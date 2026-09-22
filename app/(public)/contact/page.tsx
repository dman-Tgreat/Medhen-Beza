import type { Metadata } from "next";
import { PageHero } from "@/components/sections/Hero";
import { ContactFormClient } from "@/components/public/ContactFormClient";
import { getPublicDepartments, getPublicSiteSettings } from "@/lib/queries/public";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSiteSettings();
  return {
    title: "Contact & Appointments",
    description: `Get in touch with ${settings.hospitalName} for general inquiries, clinical appointments, emergency admissions, and medical department contacts.`,
  };
}

export default async function ContactPage() {
  const [departments, settings] = await Promise.all([
    getPublicDepartments(),
    getPublicSiteSettings(),
  ]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHero
        title={`Contact ${settings.hospitalName}`}
        description="Our patient helpdesk and medical administrative staff are available to assist with appointments, specialist inquiries, and admissions."
        badge="Get in Touch"
        breadcrumbs={[{ label: "Contact" }]}
      />

      <ContactFormClient departments={departments} settings={settings} />
    </div>
  );
}
