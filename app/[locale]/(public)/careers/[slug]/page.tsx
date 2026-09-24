import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Briefcase,
  Building2,
  Calendar,
  MapPin,
  CheckCircle2,
  ArrowLeft,
  GraduationCap,
} from "lucide-react";
import { PageHero } from "@/components/sections/Hero";
import { Button } from "@/components/ui/button";
import { getPublicCareerBySlug, getPublicCareers, getPublicSiteSettings } from "@/lib/queries/public";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { LOCALES, isSupportedLocale, DEFAULT_LOCALE, type SupportedLocale } from "@/lib/i18n/config";

interface CareerPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const careers = await getPublicCareers();
  return LOCALES.flatMap((locale) =>
    careers.map((career) => ({
      locale,
      slug: career.slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: CareerPageProps): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale: SupportedLocale = isSupportedLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const career = await getPublicCareerBySlug(slug, locale);

  if (!career) {
    return {
      title: "Career Opportunity Not Found",
    };
  }

  return {
    title: `${career.position} | Careers`,
    description: career.overview,
  };
}

export default async function CareerDetailPage({ params }: CareerPageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale: SupportedLocale = isSupportedLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const [career, settings, dict] = await Promise.all([
    getPublicCareerBySlug(slug, locale),
    getPublicSiteSettings(locale),
    getDictionary(locale),
  ]);

  if (!career) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHero
        title={career.position}
        description={`${career.department} · ${career.type}`}
        badge={dict.nav?.careers || "Job Opening"}
        breadcrumbs={[
          { label: dict.nav?.careers || "Careers", href: `/${locale}/careers` },
          { label: career.position },
        ]}
      />

      <div className="container mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 shadow-sm space-y-6">
              <h2 className="text-h3 font-bold text-text">
                {dict.careers?.overview || "Position Overview"}
              </h2>
              <p className="text-body text-text-muted leading-relaxed whitespace-pre-line">
                {career.overview}
              </p>

              {career.responsibilities && career.responsibilities.length > 0 && (
                <div className="border-t border-border pt-6 space-y-3">
                  <h3 className="text-h4 font-bold text-text">
                    {dict.careers?.responsibilities || "Key Responsibilities"}
                  </h3>
                  <div className="space-y-2">
                    {career.responsibilities.map((resp, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-small text-text">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>{resp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {career.requirements && career.requirements.length > 0 && (
                <div className="border-t border-border pt-6 space-y-3">
                  <h3 className="text-h4 font-bold text-text flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-secondary" />
                    {dict.careers?.requirements || "Candidate Requirements"}
                  </h3>
                  <div className="space-y-2">
                    {career.requirements.map((req, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-small text-text">
                        <CheckCircle2 className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <Button asChild variant="outline" size="sm">
                <Link href={`/${locale}/careers`} className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" /> {dict.common?.back || "Back to All Vacancies"}
                </Link>
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm sticky top-24 space-y-6">
              <h3 className="text-h4 font-bold text-text">
                {dict.common?.details || "Vacancy Summary"}
              </h3>

              <div className="space-y-4 text-small">
                <div className="flex items-start gap-3">
                  <Briefcase className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-text block">
                      {dict.careers?.employmentType || "Employment Type"}
                    </span>
                    <span className="text-text-muted">{career.type}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-text block">
                      {dict.nav?.departments || "Department"}
                    </span>
                    <span className="text-text-muted">{career.department}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-text block">
                      {dict.common?.location || "Location"}
                    </span>
                    <span className="text-text-muted">{career.location}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-emergency shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-text block">
                      {dict.careers?.deadline || "Application Deadline"}
                    </span>
                    <span className="font-bold text-emergency">{career.deadline}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <Button asChild variant="primary" className="w-full">
                  <Link href={`mailto:${settings.email}?subject=Application for ${encodeURIComponent(career.position)}`}>
                    {dict.careers?.apply || "Apply via Email"}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
