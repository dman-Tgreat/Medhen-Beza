import { getAdminDepartments } from "@/lib/queries/admin";
import { DepartmentsAdminClient } from "@/components/admin/content/DepartmentsAdminClient";

export const dynamic = "force-dynamic";

export default async function DepartmentsAdminPage() {
  const departments = await getAdminDepartments();

  return <DepartmentsAdminClient initialDepartments={departments} />;
}
