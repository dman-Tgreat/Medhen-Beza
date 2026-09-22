import React from "react";
import { getSession } from "@/lib/auth/session";
import { AdminRoleProvider } from "@/components/admin/role-context";
import { AdminLayoutShell } from "@/components/admin/admin-layout-shell";
import { getAdminUserNotifications } from "@/lib/queries/admin";
import { getPublicSiteSettings } from "@/lib/queries/public";

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, settings] = await Promise.all([
    getSession(),
    getPublicSiteSettings(),
  ]);

  // The authentication pages live under this layout but must remain available
  // without a session. Middleware protects every other /admin route.
  if (!session) {
    return <>{children}</>;
  }

  // Fetch notifications for the current user (null-safe)
  const notifications = session
    ? await getAdminUserNotifications(session.id)
    : [];

  const serializedNotifications = notifications.map((n) => ({
    id: n.id,
    type: n.type,
    title: n.title,
    message: n.message,
    contentType: n.contentType,
    contentId: n.contentId,
    isRead: n.isRead,
    createdAt: n.createdAt.toISOString(),
  }));

  return (
    <AdminRoleProvider initialSession={session}>
      <AdminLayoutShell
        initialNotifications={serializedNotifications}
        hospitalName={settings.hospitalName}
      >
        {children}
      </AdminLayoutShell>
    </AdminRoleProvider>
  );
}
