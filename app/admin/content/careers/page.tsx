import { getAdminCareers, getAdminDepartments } from "@/lib/queries/admin";
import { CareersAdminClient } from "@/components/admin/content/CareersAdminClient";

export default async function CareersAdminPage() {
  const [careers, departments] = await Promise.all([
    getAdminCareers(),
    getAdminDepartments(),
  ]);

  return (
    <CareersAdminClient
      initialCareers={careers}
      departments={departments.map((d) => ({ id: d.id, name: d.name }))}
    />
  );
}
