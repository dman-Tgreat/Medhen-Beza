import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Briefcase,
  Building2,
  Calendar,
  MapPin,
  Clock,
  Mail,
  CheckCircle2,
  ArrowLeft,
  AlertCircle,
  Gift,
  GraduationCap,
} from "lucide-react";
import { PageHero } from "@/components/sections/Hero";
import { Button } from "@/components/ui/button";
import { getCareerBySlug, MOCK_CAREERS_DETAILED } from "@/lib/mock-data";

interface CareerPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return MOCK_CAREERS_DETAILED.map((career) => ({
    slug: career.slug,
  }));
}

export async function generateMetadata({
  params,
}: CareerPageProps): Promise<Metadata> {
  const { slug } = await params;
  const career = getCareerBySlug(slug);

  if (!career) {
    return {
      title: "Career Opportunity Not Found | Medhen Beza Hospital",
    };
  }

  return {
    title: `${career.position} | Careers | Medhen Beza Hospital`,
    description: career.overview,
  };
}

export default async function CareerDetailPage({ params }: CareerPageProps) {
  const { slug } = await params;
  const career = getCareerBySlug(slug);

  if (!career) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 1. PageHero */}
      <PageHero
        eyebrow="Career Opening"
        title={career.position}
        description={`${career.department} · ${career.type} · ${career.location}`}
        breadcrumbs={[
          { label: "Careers", href: "/careers" },
          { label: career.position },
        ]}
      />

      <main className="layout-container pt-10 space-y-12 max-w-4xl mx-auto">
        {/* 2. Visually Prominent Application Deadline Alert Block */}
        <div className="rounded-xl border-2 border-primary/30 bg-primary-light/50 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-caption font-bold uppercase tracking-wider text-primary">
              <Calendar className="w-4 h-4" />
              Application Deadline
            </div>
            <h2 className="text-h2 font-black text-text">
              {career.deadline}
            </h2>
            <p className="text-small text-text-muted">
              Posted: {career.postedDate} · Early applications are reviewed on
              a rolling basis.
            </p>
          </div>

          <Button asChild size="lg" className="shrink-0 font-bold">
            <a href={`mailto:${career.contactEmail}?subject=Application for ${encodeURIComponent(career.position)}`}>
              <Mail className="w-4 h-4" />
              Apply via Email
            </a>
          </Button>
        </div>

        {/* 3. Job Overview */}
        <section className="space-y-4">
          <h3 className="text-h3 font-bold text-text">Position Overview</h3>
          <p className="text-body text-text-muted leading-relaxed">
            {career.overview}
          </p>
        </section>

        {/* 4. Responsibilities */}
        {career.responsibilities && career.responsibilities.length > 0 && (
          <section className="space-y-4 pt-4 border-t border-border">
            <h3 className="text-h3 font-bold text-text">
              Key Duties & Responsibilities
            </h3>
            <ul className="space-y-3">
              {career.responsibilities.map((resp, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-body text-text-muted"
                >
                  <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 5. Requirements & Qualifications */}
        {career.requirements && career.requirements.length > 0 && (
          <section className="space-y-4 pt-4 border-t border-border">
            <h3 className="text-h3 font-bold text-text">
              Requirements & Experience
            </h3>
            <ul className="space-y-3">
              {career.requirements.map((req, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-body text-text-muted"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 6. Education & Certifications */}
        {career.qualifications && career.qualifications.length > 0 && (
          <section className="space-y-4 pt-4 border-t border-border">
            <h3 className="text-h3 font-bold text-text">
              Required Qualifications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {career.qualifications.map((qual, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-md bg-surface border border-border flex items-center gap-3"
                >
                  <GraduationCap className="w-5 h-5 text-secondary shrink-0" />
                  <span className="text-small font-semibold text-text">
                    {qual}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 7. What We Offer (Benefits) */}
        {career.benefits && career.benefits.length > 0 && (
          <section className="space-y-4 pt-4 border-t border-border">
            <h3 className="text-h3 font-bold text-text">What We Offer</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {career.benefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-md bg-surface border border-border flex items-center gap-3"
                >
                  <Gift className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-small font-medium text-text">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 8. Application Instructions Box */}
        <section className="rounded-xl bg-surface border border-border p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-caption font-bold uppercase tracking-wider text-secondary">
            <Mail className="w-4 h-4" />
            How to Apply
          </div>
          <h3 className="text-h3 font-bold text-text">
            Application Instructions
          </h3>
          <p className="text-body text-text-muted leading-relaxed">
            Interested candidates should submit their updated Curriculum Vitae
            (CV), cover letter, and copies of professional licenses/credentials
            by email. Please include the job title (
            <strong>&ldquo;{career.position}&rdquo;</strong>) in the subject
            line of your email.
          </p>

          <div className="p-4 rounded-md bg-background border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-caption font-semibold uppercase tracking-wider text-text-muted">
                Send Applications To
              </p>
              <p className="text-body font-bold text-primary">
                {career.contactEmail}
              </p>
            </div>

            <Button asChild size="default">
              <a
                href={`mailto:${career.contactEmail}?subject=Application: ${encodeURIComponent(career.position)}`}
              >
                Send CV to {career.contactEmail}
              </a>
            </Button>
          </div>
        </section>

        {/* Back Link */}
        <div className="pt-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/careers" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to all open positions
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
