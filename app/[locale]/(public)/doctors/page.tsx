import * as React from "react";
import type { Metadata } from "next";
import { PageHero } from "@/components/sections/Hero";
import { DoctorsDirectoryClient } from "@/components/public/DoctorsDirectoryClient";
import { getPublicDoctors, getPublicDepartments, getPublicSiteSettings } from "@/lib/queries/public";
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
    title: dict.doctors?.title || "Find a Doctor & Medical Specialists",
    description:
      dict.doctors?.subtitle ||
      `Search and find trusted, board-certified physicians, surgeons, and specialists at ${settings.hospitalName} ${settings.city}.`,
  };
}

export default async function DoctorsPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await props.params;
  const locale: SupportedLocale = isSupportedLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const [doctors, departments, dict] = await Promise.all([
    getPublicDoctors(locale),
    getPublicDepartments(locale),
    getDictionary(locale),
  ]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHero
        title={dict.doctors?.title || "Find a Doctor & Specialist"}
        description={dict.doctors?.subtitle || "Meet our team of board-certified consultants, surgeons, and dedicated healthcare professionals providing compassionate, world-class medical care."}
        badge={dict.nav?.doctors || "Medical Specialists"}
      />

      <DoctorsDirectoryClient initialDoctors={doctors} departments={departments} />
    </div>
  );
}
