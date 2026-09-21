import { getAdminServices, getAdminDepartments } from "@/lib/queries/admin";
import { ServicesAdminClient } from "@/components/admin/content/ServicesAdminClient";

export default async function ServicesAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ departmentId?: string }>;
}) {
  const { departmentId } = await searchParams;
  const [services, departments] = await Promise.all([
    getAdminServices(),
    getAdminDepartments(),
  ]);

  return (
    <ServicesAdminClient
      initialServices={services}
      departments={departments.map((d) => ({ id: d.id, name: d.name }))}
      initialDepartmentId={departmentId}
    />
  );
}
