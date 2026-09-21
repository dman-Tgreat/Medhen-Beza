import type { Metadata } from "next";
import { PageHero } from "@/components/sections/Hero";
import { CareersDirectoryClient } from "@/components/public/CareersDirectoryClient";
import { getPublicCareers, getPublicDepartments } from "@/lib/queries/public";

export const metadata: Metadata = {
  title: "Career Opportunities & Medical Vacancies | Medhen Beza Hospital",
  description:
    "Join the clinical, nursing, and administrative team at Medhen Beza Hospital. Explore open career opportunities and healthcare vacancies in Addis Ababa.",
};

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
