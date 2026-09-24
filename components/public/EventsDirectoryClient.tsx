"use client";

import * as React from "react";
import { Calendar, CalendarCheck2 } from "lucide-react";
import { EventCard } from "@/components/content/EventCard";
import { EmptyState } from "@/components/ui/empty-state";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import type { EventDetailData } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/i18n/I18nProvider";

export function EventsDirectoryClient({
  initialEvents,
}: {
  initialEvents: EventDetailData[];
}) {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = React.useState<"upcoming" | "past">("upcoming");

  const upcomingEvents = React.useMemo(() => {
    return initialEvents.filter((e) => !e.isPast);
  }, [initialEvents]);

  const pastEvents = React.useMemo(() => {
    return initialEvents.filter((e) => e.isPast);
  }, [initialEvents]);

  const currentEvents = activeTab === "upcoming" ? upcomingEvents : pastEvents;

  return (
    <main className="container mx-auto px-4 pt-10 space-y-10">
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
            <span>{t("events.upcoming") || "Upcoming"} ({upcomingEvents.length})</span>
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
            <span>{t("events.past") || "Archive"} ({pastEvents.length})</span>
          </button>
        </div>
      </div>

      {currentEvents.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title={activeTab === "upcoming" ? (t("events.empty") || "No Upcoming Events") : (t("common.noResults") || "No Past Events Found")}
          description={t("common.noResults") || "Check back regularly or follow our announcements for hospital talks, blood donation camps, and community workshops."}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentEvents.map((event, idx) => (
            <ScrollReveal key={event.slug} delay={idx * 0.05}>
              <EventCard data={event} />
            </ScrollReveal>
          ))}
        </div>
      )}
    </main>
  );
}
