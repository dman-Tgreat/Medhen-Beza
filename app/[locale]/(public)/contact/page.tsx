import type { Metadata } from "next";
import { PageHero } from "@/components/sections/Hero";
import { ContactFormClient } from "@/components/public/ContactFormClient";
import { getPublicDepartments, getPublicSiteSettings } from "@/lib/queries/public";
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
    title: dict.contact?.title || "Contact & Appointments",
    description:
      dict.contact?.subtitle ||
      `Get in touch with ${settings.hospitalName} for general inquiries, clinical appointments, emergency admissions, and medical department contacts.`,
  };
}

export default async function ContactPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await props.params;
  const locale: SupportedLocale = isSupportedLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const [departments, settings, dict] = await Promise.all([
    getPublicDepartments(locale),
    getPublicSiteSettings(locale),
    getDictionary(locale),
  ]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHero
        title={`${dict.nav?.contact || "Contact"} ${settings.hospitalName}`}
        description={dict.contact?.subtitle || "Our patient helpdesk and medical administrative staff are available to assist with appointments, specialist inquiries, and admissions."}
        badge={dict.nav?.contact || "Get in Touch"}
        breadcrumbs={[{ label: dict.nav?.contact || "Contact" }]}
      />

      <ContactFormClient departments={departments} settings={settings} />
    </div>
  );
}
