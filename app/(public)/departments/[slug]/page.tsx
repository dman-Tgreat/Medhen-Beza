import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Building2,
  Calendar,
  PhoneCall,
  Stethoscope,
  Users,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { PageHero } from "@/components/sections/Hero";
import { ServiceCard } from "@/components/content/ServiceCard";
import { DoctorCard } from "@/components/content/DoctorCard";
import { ContactInfo } from "@/components/content/ContactInfo";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import {
  getDepartmentBySlug,
  getServicesByDepartment,
  getDoctorsByDepartment,
  MOCK_DEPARTMENTS_DETAILED,
} from "@/lib/mock-data";

interface DepartmentPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return MOCK_DEPARTMENTS_DETAILED.map((dept) => ({
    slug: dept.slug,
  }));
}

export async function generateMetadata({
  params,
}: DepartmentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const dept = getDepartmentBySlug(slug);

  if (!dept) {
    return {
      title: "Department Not Found | Medhen Beza Hospital",
    };
  }

  return {
    title: `${dept.name} Department | Medhen Beza Hospital`,
    description: dept.description,
  };
}

export default async function DepartmentDetailPage({
  params,
}: DepartmentPageProps) {
  const { slug } = await params;
  const dept = getDepartmentBySlug(slug);

  if (!dept) {
    notFound();
  }

  const departmentServices = getServicesByDepartment(dept.slug);
  const departmentDoctors = getDoctorsByDepartment(dept.slug);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 1. PageHero */}
      <PageHero
        eyebrow="Clinical Department"
        title={dept.name}
        description={dept.description}
        breadcrumbs={[
          { label: "Departments", href: "/departments" },
          { label: dept.name },
        ]}
      />

      <main className="layout-container pt-12 space-y-16">
        {/* 2. Department Overview Banner & Visual Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Info */}
          <div className="lg:col-span-8 space-y-6">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-caption font-semibold bg-secondary-light text-secondary uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5" aria-hidden />
                Department Overview
              </span>
              <h2 className="text-h2 font-bold tracking-tight text-text">
                Dedicated Care & Advanced Infrastructure
              </h2>
              <p className="text-body text-text-muted leading-relaxed">
                {dept.longDescription}
              </p>
            </div>

            {/* Department Head / Leadership note */}
            <div className="flex items-center gap-4 p-4 rounded-lg bg-surface border border-border">
              <div className="w-12 h-12 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold text-small shrink-0">
                MD
              </div>
              <div className="min-w-0">
                <p className="text-caption font-semibold uppercase tracking-wider text-text-muted">
                  Department Head & Lead Specialist
                </p>
                <p className="text-small font-bold text-text">
                  {dept.headDoctorName}
                </p>
              </div>
            </div>
          </div>

          {/* Department Location & Fast Action Card */}
          <div className="lg:col-span-4 rounded-lg bg-surface border border-border p-6 space-y-6 shadow-xs">
            <h3 className="text-h4 font-bold text-text border-b border-border pb-3">
              Department Location
            </h3>

            <div className="space-y-3 text-small">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-text">Campus Location</p>
                  <p className="text-text-muted">{dept.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-text">Clinical Hours</p>
                  <p className="text-text-muted">{dept.hours}</p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-border space-y-2.5">
              <Button asChild size="lg" className="w-full">
                <Link href="/contact" className="gap-2 justify-center">
                  <Calendar className="w-4 h-4" />
                  Request Consultation
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* ── Sub-Section 1: Services Offered (ServiceCard row) ── */}
        <ScrollReveal>
          <section className="space-y-6 pt-10 border-t border-border">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <span className="inline-flex items-center gap-1 text-caption font-bold text-secondary uppercase tracking-widest">
                  <Stethoscope className="w-3.5 h-3.5" />
                  Clinical Offerings
                </span>
                <h3 className="text-h2 font-bold text-text tracking-tight mt-1">
                  Services in {dept.name}
                </h3>
                <p className="text-small text-text-muted max-w-2xl mt-1">
                  Specialized treatments, screenings, and therapeutic programs
                  offered by this department.
                </p>
              </div>
              <Link
                href="/services"
                className="inline-flex items-center gap-1 text-small font-semibold text-primary hover:text-primary-dark transition-colors group shrink-0"
              >
                <span>All services directory</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {departmentServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {departmentServices.map((service) => (
                  <ServiceCard key={service.slug} data={service} />
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-lg bg-surface border border-border text-center text-text-muted text-small">
                Clinical services for this department are scheduled directly
                through the general medical directory.
              </div>
            )}
          </section>
        </ScrollReveal>

        {/* ── Sub-Section 2: Doctors in this Department (DoctorCard row) ── */}
        <ScrollReveal>
          <section className="space-y-6 pt-10 border-t border-border">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <span className="inline-flex items-center gap-1 text-caption font-bold text-primary uppercase tracking-widest">
                  <Users className="w-3.5 h-3.5" />
                  Medical Faculty
                </span>
                <h3 className="text-h2 font-bold text-text tracking-tight mt-1">
                  Specialists & Physicians
                </h3>
                <p className="text-small text-text-muted max-w-2xl mt-1">
                  Our team of consultant physicians and surgeons in the {dept.name}{" "}
                  Department.
                </p>
              </div>
              <Link
                href="/doctors"
                className="inline-flex items-center gap-1 text-small font-semibold text-primary hover:text-primary-dark transition-colors group shrink-0"
              >
                <span>Find all doctors</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {departmentDoctors.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {departmentDoctors.map((doctor) => (
                  <DoctorCard key={doctor.slug} data={doctor} />
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-lg bg-surface border border-border text-center text-text-muted text-small">
                Physicians from our multidisciplinary team provide rotational
                coverage for this department.
              </div>
            )}
          </section>
        </ScrollReveal>

        {/* ── Sub-Section 3: Contact & Working Hours Specific to Department ── */}
        <ScrollReveal>
          <section className="space-y-6 pt-10 border-t border-border">
            <div className="rounded-lg bg-surface border border-border p-8 lg:p-10 space-y-6">
              <div className="max-w-xl space-y-2">
                <span className="text-caption font-semibold uppercase tracking-widest text-secondary">
                  Direct Department Inquiries
                </span>
                <h3 className="text-h3 font-bold text-text tracking-tight">
                  Contact {dept.name} Department Directly
                </h3>
                <p className="text-small text-text-muted leading-relaxed">
                  For department appointment confirmations, direct doctor inquiries,
                  or ward visiting hours, contact this department&apos;s direct desk.
                </p>
              </div>

              <div className="pt-4 border-t border-border">
                <ContactInfo
                  address={dept.location}
                  phone={dept.phone}
                  email={dept.email}
                  hours={dept.hours}
                  emergency="+251 911 000 999 (24/7 Emergency Dispatch)"
                />
              </div>
            </div>
          </section>
        </ScrollReveal>
      </main>
    </div>
  );
}
