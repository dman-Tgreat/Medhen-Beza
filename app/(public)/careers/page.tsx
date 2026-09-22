import type { Metadata } from "next";
import { PageHero } from "@/components/sections/Hero";
import { CareersDirectoryClient } from "@/components/public/CareersDirectoryClient";
import { getPublicCareers, getPublicDepartments, getPublicSiteSettings } from "@/lib/queries/public";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSiteSettings();
  return {
    title: "Career Opportunities & Medical Vacancies",
    description: `Join the clinical, nursing, and administrative team at ${settings.hospitalName}. Explore open career opportunities and healthcare vacancies in ${settings.city}.`,
  };
}

export default async function CareersPage() {
  const [careers, departments] = await Promise.all([
    getPublicCareers(),
    getPublicDepartments(),
  ]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHero
        title="Join Our Healthcare Team"
        description="Build your career in a patient-first, technology-driven medical center dedicated to clinical excellence and compassion."
        badge="Careers & Vacancies"
        breadcrumbs={[{ label: "Careers" }]}
      />

      <CareersDirectoryClient initialCareers={careers} departments={departments} />
    </div>
  );
}
