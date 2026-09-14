"use client";

import React, { useState } from "react";
import { RoleGuard } from "@/components/admin/role-guard";
import { Settings, Save, Shield, Phone, Globe, Bell, Check, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function SettingsAdminPage() {
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Hospital Contact Info
  const [hospitalName, setHospitalName] = useState("Medhen Beza Specialized Hospital");
  const [phoneMain, setPhoneMain] = useState("+251 11 654 3210");
  const [phoneEmergency, setPhoneEmergency] = useState("+251 11 654 9999");
  const [emailGeneral, setEmailGeneral] = useState("info@medhenbeza.com");
  const [address, setAddress] = useState("Bole Sub-City, Next to Millennium Hall, Addis Ababa, Ethiopia");

  // CMS Workflow Settings
  const [requireDirectorApproval, setRequireDirectorApproval] = useState(true);
  const [autoArchiveDays, setAutoArchiveDays] = useState("90");
  const [enableEmailNotifications, setEnableEmailNotifications] = useState(true);

  // SEO & Meta Defaults
  const [metaTitle, setMetaTitle] = useState("Medhen Beza Hospital | Compassionate Care & Advanced Medicine");
  const [metaDescription, setMetaDescription] = useState("Leading specialized tertiary hospital in Addis Ababa providing 24/7 emergency response, cardiology, and surgical care.");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

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
              Configure global hospital parameters, emergency contact lines, workflow gates, and SEO defaults.
            </p>
          </div>

          {savedSuccess && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
              <Check className="h-4 w-4" />
              Settings saved successfully!
            </div>
          )}
        </div>

        {/* Settings Tabs */}
        <form onSubmit={handleSave}>
          <Tabs defaultValue="contact" className="space-y-4">
            <TabsList className="bg-surface border border-border h-11 p-1">
              <TabsTrigger value="contact" className="text-xs">
                <Phone className="h-3.5 w-3.5 mr-1.5 text-primary" />
                Hospital Contact & Emergency
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
                These contact lines and addresses populate headers, footers, and the emergency banner across the public website.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text">Official Hospital Name</label>
                  <Input
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    className="text-xs h-9 bg-background"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text">General Inquiries Email</label>
                  <Input
                    value={emailGeneral}
                    onChange={(e) => setEmailGeneral(e.target.value)}
                    className="text-xs h-9 bg-background"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text">Main Telephone Switchboard</label>
                  <Input
                    value={phoneMain}
                    onChange={(e) => setPhoneMain(e.target.value)}
                    className="text-xs h-9 bg-background font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-emergency flex items-center gap-1">
                    <span>Emergency Hotline Number (24/7)</span>
                  </label>
                  <Input
                    value={phoneEmergency}
                    onChange={(e) => setPhoneEmergency(e.target.value)}
                    className="text-xs h-9 bg-background font-mono border-emergency/40 text-emergency font-bold"
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

            {/* Tab 2: Workflow & Approval Settings */}
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
              </div>
            </TabsContent>

            {/* Tab 3: SEO */}
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

            {/* Tab 4: System / Storage */}
            <TabsContent value="system" className="rounded-lg border border-border bg-surface p-6 space-y-4">
              <h2 className="text-base font-bold text-text">Infrastructure & Storage Configuration</h2>
              <p className="text-xs text-text-muted">
                Cloudinary / S3 media connection and database pooling status.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                <div className="p-3 bg-background rounded-md border border-border space-y-1">
                  <span className="font-semibold text-text">Database Engine</span>
                  <p className="text-text-muted font-mono">PostgreSQL 16 (Prisma ORM)</p>
                </div>
                <div className="p-3 bg-background rounded-md border border-border space-y-1">
                  <span className="font-semibold text-text">Media Provider</span>
                  <p className="text-text-muted font-mono">Cloudinary CDN (Optimized WebP/MP4)</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end pt-4">
            <Button type="submit" variant="primary" size="default">
              <Save className="h-4 w-4" />
              Save Configuration Changes
            </Button>
          </div>
        </form>
      </div>
    </RoleGuard>
  );
}
