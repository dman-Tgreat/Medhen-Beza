/**
 * app/[locale]/(public)/page.tsx — Localized Homepage
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
 * All CMS content is fetched from the database via public queries (only PUBLISHED status)
 * localized to the active locale parameter.
 */

import Link from "next/link";
import Image from "next/image";
import {
  UserSearch,
  LayoutGrid,
  Building2,
  PhoneCall,
  ArrowRight,
  Mail,
} from "lucide-react";

import { Hero } from "@/components/sections/Hero";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { ServiceCard } from "@/components/content/ServiceCard";
import { DepartmentCard } from "@/components/content/DepartmentCard";
import { DoctorCard } from "@/components/content/DoctorCard";
import { FacilityCard } from "@/components/content/FacilityCard";
import { GalleryCard } from "@/components/content/GalleryCard";
import { NewsAndEventsSection } from "@/components/public/NewsAndEventsSection";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import {
  getPublicServices,
  getPublicDepartments,
  getPublicDoctors,
  getPublicNews,
  getPublicEvents,
  getPublicGallery,
  getPublicFacilities,
  getPublicSiteSettings,
} from "@/lib/queries/public";
import { cn } from "@/lib/utils";
import { JsonLd } from "@/components/seo/JsonLd";
import { hospitalJsonLd } from "@/lib/seo";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isSupportedLocale, DEFAULT_LOCALE, type SupportedLocale } from "@/lib/i18n/config";

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
function QuickActions({ locale, dict }: { locale: SupportedLocale; dict: any }) {
  const quickActions = [
    {
      icon: UserSearch,
      label: dict.home?.findDoctor || "Find a Doctor",
      description: dict.home?.findDoctorDesc || "Browse our specialists",
      href: `/${locale}/doctors`,
      accent: "text-primary bg-primary-light",
    },
    {
      icon: LayoutGrid,
      label: dict.home?.ourServices || "Our Services",
      description: dict.home?.ourServicesDesc || "Explore what we offer",
      href: `/${locale}/services`,
      accent: "text-secondary bg-secondary-light",
    },
    {
      icon: Building2,
      label: dict.home?.departments || "Departments",
      description: dict.home?.departmentsDesc || "See all clinical units",
      href: `/${locale}/departments`,
      accent: "text-primary bg-primary-light",
    },
    {
      icon: PhoneCall,
      label: dict.home?.emergencyCare || "Emergency",
      description: dict.home?.emergencyCareDesc || "24 / 7 immediate care",
      href: `/${locale}/emergency`,
      accent: "text-emergency bg-emergency-light",
    },
  ];

  return (
    <Section tinted className="py-10 lg:py-14 border-b border-border">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map(({ icon: Icon, label, description, href, accent }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "group flex flex-col items-center text-center gap-2.5 sm:gap-3 p-4 sm:p-6 rounded-lg",
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
function HospitalIntro({ settings, locale, dict }: { settings: any; locale: SupportedLocale; dict: any }) {
  const paragraphs = settings.hospitalIntroParagraphs?.length
    ? settings.hospitalIntroParagraphs
    : [
        `${settings.hospitalName} provides patient-centred, modern clinical care in ${settings.city}, delivering healthcare with empathy, clinical precision, and dignity.`,
        "Our multidisciplinary teams of specialists work across cutting-edge diagnostic and surgical units to serve families across Ethiopia.",
        "Committed to continuous clinical excellence and modern standards of practice.",
      ];

  return (
    <Section>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Image side */}
        <div className="relative rounded-lg overflow-hidden aspect-[4/3] bg-primary-light border border-border shadow-sm">
          {settings.hospitalIntroImage ? (
            <Image
              src={settings.hospitalIntroImage}
              alt={`${settings.hospitalName} Campus & Facilities`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary-light via-secondary-light to-primary-light flex flex-col items-center justify-center gap-3 text-primary/40">
              <Building2 className="w-20 h-20" strokeWidth={1} />
              <p className="text-caption font-medium text-center px-6">
                {settings.hospitalName} Modern Campus
              </p>
            </div>
          )}
        </div>

        {/* Text side */}
        <div className="space-y-6">
          <p className="text-caption font-semibold uppercase tracking-widest text-secondary">
            {dict.nav?.about || "About Us"}
          </p>
          <h2 className="text-h2 font-bold tracking-tight text-text">
            {settings.hospitalIntroTitle || "Trusted care for every stage of life"}
          </h2>

          <div className="space-y-3 text-body text-text-muted leading-relaxed border-l-4 border-primary-light pl-4">
            {paragraphs.map((p: string, idx: number) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          <Link
            href={`/${locale}/about`}
            className="group inline-flex items-center gap-1.5 text-small font-semibold text-primary transition-[gap] duration-200 hover:gap-2.5 focus-visible:outline-none focus-visible:underline"
          >
            {dict.common?.learnMore || "Learn About Us"}
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
function FacilitiesShowcase({ facilities, locale, dict }: { facilities: any[]; locale: SupportedLocale; dict: any }) {
  if (!facilities || facilities.length === 0) return null;

  const [featured, ...allSupporting] = facilities;
  const supporting = allSupporting.slice(0, 2);

  return (
    <Section tinted>
      <SectionHeader
        eyebrow={dict.home?.facilitiesSectionEyebrow || "Our Facilities"}
        title={dict.home?.facilitiesSectionTitle || "State-of-the-art care environment"}
        description={dict.home?.facilitiesSectionDesc || "Our campus is designed to deliver the best clinical experience — from modern inpatient suites to cutting-edge diagnostic technology."}
        viewAllHref={`/${locale}/facilities`}
        viewAllLabel={dict.home?.facilitiesViewAll || dict.common?.viewAllFacilities || dict.common?.viewAll || "Explore Facilities"}
        align="left"
      />

      <div
        className={cn(
          "mt-10 grid gap-4",
          supporting.length === 0
            ? "grid-cols-1"
            : supporting.length === 1
            ? "grid-cols-1 lg:grid-cols-2"
            : "grid-cols-1 lg:grid-cols-3"
        )}
      >
        {/* Featured */}
        <div
          className={cn(
            supporting.length >= 2 ? "lg:col-span-2" : "col-span-1"
          )}
        >
          {featured && <FacilityCard data={featured} featured className="h-full" />}
        </div>

        {/* Supporting */}
        {supporting.length > 0 && (
          <div className="flex flex-col gap-4">
            {supporting.map((f) => (
              <FacilityCard key={f.href || f.id} data={f} />
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}

// ─── 11. Emergency / Contact CTA block ───────────────────────────────────────
function EmergencyCTA({ phone, locale, dict }: { phone: string; locale: SupportedLocale; dict: any }) {
  return (
    <section className="bg-gradient-to-br from-primary-dark via-primary to-secondary py-16 lg:py-24">
      <div className="layout-container text-center space-y-8 max-w-2xl mx-auto">
        {/* Headline */}
        <div className="space-y-3">
          <h2 className="text-h2 font-bold tracking-tight text-white">
            {dict.home?.emergencyBannerTitle || "Need help or information?"}
          </h2>
          <p className="text-body text-white/80 leading-relaxed">
            {dict.home?.emergencyBannerDesc || "Our team is available around the clock. Reach us by phone, email, or walk in — we are always ready to help."}
          </p>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full max-w-md sm:max-w-none mx-auto">
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-small font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer select-none h-12 sm:h-14 px-6 text-body w-full sm:w-auto bg-white text-primary hover:bg-white/90"
          >
            <Mail className="w-5 h-5" aria-hidden />
            {dict.nav?.contact || "Contact Us"}
          </Link>
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            aria-label={`Call emergency line: ${phone}`}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-small font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 cursor-pointer select-none h-12 sm:h-14 px-6 text-body w-full sm:w-auto bg-emergency text-white hover:bg-emergency/90 tracking-wide"
          >
            <PhoneCall className="w-4 h-4 shrink-0" aria-hidden />
            <span>🚨 {dict.home?.ambulanceCall || "Emergency Line"}</span>
            <span className="font-normal opacity-90 tracking-tight">{phone}</span>
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Page Component (Server Component) ────────────────────────────────────────
export default async function HomePage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await props.params;
  const locale: SupportedLocale = isSupportedLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const [services, departments, doctors, news, events, gallery, facilities, settings, dict] = await Promise.all([
    getPublicServices(locale),
    getPublicDepartments(locale),
    getPublicDoctors(locale),
    getPublicNews(locale),
    getPublicEvents(locale),
    getPublicGallery(locale),
    getPublicFacilities(locale),
    getPublicSiteSettings(locale),
    getDictionary(locale),
  ]);

  return (
    <>
      <JsonLd data={hospitalJsonLd(settings)} />
      {/* ── 2. Hero ─────────────────────────────────────────────── */}
      <Hero
        eyebrow={settings.tagline || dict.home?.introEyebrow || "Leading Healthcare Excellence"}
        headline={settings.heroHeadline || "Compassionate care."}
        headlineAccent={settings.heroHeadlineAccent || "Trusted healthcare."}
        supportingText={
          settings.heroSupportingText ||
          "Close to you, committed to you — exceptional clinical care delivered by specialists who put patients first."
        }
        primaryCta={{ label: dict.home?.ourServices || "Explore Services", href: `/${locale}/services` }}
        secondaryCta={{ label: dict.home?.findDoctor || "Find a Doctor", href: `/${locale}/doctors` }}
        photoSrc={settings.heroImage}
        photoAlt={`${settings.hospitalName} Medical Team`}
        stats={[
          { value: settings.statSpecialists || "50+", label: dict.home?.specialistPhysicians || "Specialists" },
          { value: settings.statEmergency || "24 / 7", label: dict.home?.emergencyResponse || "Emergency" },
          { value: settings.statDepartments || "15+", label: dict.home?.clinicalDepartments || "Departments" },
        ]}
      />

      {/* ── 3. Quick Actions ─────────────────────────────────────── */}
      <ScrollReveal>
        <QuickActions locale={locale} dict={dict} />
      </ScrollReveal>

      {/* ── 4. Hospital Introduction ──────────────────────────────── */}
      <ScrollReveal>
        <HospitalIntro settings={settings} locale={locale} dict={dict} />
      </ScrollReveal>

      {/* ── 5. Services ──────────────────────────────────────────── */}
      <ScrollReveal>
        <Section tinted>
          <SectionHeader
            eyebrow={dict.home?.servicesSectionEyebrow || "What We Offer"}
            title={dict.home?.servicesSectionTitle || "Our Medical Services"}
            description={dict.home?.servicesSectionDesc || "From routine check-ups to complex surgical procedures, our specialists deliver expert care across a full spectrum of medical disciplines."}
            viewAllHref={`/${locale}/services`}
            viewAllLabel={dict.home?.servicesViewAll || dict.common?.viewAllServices || dict.common?.viewAll || "View All Services"}
          />
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.slice(0, 6).map((s) => (
              <ServiceCard key={s.href} data={s} />
            ))}
            {services.length === 0 && (
              <div className="col-span-full py-10 text-center text-text-muted">
                {dict.services?.empty || "No medical services currently listed."}
              </div>
            )}
          </div>
        </Section>
      </ScrollReveal>

      {/* ── 6. Departments ───────────────────────────────────────── */}
      <ScrollReveal>
        <Section>
          <SectionHeader
            eyebrow={dict.home?.departmentsSectionEyebrow || "Clinical Units"}
            title={dict.home?.departmentsSectionTitle || "Our Departments"}
            description={dict.home?.departmentsSectionDesc || "Each department is staffed by board-certified specialists supported by modern diagnostic and treatment technology."}
            viewAllHref={`/${locale}/departments`}
            viewAllLabel={dict.home?.departmentsViewAll || dict.common?.viewAllDepartments || dict.common?.viewAll || "Explore Departments"}
          />
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {departments.map((d) => (
              <DepartmentCard key={d.href} data={d} />
            ))}
            {departments.length === 0 && (
              <div className="col-span-full py-10 text-center text-text-muted">
                {dict.departments?.empty || "No departments currently listed."}
              </div>
            )}
          </div>
        </Section>
      </ScrollReveal>

      {/* ── 7. Doctors ────────────────────────────────────────────── */}
      <ScrollReveal>
        <Section tinted>
          <SectionHeader
            eyebrow={dict.home?.doctorsSectionEyebrow || "Meet the Team"}
            title={dict.home?.doctorsSectionTitle || "Our Doctors"}
            description={dict.home?.doctorsSectionDesc || "Our medical team combines years of clinical experience with a genuine commitment to patient-centred care."}
            viewAllHref={`/${locale}/doctors`}
            viewAllLabel={dict.home?.doctorsViewAll || dict.common?.viewAllDoctors || dict.common?.viewAll || "Meet All Doctors"}
          />
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.slice(0, 4).map((d) => (
              <DoctorCard key={d.href} data={d} />
            ))}
            {doctors.length === 0 && (
              <div className="col-span-full py-10 text-center text-text-muted">
                {dict.doctors?.empty || "No doctors currently listed."}
              </div>
            )}
          </div>
        </Section>
      </ScrollReveal>

      {/* ── 8. Facilities ─────────────────────────────────────────── */}
      <ScrollReveal>
        <FacilitiesShowcase facilities={facilities} locale={locale} dict={dict} />
      </ScrollReveal>

      {/* ── 9. News & Events ─────────────────────────────────────── */}
      <ScrollReveal>
        <NewsAndEventsSection news={news} events={events} />
      </ScrollReveal>

      {/* ── 10. Gallery ──────────────────────────────────────────── */}
      <ScrollReveal>
        <Section tinted>
          <SectionHeader
            eyebrow={dict.home?.gallerySectionEyebrow || "Photo & Video"}
            title={dict.home?.gallerySectionTitle || "Gallery"}
            description={dict.home?.gallerySectionDesc || `A glimpse of our facilities, events, and the people who make ${settings.hospitalName} what it is.`}
            viewAllHref={`/${locale}/gallery`}
            viewAllLabel={dict.home?.galleryViewAll || dict.common?.viewAllGallery || dict.common?.viewAll || "View Gallery"}
          />
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {gallery.slice(0, 8).map((g, i) => (
              <GalleryCard key={i} data={g} />
            ))}
            {gallery.length === 0 && (
              <div className="col-span-full py-10 text-center text-text-muted">
                {dict.common?.noResults || "No gallery media currently published."}
              </div>
            )}
          </div>
        </Section>
      </ScrollReveal>

      {/* ── 11. Emergency / Contact CTA ──────────────────────────── */}
      <ScrollReveal>
        <EmergencyCTA phone={settings.emergencyPhone} locale={locale} dict={dict} />
      </ScrollReveal>
    </>
  );
}
