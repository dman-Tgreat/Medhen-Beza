import type { Metadata } from "next";
import { PageHero } from "@/components/sections/Hero";
import { FacilitiesDirectoryClient } from "@/components/public/FacilitiesDirectoryClient";
import { getPublicFacilities, getPublicSiteSettings } from "@/lib/queries/public";
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
    title: dict.facilities?.title || "Hospital Facilities & Infrastructure",
    description:
      dict.facilities?.subtitle ||
      `Explore modern clinical infrastructure, sterile operating theatres, diagnostic imaging suites, intensive care units, and inpatient rooms at ${settings.hospitalName}.`,
  };
}

export default async function FacilitiesPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await props.params;
  const locale: SupportedLocale = isSupportedLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const [facilities, dict] = await Promise.all([
    getPublicFacilities(locale),
    getDictionary(locale),
  ]);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 1. PageHero */}
      <PageHero
        eyebrow={dict.home?.facilitiesSectionEyebrow || "Clinical Infrastructure"}
        title={dict.facilities?.title || "Modern Hospital Facilities"}
        description={dict.facilities?.subtitle || "Engineered for patient healing, sterile surgical excellence, and modern medical technology across all inpatient and diagnostic wings."}
        breadcrumbs={[{ label: dict.nav?.facilities || "Facilities" }]}
      />

      {/* 2. Interactive Facilities Directory */}
      <main className="pt-8">
        <FacilitiesDirectoryClient initialFacilities={facilities} />
      </main>
    </div>
  );
}
