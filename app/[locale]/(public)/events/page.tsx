import type { Metadata } from "next";
import { PageHero } from "@/components/sections/Hero";
import { EventsDirectoryClient } from "@/components/public/EventsDirectoryClient";
import { getPublicEvents, getPublicSiteSettings } from "@/lib/queries/public";
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
    title: dict.events?.title || "Hospital Events, Community Outreach & Seminars",
    description:
      dict.events?.subtitle ||
      `Explore upcoming medical symposiums, community health drives, free screening camps, and wellness workshops hosted by ${settings.hospitalName} in ${settings.city}.`,
  };
}

export default async function EventsPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await props.params;
  const locale: SupportedLocale = isSupportedLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const [events, settings, dict] = await Promise.all([
    getPublicEvents(locale),
    getPublicSiteSettings(locale),
    getDictionary(locale),
  ]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHero
        title={dict.events?.title || "Hospital Events & Talks"}
        description={dict.events?.subtitle || `Public health educational seminars, community blood donation drives, wellness workshops, and medical symposiums hosted at ${settings.hospitalName}.`}
        badge={dict.nav?.events || "Community Programs"}
        breadcrumbs={[{ label: dict.nav?.events || "Events" }]}
      />

      <EventsDirectoryClient initialEvents={events} />
    </div>
  );
}
