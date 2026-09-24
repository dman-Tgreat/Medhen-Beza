"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { ContentStatus, EmploymentType, MediaType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { uniqueSlug, slugify } from "@/lib/slugs";
import {
  approveContentAction,
  archiveContentAction,
  publishContentAction,
  rejectContentAction,
  revertToDraftAction,
  submitForApprovalAction,
} from "@/lib/actions/transitions";
import {
  departmentSchema,
  doctorSchema,
  serviceSchema,
  careerSchema,
  newsSchema,
  eventSchema,
  faqSchema,
  gallerySchema,
} from "@/lib/validation/schemas";
import { normalizeEthiopianPhone } from "@/lib/validation/phone";

export interface ActionResult<T = any> {
  success?: boolean;
  data?: T;
  error?: string;
}

// ─── Authorization Helper ───────────────────────────────────────────────────

async function verifyAuthorized(
  allowedRoles: string[],
  actionName: string,
  targetStatus?: ContentStatus
) {
  const session = await getSession();

  // If no session found, reject immediately
  if (!session) {
    throw new Error("Unauthorized: You must be logged in to perform this action.");
  }

  // If publishing or approving, strictly require HOSPITAL_DIRECTOR
  if (
    (targetStatus === ContentStatus.PUBLISHED || targetStatus === ContentStatus.APPROVED) &&
    !session.roles.includes("HOSPITAL_DIRECTOR")
  ) {
    throw new Error("Forbidden: Only the Hospital Director possesses content publishing and approval authority.");
  }

  // Check general resource permissions
  const hasPermission = session.roles.some((r) => allowedRoles.includes(r));
  if (!hasPermission) {
    throw new Error(`Forbidden: Your role (${session.primaryRole}) is not permitted to perform ${actionName}.`);
  }

  return session;
}

async function dispatchWorkflow(
  contentType: Parameters<typeof submitForApprovalAction>[0],
  id: string,
  newStatus: ContentStatus,
  rejectionReason?: string
): Promise<ActionResult> {
  switch (newStatus) {
    case ContentStatus.PENDING_APPROVAL:
      return submitForApprovalAction(contentType, id);
    case ContentStatus.APPROVED:
      return approveContentAction(contentType, id);
    case ContentStatus.REJECTED:
      return rejectContentAction(contentType, id, rejectionReason ?? "");
    case ContentStatus.PUBLISHED:
      return publishContentAction(contentType, id);
    case ContentStatus.ARCHIVED:
      return archiveContentAction(contentType, id);
    case ContentStatus.DRAFT:
      return revertToDraftAction(contentType, id);
    default:
      return { success: false, error: `Unsupported workflow transition: ${newStatus}.` };
  }
}

async function finalizeSave(
  actionType: "draft" | "submit" | "publish",
  contentType: Parameters<typeof submitForApprovalAction>[0],
  contentId: string
): Promise<ActionResult> {
  if (actionType === "submit") return submitForApprovalAction(contentType, contentId);
  if (actionType === "publish") return publishContentAction(contentType, contentId);
  return { success: true };
}

// ─── 1. Doctors CRUD ────────────────────────────────────────────────────────

export async function saveDoctorAction(
  doctorData: {
    id?: string;
    fullName: string;
    specialty: string;
    departmentId?: string;
    departmentName?: string;
    position?: string;
    experience?: string;
    biography?: string;
    qualifications?: string[];
    languages?: string[];
    areasOfExpertise?: string[];
    availability?: string;
    profilePhoto?: string;
    isFeatured?: boolean;
    slug?: string;
    regenerateSlug?: boolean;
  },
  actionType: "draft" | "submit" | "publish" = "draft"
): Promise<ActionResult> {
  try {
    // Saving edits never changes workflow state. Use the dedicated transition action afterward.
    const targetStatus = ContentStatus.DRAFT;

    const session = await verifyAuthorized(
      ["HOSPITAL_DIRECTOR", "MEDICAL_DIRECTOR"],
      "Doctor Mutation",
      targetStatus
    );

    // Resolve department
    let departmentId = doctorData.departmentId;
    if (!departmentId && doctorData.departmentName) {
      const dept = await db.department.findFirst({
        where: { name: { equals: doctorData.departmentName, mode: "insensitive" } },
      });
      if (dept) {
        departmentId = dept.id;
      } else {
        // fallback to first department
        const firstDept = await db.department.findFirst();
        if (firstDept) departmentId = firstDept.id;
      }
    }

    if (!departmentId) {
      const firstDept = await db.department.findFirst();
      if (!firstDept) {
        return { error: "Please create at least one Department before adding a Doctor." };
      }
      departmentId = firstDept.id;
    }

    const docValidation = doctorSchema.safeParse({ ...doctorData, departmentId });
    if (!docValidation.success) {
      return { error: docValidation.error.issues[0]?.message || "Invalid doctor profile data." };
    }

    if (doctorData.id && !doctorData.id.startsWith("doc-new-")) {
      const existing = await db.doctor.findUnique({ where: { id: doctorData.id }, select: { slug: true } });
      const slug = doctorData.regenerateSlug ? await uniqueSlug("doctor", doctorData.slug || doctorData.fullName, doctorData.id) : existing?.slug || await uniqueSlug("doctor", doctorData.fullName);
      // Update existing
      const updated = await db.doctor.update({
        where: { id: doctorData.id },
        data: {
          fullName: doctorData.fullName,
          slug,
          specialty: doctorData.specialty,
          position: doctorData.position,
          experience: doctorData.experience,
          biography: doctorData.biography,
          qualifications: doctorData.qualifications || [],
          languages: doctorData.languages || ["Amharic", "English"],
          areasOfExpertise: doctorData.areasOfExpertise || [],
          availability: doctorData.availability,
          profilePhoto: doctorData.profilePhoto,
          isFeatured: doctorData.isFeatured || false,
          departmentId,
          status: targetStatus,
          translations: (doctorData as any).translations !== undefined ? (doctorData as any).translations : undefined,
          ...(actionType === "submit" ? { submittedById: session.id, submittedAt: new Date() } : {}),
          ...(actionType === "publish" ? { publishedById: session.id, publishedAt: new Date() } : {}),
        },
      });

      // Audit Log
      await db.auditLog.create({
        data: {
          userId: session.id,
          userEmail: session.email,
          userName: session.name,
          action: "UPDATE",
          contentType: "Doctor",
          contentId: updated.id,
          newStatus: targetStatus,
          changes: JSON.stringify({ fullName: updated.fullName, status: targetStatus }),
        },
      });

      revalidatePath("/admin/content/doctors");
      revalidatePath("/doctors");
      revalidatePath(`/doctors/${slug}`);
      const workflow = await finalizeSave(actionType, "Doctor", updated.id);
      if (!workflow.success) return workflow;
      return { success: true, data: updated };
    } else {
      // Create new
      const slug = await uniqueSlug("doctor", doctorData.slug || doctorData.fullName);
      const created = await db.doctor.create({
        data: {
          fullName: doctorData.fullName,
          slug,
          specialty: doctorData.specialty,
          position: doctorData.position,
          experience: doctorData.experience,
          biography: doctorData.biography,
          qualifications: doctorData.qualifications || [],
          languages: doctorData.languages || ["Amharic", "English"],
          areasOfExpertise: doctorData.areasOfExpertise || [],
          availability: doctorData.availability,
          profilePhoto: doctorData.profilePhoto,
          isFeatured: doctorData.isFeatured || false,
          departmentId,
          status: targetStatus,
          translations: (doctorData as any).translations !== undefined ? (doctorData as any).translations : undefined,
          createdById: session.id,
          ...(actionType === "submit" ? { submittedById: session.id, submittedAt: new Date() } : {}),
          ...(actionType === "publish" ? { publishedById: session.id, publishedAt: new Date() } : {}),
        },
      });

      await db.auditLog.create({
        data: {
          userId: session.id,
          userEmail: session.email,
          userName: session.name,
          action: "CREATE",
          contentType: "Doctor",
          contentId: created.id,
          newStatus: targetStatus,
          changes: JSON.stringify({ fullName: created.fullName, status: targetStatus }),
        },
      });

      revalidatePath("/admin/content/doctors");
      revalidatePath("/doctors");
      const workflow = await finalizeSave(actionType, "Doctor", created.id);
      if (!workflow.success) return workflow;
      return { success: true, data: created };
    }
  } catch (error: any) {
    console.error("[DOCTOR_SAVE_ERROR]", error);
    return { error: error.message || "Failed to save doctor record." };
  }
}

export async function deleteDoctorAction(id: string): Promise<ActionResult> {
  try {
    const session = await verifyAuthorized(
      ["HOSPITAL_DIRECTOR", "MEDICAL_DIRECTOR"],
      "Delete Doctor"
    );

    await db.doctor.delete({
      where: { id },
    });

    await db.auditLog.create({
      data: {
        userId: session.id,
        userEmail: session.email,
        userName: session.name,
        action: "DELETE",
        contentType: "Doctor",
        contentId: id,
      },
    });

    revalidatePath("/admin/content/doctors");
    revalidatePath("/doctors");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to delete doctor record." };
  }
}

export async function updateDoctorStatusAction(
  id: string,
  newStatus: ContentStatus,
  rejectionReason?: string
): Promise<ActionResult> {
  return dispatchWorkflow("Doctor", id, newStatus, rejectionReason);
}

// ─── 2. Departments CRUD ────────────────────────────────────────────────────

export async function saveDepartmentAction(
  data: {
    id?: string;
    name: string;
    description: string;
    phone?: string;
    email?: string;
    location?: string;
    workingHours?: string;
    headDoctor?: string;
    specializations?: string[];
    image?: string;
    icon?: string;
    isFeatured?: boolean;
    order?: number;
    slug?: string;
    regenerateSlug?: boolean;
  },
  actionType: "draft" | "submit" | "publish" = "draft"
): Promise<ActionResult> {
  try {
    const targetStatus = ContentStatus.DRAFT;

    const session = await verifyAuthorized(
      ["HOSPITAL_DIRECTOR", "MEDICAL_DIRECTOR"],
      "Department Mutation",
      targetStatus
    );

    const validation = departmentSchema.safeParse(data);
    if (!validation.success) {
      return { error: validation.error.issues[0]?.message || "Invalid department information." };
    }
    const validated = validation.data;
    const cleanPhone = validated.phone ? normalizeEthiopianPhone(validated.phone, false) : null;

    if (data.id && !data.id.startsWith("dept-new-")) {
      const existing = await db.department.findUnique({ where: { id: data.id }, select: { slug: true } });
      const slug = data.regenerateSlug ? await uniqueSlug("department", data.slug || validated.name, data.id) : existing?.slug || await uniqueSlug("department", validated.name);
      const updated = await db.department.update({
        where: { id: data.id },
        data: {
          name: validated.name,
          slug,
          description: validated.description || "",
          phone: cleanPhone,
          email: validated.email || null,
          location: validated.location || data.location,
          workingHours: validated.workingHours || data.workingHours,
          headDoctor: validated.headDoctor || data.headDoctor,
          specializations: validated.specializations || [],
          image: validated.image || data.image,
          icon: validated.icon || data.icon,
          isFeatured: data.isFeatured || false,
          order: Number(validated.order) || 0,
          status: targetStatus,
          translations: (data as any).translations !== undefined ? (data as any).translations : undefined,
          ...(actionType === "submit" ? { submittedById: session.id, submittedAt: new Date() } : {}),
          ...(actionType === "publish" ? { publishedById: session.id, publishedAt: new Date() } : {}),
        },
      });

      revalidatePath("/admin/content/departments");
      revalidatePath("/departments");
      revalidatePath(`/departments/${slug}`);
      const workflow = await finalizeSave(actionType, "Department", updated.id);
      if (!workflow.success) return workflow;
      return { success: true, data: updated };
    } else {
      const slug = await uniqueSlug("department", data.slug || validated.name);
      const created = await db.department.create({
        data: {
          name: validated.name,
          slug,
          description: validated.description || "",
          phone: cleanPhone,
          email: validated.email || null,
          location: validated.location || data.location,
          workingHours: validated.workingHours || data.workingHours,
          headDoctor: validated.headDoctor || data.headDoctor,
          specializations: validated.specializations || [],
          image: validated.image || data.image,
          icon: validated.icon || data.icon,
          isFeatured: data.isFeatured || false,
          order: Number(validated.order) || 0,
          status: targetStatus,
          translations: (data as any).translations !== undefined ? (data as any).translations : undefined,
          createdById: session.id,
          ...(actionType === "submit" ? { submittedById: session.id, submittedAt: new Date() } : {}),
          ...(actionType === "publish" ? { publishedById: session.id, publishedAt: new Date() } : {}),
        },
      });

      revalidatePath("/admin/content/departments");
      revalidatePath("/departments");
      const workflow = await finalizeSave(actionType, "Department", created.id);
      if (!workflow.success) return workflow;
      return { success: true, data: created };
    }
  } catch (error: any) {
    return { error: error.message || "Failed to save department record." };
  }
}

export async function deleteDepartmentAction(id: string): Promise<ActionResult> {
  try {
    await verifyAuthorized(["HOSPITAL_DIRECTOR", "MEDICAL_DIRECTOR"], "Delete Department");
    await db.department.delete({ where: { id } });
    revalidatePath("/admin/content/departments");
    revalidatePath("/departments");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to delete department." };
  }
}

export async function updateDepartmentStatusAction(
  id: string,
  newStatus: ContentStatus
): Promise<ActionResult> {
  return dispatchWorkflow("Department", id, newStatus);
}

// ─── 3. Services CRUD ───────────────────────────────────────────────────────

export async function saveServiceAction(
  data: {
    id?: string;
    title: string;
    description: string;
    content?: string;
    departmentId?: string;
    departmentName?: string;
    availabilityInfo?: string;
    additionalInfo?: string;
    image?: string;
    icon?: string;
    isFeatured?: boolean;
    order?: number;
    slug?: string;
    regenerateSlug?: boolean;
  },
  actionType: "draft" | "submit" | "publish" = "draft"
): Promise<ActionResult> {
  try {
    const targetStatus = ContentStatus.DRAFT;

    const session = await verifyAuthorized(
      ["HOSPITAL_DIRECTOR", "MEDICAL_DIRECTOR"],
      "Service Mutation",
      targetStatus
    );

    let departmentId = data.departmentId;
    if (!departmentId && data.departmentName) {
      const dept = await db.department.findFirst({
        where: { name: { equals: data.departmentName, mode: "insensitive" } },
      });
      if (dept) departmentId = dept.id;
    }

    if (!departmentId) {
      const firstDept = await db.department.findFirst();
      if (!firstDept) return { error: "Please create a department first." };
      departmentId = firstDept.id;
    }

    const validation = serviceSchema.safeParse({
      id: data.id,
      name: data.title,
      summary: data.description,
      description: data.content,
      departmentId,
      availabilityInfo: data.availabilityInfo,
      additionalInfo: data.additionalInfo,
      image: data.image,
      isEmergency: data.isFeatured,
    });
    if (!validation.success) {
      return { error: validation.error.issues[0]?.message || "Invalid clinical service details." };
    }

    if (data.id && !data.id.startsWith("srv-new-")) {
      const existing = await db.service.findUnique({ where: { id: data.id }, select: { slug: true } });
      const slug = data.regenerateSlug ? await uniqueSlug("service", data.slug || data.title, data.id) : existing?.slug || await uniqueSlug("service", data.title);
      const updated = await db.service.update({
        where: { id: data.id },
        data: {
          title: data.title,
          slug,
          description: data.description,
          content: data.content,
          availabilityInfo: data.availabilityInfo,
          additionalInfo: data.additionalInfo,
          image: data.image,
          icon: data.icon,
          departmentId,
          isFeatured: data.isFeatured || false,
          order: Number(data.order) || 0,
          status: targetStatus,
          translations: (data as any).translations !== undefined ? (data as any).translations : undefined,
          ...(actionType === "submit" ? { submittedById: session.id, submittedAt: new Date() } : {}),
          ...(actionType === "publish" ? { publishedById: session.id, publishedAt: new Date() } : {}),
        },
      });

      revalidatePath("/admin/content/services");
      revalidatePath("/services");
      revalidatePath(`/services/${slug}`);
      const workflow = await finalizeSave(actionType, "Service", updated.id);
      if (!workflow.success) return workflow;
      return { success: true, data: updated };
    } else {
      const slug = await uniqueSlug("service", data.slug || data.title);
      const created = await db.service.create({
        data: {
          title: data.title,
          slug,
          description: data.description,
          content: data.content,
          availabilityInfo: data.availabilityInfo,
          additionalInfo: data.additionalInfo,
          image: data.image,
          icon: data.icon,
          departmentId,
          isFeatured: data.isFeatured || false,
          order: Number(data.order) || 0,
          status: targetStatus,
          translations: (data as any).translations !== undefined ? (data as any).translations : undefined,
          createdById: session.id,
          ...(actionType === "submit" ? { submittedById: session.id, submittedAt: new Date() } : {}),
          ...(actionType === "publish" ? { publishedById: session.id, publishedAt: new Date() } : {}),
        },
      });

      revalidatePath("/admin/content/services");
      revalidatePath("/services");
      revalidatePath(`/services/${slug}`);
      const workflow = await finalizeSave(actionType, "Service", created.id);
      if (!workflow.success) return workflow;
      return { success: true, data: created };
    }
  } catch (error: any) {
    return { error: error.message || "Failed to save service." };
  }
}

export async function deleteServiceAction(id: string): Promise<ActionResult> {
  try {
    await verifyAuthorized(["HOSPITAL_DIRECTOR", "MEDICAL_DIRECTOR"], "Delete Service");
    await db.service.delete({ where: { id } });
    revalidatePath("/admin/content/services");
    revalidatePath("/services");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to delete service." };
  }
}

export async function updateServiceStatusAction(
  id: string,
  newStatus: ContentStatus
): Promise<ActionResult> {
  return dispatchWorkflow("Service", id, newStatus);
}

// ─── 4. News CRUD ───────────────────────────────────────────────────────────

export async function saveNewsAction(
  data: {
    id?: string;
    title: string;
    summary: string;
    content: string;
    featuredImage?: string;
    authorName?: string;
    readTime?: string;
    tags?: string[];
    categoryId?: string;
    categoryName?: string;
    isFeatured?: boolean;
    slug?: string;
    regenerateSlug?: boolean;
    translations?: any;
  },
  actionType: "draft" | "submit" | "publish" = "draft"
): Promise<ActionResult> {
  try {
    const targetStatus = ContentStatus.DRAFT;

    const session = await verifyAuthorized(
      ["HOSPITAL_DIRECTOR", "CONTENT_STAFF"],
      "News Mutation",
      targetStatus
    );

    // Dynamic Category Resolution: If categoryName provided, find existing or auto-create in db.newsCategory
    let resolvedCategoryId: string | null = data.categoryId || null;
    if (data.categoryName && data.categoryName.trim()) {
      const trimmedName = data.categoryName.trim();
      let cat = await db.newsCategory.findFirst({
        where: { name: { equals: trimmedName, mode: "insensitive" } },
      });
      if (!cat) {
        const catBaseSlug = slugify(trimmedName);
        let catSlug = catBaseSlug;
        let cSuffix = 2;
        while (await db.newsCategory.findUnique({ where: { slug: catSlug } })) {
          catSlug = `${catBaseSlug}-${cSuffix++}`;
        }
        cat = await db.newsCategory.create({
          data: {
            name: trimmedName,
            slug: catSlug,
            description: `${trimmedName} articles and updates`,
          },
        });
      }
      resolvedCategoryId = cat.id;
    }

    const cleanTags = Array.isArray(data.tags)
      ? data.tags.map((t) => t.replace(/^#/, "").trim()).filter(Boolean)
      : [];

    const validation = newsSchema.safeParse({
      id: data.id,
      title: data.title,
      category: data.categoryName || data.categoryId || "General News",
      excerpt: data.summary,
      content: data.content,
      readTime: data.readTime,
      tags: cleanTags,
      image: data.featuredImage,
      author: data.authorName,
      translations: (data as any).translations,
    });
    if (!validation.success) {
      return { error: validation.error.issues[0]?.message || "Invalid article details." };
    }

    if (data.id && !data.id.startsWith("news-new-")) {
      const existing = await db.news.findUnique({ where: { id: data.id }, select: { slug: true } });
      const slug = data.regenerateSlug ? await uniqueSlug("news", data.slug || data.title, data.id) : existing?.slug || await uniqueSlug("news", data.title);
      const updated = await db.news.update({
        where: { id: data.id },
        data: {
          title: data.title,
          slug,
          summary: data.summary,
          content: data.content,
          featuredImage: data.featuredImage,
          authorName: data.authorName || session.name,
          readTime: data.readTime || null,
          tags: cleanTags,
          categoryId: resolvedCategoryId,
          isFeatured: data.isFeatured || false,
          status: targetStatus,
          translations: (data as any).translations !== undefined ? (data as any).translations : undefined,
          ...(actionType === "submit" ? { submittedById: session.id, submittedAt: new Date() } : {}),
          ...(actionType === "publish" ? { publishedById: session.id, publishedAt: new Date() } : {}),
        },
      });

      revalidatePath("/admin/content/news");
      revalidatePath("/news");
      revalidatePath(`/news/${slug}`);
      const workflow = await finalizeSave(actionType, "News", updated.id);
      if (!workflow.success) return workflow;
      return { success: true, data: updated };
    } else {
      const slug = await uniqueSlug("news", data.slug || data.title);
      const created = await db.news.create({
        data: {
          title: data.title,
          slug,
          summary: data.summary,
          content: data.content,
          featuredImage: data.featuredImage,
          authorName: data.authorName || session.name,
          readTime: data.readTime || null,
          tags: cleanTags,
          categoryId: resolvedCategoryId,
          isFeatured: data.isFeatured || false,
          status: targetStatus,
          translations: (data as any).translations !== undefined ? (data as any).translations : undefined,
          createdById: session.id,
          ...(actionType === "submit" ? { submittedById: session.id, submittedAt: new Date() } : {}),
          ...(actionType === "publish" ? { publishedById: session.id, publishedAt: new Date() } : {}),
        },
      });

      revalidatePath("/admin/content/news");
      revalidatePath("/news");
      const workflow = await finalizeSave(actionType, "News", created.id);
      if (!workflow.success) return workflow;
      return { success: true, data: created };
    }
  } catch (error: any) {
    return { error: error.message || "Failed to save news article." };
  }
}

export async function deleteNewsAction(id: string): Promise<ActionResult> {
  try {
    await verifyAuthorized(["HOSPITAL_DIRECTOR", "CONTENT_STAFF"], "Delete News");
    await db.news.delete({ where: { id } });
    revalidatePath("/admin/content/news");
    revalidatePath("/news");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to delete news." };
  }
}

export async function updateNewsStatusAction(
  id: string,
  newStatus: ContentStatus
): Promise<ActionResult> {
  return dispatchWorkflow("News", id, newStatus);
}

// ─── 5. Gallery CRUD ────────────────────────────────────────────────────────

export async function saveGalleryAction(
  data: {
    id?: string;
    title: string;
    description?: string;
    album?: string;
    url: string;
    thumbnailUrl?: string;
    type?: MediaType;
    order?: number;
    translations?: any;
  },
  actionType: "draft" | "submit" | "publish" = "draft"
): Promise<ActionResult> {
  try {
    const targetStatus = ContentStatus.DRAFT;

    const session = await verifyAuthorized(
      ["HOSPITAL_DIRECTOR", "CONTENT_STAFF"],
      "Gallery Mutation",
      targetStatus
    );

    const validation = gallerySchema.safeParse({
      id: data.id,
      title: data.title,
      category: data.album || "General",
      type: data.type || "IMAGE",
      url: data.url,
      thumbnailUrl: data.thumbnailUrl,
      translations: (data as any).translations,
    });
    if (!validation.success) {
      return { error: validation.error.issues[0]?.message || "Invalid media asset details." };
    }

    if (data.id && !data.id.startsWith("gal-new-")) {
      const updated = await db.gallery.update({
        where: { id: data.id },
        data: {
          title: data.title,
          description: data.description,
          album: data.album || "General",
          url: data.url,
          thumbnailUrl: data.thumbnailUrl,
          type: data.type || MediaType.IMAGE,
          order: Number(data.order) || 0,
          status: targetStatus,
          translations: (data as any).translations !== undefined ? (data as any).translations : undefined,
          ...(actionType === "publish" ? { publishedById: session.id, publishedAt: new Date() } : {}),
        },
      });

      revalidatePath("/admin/content/gallery");
      revalidatePath("/gallery");
      const workflow = await finalizeSave(actionType, "Gallery", updated.id);
      if (!workflow.success) return workflow;
      return { success: true, data: updated };
    } else {
      const created = await db.gallery.create({
        data: {
          title: data.title,
          description: data.description,
          album: data.album || "General",
          url: data.url,
          thumbnailUrl: data.thumbnailUrl,
          type: data.type || MediaType.IMAGE,
          order: Number(data.order) || 0,
          status: targetStatus,
          translations: (data as any).translations !== undefined ? (data as any).translations : undefined,
          createdById: session.id,
          ...(actionType === "publish" ? { publishedById: session.id, publishedAt: new Date() } : {}),
        },
      });

      revalidatePath("/admin/content/gallery");
      revalidatePath("/gallery");
      const workflow = await finalizeSave(actionType, "Gallery", created.id);
      if (!workflow.success) return workflow;
      return { success: true, data: created };
    }
  } catch (error: any) {
    return { error: error.message || "Failed to save gallery asset." };
  }
}

export async function deleteGalleryAction(id: string): Promise<ActionResult> {
  try {
    await verifyAuthorized(["HOSPITAL_DIRECTOR", "CONTENT_STAFF"], "Delete Gallery Asset");
    await db.gallery.delete({ where: { id } });
    revalidatePath("/admin/content/gallery");
    revalidatePath("/gallery");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to delete gallery item." };
  }
}

export async function updateGalleryStatusAction(
  id: string,
  newStatus: ContentStatus
): Promise<ActionResult> {
  return dispatchWorkflow("Gallery", id, newStatus);
}

// ─── 6. Events CRUD ─────────────────────────────────────────────────────────

export async function saveEventAction(
  data: {
    id?: string;
    title: string;
    description: string;
    eventDate: string | Date;
    location?: string;
    image?: string;
    isFeatured?: boolean;
    slug?: string;
    regenerateSlug?: boolean;
    translations?: any;
  },
  actionType: "draft" | "submit" | "publish" = "draft"
): Promise<ActionResult> {
  try {
    const targetStatus = ContentStatus.DRAFT;

    const session = await verifyAuthorized(
      ["HOSPITAL_DIRECTOR", "CONTENT_STAFF"],
      "Event Mutation",
      targetStatus
    );

    const validation = eventSchema.safeParse({
      id: data.id,
      title: data.title,
      date: String(data.eventDate),
      location: data.location || "Medhen Beza Hospital Campus",
      description: data.description,
      image: data.image,
      translations: (data as any).translations,
    });
    if (!validation.success) {
      return { error: validation.error.issues[0]?.message || "Invalid event details." };
    }

    const parsedDate = new Date(data.eventDate);

    if (data.id && !data.id.startsWith("ev-new-")) {
      const existing = await db.hospitalEvent.findUnique({ where: { id: data.id }, select: { slug: true } });
      const slug = data.regenerateSlug ? await uniqueSlug("hospitalEvent", data.slug || data.title, data.id) : existing?.slug || await uniqueSlug("hospitalEvent", data.title);
      const updated = await db.hospitalEvent.update({
        where: { id: data.id },
        data: {
          title: data.title,
          slug,
          description: data.description,
          eventDate: parsedDate,
          location: data.location,
          image: data.image,
          isFeatured: data.isFeatured || false,
          status: targetStatus,
          translations: (data as any).translations !== undefined ? (data as any).translations : undefined,
          ...(actionType === "publish" ? { publishedById: session.id, publishedAt: new Date() } : {}),
        },
      });

      revalidatePath("/admin/content/events");
      revalidatePath("/events");
      revalidatePath(`/events/${slug}`);
      const workflow = await finalizeSave(actionType, "HospitalEvent", updated.id);
      if (!workflow.success) return workflow;
      return { success: true, data: updated };
    } else {
      const slug = await uniqueSlug("hospitalEvent", data.slug || data.title);
      const created = await db.hospitalEvent.create({
        data: {
          title: data.title,
          slug,
          description: data.description,
          eventDate: parsedDate,
          location: data.location,
          image: data.image,
          isFeatured: data.isFeatured || false,
          status: targetStatus,
          translations: (data as any).translations !== undefined ? (data as any).translations : undefined,
          createdById: session.id,
          ...(actionType === "publish" ? { publishedById: session.id, publishedAt: new Date() } : {}),
        },
      });

      revalidatePath("/admin/content/events");
      revalidatePath("/events");
      const workflow = await finalizeSave(actionType, "HospitalEvent", created.id);
      if (!workflow.success) return workflow;
      return { success: true, data: created };
    }
  } catch (error: any) {
    return { error: error.message || "Failed to save event." };
  }
}

export async function deleteEventAction(id: string): Promise<ActionResult> {
  try {
    await verifyAuthorized(["HOSPITAL_DIRECTOR", "CONTENT_STAFF"], "Delete Event");
    await db.hospitalEvent.delete({ where: { id } });
    revalidatePath("/admin/content/events");
    revalidatePath("/events");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to delete event." };
  }
}

export async function updateEventStatusAction(
  id: string,
  newStatus: ContentStatus
): Promise<ActionResult> {
  return dispatchWorkflow("HospitalEvent", id, newStatus);
}

// ─── 7. Careers CRUD ────────────────────────────────────────────────────────

export async function saveCareerAction(
  data: {
    id?: string;
    position: string;
    departmentId?: string;
    departmentName?: string;
    employmentType?: EmploymentType;
    location?: string;
    description: string;
    responsibilities?: string[];
    requirements?: string[];
    qualifications?: string[];
    deadline: string | Date;
    isFeatured?: boolean;
    slug?: string;
    regenerateSlug?: boolean;
    translations?: any;
  },
  actionType: "draft" | "submit" | "publish" = "draft"
): Promise<ActionResult> {
  try {
    const targetStatus = ContentStatus.DRAFT;

    const session = await verifyAuthorized(
      ["HOSPITAL_DIRECTOR", "HR_STAFF"],
      "Career Mutation",
      targetStatus
    );

    let departmentId = data.departmentId;
    if (!departmentId && data.departmentName) {
      const dept = await db.department.findFirst({
        where: { name: { equals: data.departmentName, mode: "insensitive" } },
      });
      if (dept) departmentId = dept.id;
    }

    const validation = careerSchema.safeParse({
      id: data.id,
      title: data.position,
      departmentId: departmentId || "general",
      employmentType: data.employmentType || "FULL_TIME",
      location: data.location || "Addis Ababa, Ethiopia",
      deadline: data.deadline ? String(data.deadline) : undefined,
      description: data.description,
      responsibilities: data.responsibilities || [],
      requirements: data.requirements || [],
      translations: (data as any).translations,
    });
    if (!validation.success) {
      return { error: validation.error.issues[0]?.message || "Invalid career vacancy details." };
    }

    const parsedDeadline = new Date(data.deadline);

    if (data.id && !data.id.startsWith("car-new-")) {
      const existing = await db.career.findUnique({ where: { id: data.id }, select: { slug: true } });
      const slug = data.regenerateSlug ? await uniqueSlug("career", data.slug || data.position, data.id) : existing?.slug || await uniqueSlug("career", data.position);
      const updated = await db.career.update({
        where: { id: data.id },
        data: {
          position: data.position,
          slug,
          departmentId: departmentId || null,
          employmentType: data.employmentType || EmploymentType.FULL_TIME,
          location: data.location || "Addis Ababa, Ethiopia",
          description: data.description,
          responsibilities: data.responsibilities || [],
          requirements: data.requirements || [],
          qualifications: data.qualifications || [],
          deadline: parsedDeadline,
          isFeatured: data.isFeatured || false,
          status: targetStatus,
          translations: (data as any).translations !== undefined ? (data as any).translations : undefined,
          ...(actionType === "publish" ? { publishedById: session.id, publishedAt: new Date() } : {}),
        },
      });

      revalidatePath("/admin/content/careers");
      revalidatePath("/careers");
      revalidatePath(`/careers/${slug}`);
      const workflow = await finalizeSave(actionType, "Career", updated.id);
      if (!workflow.success) return workflow;
      return { success: true, data: updated };
    } else {
      const slug = await uniqueSlug("career", data.slug || data.position);
      const created = await db.career.create({
        data: {
          position: data.position,
          slug,
          departmentId: departmentId || null,
          employmentType: data.employmentType || EmploymentType.FULL_TIME,
          location: data.location || "Addis Ababa, Ethiopia",
          description: data.description,
          responsibilities: data.responsibilities || [],
          requirements: data.requirements || [],
          qualifications: data.qualifications || [],
          deadline: parsedDeadline,
          isFeatured: data.isFeatured || false,
          status: targetStatus,
          translations: (data as any).translations !== undefined ? (data as any).translations : undefined,
          createdById: session.id,
          ...(actionType === "publish" ? { publishedById: session.id, publishedAt: new Date() } : {}),
        },
      });

      revalidatePath("/admin/content/careers");
      revalidatePath("/careers");
      const workflow = await finalizeSave(actionType, "Career", created.id);
      if (!workflow.success) return workflow;
      return { success: true, data: created };
    }
  } catch (error: any) {
    return { error: error.message || "Failed to save career vacancy." };
  }
}

export async function deleteCareerAction(id: string): Promise<ActionResult> {
  try {
    await verifyAuthorized(["HOSPITAL_DIRECTOR", "HR_STAFF"], "Delete Career");
    await db.career.delete({ where: { id } });
    revalidatePath("/admin/content/careers");
    revalidatePath("/careers");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to delete career." };
  }
}

export async function updateCareerStatusAction(
  id: string,
  newStatus: ContentStatus
): Promise<ActionResult> {
  return dispatchWorkflow("Career", id, newStatus);
}

// ─── 8. FAQs CRUD ───────────────────────────────────────────────────────────

export async function saveFAQAction(
  data: {
    id?: string;
    question: string;
    answer: string;
    category?: string;
    order?: number;
    translations?: any;
  },
  actionType: "draft" | "submit" | "publish" = "publish"
): Promise<ActionResult> {
  try {
    const targetStatus = ContentStatus.DRAFT;

    await verifyAuthorized(
      ["HOSPITAL_DIRECTOR", "CONTENT_STAFF"],
      "FAQ Mutation",
      targetStatus
    );

    const validation = faqSchema.safeParse({
      id: data.id,
      question: data.question,
      answer: data.answer,
      category: data.category || "General",
      translations: (data as any).translations,
    });
    if (!validation.success) {
      return { error: validation.error.issues[0]?.message || "Invalid FAQ details." };
    }

    if (data.id && !data.id.startsWith("faq-new-")) {
      const updated = await db.fAQ.update({
        where: { id: data.id },
        data: {
          question: data.question,
          answer: data.answer,
          category: data.category || "General",
          order: Number(data.order) || 0,
          status: targetStatus,
          translations: (data as any).translations !== undefined ? (data as any).translations : undefined,
        },
      });

      revalidatePath("/admin/content/faqs");
      revalidatePath("/faqs");
      const workflow = await finalizeSave(actionType, "FAQ", updated.id);
      if (!workflow.success) return workflow;
      return { success: true, data: updated };
    } else {
      const created = await db.fAQ.create({
        data: {
          question: data.question,
          answer: data.answer,
          category: data.category || "General",
          order: Number(data.order) || 0,
          status: targetStatus,
          translations: (data as any).translations !== undefined ? (data as any).translations : undefined,
        },
      });

      revalidatePath("/admin/content/faqs");
      revalidatePath("/faqs");
      const workflow = await finalizeSave(actionType, "FAQ", created.id);
      if (!workflow.success) return workflow;
      return { success: true, data: created };
    }
  } catch (error: any) {
    return { error: error.message || "Failed to save FAQ." };
  }
}

export async function deleteFAQAction(id: string): Promise<ActionResult> {
  try {
    await verifyAuthorized(["HOSPITAL_DIRECTOR", "CONTENT_STAFF"], "Delete FAQ");
    await db.fAQ.delete({ where: { id } });
    revalidatePath("/admin/content/faqs");
    revalidatePath("/faqs");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to delete FAQ." };
  }
}

export async function updateFAQStatusAction(
  id: string,
  newStatus: ContentStatus
): Promise<ActionResult> {
  return dispatchWorkflow("FAQ", id, newStatus);
}

// ─── 9. Pages CRUD ──────────────────────────────────────────────────────────

export async function savePageAction(
  data: {
    id?: string;
    title: string;
    content: string;
    excerpt?: string;
    slug?: string;
    regenerateSlug?: boolean;
    metaTitle?: string;
    metaDescription?: string;
    translations?: any;
  },
  actionType: "draft" | "submit" | "publish" = "draft"
): Promise<ActionResult> {
  try {
    const targetStatus = ContentStatus.DRAFT;

    const session = await verifyAuthorized(
      ["HOSPITAL_DIRECTOR", "CONTENT_STAFF"],
      "Page Mutation",
      targetStatus
    );

    if (!data.title || data.title.trim().length < 2) {
      return { error: "Page title is required (minimum 2 characters)." };
    }
    if (!data.content || data.content.trim().length === 0) {
      return { error: "Page content cannot be empty." };
    }

    const inputSlug = (data.slug || "").replace(/^\/+/, "").trim();

    if (data.id && !data.id.startsWith("page-new-")) {
      const existing = await db.page.findUnique({ where: { id: data.id }, select: { slug: true } });
      const slug = data.regenerateSlug
        ? await uniqueSlug("page", inputSlug || data.title, data.id)
        : existing?.slug || (inputSlug ? inputSlug : await uniqueSlug("page", data.title));

      const updated = await db.page.update({
        where: { id: data.id },
        data: {
          title: data.title,
          slug,
          content: data.content,
          excerpt: data.excerpt,
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
          status: targetStatus,
          translations: (data as any).translations !== undefined ? (data as any).translations : undefined,
          ...(actionType === "publish" ? { publishedById: session.id, publishedAt: new Date() } : {}),
        },
      });

      revalidatePath("/admin/content/pages");
      revalidatePath("/admin/approvals");
      revalidatePath(`/${slug}`);
      if (slug === "about") revalidatePath("/about");
      revalidatePath("/");

      const workflow = await finalizeSave(actionType, "Page", updated.id);
      if (!workflow.success) return workflow;
      return { success: true, data: updated };
    } else {
      const slug = inputSlug ? inputSlug : await uniqueSlug("page", data.title);
      const created = await db.page.create({
        data: {
          title: data.title,
          slug,
          content: data.content,
          excerpt: data.excerpt,
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
          status: targetStatus,
          translations: (data as any).translations !== undefined ? (data as any).translations : undefined,
          createdById: session.id,
          ...(actionType === "publish" ? { publishedById: session.id, publishedAt: new Date() } : {}),
        },
      });

      revalidatePath("/admin/content/pages");
      revalidatePath("/admin/approvals");
      revalidatePath(`/${slug}`);
      if (slug === "about") revalidatePath("/about");
      revalidatePath("/");

      const workflow = await finalizeSave(actionType, "Page", created.id);
      if (!workflow.success) return workflow;
      return { success: true, data: created };
    }
  } catch (error: any) {
    return { error: error.message || "Failed to save page." };
  }
}

export async function deletePageAction(id: string): Promise<ActionResult> {
  try {
    await verifyAuthorized(["HOSPITAL_DIRECTOR", "CONTENT_STAFF"], "Delete Page");
    await db.page.delete({ where: { id } });
    revalidatePath("/admin/content/pages");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to delete page." };
  }
}

export async function updatePageStatusAction(
  id: string,
  newStatus: ContentStatus
): Promise<ActionResult> {
  return dispatchWorkflow("Page", id, newStatus);
}
