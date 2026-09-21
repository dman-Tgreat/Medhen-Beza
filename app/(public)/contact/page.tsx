import type { Metadata } from "next";
import { PageHero } from "@/components/sections/Hero";
import { ContactFormClient } from "@/components/public/ContactFormClient";
import { getPublicDepartments } from "@/lib/queries/public";

export const metadata: Metadata = {
  title: "Contact & Appointments | Medhen Beza Hospital",
  description:
    "Get in touch with Medhen Beza Hospital in Addis Ababa for general inquiries, clinical appointments, emergency admissions, and medical department contacts.",
};

export default async function ContactPage() {
  const departments = await getPublicDepartments();

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHero
        title="Contact Medhen Beza Hospital"
        description="Our patient helpdesk and medical administrative staff are available to assist with appointments, specialist inquiries, and admissions."
        badge="Get in Touch"
        breadcrumbs={[{ label: "Contact" }]}
      />

      <ContactFormClient departments={departments} />
    </div>
  );
}
