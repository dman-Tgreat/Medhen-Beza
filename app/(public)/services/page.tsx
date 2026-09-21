import * as React from "react";
import type { Metadata } from "next";
import { PageHero } from "@/components/sections/Hero";
import { ServicesDirectoryClient } from "@/components/public/ServicesDirectoryClient";
import { getPublicServices, getPublicDepartments } from "@/lib/queries/public";

export const metadata: Metadata = {
  title: "Clinical Services & Diagnostics | Medhen Beza Hospital",
  description:
    "Comprehensive inpatient and outpatient clinical services, diagnostic imaging, pathology, and surgical procedures at Medhen Beza Hospital Addis Ababa.",
};

export default async function ServicesPage() {
  const [services, departments] = await Promise.all([
    getPublicServices(),
    getPublicDepartments(),
  ]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHero
        title="Clinical Services & Treatments"
        description="From advanced non-invasive cardiology to specialized pediatric intensive care, explore our comprehensive range of multidisciplinary clinical services."
        badge="Hospital Services"
      />

      <ServicesDirectoryClient initialServices={services} departments={departments} />
    </div>
  );
}
