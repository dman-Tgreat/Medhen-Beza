import type { Metadata } from "next";
import { PageHero } from "@/components/sections/Hero";
import { FacilitiesDirectoryClient } from "@/components/public/FacilitiesDirectoryClient";
import { getPublicFacilities, getPublicSiteSettings } from "@/lib/queries/public";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSiteSettings();
  return {
    title: "Hospital Facilities & Infrastructure",
    description: `Explore modern clinical infrastructure, sterile operating theatres, diagnostic imaging suites, intensive care units, and inpatient rooms at ${settings.hospitalName}.`,
  };
}

export default async function FacilitiesPage() {
  const facilities = await getPublicFacilities();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 1. PageHero */}
      <PageHero
        eyebrow="Clinical Infrastructure"
        title="Modern Hospital Facilities"
        description="Engineered for patient healing, sterile surgical excellence, and modern medical technology across all inpatient and diagnostic wings."
        breadcrumbs={[{ label: "Facilities" }]}
      />

      {/* 2. Interactive Facilities Directory */}
      <main className="pt-8">
        <FacilitiesDirectoryClient initialFacilities={facilities} />
      </main>
    </div>
  );
}
