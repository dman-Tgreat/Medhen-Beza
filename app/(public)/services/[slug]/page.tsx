import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
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
  getPublicServiceBySlug,
  getPublicServices,
  getPublicDepartmentBySlug,
  getPublicDoctors,
  getPublicSiteSettings,
} from "@/lib/queries/public";
import { contentMetadata, absoluteUrl, hospitalReference } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const services = await getPublicServices();
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const [service, settings] = await Promise.all([
    getPublicServiceBySlug(slug),
    getPublicSiteSettings(),
  ]);

  if (!service) {
    return {
      title: "Service Not Found",
    };
  }

  return contentMetadata({
    title: service.metaTitle || `${service.name} | Medical Services`,
    description: service.metaDescription || service.description,
    path: `/services/${service.slug}`,
    canonicalUrl: service.canonicalUrl,
    image: service.ogImage || service.image,
    siteName: settings.hospitalName,
  });
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = await getPublicServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const [department, allDoctors, settings] = await Promise.all([
    getPublicDepartmentBySlug(service.departmentSlug),
    getPublicDoctors(),
    getPublicSiteSettings(),
  ]);

  const relatedDoctors = allDoctors.filter(
    (d) => d.departmentSlug === service.departmentSlug
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <JsonLd data={{ "@context": "https://schema.org", "@type": "MedicalProcedure", name: service.name, description: service.description, url: absoluteUrl(`/services/${service.slug}`), image: service.image ? absoluteUrl(service.image) : undefined, provider: hospitalReference(settings.hospitalName) }} />
      <PageHero
        title={service.name}
        description={service.description}
        badge={service.departmentName}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: service.name, href: `/services/${service.slug}` },
        ]}
      />

      <div className="container mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-10">
            {/* Overview Section */}
            <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 shadow-sm space-y-6">
              {service.image && (
                <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-border">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 66vw"
                  />
                </div>
              )}
              <h2 className="text-h3 font-bold text-text">Service Overview</h2>
              <p className="text-body text-text-muted leading-relaxed whitespace-pre-line">
                {service.longDescription || service.description}
              </p>

              {service.features && service.features.length > 0 && (
                <div className="border-t border-border pt-6 space-y-3">
                  <h3 className="text-h4 font-bold text-text">Key Care Highlights</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {service.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 p-3 rounded-xl bg-background border border-border text-small font-medium text-text"
                      >
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Related Specialists */}
            {relatedDoctors.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-h3 font-bold text-text">
                    Specialists Providing this Service
                  </h3>
                  <Link
                    href="/doctors"
                    className="text-small font-semibold text-primary hover:underline flex items-center gap-1"
                  >
                    All Specialists <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {relatedDoctors.map((doc) => (
                    <DoctorCard key={doc.slug} data={doc} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar: Availability & Department info */}
          <div className="lg:col-span-4">
            <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm sticky top-24 space-y-6">
              <h3 className="text-h4 font-bold text-text">Service Information</h3>

              <div className="space-y-4 text-small">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-text block">Availability</span>
                    <span className="text-text-muted">{service.availability}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-text block">Host Department</span>
                    <Link
                      href={`/departments/${service.departmentSlug}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {service.departmentName}
                    </Link>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <PhoneCall className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-text block">Inquiry Phone</span>
                    <a
                      href={`tel:${(department?.phone || settings.generalPhone).replace(/\s/g, "")}`}
                      className="text-primary hover:underline font-medium"
                    >
                      {department?.phone || settings.generalPhone}
                    </a>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <Button asChild variant="primary" className="w-full">
                  <Link href="/contact">Book Service Appointment</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/emergency">Emergency Response (24/7)</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
