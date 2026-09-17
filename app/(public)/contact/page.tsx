"use client";

import * as React from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  AlertTriangle,
  Send,
  CheckCircle2,
  PhoneCall,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { PageHero } from "@/components/sections/Hero";
import { ContactInfo } from "@/components/content/ContactInfo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { HOSPITAL_INFO } from "@/lib/constants";
import { MOCK_DEPARTMENTS_DETAILED } from "@/lib/mock-data";

interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  department: string;
  subject: string;
  message: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export default function ContactPage() {
  const [formData, setFormData] = React.useState<ContactFormData>({
    fullName: "",
    email: "",
    phone: "",
    department: "General Inquiries",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = React.useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);

  const validateForm = (): boolean => {
    const errs: FormErrors = {};

    if (!formData.fullName.trim()) {
      errs.fullName = "Please enter your full name";
    }

    if (!formData.email.trim()) {
      errs.email = "Please enter your email address";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      errs.phone = "Please enter your contact phone number";
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errs.message = "Please write a message of at least 10 characters";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        department: "General Inquiries",
        subject: "",
        message: "",
      });
      setErrors({});
    }, 800);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 1. PageHero */}
      <PageHero
        eyebrow="Get In Touch"
        title="Contact Medhen Beza Hospital"
        description="Whether you have an appointment inquiry, clinical question, or need hospital directions, our administrative and patient support teams are here to assist."
        breadcrumbs={[{ label: "Contact" }]}
      />

      <main className="layout-container pt-12 space-y-16">
        {/* 2. Side-by-Side Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Direct Hospital Info & Emergency Box */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <span className="text-caption font-semibold uppercase tracking-wider text-secondary">
                Hospital Contact Channels
              </span>
              <h2 className="text-h2 font-bold tracking-tight text-text">
                Reach Our Care Team
              </h2>
              <p className="text-body text-text-muted leading-relaxed">
                Connect with our front desk, specialist clinics, or patient
                coordination services via phone, email, or in person at our
                Addis Ababa medical campus.
              </p>
            </div>

            {/* Structured ContactInfo Block */}
            <div className="rounded-xl bg-surface border border-border p-6 sm:p-8 space-y-6 shadow-xs">
              <h3 className="text-h4 font-bold text-text border-b border-border pb-3">
                Main Contact Points
              </h3>

              <ContactInfo
                address={HOSPITAL_INFO.address}
                phone={HOSPITAL_INFO.generalPhone}
                email={HOSPITAL_INFO.email}
                hours={HOSPITAL_INFO.hours}
                emergency={HOSPITAL_INFO.emergencyPhone}
              />
            </div>

            {/* Small Emergency Banner (Not competing with form) */}
            <div className="rounded-xl bg-emergency-light/60 border border-emergency/30 p-5 space-y-3">
              <div className="flex items-center gap-2 text-emergency font-bold text-small">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span>Experiencing a Medical Emergency?</span>
              </div>
              <p className="text-caption text-text leading-relaxed">
                Do not wait for a contact form reply. For acute trauma, chest
                pain, or severe illness, call our 24/7 hotline directly or come
                to Gate 1.
              </p>
              <Button
                asChild
                size="sm"
                variant="emergency"
                className="w-full justify-center"
              >
                <a
                  href={`tel:${HOSPITAL_INFO.emergencyPhone.replace(/\s/g, "")}`}
                >
                  <PhoneCall className="w-4 h-4" />
                  Call Emergency: {HOSPITAL_INFO.emergencyPhone}
                </a>
              </Button>
            </div>
          </div>

          {/* Right Column: Interactive Validated Contact Form */}
          <div className="lg:col-span-7">
            <div className="rounded-xl bg-surface border border-border p-6 sm:p-10 shadow-xs space-y-6">
              <div className="space-y-2 border-b border-border pb-4">
                <h3 className="text-h3 font-bold text-text">
                  Send Us a Message
                </h3>
                <p className="text-small text-text-muted">
                  Fill out the form below and our patient care team will respond
                  promptly within 24 hours.
                </p>
              </div>

              {submitSuccess && (
                <Alert variant="success" className="animate-in fade-in-50">
                  <CheckCircle2 className="h-5 w-5" />
                  <AlertTitle>Message Sent Successfully</AlertTitle>
                  <AlertDescription>
                    Thank you for contacting Medhen Beza Hospital. Our team has
                    received your message and will get back to you shortly.
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="fullName"
                    className="text-small font-semibold text-text block"
                  >
                    Full Name <span className="text-emergency">*</span>
                  </label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="e.g. Almaz Bekele"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={errors.fullName ? "border-emergency focus-visible:ring-emergency" : ""}
                    required
                  />
                  {errors.fullName && (
                    <p className="text-caption text-emergency font-medium">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Email & Phone Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="email"
                      className="text-small font-semibold text-text block"
                    >
                      Email Address <span className="text-emergency">*</span>
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="almaz@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={errors.email ? "border-emergency focus-visible:ring-emergency" : ""}
                      required
                    />
                    {errors.email && (
                      <p className="text-caption text-emergency font-medium">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="phone"
                      className="text-small font-semibold text-text block"
                    >
                      Phone Number <span className="text-emergency">*</span>
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+251 911 000 000"
                      value={formData.phone}
                      onChange={handleChange}
                      className={errors.phone ? "border-emergency focus-visible:ring-emergency" : ""}
                      required
                    />
                    {errors.phone && (
                      <p className="text-caption text-emergency font-medium">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Department & Subject */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="department"
                      className="text-small font-semibold text-text block"
                    >
                      Department / Service
                    </label>
                    <select
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full min-h-[44px] h-11 sm:min-h-[40px] sm:h-10 rounded-md border border-border bg-background px-3 text-base sm:text-small text-text focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                    >
                      <option value="General Inquiries">General Inquiries</option>
                      {MOCK_DEPARTMENTS_DETAILED.map((d) => (
                        <option key={d.slug} value={d.name}>
                          {d.name} Department
                        </option>
                      ))}
                      <option value="Billing & Insurance">Billing & Insurance</option>
                      <option value="Careers / HR">Careers / HR</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="subject"
                      className="text-small font-semibold text-text block"
                    >
                      Subject / Topic
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      placeholder="e.g. Appointment inquiry"
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="message"
                    className="text-small font-semibold text-text block"
                  >
                    Your Message <span className="text-emergency">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="How can our clinical or administrative team assist you?"
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full rounded-md border border-border bg-background p-3 text-base sm:text-small text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.message ? "border-emergency focus:ring-emergency" : ""
                    }`}
                    required
                  />
                  {errors.message && (
                    <p className="text-caption text-emergency font-medium">
                      {errors.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto min-h-[48px] h-12 sm:h-14 px-8 font-bold justify-center"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? "Sending Message..." : "Submit Message"}
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* 3. Full-Width Hospital Map Section */}
        <section className="space-y-4 pt-10 border-t border-border">
          <div className="space-y-1">
            <span className="text-caption font-semibold uppercase tracking-wider text-secondary">
              Campus Location
            </span>
            <h3 className="text-h2 font-bold text-text tracking-tight">
              Visit Us in Addis Ababa
            </h3>
            <p className="text-small text-text-muted">
              Centrally located on Bole Road with multi-level secure parking
              and dedicated emergency drop-off lanes.
            </p>
          </div>

          <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-xl overflow-hidden border border-border bg-surface shadow-xs">
            <iframe
              title="Medhen Beza Hospital Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126115.1154562092!2d38.7042646274472!3d8.9806034!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85cef5ab402d%3A0x8467b6b037a24d49!2sAddis%20Ababa%2C%20Ethiopia!5e0!3m2!1sen!2set!4v1700000000000!5m2!1sen!2set"
              className="w-full h-full border-0 absolute inset-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>
      </main>
    </div>
  );
}
