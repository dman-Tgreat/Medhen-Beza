import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  Clock,
  MapPin,
  UserCircle2,
  CalendarCheck2,
  CheckCircle2,
  ArrowLeft,
  Share2,
  Info,
} from "lucide-react";
import { PageHero } from "@/components/sections/Hero";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { getEventBySlug, MOCK_EVENTS_DETAILED } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return MOCK_EVENTS_DETAILED.map((event) => ({
    slug: event.slug,
  }));
}

export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  if (!event) {
    return {
      title: "Event Not Found | Medhen Beza Hospital",
    };
  }

  return {
    title: `${event.title} | Medhen Beza Hospital Events`,
    description: event.description,
  };
}

export default async function EventDetailPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 1. PageHero */}
      <PageHero
        eyebrow={event.isPast ? "Archived Event" : "Hospital Event"}
        title={event.title}
        description={`${event.dateFormatted} · ${event.time}`}
        breadcrumbs={[
          { label: "Events", href: "/events" },
          { label: event.title },
        ]}
      />

      <main className="layout-container pt-10 space-y-12 max-w-4xl mx-auto">
        {/* Subtle Past Event Banner (if past) */}
        {event.isPast && (
          <div className="rounded-lg bg-surface border border-border p-4 flex items-center gap-3 text-text-muted">
            <Info className="w-5 h-5 text-text-light shrink-0" />
            <div className="text-small">
              <span className="font-semibold text-text">
                This event concluded on {event.dateFormatted}.
              </span>{" "}
              This page is preserved for public health reference and archival
              purposes.
            </div>
          </div>
        )}

        {/* 2. Key Event Info Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-lg bg-surface border border-border space-y-1.5">
            <div className="flex items-center gap-2 text-primary font-bold text-caption uppercase tracking-wider">
              <Calendar className="w-4 h-4" />
              Date & Day
            </div>
            <p className="text-small font-bold text-text">
              {event.dateFormatted}
            </p>
          </div>

          <div className="p-5 rounded-lg bg-surface border border-border space-y-1.5">
            <div className="flex items-center gap-2 text-secondary font-bold text-caption uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              Time
            </div>
            <p className="text-small font-bold text-text">{event.time}</p>
          </div>

          <div className="p-5 rounded-lg bg-surface border border-border space-y-1.5">
            <div className="flex items-center gap-2 text-primary font-bold text-caption uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              Venue / Location
            </div>
            <p className="text-small font-bold text-text">{event.location}</p>
          </div>
        </div>

        {/* 3. Event Description */}
        <section className="space-y-6">
          <h2 className="text-h2 font-bold text-text tracking-tight">
            About this Event
          </h2>
          <div className="space-y-4 text-body text-text-muted leading-relaxed">
            {event.fullDescription && event.fullDescription.length > 0 ? (
              event.fullDescription.map((p, idx) => <p key={idx}>{p}</p>)
            ) : (
              <p>{event.description}</p>
            )}
          </div>
        </section>

        {/* 4. Agenda / Schedule */}
        {event.agenda && event.agenda.length > 0 && (
          <section className="space-y-6 pt-6 border-t border-border">
            <h3 className="text-h3 font-bold text-text">Event Schedule</h3>
            <div className="rounded-lg border border-border divide-y divide-border overflow-hidden bg-surface">
              {event.agenda.map((slot, idx) => (
                <div
                  key={idx}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="space-y-0.5">
                    <span className="text-small font-bold text-text block">
                      {slot.topic}
                    </span>
                    {slot.presenter && (
                      <span className="text-caption text-secondary font-medium block">
                        Presenter: {slot.presenter}
                      </span>
                    )}
                  </div>
                  <span className="text-caption font-bold text-primary bg-primary-light px-2.5 py-1 rounded-sm shrink-0 self-start sm:self-auto">
                    {slot.time}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. Speaker Card (if applicable) */}
        {event.speaker && (
          <section className="space-y-4 pt-6 border-t border-border">
            <h3 className="text-h3 font-bold text-text">Keynote & Lead Speaker</h3>
            <div className="flex items-center gap-4 p-5 rounded-lg bg-surface border border-border">
              <div className="w-12 h-12 rounded-full bg-secondary-light text-secondary flex items-center justify-center shrink-0">
                <UserCircle2 className="w-7 h-7" />
              </div>
              <div>
                <p className="text-small font-bold text-text">
                  {event.speaker.name}
                </p>
                <p className="text-caption text-text-muted">
                  {event.speaker.title}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* 6. Registration & Admission Details */}
        <section className="p-6 rounded-lg bg-primary-light/40 border border-primary/20 space-y-3">
          <h3 className="text-small font-bold text-text uppercase tracking-wider">
            Registration & Admission
          </h3>
          <p className="text-small text-text-muted leading-relaxed">
            {event.registrationInfo}
          </p>
          {!event.isPast && (
            <div className="pt-2">
              <Button asChild size="sm">
                <Link href="/contact">Inquire / Register Attendance</Link>
              </Button>
            </div>
          )}
        </section>

        {/* Back Link */}
        <div className="pt-6">
          <Button asChild variant="ghost" size="sm">
            <Link href="/events" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to all events
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
