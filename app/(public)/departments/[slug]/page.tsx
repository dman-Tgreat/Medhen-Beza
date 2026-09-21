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
  getPublicDepartmentBySlug,
  getPublicDepartments,
  getPublicServices,
  getPublicDoctors,
} from "@/lib/queries/public";
import { contentMetadata, absoluteUrl, hospitalReference } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

interface DepartmentPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const departments = await getPublicDepartments();
  return departments.map((dept) => ({
    slug: dept.slug,
  }));
}

export async function generateMetadata({
  params,
}: DepartmentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const dept = await getPublicDepartmentBySlug(slug);

  if (!dept) {
    return {
      title: "Department Not Found | Medhen Beza Hospital",
    };
  }

  return contentMetadata({ title: dept.metaTitle || `${dept.name} Department`, description: dept.metaDescription || dept.description, path: `/departments/${dept.slug}`, canonicalUrl: dept.canonicalUrl, image: dept.ogImage || dept.image });
}

export default async function DepartmentDetailPage({
  params,
}: DepartmentPageProps) {
  const { slug } = await params;
  const dept = await getPublicDepartmentBySlug(slug);

  if (!dept) {
    notFound();
  }

  const [allServices, allDoctors] = await Promise.all([
    getPublicServices(),
    getPublicDoctors(),
  ]);

  const departmentServices = allServices.filter(
    (s) => s.departmentSlug === dept.slug
  );
  const departmentDoctors = allDoctors.filter(
    (d) => d.departmentSlug === dept.slug
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <JsonLd data={{ "@context": "https://schema.org", "@type": "MedicalOrganization", name: `${dept.name} Department`, description: dept.description, url: absoluteUrl(`/departments/${dept.slug}`), image: dept.image ? absoluteUrl(dept.image) : undefined, medicalSpecialty: dept.name, parentOrganization: hospitalReference() }} />
      <PageHero
        title={`${dept.name} Department`}
        description={dept.description}
        badge="Clinical Department"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Departments", href: "/departments" },
          { label: dept.name, href: `/departments/${dept.slug}` },
        ]}
      />

      <div className="container mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left / Main Column */}
          <div className="lg:col-span-8 space-y-10">
            {/* Overview & Key Services */}
            <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 shadow-sm space-y-6">
              <h2 className="text-h3 font-bold text-text">Department Overview</h2>
              <p className="text-body text-text-muted leading-relaxed whitespace-pre-line">
                {dept.longDescription || dept.description}
              </p>

              {dept.keyServices && dept.keyServices.length > 0 && (
                <div className="border-t border-border pt-6 space-y-3">
                  <h3 className="text-h4 font-bold text-text">Core Specializations</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {dept.keyServices.map((srv, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-3 rounded-xl bg-background border border-border text-small font-medium text-text"
                      >
                        <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                        <span>{srv}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Department Clinical Services */}
            {departmentServices.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-h3 font-bold text-text">
                    Services Provided in {dept.name}
                  </h3>
                  <Link
                    href="/services"
                    className="text-small font-semibold text-primary hover:underline flex items-center gap-1"
                  >
                    All Services <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {departmentServices.map((srv) => (
                    <ServiceCard key={srv.slug} data={srv} />
                  ))}
                </div>
              </div>
            )}

            {/* Department Staff & Doctors */}
            {departmentDoctors.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-h3 font-bold text-text">
                    Department Physicians & Specialists
                  </h3>
                  <Link
                    href="/doctors"
                    className="text-small font-semibold text-primary hover:underline flex items-center gap-1"
                  >
                    Doctors Directory <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-3 gap-6">
                  {departmentDoctors.map((doc) => (
                    <DoctorCard key={doc.slug} data={doc} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar: Contact, Hours, Location */}
          <div className="lg:col-span-4">
            <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm sticky top-24 space-y-6">
              <h3 className="text-h4 font-bold text-text">Unit Information</h3>

              <div className="space-y-4 text-small">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-text block">Working Hours</span>
                    <span className="text-text-muted">{dept.hours}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-text block">Location</span>
                    <span className="text-text-muted">{dept.location}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <PhoneCall className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-text block">Direct Line</span>
                    <a
                      href={`tel:${dept.phone}`}
                      className="text-primary hover:underline font-medium"
                    >
                      {dept.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-text block">Department Lead</span>
                    <span className="text-text-muted">{dept.headDoctorName}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <Button asChild variant="primary" className="w-full">
                  <Link href="/contact">Inquire with Department</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`tel:${dept.phone}`}>Call Department</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
