import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  Clock,
  Building2,
  CheckCircle2,
  PhoneCall,
  ArrowRight,
  ShieldCheck,
  UserCircle2,
  ChevronRight,
} from "lucide-react";
import { PageHero } from "@/components/sections/Hero";
import { DoctorCard } from "@/components/content/DoctorCard";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import {
  getServiceBySlug,
  getDepartmentBySlug,
  getDoctorsByDepartment,
  MOCK_SERVICES_DETAILED,
  type DoctorDetailData,
} from "@/lib/mock-data";
import { HOSPITAL_INFO } from "@/lib/constants";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return MOCK_SERVICES_DETAILED.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return {
      title: "Service Not Found | Medhen Beza Hospital",
    };
  }

  return {
    title: `${service.name} | Medical Services | Medhen Beza Hospital`,
    description: service.description,
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const department = getDepartmentBySlug(service.departmentSlug);
  const relatedDoctors = getDoctorsByDepartment(service.departmentSlug);
  const Icon = service.icon;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 1. PageHero with full breadcrumbs */}
      <PageHero
        eyebrow="Clinical Service"
        title={service.name}
        description={service.description}
        breadcrumbs={[
          { label: "Services", href: "/services" },
          { label: service.name },
        ]}
      />

      <main className="layout-container pt-12 space-y-16">
        {/* 2. Overview & Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-10">
            {/* Service Banner / Icon Swatch */}
            <div className="flex items-center gap-4 p-6 rounded-lg bg-surface border border-border">
              <div className="w-16 h-16 rounded-lg bg-primary-light text-primary flex items-center justify-center shrink-0 shadow-xs">
                <Icon className="w-8 h-8" strokeWidth={1.75} aria-hidden />
              </div>
              <div className="space-y-1">
                <span className="text-caption font-semibold uppercase tracking-widest text-secondary">
                  Specialized Treatment
                </span>
                <h2 className="text-h3 font-bold text-text">{service.name}</h2>
                <p className="text-small text-text-muted">
                  Part of the{" "}
                  {department ? (
                    <Link
                      href={department.href}
                      className="font-semibold text-primary hover:underline"
                    >
                      {department.name}
                    </Link>
                  ) : (
                    service.departmentName
                  )}
                </p>
              </div>
            </div>

            {/* In-depth clinical description */}
            <div className="space-y-4">
              <h3 className="text-h3 font-bold text-text">About this Service</h3>
              <p className="text-body text-text-muted leading-relaxed">
                {service.longDescription}
              </p>
            </div>

            {/* Key Clinical Features & Capabilities */}
            {service.features && service.features.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-border">
                <h3 className="text-h3 font-bold text-text">
                  Key Capabilities & Equipment
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {service.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-4 rounded-md bg-surface border border-border/80"
                    >
                      <CheckCircle2
                        className="w-5 h-5 text-secondary shrink-0 mt-0.5"
                        aria-hidden
                      />
                      <span className="text-small font-medium text-text leading-snug">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Diagnostic & Therapeutic Procedures */}
            {service.procedures && service.procedures.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-border">
                <h3 className="text-h3 font-bold text-text">
                  Common Procedures & Treatments
                </h3>
                <ul className="space-y-2.5">
                  {service.procedures.map((procedure, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 text-body text-text-muted"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      <span>{procedure}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar Column: Department Link, Hours & Booking Card */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Facts Card */}
            <div className="rounded-lg bg-surface border border-border p-6 space-y-6 shadow-xs">
              <h3 className="text-h4 font-bold text-text border-b border-border pb-3">
                Service Details
              </h3>

              {/* Department Box */}
              {department && (
                <div className="space-y-1.5">
                  <span className="text-caption font-semibold uppercase tracking-wider text-text-muted">
                    Responsible Department
                  </span>
                  <Link
                    href={department.href}
                    className="flex items-center justify-between p-3 rounded-md bg-background border border-border hover:border-primary-light group transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Building2 className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-small font-semibold text-text group-hover:text-primary truncate">
                        {department.name}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-text-light group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              )}

              {/* Working Hours */}
              <div className="space-y-1.5">
                <span className="text-caption font-semibold uppercase tracking-wider text-text-muted">
                  Consultation Schedule
                </span>
                <div className="flex items-start gap-2.5 text-small text-text">
                  <Clock className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                  <span className="font-medium">{service.availability}</span>
                </div>
              </div>

              {/* Booking CTA */}
              <div className="pt-4 border-t border-border space-y-3">
                <Button asChild size="lg" className="w-full">
                  <Link href="/contact" className="gap-2 justify-center">
                    <Calendar className="w-4 h-4" />
                    Book Consultation
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="secondary"
                  size="sm"
                  className="w-full justify-center"
                >
                  <a
                    href={`tel:${HOSPITAL_INFO.generalPhone.replace(/\s/g, "")}`}
                    className="gap-2"
                  >
                    <PhoneCall className="w-4 h-4" />
                    Call Reception
                  </a>
                </Button>
              </div>
            </div>

            {/* Patient Assurance Card */}
            <div className="rounded-lg bg-primary-light/40 border border-primary/20 p-5 flex items-start gap-3.5">
              <ShieldCheck className="w-6 h-6 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-small font-bold text-text">
                  Quality Guaranteed
                </h4>
                <p className="text-caption text-text-muted leading-relaxed">
                  All clinical consultations and surgical procedures adhere to
                  national hospital quality accreditation standards.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Related Doctors Section — Immediate next step toward a specialist */}
        <ScrollReveal>
          <div className="space-y-6 pt-10 border-t border-border">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <span className="inline-flex items-center gap-1 rounded-sm bg-primary-light px-2 py-0.5 text-caption font-bold text-primary uppercase tracking-wider mb-1">
                  Specialist Team
                </span>
                <h2 className="text-h2 font-bold text-text tracking-tight">
                  Specialists in {service.name}
                </h2>
                <p className="text-small text-text-muted max-w-2xl mt-1">
                  Consult with our board-certified physicians specializing in this
                  discipline.
                </p>
              </div>
              <Link
                href="/doctors"
                className="inline-flex items-center gap-1 text-small font-semibold text-primary hover:text-primary-dark transition-colors group shrink-0"
              >
                <span>View all doctors</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {relatedDoctors.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedDoctors.map((doc) => (
                  <DoctorCard key={doc.slug} data={doc} />
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-lg bg-surface border border-border text-center text-text-muted text-small">
                General consultations for this service are provided by our on-duty
                specialist team.
              </div>
            )}
          </div>
        </ScrollReveal>
      </main>
    </div>
  );
}
