"use client";

import { SectionHeader } from "@/components/sections/SectionHeader";
import { NewsCard } from "@/components/content/NewsCard";
import { EventCard } from "@/components/content/EventCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { NewsDetailData, EventDetailData } from "@/lib/mock-data";

interface NewsAndEventsSectionProps {
  news: NewsDetailData[];
  events: EventDetailData[];
}

export function NewsAndEventsSection({ news, events }: NewsAndEventsSectionProps) {
  const allItems = [
    ...news.map((n) => ({ type: "news" as const, data: n })),
    ...events.map((e) => ({ type: "event" as const, data: e })),
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="layout-container">
        <SectionHeader
          eyebrow="What's Happening"
          title="News & Events"
          description="Stay up to date with the latest from our hospital — health insights, upcoming community events, and important announcements."
        />

        <Tabs defaultValue="all" className="mt-10">
          <div className="flex justify-center mb-8">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="news">News</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
            </TabsList>
          </div>

          {/* All */}
          <TabsContent value="all">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {allItems.slice(0, 6).map((item, i) =>
                item.type === "news" ? (
                  <NewsCard key={`news-${i}`} data={item.data as any} />
                ) : (
                  <EventCard key={`event-${i}`} data={item.data as any} />
                )
              )}
              {allItems.length === 0 && (
                <div className="col-span-full py-12 text-center text-text-muted">
                  No published news or events at this time.
                </div>
              )}
            </div>
          </TabsContent>

          {/* News only */}
          <TabsContent value="news">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.slice(0, 6).map((n, i) => (
                <NewsCard key={i} data={n as any} />
              ))}
              {news.length === 0 && (
                <div className="col-span-full py-12 text-center text-text-muted">
                  No published news articles at this time.
                </div>
              )}
            </div>
          </TabsContent>

          {/* Events only */}
          <TabsContent value="events">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.slice(0, 6).map((e, i) => (
                <EventCard key={i} data={e as any} />
              ))}
              {events.length === 0 && (
                <div className="col-span-full py-12 text-center text-text-muted">
                  No upcoming events scheduled at this time.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
