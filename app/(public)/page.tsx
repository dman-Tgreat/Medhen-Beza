/**
 * app/(public)/page.tsx — Homepage
 *
 * Patient journey order:
 *   1. Header (layout)
 *   2. Hero
 *   3. Quick Actions
 *   4. Hospital Introduction
 *   5. Services
 *   6. Departments
 *   7. Doctors
 *   8. Facilities
 *   9. News & Events
 *  10. Gallery
 *  11. Emergency / Contact CTA
 *  12. Footer (layout)
 *
 * Every CMS-driven section pulls from lib/mock-data.ts.
 * Swapping in real data later = one-file change.
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import {
  UserSearch,
  LayoutGrid,
  Building2,
  PhoneCall,
  ArrowRight,
  Phone,
  Mail,
} from "lucide-react";

import { Hero } from "@/components/sections/Hero";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { ServiceCard } from "@/components/content/ServiceCard";
import { DepartmentCard } from "@/components/content/DepartmentCard";
import { DoctorCard } from "@/components/content/DoctorCard";
import { FacilityCard } from "@/components/content/FacilityCard";
import { NewsCard } from "@/components/content/NewsCard";
import { EventCard } from "@/components/content/EventCard";
import { GalleryCard } from "@/components/content/GalleryCard";
import { Button } from "@/components/ui/button";
import { EmergencyButton } from "@/components/ui/emergency-button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { HOSPITAL_INFO } from "@/lib/constants";
import {
  MOCK_SERVICES,
  MOCK_DEPARTMENTS,
  MOCK_DOCTORS,
  MOCK_FACILITIES,
  MOCK_NEWS,
  MOCK_EVENTS,
  MOCK_GALLERY,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

// ─── Section wrapper — consistent vertical rhythm ─────────────────────────────
function Section({
  children,
  className,
  tinted = false,
}: {
  children: React.ReactNode;
  className?: string;
  tinted?: boolean;
}) {
  return (
    <section
      className={cn(
        "py-16 lg:py-24",
        tinted && "bg-background",
        className
      )}
    >
      <div className="layout-container">{children}</div>
    </section>
  );
}

// ─── 3. Quick Actions ─────────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  {
    icon: UserSearch,
    label: "Find a Doctor",
    description: "Browse our specialists",
    href: "/doctors",
    accent: "text-primary bg-primary-light",
  },
  {
    icon: LayoutGrid,
    label: "Our Services",
    description: "Explore what we offer",
    href: "/services",
    accent: "text-secondary bg-secondary-light",
  },
  {
    icon: Building2,
    label: "Departments",
    description: "See all clinical units",
    href: "/departments",
    accent: "text-primary bg-primary-light",
  },
  {
    icon: PhoneCall,
    label: "Emergency",
    description: "24 / 7 immediate care",
    href: "/emergency",
    accent: "text-emergency bg-emergency-light",
  },
] as const;

function QuickActions() {
  return (
    <Section tinted className="py-10 lg:py-14 border-b border-border">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {QUICK_ACTIONS.map(({ icon: Icon, label, description, href, accent }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "group flex flex-col items-center text-center gap-3 p-6 rounded-lg",
              "bg-surface border border-border",
              "transition-[border-color,transform] duration-200 ease-out",
              "hover:-translate-y-0.5 hover:border-primary-light",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            )}
          >
            <div
              className={cn(
                "w-12 h-12 rounded-md flex items-center justify-center shrink-0",
                "transition-transform duration-200 group-hover:scale-110",
                accent
              )}
            >
              <Icon className="w-6 h-6" aria-hidden strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-small font-semibold text-text leading-tight">{label}</p>
              <p className="text-caption text-text-muted mt-0.5">{description}</p>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}

// ─── 4. Hospital Introduction ─────────────────────────────────────────────────
function HospitalIntro() {
  return (
    <Section>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Image side */}
        <div className="relative rounded-lg overflow-hidden aspect-[4/3] bg-primary-light border border-border">
          {/* ↓ Replace with a real hospital exterior photo ↓ */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-light via-secondary-light to-primary-light flex flex-col items-center justify-center gap-3 text-primary/40">
            <Building2 className="w-20 h-20" strokeWidth={1} />
            <p className="text-caption font-medium text-center px-6">
              [Photo slot — hospital exterior or lobby image]
            </p>
          </div>
        </div>

        {/* Text side */}
        <div className="space-y-6">
          <p className="text-caption font-semibold uppercase tracking-widest text-secondary">
            About Us
          </p>
          <h2 className="text-h2 font-bold tracking-tight text-text">
            {/* ↓ PLACEHOLDER — replace with client's real hospital name / intro heading ↓ */}
            [Placeholder] Trusted care for every stage of life
          </h2>

          {/* ↓ PLACEHOLDER — 2-3 sentences of intro copy from the client ↓ */}
          <div className="space-y-3 text-body text-text-muted leading-relaxed border-l-4 border-primary-light pl-4">
            <p>
              [Placeholder intro sentence 1 — describe who the hospital is, e.g.
              founding year, mission, patient-centred values.]
            </p>
            <p>
              [Placeholder intro sentence 2 — highlight specialties, community
              reach, or accreditation status.]
            </p>
            <p>
              [Placeholder intro sentence 3 — vision statement or patient
              commitment.]
            </p>
          </div>

          <Link
            href="/about"
            className="group inline-flex items-center gap-1.5 text-small font-semibold text-primary transition-[gap] duration-200 hover:gap-2.5 focus-visible:outline-none focus-visible:underline"
          >
            Learn About Us
            <ArrowRight
              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
        </div>
      </div>
    </Section>
  );
}

// ─── 8. Facilities showcase ───────────────────────────────────────────────────
function FacilitiesShowcase() {
  const [featured, ...supporting] = MOCK_FACILITIES;

  return (
    <Section tinted>
      <SectionHeader
        eyebrow="Our Facilities"
        title="State-of-the-art care environment"
        description="[Placeholder] Our campus is designed to deliver the best clinical experience — from modern inpatient suites to cutting-edge diagnostic technology."
        viewAllHref="/facilities"
        viewAllLabel="Explore Facilities"
        align="left"
      />

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Featured — spans 2 cols on desktop */}
        <div className="lg:col-span-2">
          <FacilityCard data={featured} className="h-full" />
        </div>

        {/* Supporting — stacked */}
        <div className="flex flex-col gap-4">
          {supporting.map((f) => (
            <FacilityCard key={f.href} data={f} />
          ))}
        </div>
      </div>
    </Section>
  );
}

// ─── 9. News & Events combined ────────────────────────────────────────────────
function NewsAndEvents() {
  const allItems = [
    ...MOCK_NEWS.map((n) => ({ type: "news" as const, data: n })),
    ...MOCK_EVENTS.map((e) => ({ type: "event" as const, data: e })),
  ];

  return (
    <Section>
      <SectionHeader
        eyebrow="What's Happening"
        title="News & Events"
        description="Stay up to date with the latest from our hospital — health insights, upcoming community events, and important announcements."
      />

      <Tabs defaultValue="all" className="mt-10">
        <div className="flex justify-center mb-8">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>
        </div>

        {/* All */}
        <TabsContent value="all">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allItems.slice(0, 6).map((item, i) =>
              item.type === "news" ? (
                <NewsCard key={`news-${i}`} data={item.data as typeof MOCK_NEWS[0]} />
              ) : (
                <EventCard key={`event-${i}`} data={item.data as typeof MOCK_EVENTS[0]} />
              )
            )}
          </div>
        </TabsContent>

        {/* News only */}
        <TabsContent value="news">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_NEWS.map((n, i) => (
              <NewsCard key={i} data={n} />
            ))}
          </div>
        </TabsContent>

        {/* Events only */}
        <TabsContent value="events">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_EVENTS.map((e, i) => (
              <EventCard key={i} data={e} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </Section>
  );
}

// ─── 11. Emergency / Contact CTA block ───────────────────────────────────────
function EmergencyCTA() {
  return (
    <section className="bg-gradient-to-br from-primary-dark via-primary to-secondary py-16 lg:py-24">
      <div className="layout-container text-center space-y-8 max-w-2xl mx-auto">
        {/* Headline */}
        <div className="space-y-3">
          <h2 className="text-h2 font-bold tracking-tight text-white">
            Need help or information?
          </h2>
          <p className="text-body text-white/80 leading-relaxed">
            Our team is available around the clock. Reach us by phone, email, or
            walk in — we are always ready to help.
          </p>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full max-w-md sm:max-w-none mx-auto">
          <Button asChild size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-white/90">
            <Link href="/contact">
              <Mail className="w-5 h-5" aria-hidden />
              Contact Us
            </Link>
          </Button>
          <EmergencyButton
            phone={HOSPITAL_INFO.emergencyPhone}
            label="Emergency Line"
            size="lg"
            className="w-full sm:w-auto"
          />
        </div>

        {/* Emergency number as plain text */}
        <div className="flex items-center justify-center gap-2 text-white/70">
          <Phone className="w-4 h-4 shrink-0" aria-hidden />
          <span className="text-small">
            Emergency:{" "}
            <a
              href={`tel:${HOSPITAL_INFO.emergencyPhone.replace(/\s/g, "")}`}
              className="font-semibold text-white underline-offset-2 hover:underline"
            >
              {HOSPITAL_INFO.emergencyPhone}
            </a>
            {" "}— available 24 / 7
          </span>
        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      {/* ── 2. Hero ─────────────────────────────────────────────── */}
      {/*
        The Hero component accepts real-hospital-photo via `photoSrc`.
        When no photoSrc is provided it shows a labelled placeholder slot.
        CTAs are "Explore Services" → /services and "Find a Doctor" → /doctors
        per the spec. All copy below is clearly-marked placeholder text.
      */}
      <Hero
        eyebrow="[Placeholder eyebrow — e.g. 'Leading Healthcare Excellence']"
        headline="Compassionate care."
        headlineAccent="Trusted healthcare."
        supportingText="[Placeholder supporting text — replace with the client's real marketing copy. Example: 'Close to you, committed to you — exceptional clinical care delivered by specialists who put patients first.']"
        primaryCta={{ label: "Explore Services", href: "/services" }}
        secondaryCta={{ label: "Find a Doctor", href: "/doctors" }}
        /* photoSrc="/images/hospital-hero.jpg" ← Uncomment and add real photo */
        stats={[
          { value: "50+", label: "Specialists" },
          { value: "24 / 7", label: "Emergency" },
          { value: "15+", label: "Departments" },
        ]}
      />

      {/* ── 3. Quick Actions ─────────────────────────────────────── */}
      <ScrollReveal>
        <QuickActions />
      </ScrollReveal>

      {/* ── 4. Hospital Introduction ──────────────────────────────── */}
      <ScrollReveal>
        <HospitalIntro />
      </ScrollReveal>

      {/* ── 5. Services ──────────────────────────────────────────── */}
      <ScrollReveal>
        <Section tinted>
          <SectionHeader
            eyebrow="What We Offer"
            title="Our Medical Services"
            description="[Placeholder] From routine check-ups to complex surgical procedures, our specialists deliver expert care across a full spectrum of medical disciplines."
            viewAllHref="/services"
            viewAllLabel="View All Services"
          />
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Cap at 6 cards — additional services live at /services */}
            {MOCK_SERVICES.slice(0, 6).map((s) => (
              <ServiceCard key={s.href} data={s} />
            ))}
          </div>
        </Section>
      </ScrollReveal>

      {/* ── 6. Departments ───────────────────────────────────────── */}
      <ScrollReveal>
        <Section>
          <SectionHeader
            eyebrow="Clinical Units"
            title="Our Departments"
            description="[Placeholder] Each department is staffed by board-certified specialists supported by modern diagnostic and treatment technology."
            viewAllHref="/departments"
            viewAllLabel="Explore Departments"
          />
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_DEPARTMENTS.map((d) => (
              <DepartmentCard key={d.href} data={d} />
            ))}
          </div>
        </Section>
      </ScrollReveal>

      {/* ── 7. Doctors ────────────────────────────────────────────── */}
      <ScrollReveal>
        <Section tinted>
          <SectionHeader
            eyebrow="Meet the Team"
            title="Our Doctors"
            description="[Placeholder] Our medical team combines years of clinical experience with a genuine commitment to patient-centred care."
            viewAllHref="/doctors"
            viewAllLabel="Meet All Doctors"
          />
          {/* 4 doctor cards — no appointment button per spec (Phase 2) */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_DOCTORS.map((d) => (
              <DoctorCard key={d.href} data={d} />
            ))}
          </div>
        </Section>
      </ScrollReveal>

      {/* ── 8. Facilities ─────────────────────────────────────────── */}
      <ScrollReveal>
        <FacilitiesShowcase />
      </ScrollReveal>

      {/* ── 9. News & Events ─────────────────────────────────────── */}
      <ScrollReveal>
        <NewsAndEvents />
      </ScrollReveal>

      {/* ── 10. Gallery ──────────────────────────────────────────── */}
      <ScrollReveal>
        <Section tinted>
          <SectionHeader
            eyebrow="Photo & Video"
            title="Gallery"
            description="[Placeholder] A glimpse of our facilities, events, and the people who make Medhen Beza Hospital what it is."
            viewAllHref="/gallery"
            viewAllLabel="View Gallery"
          />
          {/* Mixed grid — image + video cards. Video cards have amber tint + play icon. */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {MOCK_GALLERY.map((g, i) => (
              <GalleryCard key={i} data={g} />
            ))}
          </div>
        </Section>
      </ScrollReveal>

      {/* ── 11. Emergency / Contact CTA ──────────────────────────── */}
      <ScrollReveal>
        <EmergencyCTA />
      </ScrollReveal>
    </>
  );
}
