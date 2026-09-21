import { getAdminDoctors, getAdminDepartments } from "@/lib/queries/admin";
import { DoctorsAdminClient } from "@/components/admin/content/DoctorsAdminClient";

export default async function DoctorsAdminPage() {
  const [doctors, departments] = await Promise.all([
    getAdminDoctors(),
    getAdminDepartments(),
  ]);

  return (
    <DoctorsAdminClient
      initialDoctors={doctors}
      departments={departments.map((d) => ({ id: d.id, name: d.name }))}
    />
  );
}
