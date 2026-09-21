import { getAdminNews } from "@/lib/queries/admin";
import { NewsAdminClient } from "@/components/admin/content/NewsAdminClient";

export default async function NewsAdminPage() {
  const news = await getAdminNews();

  return <NewsAdminClient initialNews={news} />;
}
