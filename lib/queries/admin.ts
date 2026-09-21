import { db } from "@/lib/db";

/**
 * Admin Data Access Layer
 * Retrieves records across all approval statuses (DRAFT, PENDING_APPROVAL, APPROVED, PUBLISHED, REJECTED, ARCHIVED)
 */

export async function getAdminDoctors() {
  try {
    return await db.doctor.findMany({
      include: {
        department: true,
        createdBy: { select: { id: true, name: true, email: true } },
      },
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    });
  } catch (error) {
    console.error("[ADMIN_QUERY_ERROR: getAdminDoctors]", error);
    return [];
  }
}

export async function getAdminDepartments() {
  try {
    return await db.department.findMany({
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        _count: {
          select: { doctors: true, services: true, careers: true },
        },
      },
      orderBy: [{ order: "asc" }, { updatedAt: "desc" }],
    });
  } catch (error) {
    console.error("[ADMIN_QUERY_ERROR: getAdminDepartments]", error);
    return [];
  }
}

export async function getAdminServices() {
  try {
    return await db.service.findMany({
      include: {
        department: true,
        createdBy: { select: { id: true, name: true, email: true } },
      },
      orderBy: [{ order: "asc" }, { updatedAt: "desc" }],
    });
  } catch (error) {
    console.error("[ADMIN_QUERY_ERROR: getAdminServices]", error);
    return [];
  }
}

export async function getAdminNews() {
  try {
    return await db.news.findMany({
      include: {
        category: true,
        createdBy: { select: { id: true, name: true, email: true } },
      },
      orderBy: [{ createdAt: "desc" }],
    });
  } catch (error) {
    console.error("[ADMIN_QUERY_ERROR: getAdminNews]", error);
    return [];
  }
}

export async function getAdminGallery() {
  try {
    return await db.gallery.findMany({
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
      },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
  } catch (error) {
    console.error("[ADMIN_QUERY_ERROR: getAdminGallery]", error);
    return [];
  }
}

export async function getAdminEvents() {
  try {
    return await db.hospitalEvent.findMany({
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
      },
      orderBy: [{ eventDate: "desc" }],
    });
  } catch (error) {
    console.error("[ADMIN_QUERY_ERROR: getAdminEvents]", error);
    return [];
  }
}

export async function getAdminCareers() {
  try {
    return await db.career.findMany({
      include: {
        department: true,
        createdBy: { select: { id: true, name: true, email: true } },
      },
      orderBy: [{ deadline: "asc" }, { createdAt: "desc" }],
    });
  } catch (error) {
    console.error("[ADMIN_QUERY_ERROR: getAdminCareers]", error);
    return [];
  }
}

export async function getAdminFAQs() {
  try {
    return await db.fAQ.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
  } catch (error) {
    console.error("[ADMIN_QUERY_ERROR: getAdminFAQs]", error);
    return [];
  }
}

export async function getAdminPages() {
  try {
    return await db.page.findMany({
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
      },
      orderBy: [{ updatedAt: "desc" }],
    });
  } catch (error) {
    console.error("[ADMIN_QUERY_ERROR: getAdminPages]", error);
    return [];
  }
}

// ─── Approval Queue Queries ───────────────────────────────────────────────────

export interface ApprovalQueueItem {
  id: string;
  contentType: string;
  title: string;
  status: string;
  submittedById: string | null;
  submittedByName: string | null;
  submittedByEmail: string | null;
  submittedAt: Date | null;
  createdById: string | null;
  createdByName: string | null;
  rejectionReason: string | null;
  updatedAt: Date;
  /** Department/category name if applicable */
  groupLabel: string | null;
}

async function mapToQueueItems(
  records: any[],
  contentType: string,
  titleField: string,
  groupLabel?: (r: any) => string | null
): Promise<ApprovalQueueItem[]> {
  return records.map((r) => ({
    id: r.id,
    contentType,
    title: r[titleField] ?? r.id,
    status: r.status,
    submittedById: r.submittedById ?? null,
    submittedByName: r.submittedBy?.name ?? null,
    submittedByEmail: r.submittedBy?.email ?? null,
    submittedAt: r.submittedAt ?? null,
    createdById: r.createdById ?? null,
    createdByName: r.createdBy?.name ?? null,
    rejectionReason: r.rejectionReason ?? null,
    updatedAt: r.updatedAt,
    groupLabel: groupLabel ? groupLabel(r) : null,
  }));
}

const WORKFLOW_INCLUDE = {
  submittedBy: { select: { id: true, name: true, email: true } },
  createdBy: { select: { id: true, name: true, email: true } },
};

type QueueViewer = { id: string; roles: string[] };

async function getQueueByStatus(status: string, viewer?: QueueViewer): Promise<ApprovalQueueItem[]> {
  const canSeeAll = !viewer || viewer.roles.includes("HOSPITAL_DIRECTOR");
  const where = canSeeAll
    ? { status: status as any }
    : { status: status as any, OR: [{ createdById: viewer.id }, { submittedById: viewer.id }] };
  const [doctors, departments, services, news, gallery, careers, events, pages, faqs] =
    await Promise.all([
      db.doctor.findMany({ where, include: { ...WORKFLOW_INCLUDE, department: { select: { name: true } } }, orderBy: { submittedAt: "desc" } }),
      db.department.findMany({ where, include: WORKFLOW_INCLUDE, orderBy: { submittedAt: "desc" } }),
      db.service.findMany({ where, include: { ...WORKFLOW_INCLUDE, department: { select: { name: true } } }, orderBy: { submittedAt: "desc" } }),
      db.news.findMany({ where, include: { ...WORKFLOW_INCLUDE, category: { select: { name: true } } }, orderBy: { submittedAt: "desc" } }),
      db.gallery.findMany({ where, include: WORKFLOW_INCLUDE, orderBy: { submittedAt: "desc" } }),
      db.career.findMany({ where, include: { ...WORKFLOW_INCLUDE, department: { select: { name: true } } }, orderBy: { submittedAt: "desc" } }),
      db.hospitalEvent.findMany({ where, include: WORKFLOW_INCLUDE, orderBy: { submittedAt: "desc" } }),
      db.page.findMany({ where, include: WORKFLOW_INCLUDE, orderBy: { submittedAt: "desc" } }),
      db.fAQ.findMany({ where: canSeeAll ? { status: status as any } : { id: "__not_visible__" }, orderBy: { updatedAt: "desc" } }),
    ]);

  const items: ApprovalQueueItem[] = [
    ...(await mapToQueueItems(doctors, "Doctor", "fullName", (r) => r.department?.name ?? null)),
    ...(await mapToQueueItems(departments, "Department", "name")),
    ...(await mapToQueueItems(services, "Service", "title", (r) => r.department?.name ?? null)),
    ...(await mapToQueueItems(news, "News", "title", (r) => r.category?.name ?? null)),
    ...(await mapToQueueItems(gallery, "Gallery", "title")),
    ...(await mapToQueueItems(careers, "Career", "position", (r) => r.department?.name ?? null)),
    ...(await mapToQueueItems(events, "HospitalEvent", "title")),
    ...(await mapToQueueItems(pages, "Page", "title")),
    ...(await mapToQueueItems(
      faqs.map((f) => ({ ...f, submittedById: null, submittedBy: null, submittedAt: null, rejectionReason: null })),
      "FAQ",
      "question"
    )),
  ];

  // Sort all by submittedAt descending
  return items.sort((a, b) => {
    const aTime = a.submittedAt?.getTime() ?? a.updatedAt.getTime();
    const bTime = b.submittedAt?.getTime() ?? b.updatedAt.getTime();
    return bTime - aTime;
  });
}

export async function getAdminPendingContent(viewer?: QueueViewer): Promise<ApprovalQueueItem[]> {
  try { return await getQueueByStatus("PENDING_APPROVAL", viewer); }
  catch (e) { console.error("[ADMIN_QUERY_ERROR: getAdminPendingContent]", e); return []; }
}

export async function getAdminApprovedContent(viewer?: QueueViewer): Promise<ApprovalQueueItem[]> {
  try { return await getQueueByStatus("APPROVED", viewer); }
  catch (e) { console.error("[ADMIN_QUERY_ERROR: getAdminApprovedContent]", e); return []; }
}

export async function getAdminRejectedContent(viewer?: QueueViewer): Promise<ApprovalQueueItem[]> {
  try { return await getQueueByStatus("REJECTED", viewer); }
  catch (e) { console.error("[ADMIN_QUERY_ERROR: getAdminRejectedContent]", e); return []; }
}

export async function getAdminPublishedContent(viewer?: QueueViewer): Promise<ApprovalQueueItem[]> {
  try { return await getQueueByStatus("PUBLISHED", viewer); }
  catch (e) { console.error("[ADMIN_QUERY_ERROR: getAdminPublishedContent]", e); return []; }
}

// ─── Audit Log Query ──────────────────────────────────────────────────────────

export interface AuditLogFilters {
  contentType?: string;
  userId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  limit?: number;
}

export async function getAdminAuditLogs(filters?: AuditLogFilters) {
  try {
    const where: any = {};
    if (filters?.contentType) where.contentType = filters.contentType;
    if (filters?.userId) where.userId = filters.userId;
    if (filters?.dateFrom || filters?.dateTo) {
      where.createdAt = {};
      if (filters.dateFrom) where.createdAt.gte = filters.dateFrom;
      if (filters.dateTo) where.createdAt.lte = filters.dateTo;
    }
    return await db.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: filters?.limit ?? 200,
    });
  } catch (error) {
    console.error("[ADMIN_QUERY_ERROR: getAdminAuditLogs]", error);
    return [];
  }
}

export async function getAdminAuditUsers() {
  return db.user.findMany({
    where: { auditLogs: { some: {} } },
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  });
}

// ─── Notification Queries ─────────────────────────────────────────────────────

export async function getAdminUserNotifications(userId: string) {
  try {
    return await db.notification.findMany({
      where: { recipientId: userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  } catch (error) {
    console.error("[ADMIN_QUERY_ERROR: getAdminUserNotifications]", error);
    return [];
  }
}

export async function getAdminUnreadNotificationCount(userId: string): Promise<number> {
  try {
    return await db.notification.count({ where: { recipientId: userId, isRead: false } });
  } catch {
    return 0;
  }
}
