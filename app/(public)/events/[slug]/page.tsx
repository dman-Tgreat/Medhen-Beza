import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Calendar,
  Clock,
  MapPin,
  CalendarCheck2,
  CheckCircle2,
  ArrowLeft,
  Share2,
} from "lucide-react";
import { PageHero } from "@/components/sections/Hero";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { getPublicEventBySlug, getPublicEvents, getPublicSiteSettings } from "@/lib/queries/public";
import { contentMetadata, absoluteUrl, hospitalReference } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const events = await getPublicEvents();
  return events.map((event) => ({
    slug: event.slug,
  }));
}

export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [event, settings] = await Promise.all([
    getPublicEventBySlug(slug),
    getPublicSiteSettings(),
  ]);

  if (!event) {
    return {
      title: "Event Not Found",
    };
  }

  return contentMetadata({
    title: event.metaTitle || event.title,
    description: event.metaDescription || event.description,
    path: `/events/${event.slug}`,
    canonicalUrl: event.canonicalUrl,
    image: event.image,
    siteName: settings.hospitalName,
  });
}

export default async function EventDetailPage({ params }: EventPageProps) {
  const { slug } = await params;
  const [event, settings] = await Promise.all([
    getPublicEventBySlug(slug),
    getPublicSiteSettings(),
  ]);

  if (!event) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Event", name: event.title, description: event.description, url: absoluteUrl(`/events/${event.slug}`), image: event.image ? absoluteUrl(event.image) : undefined, organizer: hospitalReference(settings.hospitalName), location: { "@type": "Place", name: event.location } }} />
      <PageHero
        title={event.title}
        description={`Event Date: ${event.dateFormatted} · ${event.location}`}
        badge="Hospital Event"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Events", href: "/events" },
          { label: event.title, href: `/events/${event.slug}` },
        ]}
      />

      <div className="container mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 shadow-sm space-y-6">
              {event.image && (
                <div className="relative h-[260px] sm:h-[380px] w-full rounded-xl overflow-hidden border border-border">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              <h2 className="text-h3 font-bold text-text">Event Overview & Schedule</h2>
              <p className="text-body text-text-muted leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            <div>
              <Button asChild variant="outline" size="sm">
                <Link href="/events" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" /> Back to All Events
                </Link>
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm sticky top-24 space-y-6">
              <h3 className="text-h4 font-bold text-text">Event Details</h3>

              <div className="space-y-4 text-small">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-text block">Date</span>
                    <span className="text-text-muted">{event.dateFormatted}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-text block">Time</span>
                    <span className="text-text-muted">{event.time}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-text block">Venue</span>
                    <span className="text-text-muted">{event.location}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <Button asChild variant="primary" className="w-full">
                  <Link href="/contact">Register / Attend</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
