import type { Metadata } from "next";
import { PageHero } from "@/components/sections/Hero";
import { CareersDirectoryClient } from "@/components/public/CareersDirectoryClient";
import { getPublicCareers, getPublicDepartments, getPublicSiteSettings } from "@/lib/queries/public";
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
    title: dict.careers?.title || "Career Opportunities & Medical Vacancies",
    description:
      dict.careers?.subtitle ||
      `Join the clinical, nursing, and administrative team at ${settings.hospitalName}. Explore open career opportunities and healthcare vacancies in ${settings.city}.`,
  };
}

export default async function CareersPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await props.params;
  const locale: SupportedLocale = isSupportedLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const [careers, departments, dict] = await Promise.all([
    getPublicCareers(locale),
    getPublicDepartments(locale),
    getDictionary(locale),
  ]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHero
        title={dict.careers?.title || "Join Our Healthcare Team"}
        description={dict.careers?.subtitle || "Build your career in a patient-first, technology-driven medical center dedicated to clinical excellence and compassion."}
        badge={dict.nav?.careers || "Careers & Vacancies"}
        breadcrumbs={[{ label: dict.nav?.careers || "Careers" }]}
      />

      <CareersDirectoryClient initialCareers={careers} departments={departments} />
    </div>
  );
}
