import * as React from "react";
import type { Metadata } from "next";
import { PageHero } from "@/components/sections/Hero";
import { ServicesDirectoryClient } from "@/components/public/ServicesDirectoryClient";
import { getPublicServices, getPublicDepartments, getPublicSiteSettings } from "@/lib/queries/public";
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
    title: dict.services?.title || "Clinical Services & Diagnostics",
    description:
      dict.services?.subtitle ||
      `Comprehensive inpatient and outpatient clinical services, diagnostic imaging, pathology, and surgical procedures at ${settings.hospitalName} ${settings.city}.`,
  };
}

export default async function ServicesPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await props.params;
  const locale: SupportedLocale = isSupportedLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const [services, departments, dict] = await Promise.all([
    getPublicServices(locale),
    getPublicDepartments(locale),
    getDictionary(locale),
  ]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHero
        title={dict.services?.title || "Clinical Services & Treatments"}
        description={dict.services?.subtitle || "From advanced non-invasive cardiology to specialized pediatric intensive care, explore our comprehensive range of multidisciplinary clinical services."}
        badge={dict.nav?.services || "Hospital Services"}
      />

      <ServicesDirectoryClient initialServices={services} departments={departments} />
    </div>
  );
}
