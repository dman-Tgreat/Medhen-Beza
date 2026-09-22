"use client";

import React, { useState, useEffect } from "react";
import { RoleGuard } from "@/components/admin/role-guard";
import {
  Settings,
  Save,
  Shield,
  Phone,
  Globe,
  Bell,
  Check,
  Database,
  Loader2,
  LayoutTemplate,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { siteSettingsSchema } from "@/lib/validation/schemas";
import {
  getAdminSettingsAction,
  saveSiteSettingsAction,
} from "@/lib/actions/settings";

export default function SettingsAdminPage() {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("contact");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Hospital Contact Info
  const [hospitalName, setHospitalName] = useState("Medhen Beza Specialized Hospital");
  const [phoneMain, setPhoneMain] = useState("+251 11 654 3210");
  const [phoneEmergency, setPhoneEmergency] = useState("+251 11 654 9999");
  const [ambulancePhone, setAmbulancePhone] = useState("+251 911 000 999");
  const [emailGeneral, setEmailGeneral] = useState("info@medhenbeza.com");
  const [address, setAddress] = useState("Bole Sub-City, Next to Millennium Hall, Addis Ababa, Ethiopia");
  const [emergencyGate, setEmergencyGate] = useState("Gate 1 (Dedicated Ambulance & Emergency Driveway), Bole Road");
  const [emergencyHours, setEmergencyHours] = useState("Open 24 Hours · 7 Days a Week · All Holidays");
  const [visitingHours, setVisitingHours] = useState("Mon - Sun: 06:00 - 08:00, 12:00 - 14:00, 17:00 - 19:30");

  // Public Homepage & Content
  const [heroHeadline, setHeroHeadline] = useState("Compassionate care.");
  const [heroHeadlineAccent, setHeroHeadlineAccent] = useState("Trusted healthcare.");
  const [heroSupportingText, setHeroSupportingText] = useState("Close to you, committed to you — exceptional clinical care delivered by specialists who put patients first.");
  const [statSpecialists, setStatSpecialists] = useState("50+");
  const [statEmergency, setStatEmergency] = useState("24 / 7");
  const [statDepartments, setStatDepartments] = useState("15+");
  const [hospitalIntroTitle, setHospitalIntroTitle] = useState("Trusted care for every stage of life");

  // CMS Workflow Settings
  const [requireDirectorApproval, setRequireDirectorApproval] = useState(true);
  const [autoArchiveDays, setAutoArchiveDays] = useState("90");
  const [enableEmailNotifications, setEnableEmailNotifications] = useState(true);

  // SEO & Meta Defaults
  const [metaTitle, setMetaTitle] = useState("Medhen Beza Hospital | Compassionate Care & Advanced Medicine");
  const [metaDescription, setMetaDescription] = useState("Leading specialized tertiary hospital in Addis Ababa providing 24/7 emergency response, cardiology, and surgical care.");

  // Load from DB on mount
  useEffect(() => {
    async function loadSettings() {
      setLoading(true);
      const res = await getAdminSettingsAction();
      if (res.data) {
        const s = res.data;
        if (s.hospital_name) setHospitalName(s.hospital_name);
        if (s.hospital_phone) setPhoneMain(s.hospital_phone);
        if (s.hospital_emergency) setPhoneEmergency(s.hospital_emergency);
        if (s.ambulance_phone) setAmbulancePhone(s.ambulance_phone);
        if (s.hospital_email) setEmailGeneral(s.hospital_email);
        if (s.hospital_address) setAddress(s.hospital_address);
        if (s.emergency_gate) setEmergencyGate(s.emergency_gate);
        if (s.emergency_hours) setEmergencyHours(s.emergency_hours);
        if (s.visiting_hours) setVisitingHours(s.visiting_hours);

        if (s.hero_headline) setHeroHeadline(s.hero_headline);
        if (s.hero_headline_accent) setHeroHeadlineAccent(s.hero_headline_accent);
        if (s.hero_supporting_text) setHeroSupportingText(s.hero_supporting_text);
        if (s.stat_specialists) setStatSpecialists(s.stat_specialists);
        if (s.stat_emergency) setStatEmergency(s.stat_emergency);
        if (s.stat_departments) setStatDepartments(s.stat_departments);
        if (s.hospital_intro_title) setHospitalIntroTitle(s.hospital_intro_title);

        if (s.require_director_approval !== undefined) setRequireDirectorApproval(s.require_director_approval === "true");
        if (s.enable_email_notifications !== undefined) setEnableEmailNotifications(s.enable_email_notifications === "true");
        if (s.auto_archive_days) setAutoArchiveDays(s.auto_archive_days);

        if (s.seo_title) setMetaTitle(s.seo_title);
        if (s.seo_description) setMetaDescription(s.seo_description);
      }
      setLoading(false);
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    setFieldErrors({});
    setIsSaving(true);
    setSavedSuccess(false);

    const payload: Record<string, string> = {
      hospital_name: hospitalName,
      hospital_phone: phoneMain,
      hospital_emergency: phoneEmergency,
      ambulance_phone: ambulancePhone,
      hospital_email: emailGeneral,
      hospital_address: address,
      emergency_gate: emergencyGate,
      emergency_hours: emergencyHours,
      visiting_hours: visitingHours,

      hero_headline: heroHeadline,
      hero_headline_accent: heroHeadlineAccent,
      hero_supporting_text: heroSupportingText,
      stat_specialists: statSpecialists,
      stat_emergency: statEmergency,
      stat_departments: statDepartments,
      hospital_intro_title: hospitalIntroTitle,

      require_director_approval: String(requireDirectorApproval),
      enable_email_notifications: String(enableEmailNotifications),
      auto_archive_days: autoArchiveDays,

      seo_title: metaTitle,
      seo_description: metaDescription,
    };

    // Client-side validation using Zod
    const validationResult = siteSettingsSchema.safeParse(payload);
    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      for (const issue of validationResult.error.issues) {
        const field = issue.path[0]?.toString() || "form";
        if (!errors[field]) errors[field] = issue.message;
      }
      setFieldErrors(errors);
      const firstError = validationResult.error.issues[0]?.message || "Please fix validation errors.";
      setSaveError(firstError);
      setIsSaving(false);

      if (
        errors.hospital_name ||
        errors.hospital_phone ||
        errors.hospital_emergency ||
        errors.ambulance_phone ||
        errors.hospital_email ||
        errors.hospital_address
      ) {
        setActiveTab("contact");
      } else if (errors.auto_archive_days) {
        setActiveTab("workflow");
      }
      return;
    }

    const res = await saveSiteSettingsAction(payload);
    setIsSaving(false);

    if (res.error) {
      setSaveError(res.error);
      if (res.fieldErrors) setFieldErrors(res.fieldErrors);
    } else {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-small text-text-muted">Loading live database configuration...</p>
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={["HOSPITAL_DIRECTOR", "SYSTEM_ADMIN"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-h3 font-bold text-text tracking-tight">
              Hospital & CMS Configuration
            </h1>
            <p className="text-small text-text-muted mt-1">
              Configure global hospital parameters, emergency contact lines, workflow gates, and SEO defaults stored directly in PostgreSQL.
            </p>
          </div>

          {savedSuccess && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold animate-fade-in">
              <Check className="h-4 w-4" />
              Settings saved and published!
            </div>
          )}
        </div>

        {saveError && (
          <Alert variant="emergency">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Configuration Error</AlertTitle>
            <AlertDescription>{saveError}</AlertDescription>
          </Alert>
        )}

        {/* Settings Tabs */}
        <form onSubmit={handleSave}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="bg-surface border border-border h-11 p-1">
              <TabsTrigger value="contact" className="text-xs">
                <Phone className="h-3.5 w-3.5 mr-1.5 text-primary" />
                Hospital Contact & Emergency
              </TabsTrigger>
              <TabsTrigger value="content" className="text-xs">
                <LayoutTemplate className="h-3.5 w-3.5 mr-1.5 text-blue-600" />
                Homepage & Public Copy
              </TabsTrigger>
              <TabsTrigger value="workflow" className="text-xs">
                <Shield className="h-3.5 w-3.5 mr-1.5 text-secondary-dark" />
                Approval Workflows & RBAC
              </TabsTrigger>
              <TabsTrigger value="seo" className="text-xs">
                <Globe className="h-3.5 w-3.5 mr-1.5 text-amber-600" />
                SEO & Metadata
              </TabsTrigger>
              <TabsTrigger value="system" className="text-xs">
                <Database className="h-3.5 w-3.5 mr-1.5 text-slate-700" />
                Infrastructure & Media
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Hospital Contact */}
            <TabsContent value="contact" className="rounded-lg border border-border bg-surface p-6 space-y-4">
              <h2 className="text-base font-bold text-text">Hospital Information & Public Directory Lines</h2>
              <p className="text-xs text-text-muted">
                These contact lines and addresses populate headers, footers, emergency banners, and contact forms across the public website.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text">
                    Official Hospital Name <span className="text-emergency">*</span>
                  </label>
                  <Input
                    value={hospitalName}
                    onChange={(e) => {
                      setHospitalName(e.target.value);
                      if (fieldErrors.hospital_name) setFieldErrors({ ...fieldErrors, hospital_name: "" });
                    }}
                    className={`text-xs h-9 bg-background ${
                      fieldErrors.hospital_name ? "border-emergency text-emergency" : ""
                    }`}
                  />
                  {fieldErrors.hospital_name && (
                    <p className="text-[11px] text-emergency font-medium">{fieldErrors.hospital_name}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text">
                    General Inquiries Email <span className="text-emergency">*</span>
                  </label>
                  <Input
                    type="email"
                    value={emailGeneral}
                    onChange={(e) => {
                      setEmailGeneral(e.target.value);
                      if (fieldErrors.hospital_email) setFieldErrors({ ...fieldErrors, hospital_email: "" });
                    }}
                    className={`text-xs h-9 bg-background ${
                      fieldErrors.hospital_email ? "border-emergency text-emergency" : ""
                    }`}
                  />
                  {fieldErrors.hospital_email && (
                    <p className="text-[11px] text-emergency font-medium">{fieldErrors.hospital_email}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <PhoneInput
                    label="Main Telephone Switchboard"
                    value={phoneMain}
                    onChange={(val) => {
                      setPhoneMain(val);
                      if (fieldErrors.hospital_phone) setFieldErrors({ ...fieldErrors, hospital_phone: "" });
                    }}
                    error={fieldErrors.hospital_phone}
                    helperText="Primary hospital line (e.g. +251 11 654 3210 or 011 654 3210)."
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <PhoneInput
                    label="Emergency Hotline Number (24/7)"
                    value={phoneEmergency}
                    onChange={(val) => {
                      setPhoneEmergency(val);
                      if (fieldErrors.hospital_emergency) setFieldErrors({ ...fieldErrors, hospital_emergency: "" });
                    }}
                    allowShortCode
                    error={fieldErrors.hospital_emergency}
                    helperText="Critical trauma line (e.g. +251 11 654 9999 or 911 shortcode)."
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <PhoneInput
                    label="Ambulance Dispatch Line"
                    value={ambulancePhone}
                    onChange={(val) => {
                      setAmbulancePhone(val);
                      if (fieldErrors.ambulance_phone) setFieldErrors({ ...fieldErrors, ambulance_phone: "" });
                    }}
                    allowShortCode
                    error={fieldErrors.ambulance_phone}
                    helperText="Direct dispatch desk for emergency ambulance vehicles."
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text">Emergency Gate & Directions</label>
                  <Input
                    value={emergencyGate}
                    onChange={(e) => setEmergencyGate(e.target.value)}
                    className="text-xs h-9 bg-background"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text">Emergency Operating Hours</label>
                  <Input
                    value={emergencyHours}
                    onChange={(e) => setEmergencyHours(e.target.value)}
                    className="text-xs h-9 bg-background"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text">General Visiting Hours</label>
                  <Input
                    value={visitingHours}
                    onChange={(e) => setVisitingHours(e.target.value)}
                    className="text-xs h-9 bg-background"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-text">Hospital Physical Campus Address</label>
                  <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="text-xs h-9 bg-background"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Tab 2: Homepage & Public Copy */}
            <TabsContent value="content" className="rounded-lg border border-border bg-surface p-6 space-y-4">
              <h2 className="text-base font-bold text-text">Public Homepage Content & Hero Settings</h2>
              <p className="text-xs text-text-muted">
                Administer hero copy, highlight counters, and hospital introduction paragraphs displayed on the homepage.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text">Hero Main Headline</label>
                  <Input
                    value={heroHeadline}
                    onChange={(e) => setHeroHeadline(e.target.value)}
                    className="text-xs h-9 bg-background"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text">Hero Accent Headline</label>
                  <Input
                    value={heroHeadlineAccent}
                    onChange={(e) => setHeroHeadlineAccent(e.target.value)}
                    className="text-xs h-9 bg-background"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-text">Hero Supporting Description</label>
                  <textarea
                    rows={2}
                    value={heroSupportingText}
                    onChange={(e) => setHeroSupportingText(e.target.value)}
                    className="w-full rounded-md border border-border bg-background p-2.5 text-xs text-text focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text">Stat: Specialists Counter</label>
                  <Input
                    value={statSpecialists}
                    onChange={(e) => setStatSpecialists(e.target.value)}
                    className="text-xs h-9 bg-background"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text">Stat: Emergency Availability</label>
                  <Input
                    value={statEmergency}
                    onChange={(e) => setStatEmergency(e.target.value)}
                    className="text-xs h-9 bg-background"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text">Stat: Clinical Departments</label>
                  <Input
                    value={statDepartments}
                    onChange={(e) => setStatDepartments(e.target.value)}
                    className="text-xs h-9 bg-background"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text">Intro Section Title</label>
                  <Input
                    value={hospitalIntroTitle}
                    onChange={(e) => setHospitalIntroTitle(e.target.value)}
                    className="text-xs h-9 bg-background"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Tab 3: Workflow & Approval Settings */}
            <TabsContent value="workflow" className="rounded-lg border border-border bg-surface p-6 space-y-4">
              <h2 className="text-base font-bold text-text">Editorial Approval Governance</h2>
              <p className="text-xs text-text-muted">
                Configure content stage controls and approval rules.
              </p>

              <div className="space-y-4 pt-2 text-xs">
                <div className="flex items-center justify-between p-4 rounded-md border border-border bg-background">
                  <div>
                    <span className="font-semibold text-text block">Enforce Hospital Director Final Approval</span>
                    <span className="text-text-muted text-[11px]">
                      When enabled, clinical and non-clinical submissions must receive Director sign-off before publishing.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={requireDirectorApproval}
                    onChange={(e) => setRequireDirectorApproval(e.target.checked)}
                    className="h-4 w-4 text-primary rounded border-border"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-md border border-border bg-background">
                  <div>
                    <span className="font-semibold text-text block">Email Notifications on Submissions</span>
                    <span className="text-text-muted text-[11px]">
                      Send alert email to Hospital Director when a new item enters Pending Approval status.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableEmailNotifications}
                    onChange={(e) => setEnableEmailNotifications(e.target.checked)}
                    className="h-4 w-4 text-primary rounded border-border"
                  />
                </div>

                <div className="space-y-1.5 max-w-xs">
                  <label className="text-xs font-semibold text-text">Auto-Archive Days for Outdated Content</label>
                  <Input
                    type="number"
                    value={autoArchiveDays}
                    onChange={(e) => {
                      setAutoArchiveDays(e.target.value);
                      if (fieldErrors.auto_archive_days) setFieldErrors({ ...fieldErrors, auto_archive_days: "" });
                    }}
                    className={`text-xs h-9 bg-background ${
                      fieldErrors.auto_archive_days ? "border-emergency text-emergency" : ""
                    }`}
                  />
                  {fieldErrors.auto_archive_days && (
                    <p className="text-[11px] text-emergency font-medium">{fieldErrors.auto_archive_days}</p>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Tab 4: SEO */}
            <TabsContent value="seo" className="rounded-lg border border-border bg-surface p-6 space-y-4">
              <h2 className="text-base font-bold text-text">Default Search Engine Optimization (SEO)</h2>
              <p className="text-xs text-text-muted">
                Fallback titles and open-graph descriptions for public website pages.
              </p>

              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text">Default Site Title</label>
                  <Input
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    className="text-xs h-9 bg-background"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text">Default Meta Description</label>
                  <textarea
                    rows={3}
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    className="w-full rounded-md border border-border bg-background p-2.5 text-xs text-text focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Tab 5: System / Storage */}
            <TabsContent value="system" className="rounded-lg border border-border bg-surface p-6 space-y-4">
              <h2 className="text-base font-bold text-text">Infrastructure & Storage Configuration</h2>
              <p className="text-xs text-text-muted">
                Database connection and media limits status.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                <div className="p-3 bg-background rounded-md border border-border space-y-1">
                  <span className="font-semibold text-text">Database Engine</span>
                  <p className="text-text-muted font-mono">PostgreSQL 16 (Prisma ORM connected)</p>
                </div>
                <div className="p-3 bg-background rounded-md border border-border space-y-1">
                  <span className="font-semibold text-text">Media Provider & Limits</span>
                  <p className="text-text-muted font-mono">Cloudinary CDN (100MB video/image upload limit enabled)</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              variant="primary"
              size="default"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving Configuration...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Configuration Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </RoleGuard>
  );
}
