import { getAdminDepartments } from "@/lib/queries/admin";
import { DepartmentsAdminClient } from "@/components/admin/content/DepartmentsAdminClient";

export default async function DepartmentsAdminPage() {
  const departments = await getAdminDepartments();

  return <DepartmentsAdminClient initialDepartments={departments} />;
}
