import type { Metadata } from "next";
import { PageHero } from "@/components/sections/Hero";
import { FAQsDirectoryClient } from "@/components/public/FAQsDirectoryClient";
import { getPublicFAQs } from "@/lib/queries/public";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQs) | Medhen Beza Hospital",
  description:
    "Find answers to frequently asked questions about doctor appointments, emergency admission, health insurance, visiting hours, and clinical services at Medhen Beza Hospital.",
};

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
