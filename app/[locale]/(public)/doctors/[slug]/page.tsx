import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Clock,
  MapPin,
  Building2,
  GraduationCap,
  Globe2,
  Award,
  ArrowRight,
  ShieldCheck,
  UserCircle2,
  CheckCircle,
} from "lucide-react";
import { PageHero } from "@/components/sections/Hero";
import { DoctorCard } from "@/components/content/DoctorCard";
import { Button } from "@/components/ui/button";
import {
  getPublicDoctorBySlug,
  getPublicRelatedDoctors,
  getPublicDepartmentBySlug,
  getPublicDoctors,
  getPublicSiteSettings,
} from "@/lib/queries/public";
import { contentMetadata, hospitalReference, absoluteUrl } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { LOCALES, isSupportedLocale, DEFAULT_LOCALE, type SupportedLocale } from "@/lib/i18n/config";

interface DoctorPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const doctors = await getPublicDoctors();
  return LOCALES.flatMap((locale) =>
    doctors.map((doc) => ({
      locale,
      slug: doc.slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: DoctorPageProps): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale: SupportedLocale = isSupportedLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const [doctor, settings] = await Promise.all([
    getPublicDoctorBySlug(slug, locale),
    getPublicSiteSettings(locale),
  ]);

  if (!doctor) {
    return {
      title: "Doctor Not Found",
    };
  }

  return contentMetadata({
    title: doctor.metaTitle || `${doctor.name} — ${doctor.specialty}`,
    description: doctor.metaDescription || doctor.biography,
    path: `/${locale}/doctors/${doctor.slug}`,
    canonicalUrl: doctor.canonicalUrl,
    image: doctor.ogImage || doctor.photo,
    siteName: settings.hospitalName,
  });
}

export default async function DoctorProfilePage({ params }: DoctorPageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale: SupportedLocale = isSupportedLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const [doctor, dict] = await Promise.all([
    getPublicDoctorBySlug(slug, locale),
    getDictionary(locale),
  ]);

  if (!doctor) {
    notFound();
  }

  const [department, otherDoctors, settings] = await Promise.all([
    getPublicDepartmentBySlug(doctor.departmentSlug, locale),
    getPublicRelatedDoctors(doctor.departmentSlug, doctor.slug, 3, locale),
    getPublicSiteSettings(locale),
  ]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Physician",
          name: doctor.name,
          description: doctor.biography,
          url: absoluteUrl(`/${locale}/doctors/${doctor.slug}`),
          image: doctor.photo ? absoluteUrl(doctor.photo) : undefined,
          medicalSpecialty: doctor.specialty,
          worksFor: hospitalReference(settings.hospitalName),
        }}
      />
      <PageHero
        title={doctor.name}
        description={`${doctor.title} · ${doctor.department}`}
        badge={doctor.specialty}
        breadcrumbs={[
          { label: dict.nav?.doctors || "Doctors", href: `/${locale}/doctors` },
          { label: doctor.name },
        ]}
      />

      <div className="container mx-auto px-4 -mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Doctor Profile Card */}
          <div className="lg:col-span-4">
            <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm sticky top-24 space-y-6">
              {/* Doctor Portrait */}
              <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-primary-light bg-background">
                {doctor.photo ? (
                  <Image
                    src={doctor.photo}
                    alt={doctor.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-secondary-light/30">
                    <UserCircle2 className="h-20 w-20 text-primary/40" />
                  </div>
                )}
              </div>

              {/* Basic Info */}
              <div className="text-center space-y-2">
                <h2 className="text-h3 font-bold text-text">{doctor.name}</h2>
                <p className="text-small font-medium text-secondary-dark">{doctor.title}</p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-primary-light text-primary-dark text-caption font-semibold">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Board Certified
                </div>
              </div>

              <div className="border-t border-border pt-4 space-y-3 text-small">
                <div className="flex items-start gap-3">
                  <Building2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="text-caption text-text-light block">
                      {dict.nav?.departments || "Department"}
                    </span>
                    <Link
                      href={`/${locale}/departments/${doctor.departmentSlug}`}
                      className="font-medium text-text hover:text-primary transition-colors"
                    >
                      {doctor.department}
                    </Link>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="text-caption text-text-light block">
                      {dict.doctors?.availability || "Consultation Hours"}
                    </span>
                    <span className="font-medium text-text">{doctor.availability}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="text-caption text-text-light block">
                      {dict.common?.location || "Clinical Location"}
                    </span>
                    <span className="font-medium text-text">{doctor.officeLocation}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Globe2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="text-caption text-text-light block">
                      {dict.doctors?.languages || "Languages"}
                    </span>
                    <span className="font-medium text-text">
                      {doctor.languages.join(", ")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <Button asChild variant="primary" className="w-full">
                  <Link href={`/${locale}/contact`}>
                    {dict.nav?.contact || "Book Consultation"}
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`tel:${department?.phone || "+251111234567"}`}>
                    {dict.common?.callNow || "Call Clinic"}
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column: In-depth Biography & Qualifications */}
          <div className="lg:col-span-8 space-y-8">
            {/* Biography */}
            <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 shadow-sm space-y-4">
              <h3 className="text-h4 font-bold text-text flex items-center gap-2">
                <UserCircle2 className="h-5 w-5 text-primary" />
                {dict.doctors?.biography || "About"} {doctor.name}
              </h3>
              <p className="text-body text-text-muted leading-relaxed whitespace-pre-line">
                {doctor.biography}
              </p>
            </div>

            {/* Qualifications & Education */}
            {doctor.qualifications.length > 0 && (
              <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 shadow-sm space-y-4">
                <h3 className="text-h4 font-bold text-text flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  {dict.doctors?.qualifications || "Medical Qualifications & Fellowships"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {doctor.qualifications.map((q, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-background border border-border text-small font-medium text-text"
                    >
                      <CheckCircle className="h-4 w-4 text-secondary shrink-0" />
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Areas of Clinical Expertise */}
            {doctor.areasOfExpertise.length > 0 && (
              <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 shadow-sm space-y-4">
                <h3 className="text-h4 font-bold text-text flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  {dict.doctors?.areasOfExpertise || "Clinical Specialties & Focus Areas"}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {doctor.areasOfExpertise.map((area, idx) => (
                    <span
                      key={idx}
                      className="px-3.5 py-1.5 rounded-pill bg-primary-light text-primary-dark font-medium text-small border border-primary/20"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Related Department Specialists */}
            {otherDoctors.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-h4 font-bold text-text">
                    {dict.doctors?.relatedDoctors || "Colleagues in"} {doctor.department}
                  </h3>
                  <Link
                    href={`/${locale}/departments/${doctor.departmentSlug}`}
                    className="text-small font-semibold text-primary hover:underline flex items-center gap-1"
                  >
                    {dict.common?.details || "View Department"} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {otherDoctors.map((doc) => (
                    <DoctorCard key={doc.slug} data={doc} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
