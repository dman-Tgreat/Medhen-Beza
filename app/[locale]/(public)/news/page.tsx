import * as React from "react";
import type { Metadata } from "next";
import { PageHero } from "@/components/sections/Hero";
import { NewsDirectoryClient } from "@/components/public/NewsDirectoryClient";
import { getPublicNews, getPublicSiteSettings } from "@/lib/queries/public";
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
    title: dict.news?.title || "Hospital News, Medical Advances & Health Articles",
    description:
      dict.news?.subtitle ||
      `Stay informed with the latest medical news, specialized clinical updates, community health outreach, and physician insights from ${settings.hospitalName}.`,
  };
}

export default async function NewsPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await props.params;
  const locale: SupportedLocale = isSupportedLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const [news, dict] = await Promise.all([
    getPublicNews(locale),
    getDictionary(locale),
  ]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHero
        title={dict.news?.title || "News, Research & Health Updates"}
        description={dict.news?.subtitle || "Discover the latest medical breakthroughs, clinical advancements, hospital announcements, and health wellness advice from our expert physicians."}
        badge={dict.nav?.news || "Hospital News"}
      />

      <NewsDirectoryClient initialNews={news} />
    </div>
  );
}
