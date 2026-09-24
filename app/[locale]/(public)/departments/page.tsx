import type { Metadata } from "next";
import { Compass, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/sections/Hero";
import { DepartmentCard } from "@/components/content/DepartmentCard";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { getPublicDepartments, getPublicSiteSettings } from "@/lib/queries/public";
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
    title: dict.departments?.title || "Clinical Departments",
    description:
      dict.departments?.subtitle ||
      `Explore the medical departments and clinical divisions at ${settings.hospitalName} in ${settings.city}.`,
  };
}

export default async function DepartmentsPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await props.params;
  const locale: SupportedLocale = isSupportedLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const [departments, settings, dict] = await Promise.all([
    getPublicDepartments(locale),
    getPublicSiteSettings(locale),
    getDictionary(locale),
  ]);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 1. PageHero */}
      <PageHero
        eyebrow={dict.home?.departmentsSectionEyebrow || "Campus Directory"}
        title={dict.departments?.title || "Clinical Departments"}
        description={dict.departments?.subtitle || "Our specialized clinical departments bring together multidisciplinary medical teams, dedicated equipment, and modern facilities to deliver tailored patient care."}
        breadcrumbs={[{ label: dict.nav?.departments || "Departments" }]}
      />

      {/* 2. Directory Info Banner */}
      <section className="bg-surface border-b border-border py-6">
        <div className="layout-container">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-small text-text-muted">
            <div className="flex items-center gap-2 font-medium text-text">
              <Compass className="w-5 h-5 text-secondary shrink-0" />
              <span>
                Showing <strong>{departments.length}</strong> specialized
                clinical divisions across the {settings.hospitalName} medical campus
              </span>
            </div>
            <div className="flex items-center gap-4 text-caption">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                All Units Operational
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-primary" />
                Accredited Care
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Image-Forward Directory Grid */}
      <main className="layout-container pt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {departments.map((dept, idx) => (
            <ScrollReveal key={dept.slug} delay={idx * 0.05}>
              <DepartmentCard data={dept} />
            </ScrollReveal>
          ))}
          {departments.length === 0 && (
            <div className="col-span-full py-16 text-center text-text-muted">
              {dict.departments?.empty || "No departments currently listed."}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
