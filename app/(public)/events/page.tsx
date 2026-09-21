import type { Metadata } from "next";
import { PageHero } from "@/components/sections/Hero";
import { EventsDirectoryClient } from "@/components/public/EventsDirectoryClient";
import { getPublicEvents } from "@/lib/queries/public";

export const metadata: Metadata = {
  title: "Hospital Events, Community Outreach & Seminars | Medhen Beza Hospital",
  description:
    "Explore upcoming medical symposiums, community health drives, free screening camps, and wellness workshops hosted by Medhen Beza Hospital Addis Ababa.",
};

export default async function EventsPage() {
  const events = await getPublicEvents();

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHero
        title="Hospital Events & Talks"
        description="Public health educational seminars, community blood donation drives, wellness workshops, and medical symposiums hosted at Medhen Beza Hospital."
        badge="Community Programs"
        breadcrumbs={[{ label: "Events" }]}
      />

      <EventsDirectoryClient initialEvents={events} />
    </div>
  );
}
