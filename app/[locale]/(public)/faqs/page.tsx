import type { Metadata } from "next";
import { PageHero } from "@/components/sections/Hero";
import { FAQsDirectoryClient } from "@/components/public/FAQsDirectoryClient";
import { getPublicFAQs, getPublicSiteSettings } from "@/lib/queries/public";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isSupportedLocale, DEFAULT_LOCALE, type SupportedLocale } from "@/lib/i18n/config";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await props.params;
  const locale: SupportedLocale = isSupportedLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const [settings, dict] = await Promise.all([
    getPublicSiteSettings(locale),
    getDictionary(locale),
  ]);
  return {
    title: dict.faqs?.title || "Frequently Asked Questions (FAQs)",
    description:
      dict.faqs?.subtitle ||
      `Find answers to frequently asked questions about doctor appointments, emergency admission, health insurance, visiting hours, and clinical services at ${settings.hospitalName}.`,
  };
}

export default async function FAQsPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await props.params;
  const locale: SupportedLocale = isSupportedLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const [groups, dict] = await Promise.all([
    getPublicFAQs(locale),
    getDictionary(locale),
  ]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHero
        eyebrow="Help & Knowledge Base"
        title={dict.faqs?.title || "Frequently Asked Questions"}
        description={dict.faqs?.subtitle || "Find clear answers to common questions about visiting guidelines, booking appointments, health insurance, payment policies, and hospital services."}
        breadcrumbs={[{ label: dict.nav?.faqs || "FAQs" }]}
      />

      <FAQsDirectoryClient initialGroups={groups} />
    </div>
  );
}
