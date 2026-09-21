"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { ContentStatus, MediaType } from "@prisma/client";
import { revalidatePath } from "next/cache";

export interface ActionResult<T = any> {
  success?: boolean;
  data?: T;
  error?: string;
}

export interface AdminFacilityItem {
  id: string;
  name: string;
  category: string;
  capacity: string;
  description?: string;
  status: ContentStatus;
  url?: string;
}

export async function getAdminFacilitiesAction(): Promise<ActionResult<AdminFacilityItem[]>> {
  const session = await getSession();
  if (!session) {
    return { error: "Unauthorized: You must be logged in to view facilities." };
  }

  try {
    const items = await db.gallery.findMany({
      where: {
        album: { equals: "Facilities", mode: "insensitive" },
      },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    const mapped: AdminFacilityItem[] = items.map((g) => {
      const parts = (g.altText || "").split(":");
      const category = parts.length > 1 ? parts[0].trim() : "Clinical Unit";
      const capacity =
        parts.length > 1
          ? parts.slice(1).join(":").trim()
          : (g.altText || "Standard Inpatient & Surgical Capacity");

      return {
        id: g.id,
        name: g.title,
        category,
        capacity,
        description: g.description || "",
        status: g.status,
        url: g.url,
      };
    });

    return { success: true, data: mapped };
  } catch (err: any) {
    return { error: err.message || "Failed to load facilities from database." };
  }
}

export async function saveAdminFacilityAction(data: {
  id?: string;
  name: string;
  category: string;
  capacity?: string;
  description?: string;
  status?: ContentStatus;
}): Promise<ActionResult<AdminFacilityItem>> {
  const session = await getSession();
  if (!session) {
    return { error: "Unauthorized: You must be logged in to manage facilities." };
  }

  const isAuthorized = session.roles.some((r) =>
    ["HOSPITAL_DIRECTOR", "CONTENT_STAFF"].includes(r)
  );

  if (!isAuthorized) {
    return { error: "Forbidden: Insufficient permissions to edit facilities." };
  }

  try {
    const isDirector = session.roles.includes("HOSPITAL_DIRECTOR");
    const targetStatus = isDirector
      ? (data.status || ContentStatus.PUBLISHED)
      : ContentStatus.PENDING_APPROVAL;

    const formattedAlt = `${data.category}: ${data.capacity || "Standard Capacity"}`;

    if (data.id && !data.id.startsWith("fac-new-")) {
      const updated = await db.gallery.update({
        where: { id: data.id },
        data: {
          title: data.name,
          altText: formattedAlt,
          description: data.description || "",
          album: "Facilities",
          status: targetStatus,
          publishedById: targetStatus === ContentStatus.PUBLISHED ? session.id : undefined,
          publishedAt: targetStatus === ContentStatus.PUBLISHED ? new Date() : undefined,
        },
      });

      revalidatePath("/admin/content/facilities");
      revalidatePath("/facilities");
      revalidatePath("/");

      return {
        success: true,
        data: {
          id: updated.id,
          name: updated.title,
          category: data.category,
          capacity: data.capacity || "",
          description: updated.description || "",
          status: updated.status,
          url: updated.url,
        },
      };
    } else {
      const created = await db.gallery.create({
        data: {
          title: data.name,
          altText: formattedAlt,
          description: data.description || "",
          album: "Facilities",
          type: MediaType.IMAGE,
          url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
          status: targetStatus,
          createdById: session.id,
          publishedById: targetStatus === ContentStatus.PUBLISHED ? session.id : undefined,
          publishedAt: targetStatus === ContentStatus.PUBLISHED ? new Date() : undefined,
        },
      });

      revalidatePath("/admin/content/facilities");
      revalidatePath("/facilities");
      revalidatePath("/");

      return {
        success: true,
        data: {
          id: created.id,
          name: created.title,
          category: data.category,
          capacity: data.capacity || "",
          description: created.description || "",
          status: created.status,
          url: created.url,
        },
      };
    }
  } catch (err: any) {
    return { error: err.message || "Failed to save facility." };
  }
}

export async function deleteAdminFacilityAction(id: string): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: "Unauthorized." };

  const isAuthorized = session.roles.some((r) =>
    ["HOSPITAL_DIRECTOR", "CONTENT_STAFF"].includes(r)
  );
  if (!isAuthorized) return { error: "Forbidden: Insufficient permissions." };

  try {
    await db.gallery.delete({ where: { id } });
    revalidatePath("/admin/content/facilities");
    revalidatePath("/facilities");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to delete facility." };
  }
}
