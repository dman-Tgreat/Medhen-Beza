"use client";

import * as React from "react";
import { Calendar, CalendarCheck2, Clock, MapPin, Sparkles } from "lucide-react";
import { PageHero } from "@/components/sections/Hero";
import { EventCard } from "@/components/content/EventCard";
import { EmptyState } from "@/components/ui/empty-state";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { MOCK_EVENTS_DETAILED, type EventDetailData } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function EventsPage() {
  const [activeTab, setActiveTab] = React.useState<"upcoming" | "past">(
    "upcoming"
  );

  const upcomingEvents = React.useMemo(() => {
    return MOCK_EVENTS_DETAILED.filter((e) => !e.isPast);
  }, []);

  const pastEvents = React.useMemo(() => {
    return MOCK_EVENTS_DETAILED.filter((e) => e.isPast);
  }, []);

  const currentEvents = activeTab === "upcoming" ? upcomingEvents : pastEvents;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 1. PageHero */}
      <PageHero
        eyebrow="Calendar & Programs"
        title="Hospital Events & Talks"
        description="Public health educational seminars, community blood donation drives, wellness workshops, and medical symposiums hosted at Medhen Beza Hospital."
        breadcrumbs={[{ label: "Events" }]}
      />

      <main className="layout-container pt-10 space-y-10">
        {/* 2. Upcoming vs Past Distinction Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-border pb-4">
          <div className="inline-flex p-1 rounded-lg bg-surface border border-border shadow-xs w-full sm:w-auto">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={cn(
                "flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 min-h-[44px] rounded-md text-small font-bold transition-all cursor-pointer text-center",
                activeTab === "upcoming"
                  ? "bg-primary text-white shadow-xs"
                  : "text-text-muted hover:text-text"
              )}
            >
              <Calendar className="w-4 h-4 shrink-0" />
              <span>Upcoming ({upcomingEvents.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={cn(
                "flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 min-h-[44px] rounded-md text-small font-bold transition-all cursor-pointer text-center",
                activeTab === "past"
                  ? "bg-secondary text-white shadow-xs"
                  : "text-text-muted hover:text-text"
              )}
            >
              <CalendarCheck2 className="w-4 h-4 shrink-0" />
              <span>Past ({pastEvents.length})</span>
            </button>
          </div>

          <p className="text-caption text-text-muted">
            {activeTab === "upcoming"
              ? "All upcoming events open for public or professional registration"
              : "Completed workshops, drives, and previous clinical symposiums"}
          </p>
        </div>

        {/* 3. Grid of EventCards */}
        {currentEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentEvents.map((evt) => (
              <ScrollReveal key={evt.slug}>
                <EventCard data={evt} />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Calendar className="w-8 h-8 text-primary" />}
            title={
              activeTab === "upcoming"
                ? "No upcoming events scheduled"
                : "No past events recorded"
            }
            description={
              activeTab === "upcoming"
                ? "We are currently organizing new community workshops and medical seminars. Please check back soon."
                : "There are no archived past events in the system."
            }
            action={
              activeTab === "past"
                ? {
                    label: "View Upcoming Events",
                    onClick: () => setActiveTab("upcoming"),
                  }
                : undefined
            }
          />
        )}
      </main>
    </div>
  );
}
