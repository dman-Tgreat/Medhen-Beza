import type { Metadata } from "next";
import { PageHero } from "@/components/sections/Hero";
import { EventsDirectoryClient } from "@/components/public/EventsDirectoryClient";
import { getPublicEvents, getPublicSiteSettings } from "@/lib/queries/public";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSiteSettings();
  return {
    title: "Hospital Events, Community Outreach & Seminars",
    description: `Explore upcoming medical symposiums, community health drives, free screening camps, and wellness workshops hosted by ${settings.hospitalName} in ${settings.city}.`,
  };
}

export default async function EventsPage() {
  const [events, settings] = await Promise.all([
    getPublicEvents(),
    getPublicSiteSettings(),
  ]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHero
        title="Hospital Events & Talks"
        description={`Public health educational seminars, community blood donation drives, wellness workshops, and medical symposiums hosted at ${settings.hospitalName}.`}
        badge="Community Programs"
        breadcrumbs={[{ label: "Events" }]}
      />

      <EventsDirectoryClient initialEvents={events} />
    </div>
  );
}
