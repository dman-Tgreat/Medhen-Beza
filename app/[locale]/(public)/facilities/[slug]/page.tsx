import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Building2,
  CheckCircle2,
  MapPin,
  Calendar,
  Clock,
  PhoneCall,
  Tag,
} from "lucide-react";
import { PageHero } from "@/components/sections/Hero";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { getPublicFacilityBySlug, getPublicFacilities } from "@/lib/queries/public";
import { FacilityGalleryLightbox } from "./FacilityGalleryLightbox";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { LOCALES, isSupportedLocale, DEFAULT_LOCALE, type SupportedLocale } from "@/lib/i18n/config";

interface FacilityPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const facilities = await getPublicFacilities();
  const params: { locale: string; slug: string }[] = [];
  LOCALES.forEach((locale) => {
    facilities.forEach((fac) => {
      if (fac.slug) params.push({ locale, slug: fac.slug });
      if (fac.id && fac.id !== fac.slug) params.push({ locale, slug: fac.id });
    });
  });
  return params;
}

export async function generateMetadata({
  params,
}: FacilityPageProps): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale: SupportedLocale = isSupportedLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const facility = await getPublicFacilityBySlug(slug, locale);

  if (!facility) {
    return {
      title: "Facility Not Found",
    };
  }

  return {
    title: `${facility.name} | Hospital Facilities`,
    description: facility.description,
  };
}

export default async function FacilityDetailPage({
  params,
}: FacilityPageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale: SupportedLocale = isSupportedLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const [facility, dict] = await Promise.all([
    getPublicFacilityBySlug(slug, locale),
    getDictionary(locale),
  ]);

  if (!facility) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 1. PageHero */}
      <PageHero
        badge={facility.category || dict.nav?.facilities || "Clinical Facility"}
        title={facility.name}
        description={facility.tagline}
        breadcrumbs={[
          { label: dict.nav?.facilities || "Facilities", href: `/${locale}/facilities` },
          { label: facility.name },
        ]}
      />

      <main className="layout-container pt-12 space-y-14">
        {/* 2. Facility Overview & Specifications */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-8 space-y-8">
            {facility.image && !facility.image.includes("youtube.com/watch") && !facility.image.includes("youtu.be/") && (
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-border shadow-sm">
                <Image
                  src={facility.image}
                  alt={facility.imageAlt || facility.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              </div>
            )}

            <div className="space-y-4">
              <div className="inline-flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-caption font-semibold bg-primary-light text-primary uppercase tracking-wider">
                  <Building2 className="w-3.5 h-3.5" aria-hidden />
                  {facility.category || "Clinical Unit"}
                </span>
                {facility.capacity && (
                  <span className="text-caption font-medium text-text-muted">
                    · {facility.capacity}
                  </span>
                )}
              </div>

              <h2 className="text-h2 font-bold tracking-tight text-text">
                {facility.tagline || facility.name}
              </h2>

              <p className="text-body text-text-muted leading-relaxed whitespace-pre-line">
                {facility.longDescription || facility.description}
              </p>
            </div>

            {/* Key Features */}
            {facility.features && facility.features.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-border">
                <h3 className="text-h3 font-bold text-text">
                  {dict.facilities?.specifications || "Key Specifications & Amenities"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {facility.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-4 rounded-xl bg-surface border border-border shadow-2xs"
                    >
                      <CheckCircle2
                        className="w-5 h-5 text-primary shrink-0 mt-0.5"
                        aria-hidden
                      />
                      <span className="text-small font-medium text-text leading-snug">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar: Location, Capacity, Hours & Contact */}
          <div className="lg:col-span-4 rounded-2xl bg-surface border border-border p-6 sm:p-7 space-y-6 shadow-sm sticky top-24">
            <h3 className="text-h4 font-bold text-text border-b border-border pb-3">
              {dict.common?.location || "Location & Access"}
            </h3>

            <div className="space-y-4 text-small">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-text">Campus Wing</p>
                  <p className="text-text-muted">{facility.location || "Main Medical Complex"}</p>
                </div>
              </div>

              {facility.category && (
                <div className="flex items-start gap-3">
                  <Tag className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-text">Classification</p>
                    <span className="inline-block rounded bg-primary-light px-2 py-0.5 text-xs font-semibold text-primary mt-0.5">
                      {facility.category}
                    </span>
                  </div>
                </div>
              )}

              {facility.capacity && (
                <div className="flex items-start gap-3">
                  <Building2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-text">Capacity / Size</p>
                    <p className="text-text-muted">{facility.capacity}</p>
                  </div>
                </div>
              )}

              {facility.hours && (
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-text">{dict.common?.hours || "Access & Visiting Hours"}</p>
                    <p className="text-text-muted">{facility.hours}</p>
                  </div>
                </div>
              )}

              {facility.phone && (
                <div className="flex items-start gap-3">
                  <PhoneCall className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-text">{dict.common?.phone || "Direct Inquiry"}</p>
                    <a
                      href={`tel:${facility.phone.replace(/\s/g, "")}`}
                      className="text-primary hover:underline font-medium"
                    >
                      {facility.phone}
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-border space-y-2.5">
              <Button asChild size="lg" className="w-full">
                <Link href={`/${locale}/contact`} className="gap-2 justify-center">
                  <Calendar className="w-4 h-4" />
                  {dict.nav?.contact || "Inquire / Arrange Visit"}
                </Link>
              </Button>
              {facility.phone && (
                <Button asChild variant="outline" size="lg" className="w-full">
                  <a href={`tel:${facility.phone.replace(/\s/g, "")}`} className="gap-2 justify-center">
                    <PhoneCall className="w-4 h-4" />
                    {dict.common?.callNow || "Call Unit Directly"}
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* 3. Image Gallery with Lightbox Client Component */}
        {facility.galleryImages && facility.galleryImages.length > 0 && (
          <ScrollReveal>
            <FacilityGalleryLightbox images={facility.galleryImages} />
          </ScrollReveal>
        )}
      </main>
    </div>
  );
}
