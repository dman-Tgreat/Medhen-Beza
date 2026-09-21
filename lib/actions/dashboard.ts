"use server";

import { ContentStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import {
  getAdminApprovedContent,
  getAdminAuditLogs,
  getAdminPendingContent,
  getAdminPublishedContent,
  getAdminRejectedContent,
} from "@/lib/queries/admin";

export async function getDashboardSummaryAction() {
  const session = await getSession();
  if (!session) return { success: false as const, error: "Unauthorized." };

  const [pending, approved, rejected, published, logs, doctors, careers, news] = await Promise.all([
    getAdminPendingContent(session),
    getAdminApprovedContent(session),
    getAdminRejectedContent(session),
    getAdminPublishedContent(session),
    getAdminAuditLogs({ limit: 6 }),
    db.doctor.count({ where: { status: ContentStatus.PUBLISHED } }),
    db.career.count({ where: { status: ContentStatus.PUBLISHED } }),
    db.news.count({ where: { status: ContentStatus.PUBLISHED } }),
  ]);

  const visibleItems = (session.roles.includes("HOSPITAL_DIRECTOR") ? pending : [...pending, ...approved, ...rejected, ...published])
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 4)
    .map((item) => ({
      id: item.id,
      title: item.title,
      type: item.contentType,
      author: item.submittedByName ?? item.createdByName ?? "Unknown author",
      date: (item.submittedAt ?? item.updatedAt).toISOString(),
      status: item.status,
    }));

  return {
    success: true as const,
    data: {
      pendingCount: pending.length,
      doctors,
      careers,
      news,
      pendingApprovals: visibleItems,
      recentActivities: logs.map((log) => ({
        id: log.id,
        user: log.userName ?? log.userEmail ?? "System",
        action: log.action,
        entity: `${log.contentType} (${log.contentId})`,
        time: log.createdAt.toISOString(),
      })),
    },
  };
}
