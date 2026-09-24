import type { Metadata } from "next";
import { PageHero } from "@/components/sections/Hero";
import { GalleryDirectoryClient } from "@/components/public/GalleryDirectoryClient";
import { getPublicGallery, getPublicSiteSettings } from "@/lib/queries/public";
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
    title: dict.gallery?.title || "Media Gallery & Hospital Tour",
    description:
      dict.gallery?.subtitle ||
      `Take a visual and video tour of ${settings.hospitalName}'s advanced diagnostic imaging suites, modern operating theatres, patient rooms, and specialized clinical centers.`,
  };
}

export default async function GalleryPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await props.params;
  const locale: SupportedLocale = isSupportedLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const [items, dict] = await Promise.all([
    getPublicGallery(locale),
    getDictionary(locale),
  ]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHero
        title={dict.gallery?.title || "Hospital Campus & Facilities Gallery"}
        description={dict.gallery?.subtitle || "Experience our modern medical architecture, state-of-the-art diagnostic suites, comfortable inpatient amenities, and compassionate clinical teams."}
        badge={dict.nav?.gallery || "Media Gallery"}
        breadcrumbs={[{ label: dict.nav?.gallery || "Gallery" }]}
      />

      <GalleryDirectoryClient initialItems={items} />
    </div>
  );
}
