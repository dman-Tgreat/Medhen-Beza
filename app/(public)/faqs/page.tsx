import type { Metadata } from "next";
import { PageHero } from "@/components/sections/Hero";
import { FAQsDirectoryClient } from "@/components/public/FAQsDirectoryClient";
import { getPublicFAQs, getPublicSiteSettings } from "@/lib/queries/public";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSiteSettings();
  return {
    title: "Frequently Asked Questions (FAQs)",
    description: `Find answers to frequently asked questions about doctor appointments, emergency admission, health insurance, visiting hours, and clinical services at ${settings.hospitalName}.`,
  };
}

export default async function FAQsPage() {
  const groups = await getPublicFAQs();

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHero
        eyebrow="Help & Knowledge Base"
        title="Frequently Asked Questions"
        description="Find clear answers to common questions about visiting guidelines, booking appointments, health insurance, payment policies, and hospital services."
        breadcrumbs={[{ label: "FAQs" }]}
      />

      <FAQsDirectoryClient initialGroups={groups} />
    </div>
  );
}
