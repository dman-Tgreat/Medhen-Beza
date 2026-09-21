import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Building2, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { PageHero } from "@/components/sections/Hero";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { getPublicFacilities } from "@/lib/queries/public";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Hospital Facilities & Infrastructure | Medhen Beza Hospital",
  description:
    "Explore our modern clinical infrastructure, sterile operating theatres, diagnostic imaging suites, intensive care units, and inpatient rooms.",
};

export default async function FacilitiesPage() {
  const facilities = await getPublicFacilities();
  const [featuredFacility, secondFacility, ...restFacilities] = facilities;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 1. PageHero */}
      <PageHero
        eyebrow="Clinical Infrastructure"
        title="Modern Hospital Facilities"
        description="Engineered for patient healing, sterile surgical excellence, and modern medical technology across all inpatient and diagnostic wings."
        breadcrumbs={[{ label: "Facilities" }]}
      />

      <main className="layout-container pt-12 space-y-12">
        {/* 2. Visual-Led Asymmetric / Masonry Grid */}
        {/* Top Hero Banner: Large Featured Facility */}
        {featuredFacility && (
          <ScrollReveal>
            <Link
              href={featuredFacility.href}
              className="group block relative aspect-[16/9] md:aspect-[21/9] rounded-xl overflow-hidden border border-border bg-primary-light shadow-md hover:border-primary transition-all duration-300"
            >
              {featuredFacility.image ? (
                <Image
                  src={featuredFacility.image}
                  alt={featuredFacility.imageAlt || featuredFacility.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  priority
                  sizes="100vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-secondary flex flex-col items-center justify-center p-8 text-center text-white/80">
                  <Building2 className="w-20 h-20 text-white/40 mb-3" strokeWidth={1.25} />
                  <span className="text-caption font-semibold text-secondary-light uppercase tracking-widest">
                    Flagship Facility
                  </span>
                  <h2 className="text-h2 font-black text-white mt-1">
                    {featuredFacility.name}
                  </h2>
                </div>
              )}

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-text/90 via-text/40 to-transparent" />

              {/* Content floating on image */}
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-2 max-w-2xl text-white">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-caption font-bold uppercase tracking-wider text-white">
                    <Sparkles className="w-3.5 h-3.5 text-secondary-light" />
                    Featured Facility
                  </div>
                  <h3 className="text-h2 font-bold text-white leading-tight">
                    {featuredFacility.name}
                  </h3>
                  <p className="text-small text-white/85 line-clamp-2 leading-relaxed">
                    {featuredFacility.description}
                  </p>
                </div>

                <span className="inline-flex items-center gap-2 rounded-md bg-white text-primary px-5 py-2.5 text-small font-bold shrink-0 group-hover:bg-primary-light transition-colors">
                  Explore Facility
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </ScrollReveal>
        )}

        {/* Masonry-Style Asymmetric Grid for Remaining Facilities */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Second Facility (Span 7) */}
          {secondFacility && (
            <div className="md:col-span-7">
              <ScrollReveal>
                <Link
                  href={secondFacility.href}
                  className="group block relative aspect-[4/3] rounded-lg overflow-hidden border border-border bg-surface shadow-xs hover:border-primary transition-all duration-300 h-full"
                >
                  {secondFacility.image ? (
                    <Image
                      src={secondFacility.image}
                      alt={secondFacility.imageAlt || secondFacility.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 60vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary-light to-primary-light flex flex-col items-center justify-center p-6 text-center text-primary/40">
                      <Building2 className="w-16 h-16 mb-2" strokeWidth={1.25} />
                      <span className="text-caption font-semibold text-text-muted">
                        {secondFacility.name}
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-text/85 via-text/30 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-6 text-white space-y-1.5">
                    <span className="text-caption font-bold text-secondary-light uppercase tracking-wider">
                      {secondFacility.location}
                    </span>
                    <h3 className="text-h3 font-bold text-white">
                      {secondFacility.name}
                    </h3>
                    <p className="text-caption text-white/80 line-clamp-2">
                      {secondFacility.description}
                    </p>
                  </div>
                </Link>
              </ScrollReveal>
            </div>
          )}

          {/* Third Facility (Span 5) */}
          {restFacilities.slice(0, 1).map((fac) => (
            <div key={fac.slug} className="md:col-span-5">
              <ScrollReveal>
                <Link
                  href={fac.href}
                  className="group block relative aspect-[4/3] rounded-lg overflow-hidden border border-border bg-surface shadow-xs hover:border-primary transition-all duration-300 h-full"
                >
                  {fac.image ? (
                    <Image
                      src={fac.image}
                      alt={fac.imageAlt || fac.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 40vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-light to-secondary-light flex flex-col items-center justify-center p-6 text-center text-primary/40">
                      <Building2 className="w-14 h-14 mb-2" strokeWidth={1.25} />
                      <span className="text-caption font-semibold text-text-muted">
                        {fac.name}
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-text/85 via-text/30 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-6 text-white space-y-1.5">
                    <span className="text-caption font-bold text-secondary-light uppercase tracking-wider">
                      {fac.location}
                    </span>
                    <h3 className="text-h3 font-bold text-white">
                      {fac.name}
                    </h3>
                    <p className="text-caption text-white/80 line-clamp-2">
                      {fac.description}
                    </p>
                  </div>
                </Link>
              </ScrollReveal>
            </div>
          ))}

          {/* Remaining Facilities in 3-col Grid */}
          {restFacilities.slice(1).map((fac) => (
            <div key={fac.slug} className="md:col-span-4">
              <ScrollReveal>
                <Link
                  href={fac.href}
                  className="group block relative aspect-[4/3] rounded-lg overflow-hidden border border-border bg-surface shadow-xs hover:border-primary transition-all duration-300"
                >
                  {fac.image ? (
                    <Image
                      src={fac.image}
                      alt={fac.imageAlt || fac.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary-light/60 to-primary-light flex flex-col items-center justify-center p-4 text-center text-primary/40">
                      <Building2 className="w-12 h-12 mb-1.5" strokeWidth={1.25} />
                      <span className="text-caption font-semibold text-text-muted">
                        {fac.name}
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-text/85 via-text/25 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-5 text-white space-y-1">
                    <span className="text-caption font-bold text-secondary-light uppercase tracking-wider text-[11px]">
                      {fac.location}
                    </span>
                    <h3 className="text-h4 font-bold text-white leading-tight">
                      {fac.name}
                    </h3>
                    <p className="text-caption text-white/75 line-clamp-1">
                      {fac.description}
                    </p>
                  </div>
                </Link>
              </ScrollReveal>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
