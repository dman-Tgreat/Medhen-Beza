import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Building2,
  CheckCircle2,
  MapPin,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import { PageHero } from "@/components/sections/Hero";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { getFacilityBySlug, MOCK_FACILITIES_DETAILED } from "@/lib/mock-data";
import { FacilityGalleryLightbox } from "./FacilityGalleryLightbox";

interface FacilityPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return MOCK_FACILITIES_DETAILED.map((fac) => ({
    slug: fac.slug,
  }));
}

export async function generateMetadata({
  params,
}: FacilityPageProps): Promise<Metadata> {
  const { slug } = await params;
  const facility = getFacilityBySlug(slug);

  if (!facility) {
    return {
      title: "Facility Not Found | Medhen Beza Hospital",
    };
  }

  return {
    title: `${facility.name} | Hospital Facilities | Medhen Beza Hospital`,
    description: facility.description,
  };
}

export default async function FacilityDetailPage({
  params,
}: FacilityPageProps) {
  const { slug } = await params;
  const facility = getFacilityBySlug(slug);

  if (!facility) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 1. PageHero */}
      <PageHero
        eyebrow="Hospital Facility"
        title={facility.name}
        description={facility.tagline || facility.description}
        breadcrumbs={[
          { label: "Facilities", href: "/facilities" },
          { label: facility.name },
        ]}
      />

      <main className="layout-container pt-12 space-y-14">
        {/* 2. Facility Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-8 space-y-6">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-caption font-semibold bg-secondary-light text-secondary uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5" aria-hidden />
                Facility Specifications
              </span>
              <h2 className="text-h2 font-bold tracking-tight text-text">
                {facility.tagline}
              </h2>
              <p className="text-body text-text-muted leading-relaxed">
                {facility.longDescription || facility.description}
              </p>
            </div>

            {/* Key Features */}
            {facility.features && facility.features.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-border">
                <h3 className="text-h3 font-bold text-text">
                  Key Specifications & Amenities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {facility.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-4 rounded-md bg-surface border border-border"
                    >
                      <CheckCircle2
                        className="w-5 h-5 text-secondary shrink-0 mt-0.5"
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

          {/* Sidebar: Location, Capacity & Contact */}
          <div className="lg:col-span-4 rounded-lg bg-surface border border-border p-6 space-y-6 shadow-xs">
            <h3 className="text-h4 font-bold text-text border-b border-border pb-3">
              Location & Access
            </h3>

            <div className="space-y-3 text-small">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-text">Campus Wing</p>
                  <p className="text-text-muted">{facility.location}</p>
                </div>
              </div>

              {facility.capacity && (
                <div className="flex items-start gap-3">
                  <Building2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-text">Capacity / Size</p>
                    <p className="text-text-muted">{facility.capacity}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-border space-y-2.5">
              <Button asChild size="lg" className="w-full">
                <Link href="/contact" className="gap-2 justify-center">
                  <Calendar className="w-4 h-4" />
                  Inquire / Arrange Visit
                </Link>
              </Button>
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
