import Image from "next/image";
import Link from "next/link";
import { Calendar, PhoneCall, ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/layout/Breadcrumbs";
import { HOSPITAL_INFO } from "@/lib/constants";

// ─── Shared internal helpers ──────────────────────────────────────────────────

function StatBadge({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="space-y-0.5">
      <div className="text-2xl sm:text-3xl font-bold text-text tracking-tight">
        {value}
      </div>
      <div className="text-caption text-text-muted font-medium">{label}</div>
    </div>
  );
}

// ─── Hero (Homepage) ──────────────────────────────────────────────────────────

export interface HeroProps {
  eyebrow?: string;
  headline?: string;
  /** Highlighted portion of the headline (appended in a different color) */
  headlineAccent?: string;
  supportingText?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  /** URL passed to next/image for the right-column photo */
  photoSrc?: string;
  photoAlt?: string;
  stats?: { value: string; label: string }[];
  className?: string;
}

/**
 * Hero — full homepage hero.
 * Left column: eyebrow badge, headline, supporting text, two CTA buttons, stats strip.
 * Right column: real-photo slot (with placeholder gradient if no src given).
 */
export function Hero({
  eyebrow = "Leading Healthcare Excellence",
  headline = HOSPITAL_INFO.shortName,
  headlineAccent = "Hospital",
  supportingText = "Compassionate care, advanced medicine, exceptional service — delivering patient-centered clinical care, 24/7 emergency response, and state-of-the-art medical technology.",
  primaryCta = { label: "Book Appointment", href: "/appointments" },
  secondaryCta = { label: "Emergency Services", href: "/emergency" },
  photoSrc,
  photoAlt = `Medical team at ${HOSPITAL_INFO.name}`,
  stats = [
    { value: "50+", label: "Specialized Doctors" },
    { value: "24/7", label: "Emergency & Care" },
    { value: "15+", label: "Medical Departments" },
  ],
  className,
}: HeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-gradient-to-b from-primary-light/60 via-surface to-background",
        "py-16 lg:py-24",
        className
      )}
    >
      {/* Decorative background circles */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-secondary-light/40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full bg-primary-light/50 blur-3xl"
      />

      <div className="layout-container relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* ── Left column ── */}
          <div className="lg:col-span-7 space-y-7">
            {/* Eyebrow pill */}
            {/* {eyebrow && (
              <div className="inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-secondary-light px-4 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" />
                <span className="text-caption font-semibold text-secondary uppercase tracking-wider">
                  {eyebrow}
                </span>
              </div>
            )} */}

            {/* Headline */}
            <h1 className="text-display font-black tracking-tight text-text leading-[1.1]">
              {headline}{" "}
              <span className="text-secondary">{headlineAccent}</span>
            </h1>

            {/* Supporting text */}
            <p className="text-body text-text-muted leading-relaxed max-w-xl">
              {supportingText}
            </p>

            {/* CTAs — mobile-first full-width stack with matched height & padding */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full">
              <Button
                asChild
                size="lg"
                variant="primary"
                className="w-full sm:w-auto min-h-[48px] h-12 sm:h-14 px-6 justify-center text-center"
              >
                <Link href={primaryCta.href} className="w-full sm:w-auto flex items-center justify-center gap-2">
                  <Calendar className="w-5 h-5 shrink-0" />
                  <span>{primaryCta.label}</span>
                </Link>
              </Button>
              {secondaryCta && (
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto min-h-[48px] h-12 sm:h-14 px-6 justify-center text-center"
                >
                  <Link href={secondaryCta.href} className="w-full sm:w-auto flex items-center justify-center gap-2">
                    <PhoneCall className="w-5 h-5 shrink-0" />
                    <span>{secondaryCta.label}</span>
                  </Link>
                </Button>
              )}
            </div>

            {/* Stats strip */}
            {stats && stats.length > 0 && (
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border">
                {stats.map((s) => (
                  <StatBadge key={s.label} value={s.value} label={s.label} />
                ))}
              </div>
            )}
          </div>

          {/* ── Right column — photo slot ── */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-lg overflow-hidden aspect-[4/5] bg-primary-light border border-border shadow-modal">
              {photoSrc ? (
                <Image
                  src={photoSrc}
                  alt={photoAlt}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                />
              ) : (
                /* Placeholder when no real photo is available yet */
                <div className="absolute inset-0 bg-gradient-to-br from-secondary via-primary to-secondary-dark flex flex-col items-center justify-center gap-4 text-white/90">
                  <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                    <svg
                      viewBox="0 0 40 40"
                      className="w-10 h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path d="M20 4a8 8 0 1 0 0 16A8 8 0 0 0 20 4zM6 36c0-7.732 6.268-14 14-14s14 6.268 14 14" />
                    </svg>
                  </div>
                  <p className="text-small font-medium text-white/70 text-center px-4">
                    Photo slot — pass{" "}
                    <code className="bg-white/10 px-1 rounded">photoSrc</code>{" "}
                    prop
                  </p>
                </div>
              )}

              {/* Floating accent card */}
              <div className="absolute bottom-4 left-4 right-4 rounded-md bg-surface/90 backdrop-blur-md border border-border/60 p-3 flex items-center gap-3 shadow-dropdown">
                <div className="w-9 h-9 rounded-md bg-secondary-light flex items-center justify-center shrink-0">
                  <svg
                    viewBox="0 0 20 20"
                    className="w-5 h-5 text-secondary"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm-.75-11.25a.75.75 0 0 1 1.5 0v4a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1 0-1.5H9.25V6.75Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-caption font-semibold text-text leading-tight">
                    Available 24 / 7
                  </p>
                  <p className="text-caption text-text-muted truncate">
                    Emergency & outpatient services open now
                  </p>
                </div>
                <span className="ml-auto h-2 w-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── HeroWithBackground ───────────────────────────────────────────────────────

export interface HeroWithBackgroundProps {
  /** URL of the full-bleed background image */
  backgroundSrc?: string;
  backgroundAlt?: string;
  eyebrow?: string;
  headline?: string;
  headlineAccent?: string;
  supportingText?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  className?: string;
}

/**
 * HeroWithBackground — full-bleed image background with a dark/teal overlay.
 * Centered content, two CTAs, designed for landing pages or section promos.
 */
export function HeroWithBackground({
  backgroundSrc,
  backgroundAlt = "Hospital background",
  eyebrow = "World-Class Healthcare",
  headline = "Your Health,",
  headlineAccent = "Our Priority",
  supportingText = `From routine check-ups to complex surgeries, ${HOSPITAL_INFO.name} brings together the region's finest specialists under one roof.`,
  primaryCta = { label: "Explore Services", href: "/services" },
  secondaryCta = { label: "Find a Doctor", href: "/doctors" },
  className,
}: HeroWithBackgroundProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden min-h-[560px] flex items-center justify-center",
        "py-24 lg:py-32",
        className
      )}
    >
      {/* Background layer */}
      {backgroundSrc ? (
        <Image
          src={backgroundSrc}
          alt={backgroundAlt}
          fill
          priority
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-secondary" />
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-text/60" />

      {/* Content */}
      <div className="layout-container relative text-center text-white space-y-8 max-w-3xl mx-auto">
        {eyebrow && (
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-1.5">
            <span className="text-caption font-semibold text-white/90 uppercase tracking-widest">
              {eyebrow}
            </span>
          </div>
        )}

        <h1 className="text-display font-black tracking-tight leading-[1.1]">
          {headline}{" "}
          <span className="text-secondary-light">{headlineAccent}</span>
        </h1>

        <p className="text-body text-white/80 leading-relaxed max-w-2xl mx-auto">
          {supportingText}
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full max-w-md sm:max-w-none mx-auto">
          <Button
            asChild
            size="lg"
            variant="primary"
            className="w-full sm:w-auto min-h-[48px] h-12 sm:h-14 px-6 justify-center text-center"
          >
            <Link href={primaryCta.href} className="w-full sm:w-auto flex items-center justify-center">
              {primaryCta.label}
            </Link>
          </Button>
          {secondaryCta && (
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto min-h-[48px] h-12 sm:h-14 px-6 justify-center text-center bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:text-white"
            >
              <Link href={secondaryCta.href} className="w-full sm:w-auto flex items-center justify-center">
                {secondaryCta.label}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── PageHero ────────────────────────────────────────────────────────────────

export interface PageHeroProps {
  eyebrow?: string;
  badge?: string;
  /** The page title — rendered as <h1> */
  title: string;
  /** One supporting sentence */
  description?: string;
  /** Breadcrumb items (auto-prepends Home). Omit href on the last item. */
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
}

/**
 * PageHero — compact hero for interior pages.
 * Eyebrow, one-line <h1>, optional supporting sentence, breadcrumb trail.
 */
export function PageHero({
  eyebrow,
  badge,
  title,
  description,
  breadcrumbs = [],
  className,
}: PageHeroProps) {
  const displayEyebrow = eyebrow || badge;
  return (
    <section
      className={cn(
        "bg-gradient-to-b from-primary-light/50 to-surface border-b border-border",
        "py-10 lg:py-14",
        className
      )}
    >
      <div className="layout-container space-y-4">
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <Breadcrumbs
            items={breadcrumbs.filter((b) => b.label.toLowerCase() !== "home")}
          />
        )}

        {/* Eyebrow */}
        {displayEyebrow && (
          <p className="text-caption font-semibold uppercase tracking-widest text-secondary">
            {displayEyebrow}
          </p>
        )}

        {/* Title */}
        <h1 className="text-h1 font-bold tracking-tight text-text">{title}</h1>

        {/* Description */}
        {description && (
          <p className="text-body text-text-muted leading-relaxed max-w-2xl">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
