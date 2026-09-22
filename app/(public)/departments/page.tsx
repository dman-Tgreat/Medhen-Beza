import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Compass, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/sections/Hero";
import { DepartmentCard } from "@/components/content/DepartmentCard";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { getPublicDepartments, getPublicSiteSettings } from "@/lib/queries/public";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSiteSettings();
  return {
    title: "Clinical Departments",
    description: `Explore the medical departments and clinical divisions at ${settings.hospitalName} in ${settings.city} — Cardiology, Maternity, Pediatrics, Surgery, Neurology, and more.`,
  };
}

export default async function DepartmentsPage() {
  const [departments, settings] = await Promise.all([
    getPublicDepartments(),
    getPublicSiteSettings(),
  ]);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 1. PageHero */}
      <PageHero
        eyebrow="Campus Directory"
        title="Clinical Departments"
        description="Our specialized clinical departments bring together multidisciplinary medical teams, dedicated equipment, and modern facilities to deliver tailored patient care."
        breadcrumbs={[{ label: "Departments" }]}
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
          {departments.map((dept) => (
            <ScrollReveal key={dept.slug} className="h-full">
              <DepartmentCard data={dept} />
            </ScrollReveal>
          ))}
        </div>
      </main>
    </div>
  );
}
