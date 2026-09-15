/**
 * app/(public)/about/page.tsx — About Page
 *
 * Structured single-page About page with CMS-ready fields.
 * Section order:
 *   1. PageHero (split layout, breadcrumb Home / About)
 *   2. Hospital Introduction (split layout, photo + placeholder body + Contact Us)
 *   3. Mission & Vision (clean typographic blocks side by side)
 *   4. Core Values (row of 6 values with icons)
 *   5. Leadership (grid of 4 leadership profile cards)
 *   6. Hospital Environment (1 large facility image + row of 3 smaller labeled images)
 *   7. Accreditations & Certifications (conditionally renders only if data exists)
 *   8. Final CTA (simple closing block with Contact Us button, no emergency button)
 */

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  Mail,
  ArrowRight,
  UserCircle2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { MOCK_ABOUT_PAGE, type AboutPageData } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About Us | Medhen Beza Hospital",
  description:
    "Learn about Medhen Beza Hospital in Addis Ababa — our story, mission, vision, core values, leadership team, clinical environment, and accreditations.",
};

// ─── Reusable Section Wrapper ────────────────────────────────────────────────
function Section({
  children,
  className,
  tinted = false,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  tinted?: boolean;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn("py-16 lg:py-24", tinted && "bg-background", className)}
    >
      <div className="layout-container">{children}</div>
    </section>
  );
}

// ─── 1. PageHero ─────────────────────────────────────────────────────────────
function AboutHero({ data }: { data: AboutPageData["hero"] }) {
  return (
    <section className="bg-surface border-b border-border py-10 lg:py-16">
      <div className="layout-container">
        {/* Breadcrumb navigation */}
        <Breadcrumbs items={[{ label: "About" }]} className="mb-8" />

        {/* Split Hero Layout: on mobile image is on top, on desktop text is left and image is right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Text content side */}
          <div className="order-2 lg:order-1 lg:col-span-7 space-y-6">
            <h1 className="text-display font-bold tracking-tight text-text">
              {data.title}
            </h1>

            <p className="text-body text-text-muted leading-relaxed max-w-2xl">
              {data.supportingText}
            </p>
          </div>

          {/* Photography side */}
          <div className="order-1 lg:order-2 lg:col-span-5">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-border bg-primary-light shadow-sm">
              {data.image ? (
                <Image
                  src={data.image}
                  alt={data.imageAlt}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary-light via-secondary-light/40 to-primary-light flex flex-col items-center justify-center p-6 text-center text-primary/50 gap-3">
                  <div className="w-16 h-16 rounded-full bg-white/80 border border-border/80 flex items-center justify-center text-primary shadow-xs">
                    <Building2 className="w-8 h-8" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-small font-semibold text-text">
                      Medhen Beza Medical Campus
                    </p>
                    <p className="text-caption text-text-muted mt-0.5">
                      [Hospital exterior photography slot]
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 2. Hospital Introduction ────────────────────────────────────────────────
function HospitalIntroduction({ data }: { data: AboutPageData["introduction"] }) {
  return (
    <Section tinted>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Photo slot side (stacks above text on mobile) */}
        <div className="order-1 lg:order-1 lg:col-span-5">
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-border bg-primary-light shadow-sm">
            {data.photo ? (
              <Image
                src={data.photo}
                alt={data.photoAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-secondary-light/40 via-surface to-primary-light flex flex-col items-center justify-center p-6 text-center text-primary/50 gap-3">
                <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center text-secondary shadow-xs">
                  <Building2 className="w-8 h-8" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-small font-semibold text-text">
                    Clinical Team & Hospital Care
                  </p>
                  <p className="text-caption text-text-muted mt-0.5">
                    [Photo slot — doctors & care team in hospital environment]
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Text side */}
        <div className="order-2 lg:order-2 lg:col-span-7 space-y-6">
          <div>
            <p className="text-caption font-semibold uppercase tracking-widest text-secondary mb-2">
              {data.eyebrow}
            </p>
            <h2 className="text-h2 font-bold tracking-tight text-text">
              {data.title}
            </h2>
          </div>

          {/* Placeholder paragraphs clearly annotated */}
          <div className="space-y-4 text-body text-text-muted leading-relaxed">
            {data.paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className={cn(
                  index === 0 &&
                    "text-text font-medium border-l-3 border-primary pl-4"
                )}
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="pt-2">
            <Button asChild size="lg">
              <Link href={data.ctaHref}>
                <Mail className="w-4 h-4" aria-hidden />
                {data.ctaLabel}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}

// ─── 3. Mission & Vision ─────────────────────────────────────────────────────
function MissionVision({ data }: { data: AboutPageData["missionVision"] }) {
  return (
    <Section className="bg-surface border-y border-border">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Mission block */}
        <div className="space-y-4 pr-0 lg:pr-6 border-b lg:border-b-0 lg:border-r border-border pb-10 lg:pb-0">
          <p className="text-caption font-semibold uppercase tracking-widest text-primary">
            {data.mission.eyebrow}
          </p>
          <h2 className="text-h3 font-bold tracking-tight text-text">
            {data.mission.title}
          </h2>
          <p className="text-body text-text-muted leading-relaxed">
            {data.mission.text}
          </p>
        </div>

        {/* Vision block */}
        <div className="space-y-4 pl-0 lg:pl-6">
          <p className="text-caption font-semibold uppercase tracking-widest text-secondary">
            {data.vision.eyebrow}
          </p>
          <h2 className="text-h3 font-bold tracking-tight text-text">
            {data.vision.title}
          </h2>
          <p className="text-body text-text-muted leading-relaxed">
            {data.vision.text}
          </p>
        </div>
      </div>
    </Section>
  );
}

// ─── 4. Core Values ──────────────────────────────────────────────────────────
function CoreValues({ values }: { values: AboutPageData["values"] }) {
  return (
    <Section tinted>
      <SectionHeader
        eyebrow="Our Principles"
        title="Core Values"
        description="The fundamental principles guiding every diagnosis, treatment, and patient interaction at Medhen Beza Hospital."
      />

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {values.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className={cn(
                "p-6 rounded-lg bg-surface border border-border",
                "transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-primary-light flex flex-col gap-3.5"
              )}
            >
              <div className="w-11 h-11 rounded-md bg-primary-light text-primary flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" aria-hidden strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-h4 font-bold text-text mb-1.5">
                  {item.label}
                </h3>
                <p className="text-small text-text-muted leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

// ─── 5. Leadership ───────────────────────────────────────────────────────────
function Leadership({ leaders }: { leaders: AboutPageData["leadership"] }) {
  return (
    <Section>
      <SectionHeader
        eyebrow="Hospital Governance"
        title="Leadership Team"
        description="Our experienced clinical and administrative directors dedicated to upholding healthcare quality and organizational integrity."
      />

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {leaders.map((leader, index) => (
          <div
            key={index}
            className={cn(
              "group flex flex-col rounded-lg bg-surface border border-border overflow-hidden",
              "transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-light"
            )}
          >
            {/* Person Photo Slot */}
            <div className="relative aspect-[4/5] bg-primary-light overflow-hidden border-b border-border">
              {leader.photo ? (
                <Image
                  src={leader.photo}
                  alt={leader.photoAlt || leader.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary-light via-surface to-secondary-light/30 flex flex-col items-center justify-center p-4 text-center text-primary/40">
                  <UserCircle2 className="w-16 h-16 text-primary/40 mb-2" strokeWidth={1} />
                  <span className="text-caption font-medium text-text-muted">
                    [Photo Placeholder]
                  </span>
                </div>
              )}
            </div>

            {/* Person Details */}
            <div className="p-5 flex flex-col flex-1 gap-1">
              <h3 className="text-h4 font-bold text-text leading-snug">
                {leader.name}
              </h3>
              <p className="text-small font-medium text-secondary">
                {leader.position}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─── 6. Hospital Environment ─────────────────────────────────────────────────
function HospitalEnvironment({ data }: { data: AboutPageData["environment"] }) {
  return (
    <Section tinted>
      <SectionHeader
        eyebrow={data.eyebrow}
        title={data.title}
        description={data.description}
        viewAllHref="/facilities"
        viewAllLabel="Explore All Facilities"
        align="left"
      />

      <div className="mt-10 space-y-6">
        {/* Large featured facility image */}
        <div className="group relative aspect-[16/9] sm:aspect-[21/9] rounded-lg overflow-hidden border border-border bg-primary-light shadow-xs">
          {data.featured.image ? (
            <Image
              src={data.featured.image}
              alt={data.featured.imageAlt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary-light via-secondary-light/30 to-primary-light flex flex-col items-center justify-center p-6 text-center text-primary/50">
              <Building2 className="w-16 h-16 text-primary/40 mb-3" strokeWidth={1.25} />
              <p className="text-h4 font-semibold text-text">
                {data.featured.name}
              </p>
              <p className="text-caption text-text-muted mt-1">
                [Large facility overview image slot]
              </p>
            </div>
          )}

          {/* Overlay badge */}
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-surface/95 backdrop-blur-xs border border-border px-4 py-2.5 rounded-md shadow-sm">
            <span className="text-caption font-semibold uppercase tracking-wider text-secondary block">
              {data.featured.category}
            </span>
            <span className="text-small font-bold text-text block">
              {data.featured.name}
            </span>
          </div>
        </div>

        {/* Row of 3 smaller labeled images */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {data.supporting.map((item, index) => (
            <div
              key={index}
              className="group relative aspect-[4/3] rounded-lg overflow-hidden border border-border bg-surface shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-light"
            >
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary-light/60 via-surface to-secondary-light/30 flex flex-col items-center justify-center p-4 text-center">
                  <Building2 className="w-10 h-10 text-primary/40 mb-2" strokeWidth={1.25} />
                  <p className="text-caption font-semibold text-text px-2">
                    {item.name}
                  </p>
                  <p className="text-caption text-text-light text-xs mt-0.5">
                    [Facility photo slot]
                  </p>
                </div>
              )}

              {/* Bottom label bar */}
              <div className="absolute bottom-0 inset-x-0 bg-surface/95 backdrop-blur-xs border-t border-border px-3.5 py-2">
                <p className="text-caption font-bold text-text truncate">
                  {item.name}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Link to full facilities page */}
        <div className="pt-2 text-right">
          <Link
            href="/facilities"
            className="inline-flex items-center gap-1.5 text-small font-semibold text-primary hover:text-primary-dark transition-[gap] duration-200 hover:gap-2.5"
          >
            Explore all hospital departments & facilities
            <ArrowRight className="w-4 h-4" aria-hidden />
          </Link>
        </div>
      </div>
    </Section>
  );
}

// ─── 7. Accreditations & Certifications ──────────────────────────────────────
function Accreditations({
  accreditations,
}: {
  accreditations?: AboutPageData["accreditations"];
}) {
  // Conditionally render nothing at all if there's no accreditation data
  if (!accreditations || accreditations.length === 0) {
    return null;
  }

  return (
    <Section className="bg-surface border-y border-border">
      <SectionHeader
        eyebrow="Quality Standards"
        title="Accreditations & Certifications"
        description="Our clinical facilities and healthcare practices adhere to national and international healthcare standards."
      />

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {accreditations.map((badge, index) => (
          <div
            key={index}
            className="p-6 rounded-lg bg-background border border-border flex flex-col items-center text-center gap-3"
          >
            <div className="w-12 h-12 rounded-full bg-secondary-light text-secondary flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-small font-bold text-text">
                {badge.name}
              </h3>
              <p className="text-caption text-text-muted mt-1">
                Issued by {badge.issuer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─── 8. Final CTA ────────────────────────────────────────────────────────────
function FinalCTA({ data }: { data: AboutPageData["finalCta"] }) {
  return (
    <section className="bg-gradient-to-br from-primary-dark via-primary to-primary-dark text-white py-16 lg:py-20">
      <div className="layout-container text-center space-y-6 max-w-2xl mx-auto">
        <h2 className="text-h2 font-bold tracking-tight text-white">
          {data.title}
        </h2>
        <p className="text-body text-white/85 leading-relaxed">
          {data.description}
        </p>

        <div className="pt-2 flex justify-center">
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 shadow-cta border border-transparent font-semibold"
          >
            <Link href={data.ctaHref}>
              <Mail className="w-4 h-4" aria-hidden />
              {data.ctaLabel}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

// ─── Main Page Component ─────────────────────────────────────────────────────
export default function AboutPage() {
  const data = MOCK_ABOUT_PAGE;

  return (
    <>
      {/* 1. PageHero */}
      <AboutHero data={data.hero} />

      {/* 2. Hospital Introduction */}
      <ScrollReveal>
        <HospitalIntroduction data={data.introduction} />
      </ScrollReveal>

      {/* 3. Mission & Vision */}
      <ScrollReveal>
        <MissionVision data={data.missionVision} />
      </ScrollReveal>

      {/* 4. Core Values */}
      <ScrollReveal>
        <CoreValues values={data.values} />
      </ScrollReveal>

      {/* 5. Leadership */}
      <ScrollReveal>
        <Leadership leaders={data.leadership} />
      </ScrollReveal>

      {/* 6. Hospital Environment */}
      <ScrollReveal>
        <HospitalEnvironment data={data.environment} />
      </ScrollReveal>

      {/* 7. Accreditations & Certifications (conditionally rendered) */}
      <ScrollReveal>
        <Accreditations accreditations={data.accreditations} />
      </ScrollReveal>

      {/* 8. Final CTA */}
      <ScrollReveal>
        <FinalCTA data={data.finalCta} />
      </ScrollReveal>
    </>
  );
}
