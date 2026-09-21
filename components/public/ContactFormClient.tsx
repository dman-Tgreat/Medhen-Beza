"use client";

import * as React from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  PhoneCall,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HOSPITAL_INFO } from "@/lib/constants";
import type { DepartmentDetailData } from "@/lib/mock-data";
import { submitContactMessageAction } from "@/lib/actions/contact";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  department: string;
  subject: string;
  message: string;
}

export function ContactFormClient({
  departments,
}: {
  departments: DepartmentDetailData[];
}) {
  const [formData, setFormData] = React.useState<ContactFormData>({
    fullName: "",
    email: "",
    phone: "",
    department: "General Inquiries",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);
    const result = await submitContactMessageAction(new FormData(e.currentTarget));
    setIsSubmitting(false);
    if (result.error) {
      setSubmitError(result.error);
      return;
    }
    if (result.success) {
      setSubmitSuccess(true);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        department: "General Inquiries",
        subject: "",
        message: "",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-surface rounded-3xl border border-border p-6 sm:p-10 shadow-sm space-y-6">
          <div className="space-y-2">
            <h2 className="text-h3 font-bold text-text">Send Us an Inquiry</h2>
            <p className="text-small text-text-muted">
              Have a question about clinical treatments, consultant availability, or hospital services? Fill out the form and our patient care team will get back to you promptly.
            </p>
          </div>

          {submitSuccess ? (
            <div className="rounded-2xl bg-teal-50 border border-teal-200 p-6 text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-h4 font-bold text-teal-900">Message Dispatched Successfully</h3>
              <p className="text-small text-teal-800 max-w-md mx-auto">
                Thank you for contacting Medhen Beza Hospital. Our admissions & medical coordinator will review your request and reach out within 24 hours.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setSubmitSuccess(false)}
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input id="website" name="website" tabIndex={-1} autoComplete="off" />
              </div>
              {submitError && (
                <Alert variant="emergency">
                  <AlertTitle>Unable to send inquiry</AlertTitle>
                  <AlertDescription>{submitError}</AlertDescription>
                </Alert>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text">
                    Your Full Name <span className="text-emergency">*</span>
                  </label>
                  <Input
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Abebe Bekele"
                    className="bg-background h-10 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text">
                    Email Address <span className="text-emergency">*</span>
                  </label>
                  <Input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="bg-background h-10 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text">Phone Number</label>
                  <Input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+251 91 123 4567"
                    className="bg-background h-10 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text">Department / Unit</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full h-10 rounded-md border border-border bg-background px-3 text-xs text-text focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="General Inquiries">General Inquiries</option>
                    {departments.map((d) => (
                      <option key={d.slug} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text">
                  Subject / Topic <span className="text-emergency">*</span>
                </label>
                <Input
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Cardiology consultation appointment inquiry"
                  className="bg-background h-10 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text">
                  Message Details <span className="text-emergency">*</span>
                </label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Please describe your inquiry or appointment requirements in detail..."
                  className="w-full rounded-md border border-border bg-background p-3 text-xs text-text focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full sm:w-auto h-11 px-8 text-xs font-bold"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Sending Inquiry...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Inquiry to Care Team
                  </>
                )}
              </Button>
            </form>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-surface rounded-3xl border border-border p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-h4 font-bold text-text">Direct Contact Information</h3>

            <div className="space-y-4 text-small">
              <div className="flex items-start gap-3.5">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-text block">Hospital Location</span>
                  <span className="text-text-muted">{HOSPITAL_INFO.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-text block">Main Helpdesk</span>
                  <a href={`tel:${HOSPITAL_INFO.generalPhone}`} className="text-primary font-medium hover:underline">
                    {HOSPITAL_INFO.generalPhone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-text block">Inquiry Email</span>
                  <a href={`mailto:${HOSPITAL_INFO.email}`} className="text-primary font-medium hover:underline">
                    {HOSPITAL_INFO.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-text block">Outpatient Hours</span>
                  <span className="text-text-muted">{HOSPITAL_INFO.hours}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <div className="rounded-xl bg-red-50 border border-red-200 p-4 space-y-2">
                <span className="text-xs font-bold text-red-900 block flex items-center gap-1.5">
                  <PhoneCall className="h-4 w-4 text-emergency" />
                  24/7 Emergency Line
                </span>
                <p className="text-xs text-red-800">
                  For immediate acute emergencies, call our dedicated triage desk directly:
                </p>
                <a
                  href={`tel:${HOSPITAL_INFO.emergencyPhone}`}
                  className="inline-block text-base font-bold text-emergency hover:underline"
                >
                  {HOSPITAL_INFO.emergencyPhone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
