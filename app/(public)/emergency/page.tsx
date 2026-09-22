import type { Metadata } from "next";
import {
  PhoneCall,
  MapPin,
  Clock,
  AlertTriangle,
  Ambulance,
  HeartPulse,
  CheckCircle2,
  Navigation,
  ShieldAlert,
} from "lucide-react";
import { PageHero } from "@/components/sections/Hero";
import { Button } from "@/components/ui/button";
import { getPublicSiteSettings, getPublicPageBySlug } from "@/lib/queries/public";
import { HospitalMap } from "@/components/public/HospitalMap";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSiteSettings();
  return {
    title: "Emergency Services 24/7",
    description: `24/7 Emergency Medical Response & Trauma Center at ${settings.hospitalName}. Immediate critical care hotline available around the clock.`,
  };
}

export default async function EmergencyPage() {
  const settings = await getPublicSiteSettings();
  const dbPage = await getPublicPageBySlug("emergency");

  const phone = settings.emergencyPhone;
  const emergencyPhoneRaw = phone.replace(/\s/g, "");
  const gateInfo = settings.emergencyGate || `Gate 1 (Dedicated Ambulance & Emergency Driveway), ${settings.address || "Bole Road"}`;
  const hoursInfo = settings.emergencyHours || "Open 24 Hours · 7 Days a Week · All Holidays";
  const mapQuery = encodeURIComponent(settings.address || settings.location || "Adama, Ethiopia");

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 1. Minimal Calm PageHero */}
      <PageHero
        eyebrow="24/7 Trauma & Critical Response"
        title={dbPage?.title || "Emergency Medical Services"}
        description={
          dbPage?.excerpt ||
          "Immediate emergency care and rapid trauma response available 24 hours a day, 365 days a year."
        }
        breadcrumbs={[{ label: "Emergency" }]}
      />

      <main className="layout-container pt-8 space-y-10 max-w-4xl mx-auto">
        {/* 2. High-Contrast Emergency Block (Red Token) */}
        <section
          className="rounded-xl bg-emergency text-white p-6 sm:p-10 shadow-modal space-y-8"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-full bg-white/20 text-white animate-pulse">
              <AlertTriangle className="w-6 h-6" aria-hidden />
            </span>
            <span className="text-small font-black uppercase tracking-widest text-white/90">
              Immediate Critical Hotline
            </span>
          </div>

          <div className="space-y-4 text-center sm:text-left">
            <h2 className="text-caption sm:text-small font-bold text-white/80 uppercase tracking-widest">
              Call for Ambulance & Trauma Dispatch
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <a
                href={`tel:${emergencyPhoneRaw}`}
                className="inline-flex items-center justify-center gap-2.5 sm:gap-3 rounded-lg bg-white text-emergency px-4 sm:px-6 py-3.5 sm:py-4 text-xl sm:text-h2 md:text-h1 font-black hover:bg-white/90 transition-transform active:scale-95 shadow-md max-w-full"
                aria-label={`Call emergency line at ${phone}`}
              >
                <PhoneCall className="w-6 h-6 sm:w-8 sm:h-8 shrink-0 animate-bounce" />
                <span className="whitespace-nowrap sm:whitespace-normal">{phone}</span>
              </a>

              <p className="text-small text-white/90 font-medium max-w-xs">
                Tap to call instantly. Our emergency triage dispatch is live
                around the clock.
              </p>
            </div>
          </div>

          {/* Quick Access Badges inside Red Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-white/20 text-white text-small">
            <div className="flex items-start gap-3 bg-black/15 p-4 rounded-lg">
              <MapPin className="w-5 h-5 text-white shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Emergency Gate & Entrance</p>
                <p className="text-white/85 text-caption mt-0.5">
                  {gateInfo}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-black/15 p-4 rounded-lg">
              <Clock className="w-5 h-5 text-white shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Operating Hours</p>
                <p className="text-white/85 text-caption mt-0.5">
                  {hoursInfo}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Plain-Language Scannable Instructions (What to do while coming) */}
        <section className="space-y-6">
          <div className="space-y-1">
            <h3 className="text-h2 font-bold text-text tracking-tight">
              Before You Arrive
            </h3>
            <p className="text-small text-text-muted">
              Quick guidelines for patients and companions en route to the
              emergency center.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Step 1 */}
            <div className="p-5 rounded-lg bg-surface border border-border space-y-2.5">
              <div className="w-8 h-8 rounded-full bg-emergency-light text-emergency font-bold text-small flex items-center justify-center">
                1
              </div>
              <h4 className="text-small font-bold text-text">
                Call Ahead If Possible
              </h4>
              <p className="text-caption text-text-muted leading-relaxed">
                Calling allows our trauma team to prepare resuscitation bays,
                blood supplies, and surgical specialists prior to your arrival.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-lg bg-surface border border-border space-y-2.5">
              <div className="w-8 h-8 rounded-full bg-emergency-light text-emergency font-bold text-small flex items-center justify-center">
                2
              </div>
              <h4 className="text-small font-bold text-text">
                What to Bring (If Accessible)
              </h4>
              <p className="text-caption text-text-muted leading-relaxed">
                Patient ID, insurance card, and current medications. However,
                never delay emergency transit to search for documents.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-lg bg-surface border border-border space-y-2.5">
              <div className="w-8 h-8 rounded-full bg-emergency-light text-emergency font-bold text-small flex items-center justify-center">
                3
              </div>
              <h4 className="text-small font-bold text-text">
                Immediate Triage On Arrival
              </h4>
              <p className="text-caption text-text-muted leading-relaxed">
                Our triage nurse evaluates severity immediately. Life-threatening
                and critical cases receive instant physician intervention.
              </p>
            </div>
          </div>
        </section>

        {/* 4. When to Come to Emergency (Critical Conditions) */}
        <section className="p-6 rounded-lg bg-surface border border-border space-y-4">
          <h3 className="text-h3 font-bold text-text">
            Critical Symptoms Requiring Immediate Emergency Care
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-small text-text">
            {[
              "Severe chest pain, pressure, or shortness of breath",
              "Sudden numbness, facial drooping, or speech difficulty (Stroke signs)",
              "Severe uncontrolled bleeding or major physical trauma",
              "Loss of consciousness, severe dizziness, or seizures",
              "Sudden severe abdominal pain or persistent high fever in infants",
              "Severe allergic reactions with throat swelling or breathing difficulty",
            ].map((symptom, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-emergency shrink-0 mt-0.5" />
                <span className="text-text-muted">{symptom}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Campus Emergency Gate Location & OpenStreetMap Guidance */}
        <section className="space-y-4">
          <HospitalMap
            variant="emergency"
            title="Emergency Entrance & Map Navigation"
            subtitle={`Hospital Address: ${settings.address || settings.location || "Adama, Ethiopia"}. Direct ramp access for ambulances and private emergency vehicles.`}
            address={settings.address || settings.location || "H73F+R49, Adama, Ethiopia"}
          />
        </section>
      </main>
    </div>
  );
}
