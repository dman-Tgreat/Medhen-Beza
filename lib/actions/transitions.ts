"use server";

import { ContentStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import {
  revalidateDoctorPages,
  clearDoctorFromDepartments,
  revalidateDepartmentPages,
  revalidateServicePages,
} from "@/lib/actions/revalidate";

export interface ActionResult<T = undefined> {
  success: boolean;
  data?: T;
  error?: string;
}

export type ContentType =
  | "Doctor"
  | "Department"
  | "Service"
  | "News"
  | "Gallery"
  | "Career"
  | "HospitalEvent"
  | "Event"
  | "Page"
  | "FAQ";

type WorkflowRecord = {
  id: string;
  status: ContentStatus;
  createdById?: string | null;
  submittedById?: string | null;
  [key: string]: unknown;
};

type WorkflowClient = any;
type ConfiguredContentType = Exclude<ContentType, "Event">;

const CONTENT_CONFIG: Record<ConfiguredContentType, {
  model: (client: WorkflowClient) => any;
  titleField: string;
  publicPath: string;
  adminPath: string;
  ownerRoles: string[];
  workflowFields: boolean;
}> = {
  Doctor: { model: (client) => client.doctor, titleField: "fullName", publicPath: "/doctors", adminPath: "/admin/content/doctors", ownerRoles: ["MEDICAL_DIRECTOR"], workflowFields: true },
  Department: { model: (client) => client.department, titleField: "name", publicPath: "/departments", adminPath: "/admin/content/departments", ownerRoles: ["MEDICAL_DIRECTOR"], workflowFields: true },
  Service: { model: (client) => client.service, titleField: "title", publicPath: "/services", adminPath: "/admin/content/services", ownerRoles: ["MEDICAL_DIRECTOR"], workflowFields: true },
  News: { model: (client) => client.news, titleField: "title", publicPath: "/news", adminPath: "/admin/content/news", ownerRoles: ["CONTENT_STAFF"], workflowFields: true },
  Gallery: { model: (client) => client.gallery, titleField: "title", publicPath: "/gallery", adminPath: "/admin/content/gallery", ownerRoles: ["CONTENT_STAFF"], workflowFields: true },
  Career: { model: (client) => client.career, titleField: "position", publicPath: "/careers", adminPath: "/admin/content/careers", ownerRoles: ["HR_STAFF"], workflowFields: true },
  HospitalEvent: { model: (client) => client.hospitalEvent, titleField: "title", publicPath: "/events", adminPath: "/admin/content/events", ownerRoles: ["CONTENT_STAFF"], workflowFields: true },
  Page: { model: (client) => client.page, titleField: "title", publicPath: "/", adminPath: "/admin/content/pages", ownerRoles: ["CONTENT_STAFF"], workflowFields: true },
  FAQ: { model: (client) => client.fAQ, titleField: "question", publicPath: "/faqs", adminPath: "/admin/content/faqs", ownerRoles: ["CONTENT_STAFF"], workflowFields: false },
};

function normalizeContentType(contentType: ContentType): ConfiguredContentType {
  return contentType === "Event" ? "HospitalEvent" : contentType;
}

function configFor(contentType: ContentType) {
  return CONTENT_CONFIG[normalizeContentType(contentType)];
}

async function loadRecord(contentType: ContentType, contentId: string): Promise<WorkflowRecord> {
  const record = await configFor(contentType).model(db).findUnique({ where: { id: contentId } });
  if (!record) throw new Error(`${contentType} with id "${contentId}" was not found.`);
  return record as WorkflowRecord;
}

function isDirector(session: { roles: string[] }) {
  return session.roles.includes("HOSPITAL_DIRECTOR");
}

function canSubmit(session: { id: string; roles: string[] }, record: WorkflowRecord, contentType: ContentType) {
  const config = configFor(contentType);
  if (isDirector(session)) return true;
  if (!session.roles.some((role) => config.ownerRoles.includes(role))) return false;
  return !record.createdById || record.createdById === session.id;
}

function canReview(session: { roles: string[] }) {
  // The Hospital Director is the final authority and may approve their own
  // submissions. Other roles never receive review authority.
  return isDirector(session);
}

function transitionData(config: ReturnType<typeof configFor>, nextStatus: ContentStatus, sessionId: string, reason?: string) {
  if (!config.workflowFields) return { status: nextStatus };
  return {
    status: nextStatus,
    ...(nextStatus === ContentStatus.PENDING_APPROVAL ? { submittedById: sessionId, submittedAt: new Date(), rejectionReason: null } : {}),
    ...(nextStatus === ContentStatus.APPROVED ? { approvedById: sessionId, approvedAt: new Date() } : {}),
    ...(nextStatus === ContentStatus.REJECTED ? { rejectionReason: reason?.trim() } : {}),
    ...(nextStatus === ContentStatus.PUBLISHED ? { publishedById: sessionId, publishedAt: new Date() } : {}),
    ...(nextStatus === ContentStatus.ARCHIVED ? { archivedAt: new Date() } : {}),
    ...(nextStatus === ContentStatus.DRAFT ? { submittedById: null, submittedAt: null } : {}),
  };
}

async function createNotification(client: WorkflowClient, recipientId: string, type: string, title: string, message: string, contentType: ContentType, contentId: string) {
  await client.notification.create({ data: { recipientId, type, title, message, contentType: normalizeContentType(contentType), contentId } });
}

async function transition(contentType: ContentType, contentId: string, nextStatus: ContentStatus, action: string, reason?: string): Promise<ActionResult> {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized: you must be logged in." };

    const normalizedType = normalizeContentType(contentType);
    const config = configFor(normalizedType);
    const current = await loadRecord(normalizedType, contentId);

    if (nextStatus === ContentStatus.PENDING_APPROVAL) {
      if (!canSubmit(session, current, normalizedType)) return { success: false, error: "Forbidden: your role cannot submit this content or you are not its owner." };
      if (current.status !== ContentStatus.DRAFT && current.status !== ContentStatus.REJECTED) return { success: false, error: `Cannot submit content in ${current.status} status.` };
    } else {
      if (!canReview(session)) return { success: false, error: "Forbidden: only the Hospital Director can perform this review action." };
      const expected = nextStatus === ContentStatus.APPROVED || nextStatus === ContentStatus.REJECTED ? ContentStatus.PENDING_APPROVAL : nextStatus === ContentStatus.PUBLISHED ? ContentStatus.APPROVED : ContentStatus.PUBLISHED;
      if (current.status !== expected) return { success: false, error: `Cannot ${action.toLowerCase()} content in ${current.status} status.` };
      if (nextStatus === ContentStatus.REJECTED && (!reason || reason.trim().length < 10)) return { success: false, error: "A rejection reason of at least 10 characters is required." };
    }

    const title = String(current[config.titleField] ?? contentId);
    await db.$transaction(async (tx) => {
      const txConfig = configFor(normalizedType);
      await txConfig.model(tx).update({ where: { id: contentId }, data: transitionData(txConfig, nextStatus, session.id, reason) });
      await tx.auditLog.create({ data: { userId: session.id, userEmail: session.email, userName: session.name, action, contentType: normalizedType, contentId, previousStatus: current.status, newStatus: nextStatus } });

      if (nextStatus === ContentStatus.PENDING_APPROVAL) {
        const directors = await tx.user.findMany({ where: { isActive: true, userRoles: { some: { role: { code: "HOSPITAL_DIRECTOR" } } } }, select: { id: true } });
        await Promise.all(directors.map((director) => createNotification(tx, director.id, "SUBMITTED", `New ${normalizedType} pending approval`, `${session.name} submitted “${title}” for review.`, normalizedType, contentId)));
      } else {
        const recipientId = current.submittedById ?? current.createdById;
        if (recipientId) {
          const notificationType = nextStatus === ContentStatus.APPROVED ? "APPROVED" : nextStatus === ContentStatus.REJECTED ? "REJECTED" : nextStatus === ContentStatus.PUBLISHED ? "PUBLISHED" : "ARCHIVED";
          const message = nextStatus === ContentStatus.REJECTED ? `“${title}” was rejected. Reason: ${reason!.trim()}` : `“${title}” is now ${nextStatus.toLowerCase().replaceAll("_", " ")}.`;
          await createNotification(tx, recipientId, notificationType, `${normalizedType} ${notificationType.toLowerCase()}`, message, normalizedType, contentId);
        }
      }
    });

    if (normalizedType === "Doctor") {
      const doc = await db.doctor.findUnique({
        where: { id: contentId },
        include: {
          department: {
            include: {
              services: { select: { slug: true } },
            },
          },
        },
      });
      if (doc) {
        if (nextStatus !== ContentStatus.PUBLISHED) {
          await clearDoctorFromDepartments(doc);
        }
        const serviceSlugs = doc.department?.services?.map((s) => s.slug) || [];
        await revalidateDoctorPages(doc.slug, doc.department?.slug, serviceSlugs);
      } else {
        await revalidateDoctorPages();
      }
    } else if (normalizedType === "Department") {
      const dept = await db.department.findUnique({ where: { id: contentId }, select: { slug: true } });
      await revalidateDepartmentPages(dept?.slug);
    } else if (normalizedType === "Service") {
      const srv = await db.service.findUnique({ where: { id: contentId }, include: { department: { select: { slug: true } } } });
      await revalidateServicePages(srv?.slug, srv?.department?.slug);
    } else {
      revalidatePath("/", "layout");
      revalidatePath("/admin");
      revalidatePath("/admin/approvals");
      revalidatePath(config.adminPath);
      revalidatePath(config.publicPath);
      if (normalizedType === "Page" && (current as any).slug) {
        const pageSlug = String((current as any).slug).replace(/^\/+/, "");
        revalidatePath(`/${pageSlug}`);
        if (pageSlug === "about") revalidatePath("/about");
      }
    }
    return { success: true };
  } catch (error) {
    console.error(`[WORKFLOW_${action}_ERROR]`, error);
    return { success: false, error: error instanceof Error ? error.message : "The workflow action failed." };
  }
}

export async function submitForApprovalAction(contentType: ContentType, contentId: string) { return transition(contentType, contentId, ContentStatus.PENDING_APPROVAL, "SUBMIT"); }
export async function approveContentAction(contentType: ContentType, contentId: string) { return transition(contentType, contentId, ContentStatus.APPROVED, "APPROVE"); }
export async function rejectContentAction(contentType: ContentType, contentId: string, reason: string) { return transition(contentType, contentId, ContentStatus.REJECTED, "REJECT", reason); }
export async function publishContentAction(contentType: ContentType, contentId: string) { return transition(contentType, contentId, ContentStatus.PUBLISHED, "PUBLISH"); }
export async function archiveContentAction(contentType: ContentType, contentId: string) { return transition(contentType, contentId, ContentStatus.ARCHIVED, "ARCHIVE"); }

export async function revertToDraftAction(contentType: ContentType, contentId: string): Promise<ActionResult> {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized: you must be logged in." };
    const current = await loadRecord(contentType, contentId);
    if (current.status !== ContentStatus.REJECTED) return { success: false, error: "Only rejected content can be reverted to draft." };
    if (!isDirector(session) && current.createdById !== session.id && current.submittedById !== session.id) return { success: false, error: "Forbidden: only the content owner or Hospital Director can revert this item." };
    const config = configFor(contentType);
    await db.$transaction(async (tx) => {
      await configFor(contentType).model(tx).update({ where: { id: contentId }, data: transitionData(config, ContentStatus.DRAFT, session.id) });
      await tx.auditLog.create({ data: { userId: session.id, userEmail: session.email, userName: session.name, action: "REVERT_TO_DRAFT", contentType: normalizeContentType(contentType), contentId, previousStatus: current.status, newStatus: ContentStatus.DRAFT } });
    });

    const normalized = normalizeContentType(contentType);
    if (normalized === "Doctor") {
      const doc = await db.doctor.findUnique({
        where: { id: contentId },
        include: {
          department: {
            include: {
              services: { select: { slug: true } },
            },
          },
        },
      });
      if (doc) {
        await clearDoctorFromDepartments(doc);
        const serviceSlugs = doc.department?.services?.map((s) => s.slug) || [];
        await revalidateDoctorPages(doc.slug, doc.department?.slug, serviceSlugs);
      } else {
        await revalidateDoctorPages();
      }
    } else if (normalized === "Department") {
      const dept = await db.department.findUnique({ where: { id: contentId }, select: { slug: true } });
      await revalidateDepartmentPages(dept?.slug);
    } else if (normalized === "Service") {
      const srv = await db.service.findUnique({ where: { id: contentId }, include: { department: { select: { slug: true } } } });
      await revalidateServicePages(srv?.slug, srv?.department?.slug);
    } else {
      revalidatePath("/", "layout");
      revalidatePath("/admin");
      revalidatePath("/admin/approvals");
      revalidatePath(config.adminPath);
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "The workflow action failed." };
  }
}

export async function markNotificationReadAction(notificationId: string): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized." };
  await db.notification.updateMany({ where: { id: notificationId, recipientId: session.id }, data: { isRead: true } });
  return { success: true };
}

export async function markAllNotificationsReadAction(): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized." };
  await db.notification.updateMany({ where: { recipientId: session.id, isRead: false }, data: { isRead: true } });
  revalidatePath("/admin");
  return { success: true };
}
