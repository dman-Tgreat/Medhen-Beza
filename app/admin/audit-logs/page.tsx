import { getAdminAuditLogs } from "@/lib/queries/admin";
import { getAdminAuditUsers } from "@/lib/queries/admin";
import { RoleGuard } from "@/components/admin/role-guard";
import { AuditLogsClient } from "@/components/admin/audit-logs-client";

export const dynamic = "force-dynamic";

export default async function AuditLogsAdminPage() {
  const [logs, users] = await Promise.all([
    getAdminAuditLogs({ limit: 200 }),
    getAdminAuditUsers(),
  ]);

  // Serialize dates to ISO strings for client component
  const serializedLogs = logs.map((l) => ({
    ...l,
    previousStatus: l.previousStatus ?? null,
    newStatus: l.newStatus ?? null,
    createdAt: l.createdAt.toISOString(),
  }));

  return (
    <RoleGuard allowedRoles={["HOSPITAL_DIRECTOR", "SYSTEM_ADMIN"]}>
      <AuditLogsClient logs={serializedLogs} users={users} />
    </RoleGuard>
  );
}
