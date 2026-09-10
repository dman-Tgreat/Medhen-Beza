import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Calendar,
  Clock,
  MapPin,
  Mail,
  Building2,
  GraduationCap,
  Globe2,
  Award,
  ArrowRight,
  ShieldCheck,
  UserCircle2,
  CheckCircle,
} from "lucide-react";
import { PageHero } from "@/components/sections/Hero";
import { DoctorCard } from "@/components/content/DoctorCard";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import {
  getDoctorBySlug,
  getDepartmentBySlug,
  getRelatedDoctors,
  MOCK_DOCTORS_DETAILED,
} from "@/lib/mock-data";

interface DoctorPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return MOCK_DOCTORS_DETAILED.map((doc) => ({
    slug: doc.slug,
  }));
}

export async function generateMetadata({
  params,
}: DoctorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const doctor = getDoctorBySlug(slug);

  if (!doctor) {
    return {
      title: "Doctor Not Found | Medhen Beza Hospital",
    };
  }

  return {
    title: `${doctor.name} — ${doctor.specialty} | Medhen Beza Hospital`,
    description: doctor.biography,
  };
}

export default async function DoctorProfilePage({ params }: DoctorPageProps) {
  const { slug } = await params;
  const doctor = getDoctorBySlug(slug);

  if (!doctor) {
    notFound();
  }

  const department = getDepartmentBySlug(doctor.departmentSlug);
  const otherDoctors = getRelatedDoctors(doctor.departmentSlug, doctor.slug, 3);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 1. PageHero */}
      <PageHero
        eyebrow="Physician Profile"
        title={doctor.name}
        description={`${doctor.title} · ${doctor.specialty}`}
        breadcrumbs={[
          { label: "Doctors", href: "/doctors" },
          { label: doctor.name },
        ]}
      />

      <main className="layout-container pt-12 space-y-16">
        {/* 2. Main Profile Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Portrait & Key Details & Quick Booking Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-lg bg-surface border border-border overflow-hidden shadow-xs">
              {/* Photo Slot */}
              <div className="relative aspect-[4/5] bg-primary-light">
                {doctor.photo ? (
                  <Image
                    src={doctor.photo}
                    alt={doctor.name}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-light via-surface to-secondary-light/40 flex flex-col items-center justify-center text-primary/40 p-6 text-center">
                    <UserCircle2 className="w-24 h-24 mb-2" strokeWidth={1} />
                    <span className="text-small font-semibold text-text">
                      {doctor.name}
                    </span>
                    <span className="text-caption text-text-muted mt-0.5">
                      {doctor.specialty}
                    </span>
                  </div>
                )}

                <span className="absolute top-3 right-3 rounded-full bg-secondary text-white px-3 py-1 text-caption font-bold tracking-wider uppercase shadow-sm">
                  {doctor.specialty}
                </span>
              </div>

              {/* Quick Details List */}
              <div className="p-6 space-y-5">
                <div>
                  <h2 className="text-h3 font-bold text-text leading-tight">
                    {doctor.name}
                  </h2>
                  <p className="text-small font-medium text-secondary mt-1">
                    {doctor.title}
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-border text-small text-text-muted">
                  <div className="flex items-start gap-3">
                    <Building2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-text">Department</p>
                      {department ? (
                        <Link
                          href={department.href}
                          className="text-primary hover:underline font-medium"
                        >
                          {department.name}
                        </Link>
                      ) : (
                        <span>{doctor.department}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-text">Office Location</p>
                      <span>{doctor.officeLocation}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-text">Clinical Hours</p>
                      <span>{doctor.availability}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Globe2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-text">Languages</p>
                      <span>{doctor.languages.join(", ")}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border space-y-2.5">
                  <Button asChild size="lg" className="w-full">
                    <Link href="/contact" className="gap-2 justify-center">
                      <Calendar className="w-4 h-4" />
                      Book Consultation
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Department Quick Link Card */}
            {department && (
              <div className="rounded-lg bg-surface border border-border p-5 space-y-3">
                <span className="text-caption font-semibold uppercase tracking-wider text-text-muted block">
                  Department Affiliation
                </span>
                <h4 className="text-small font-bold text-text">
                  {department.name} Department
                </h4>
                <p className="text-caption text-text-muted line-clamp-2">
                  {department.description}
                </p>
                <Link
                  href={department.href}
                  className="inline-flex items-center gap-1.5 text-small font-semibold text-primary hover:underline pt-1"
                >
                  <span>Explore department & services</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Right Column: Bio, Qualifications, Expertise */}
          <div className="lg:col-span-8 space-y-10">
            {/* Biography */}
            <div className="space-y-4">
              <h3 className="text-h3 font-bold text-text">Doctor Biography</h3>
              <p className="text-body text-text-muted leading-relaxed">
                {doctor.biography}
              </p>
              <div className="p-4 rounded-md bg-surface border border-border flex items-center gap-3">
                <Award className="w-5 h-5 text-secondary shrink-0" />
                <span className="text-small font-medium text-text">
                  {doctor.experience}
                </span>
              </div>
            </div>

            {/* Areas of Clinical Expertise */}
            <div className="space-y-4 pt-4 border-t border-border">
              <h3 className="text-h3 font-bold text-text">
                Areas of Clinical Expertise
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {doctor.areasOfExpertise.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 rounded-full bg-primary-light/70 text-primary border border-primary/20 px-3.5 py-1.5 text-small font-semibold"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-primary" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Education & Qualifications */}
            <div className="space-y-4 pt-4 border-t border-border">
              <h3 className="text-h3 font-bold text-text">
                Education & Board Certifications
              </h3>
              <ul className="space-y-3">
                {doctor.qualifications.map((qual, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-body text-text-muted"
                  >
                    <div className="w-8 h-8 rounded-md bg-secondary-light text-secondary flex items-center justify-center shrink-0 mt-0.5">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <span className="mt-1 font-medium text-text">{qual}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quality Standard */}
            <div className="rounded-lg bg-surface border border-border p-6 flex items-start gap-4">
              <ShieldCheck className="w-8 h-8 text-secondary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-small font-bold text-text">
                  Certified Clinical Provider
                </h4>
                <p className="text-caption text-text-muted leading-relaxed">
                  Licensed by the Ethiopian Health Regulatory Authority (EFDA)
                  and the Ministry of Health. Adheres to international medical
                  ethics and patient privacy protocols.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Other Doctors in this Department — Keep visitors moving */}
        {otherDoctors.length > 0 && (
          <ScrollReveal>
            <div className="space-y-6 pt-10 border-t border-border">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <div>
                  <span className="text-caption font-semibold uppercase tracking-wider text-secondary">
                    Department Team
                  </span>
                  <h3 className="text-h2 font-bold text-text tracking-tight mt-0.5">
                    Other Specialists in {doctor.department}
                  </h3>
                  <p className="text-small text-text-muted max-w-2xl mt-1">
                    Meet other consultant physicians and surgeons in this clinical
                    division.
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

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {otherDoctors.map((doc) => (
                  <DoctorCard key={doc.slug} data={doc} />
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}
      </main>
    </div>
  );
}
