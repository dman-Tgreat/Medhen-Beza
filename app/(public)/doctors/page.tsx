import * as React from "react";
import type { Metadata } from "next";
import { PageHero } from "@/components/sections/Hero";
import { DoctorsDirectoryClient } from "@/components/public/DoctorsDirectoryClient";
import { getPublicDoctors, getPublicDepartments, getPublicSiteSettings } from "@/lib/queries/public";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSiteSettings();
  return {
    title: "Find a Doctor & Medical Specialists",
    description: `Search and find trusted, board-certified physicians, surgeons, and specialists at ${settings.hospitalName} ${settings.city}.`,
  };
}

export default async function DoctorsPage() {
  const [doctors, departments] = await Promise.all([
    getPublicDoctors(),
    getPublicDepartments(),
  ]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHero
        title="Find a Doctor & Specialist"
        description="Meet our team of board-certified consultants, surgeons, and dedicated healthcare professionals providing compassionate, world-class medical care."
        badge="Medical Specialists"
      />

      <DoctorsDirectoryClient initialDoctors={doctors} departments={departments} />
    </div>
  );
}
