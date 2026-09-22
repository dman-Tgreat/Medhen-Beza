"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

export interface ActionResult<T = any> {
  success?: boolean;
  data?: T;
  error?: string;
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

  try {
    const upsertPromises = Object.entries(settings).map(([key, value]) => {
      let group = "general";
      if (key.includes("emergency") || key.includes("hotline")) group = "emergency";
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
          changes: JSON.stringify(settings),
        },
      });
    } catch (auditErr) {
      console.error("[SETTINGS AUDIT ERROR]", auditErr);
    }

    // Revalidate public and admin pages and layouts
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
