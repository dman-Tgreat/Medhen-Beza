import React from "react";
import { getSession } from "@/lib/auth/session";
import { AdminRoleProvider } from "@/components/admin/role-context";
import { AdminLayoutShell } from "@/components/admin/admin-layout-shell";

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <AdminRoleProvider initialSession={session}>
      <AdminLayoutShell>{children}</AdminLayoutShell>
    </AdminRoleProvider>
  );
}
