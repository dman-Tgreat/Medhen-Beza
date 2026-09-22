"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { ContentStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { facilitySchema } from "@/lib/validation/schemas";
import { normalizeEthiopianPhone } from "@/lib/validation/phone";

export interface ActionResult<T = any> {
  success?: boolean;
  data?: T;
  error?: string;
}

export interface AdminFacilityItem {
  id: string;
  name: string;
  slug?: string;
  tagline?: string;
  category: string;
  capacity?: string;
  location?: string;
  hours?: string;
  phone?: string;
  features: string[];
  description?: string;
  image?: string;
  order?: number;
  status: ContentStatus;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function uniqueFacilitySlug(name: string, currentId?: string): Promise<string> {
  const base = slugify(name);
  let slug = base;
  let counter = 1;
  while (true) {
    const existing = await db.facility.findUnique({ where: { slug }, select: { id: true } });
    if (!existing || existing.id === currentId) {
      return slug;
    }
    slug = `${base}-${counter++}`;
  }
}

export async function getAdminFacilitiesAction(): Promise<ActionResult<AdminFacilityItem[]>> {
  const session = await getSession();
  if (!session) {
    return { error: "Unauthorized: You must be logged in to view facilities." };
  }

  try {
    const items = await db.facility.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    const mapped: AdminFacilityItem[] = items.map((f) => ({
      id: f.id,
      name: f.name,
      slug: f.slug,
      tagline: f.tagline || "",
      category: f.category || "Clinical Unit",
      capacity: f.capacity || "",
      location: f.location || "",
      hours: f.hours || "",
      phone: f.phone || "",
      features: f.features || [],
      description: f.description || "",
      image: f.image || undefined,
      order: f.order,
      status: f.status,
    }));

    return { success: true, data: mapped };
  } catch (err: any) {
    return { error: err.message || "Failed to load facilities from database." };
  }
}

export async function saveAdminFacilityAction(
  data: {
    id?: string;
    name: string;
    slug?: string;
    tagline?: string;
    category: string;
    capacity?: string;
    location?: string;
    hours?: string;
    phone?: string;
    features?: string[];
    description?: string;
    image?: string;
    order?: number;
    status?: ContentStatus;
  },
  actionType: "draft" | "submit" | "publish" = "draft"
): Promise<ActionResult<AdminFacilityItem>> {
  const session = await getSession();
  if (!session) {
    return { error: "Unauthorized: You must be logged in to manage facilities." };
  }

  const isAuthorized = session.roles.some((r) =>
    ["HOSPITAL_DIRECTOR", "MEDICAL_DIRECTOR", "CONTENT_STAFF"].includes(r)
  );

  if (!isAuthorized) {
    return { error: "Forbidden: Insufficient permissions to edit facilities." };
  }

  try {
    const isDirector = session.roles.some((r) =>
      ["HOSPITAL_DIRECTOR", "MEDICAL_DIRECTOR"].includes(r)
    );

    let targetStatus: ContentStatus = ContentStatus.DRAFT;
    if (actionType === "publish") {
      targetStatus = isDirector ? ContentStatus.PUBLISHED : ContentStatus.PENDING_APPROVAL;
    } else if (actionType === "submit") {
      targetStatus = ContentStatus.PENDING_APPROVAL;
    } else if (data.status) {
      targetStatus = data.status;
    }

    const validation = facilitySchema.safeParse(data);
    if (!validation.success) {
      return { error: validation.error.issues[0]?.message || "Invalid facility details provided." };
    }

    const validated = validation.data;
    const cleanCategory = (validated.category || "").trim() || "Clinical Unit";
    const cleanFeatures = Array.isArray(validated.features)
      ? validated.features.map((f) => f.trim()).filter(Boolean)
      : [];
    const cleanPhone = validated.phone ? normalizeEthiopianPhone(validated.phone, true) : null;

    if (data.id && !data.id.startsWith("fac-new-")) {
      const existing = await db.facility.findUnique({ where: { id: data.id } });
      const slug = validated.slug || existing?.slug || (await uniqueFacilitySlug(validated.name, data.id));

      const updated = await db.facility.update({
        where: { id: data.id },
        data: {
          name: validated.name,
          slug,
          tagline: validated.tagline,
          description: validated.description || "",
          category: cleanCategory,
          capacity: validated.capacity,
          location: validated.location,
          hours: validated.hours,
          phone: cleanPhone,
          features: cleanFeatures,
          image: validated.image,
          order: Number(validated.order) || 0,
          status: targetStatus,
          publishedById: targetStatus === ContentStatus.PUBLISHED ? session.id : undefined,
          publishedAt: targetStatus === ContentStatus.PUBLISHED ? new Date() : undefined,
          submittedById: targetStatus === ContentStatus.PENDING_APPROVAL ? session.id : undefined,
          submittedAt: targetStatus === ContentStatus.PENDING_APPROVAL ? new Date() : undefined,
        },
      });

      revalidatePath("/admin/content/facilities");
      revalidatePath("/facilities");
      revalidatePath(`/facilities/${slug}`);
      revalidatePath(`/facilities/${updated.id}`);
      revalidatePath("/");

      return {
        success: true,
        data: {
          id: updated.id,
          name: updated.name,
          slug: updated.slug,
          tagline: updated.tagline || "",
          category: updated.category,
          capacity: updated.capacity || "",
          location: updated.location || "",
          hours: updated.hours || "",
          phone: updated.phone || "",
          features: updated.features,
          description: updated.description || "",
          image: updated.image || undefined,
          order: updated.order,
          status: updated.status,
        },
      };
    } else {
      const slug = await uniqueFacilitySlug(validated.name);

      const created = await db.facility.create({
        data: {
          name: validated.name,
          slug,
          tagline: validated.tagline,
          description: validated.description || "",
          category: cleanCategory,
          capacity: validated.capacity,
          location: validated.location,
          hours: validated.hours,
          phone: cleanPhone,
          features: cleanFeatures,
          image: validated.image || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
          order: Number(validated.order) || 0,
          status: targetStatus,
          createdById: session.id,
          publishedById: targetStatus === ContentStatus.PUBLISHED ? session.id : undefined,
          publishedAt: targetStatus === ContentStatus.PUBLISHED ? new Date() : undefined,
          submittedById: targetStatus === ContentStatus.PENDING_APPROVAL ? session.id : undefined,
          submittedAt: targetStatus === ContentStatus.PENDING_APPROVAL ? new Date() : undefined,
        },
      });

      revalidatePath("/admin/content/facilities");
      revalidatePath("/facilities");
      revalidatePath(`/facilities/${slug}`);
      revalidatePath(`/facilities/${created.id}`);
      revalidatePath("/");

      return {
        success: true,
        data: {
          id: created.id,
          name: created.name,
          slug: created.slug,
          tagline: created.tagline || "",
          category: created.category,
          capacity: created.capacity || "",
          location: created.location || "",
          hours: created.hours || "",
          phone: created.phone || "",
          features: created.features,
          description: created.description || "",
          image: created.image || undefined,
          order: created.order,
          status: created.status,
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
    ["HOSPITAL_DIRECTOR", "MEDICAL_DIRECTOR", "CONTENT_STAFF"].includes(r)
  );
  if (!isAuthorized) return { error: "Forbidden: Insufficient permissions." };

  try {
    const existing = await db.facility.findUnique({ where: { id }, select: { slug: true } });
    await db.facility.delete({ where: { id } });

    revalidatePath("/admin/content/facilities");
    revalidatePath("/facilities");
    if (existing?.slug) revalidatePath(`/facilities/${existing.slug}`);
    revalidatePath(`/facilities/${id}`);
    revalidatePath("/");

    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to delete facility." };
  }
}

export async function updateFacilityStatusAction(
  id: string,
  newStatus: ContentStatus
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: "Unauthorized." };

  const isDirector = session.roles.some((r) =>
    ["HOSPITAL_DIRECTOR", "MEDICAL_DIRECTOR"].includes(r)
  );

  if (newStatus === ContentStatus.PUBLISHED && !isDirector) {
    return { error: "Forbidden: Publishing requires Director approval." };
  }

  try {
    const updated = await db.facility.update({
      where: { id },
      data: {
        status: newStatus,
        publishedById: newStatus === ContentStatus.PUBLISHED ? session.id : undefined,
        publishedAt: newStatus === ContentStatus.PUBLISHED ? new Date() : undefined,
        approvedById: newStatus === ContentStatus.APPROVED ? session.id : undefined,
        approvedAt: newStatus === ContentStatus.APPROVED ? new Date() : undefined,
      },
    });

    revalidatePath("/admin/content/facilities");
    revalidatePath("/facilities");
    revalidatePath(`/facilities/${updated.slug}`);
    revalidatePath(`/facilities/${updated.id}`);
    revalidatePath("/");

    return { success: true, data: updated };
  } catch (err: any) {
    return { error: err.message || "Failed to update facility status." };
  }
}
