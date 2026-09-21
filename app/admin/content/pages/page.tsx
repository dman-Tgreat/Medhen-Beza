import { getAdminPages } from "@/lib/queries/admin";
import { PagesAdminClient } from "@/components/admin/content/PagesAdminClient";

export default async function PagesAdminPage() {
  const pages = await getAdminPages();

  return <PagesAdminClient initialPages={pages} />;
}
