import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { detectBrowserLocale } from "@/lib/i18n/detect-locale";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";

export default async function RootPage() {
  const headersList = await headers();
  const acceptLang = headersList.get("accept-language");
  const locale = detectBrowserLocale(acceptLang);
  redirect(`/${locale || DEFAULT_LOCALE}`);
}
