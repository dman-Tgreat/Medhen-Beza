import { getAdminFAQs } from "@/lib/queries/admin";
import { FAQsAdminClient } from "@/components/admin/content/FAQsAdminClient";

export default async function FAQsAdminPage() {
  const faqs = await getAdminFAQs();

  return <FAQsAdminClient initialFAQs={faqs} />;
}
