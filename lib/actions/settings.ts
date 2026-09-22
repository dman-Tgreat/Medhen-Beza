"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import { siteSettingsSchema } from "@/lib/validation/schemas";
import { normalizeEthiopianPhone } from "@/lib/validation/phone";

export interface ActionResult<T = any> {
  success?: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function getAdminSettingsAction(): Promise<ActionResult<Record<string, string>>> {
  const session = await getSession();
  if (!session) {
    return { error: "Unauthorized: You must be logged in to view settings." };
  }

  try {
    const settings = await db.siteSetting.findMany();
    const map: Record<string, string> = {};
    for (const s of settings) {
      map[s.key] = s.value;
    }
    return { success: true, data: map };
  } catch (error: any) {
    return { error: error.message || "Failed to load settings." };
  }
}

export async function saveSiteSettingsAction(
  settings: Record<string, string>
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) {
    return { error: "Unauthorized: You must be logged in to update settings." };
  }

  const isAuthorized = session.roles.some((r) =>
    ["HOSPITAL_DIRECTOR", "SYSTEM_ADMIN"].includes(r)
  );

  if (!isAuthorized) {
    return {
      error: "Forbidden: Only the Hospital Director or System Administrator can modify website settings.",
    };
  }

  // Validate critical fields if present
  const validationResult = siteSettingsSchema.safeParse(settings);
  if (!validationResult.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of validationResult.error.issues) {
      const field = issue.path[0]?.toString() || "settings";
      if (!fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }
    const firstError = validationResult.error.issues[0]?.message || "Invalid settings input.";
    return { error: firstError, fieldErrors };
  }

  // Normalize phone numbers before persisting to PostgreSQL
  const sanitizedSettings = { ...settings };
  if (sanitizedSettings.hospital_phone) {
    sanitizedSettings.hospital_phone = normalizeEthiopianPhone(sanitizedSettings.hospital_phone, false);
  }
  if (sanitizedSettings.hospital_emergency) {
    sanitizedSettings.hospital_emergency = normalizeEthiopianPhone(sanitizedSettings.hospital_emergency, true);
  }
  if (sanitizedSettings.ambulance_phone) {
    sanitizedSettings.ambulance_phone = normalizeEthiopianPhone(sanitizedSettings.ambulance_phone, true);
  }

  try {
    const upsertPromises = Object.entries(sanitizedSettings).map(([key, value]) => {
      let group = "general";
      if (key.includes("emergency") || key.includes("hotline") || key.includes("ambulance")) group = "emergency";
      else if (key.includes("phone") || key.includes("email") || key.includes("address")) group = "contact";
      else if (key.includes("seo") || key.includes("meta")) group = "seo";
      else if (key.includes("hero") || key.includes("intro") || key.includes("stat")) group = "content";

      return db.siteSetting.upsert({
        where: { key },
        create: {
          key,
          value: String(value ?? ""),
          group,
          isPublic: true,
          updatedById: session.id,
        },
        update: {
          value: String(value ?? ""),
          group,
          isPublic: true,
          updatedById: session.id,
        },
      });
    });

    await Promise.all(upsertPromises);

    // Record in Audit Trail
    try {
      await db.auditLog.create({
        data: {
          userId: session.id,
          userEmail: session.email,
          userName: session.name,
          action: "UPDATE",
          contentType: "SiteSetting",
          contentId: "global",
          changes: JSON.stringify(sanitizedSettings),
        },
      });
    } catch (auditErr) {
      console.error("[SETTINGS AUDIT ERROR]", auditErr);
    }

    // Revalidate public and admin pages and layouts per handoff.md rules
    revalidatePath("/", "layout");
    revalidatePath("/admin", "layout");
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/contact");
    revalidatePath("/emergency");
    revalidatePath("/services");
    revalidatePath("/departments");
    revalidatePath("/doctors");
    revalidatePath("/facilities");
    revalidatePath("/news");
    revalidatePath("/events");
    revalidatePath("/gallery");
    revalidatePath("/careers");
    revalidatePath("/faqs");
    revalidatePath("/admin/settings");

    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to save settings." };
  }
}
