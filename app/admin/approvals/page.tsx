"use client";

import React, { useState } from "react";
import { useAdminRole } from "@/components/admin/role-context";
import { StatusBadge } from "@/components/admin/status-badge";
import { RoleGuard } from "@/components/admin/role-guard";
import { ContentStatusType } from "@/lib/admin/types";
import {
  CheckCircle2,
  XCircle,
  Eye,
  Send,
  Globe,
  Clock,
  AlertCircle,
  FileCheck,
  Filter,
  User,
  Calendar,
  Building2,
  Stethoscope,
  Briefcase,
  Newspaper,
  Shield,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface ApprovalItem {
  id: string;
  title: string;
  contentType: "Doctor" | "News" | "Career" | "Service" | "Facility" | "Event";
  department: string;
  submittedBy: string;
  submitterRole: string;
  submittedAt: string;
  status: ContentStatusType;
  summary: string;
  rejectionReason?: string;
}

const INITIAL_APPROVAL_ITEMS: ApprovalItem[] = [
  {
    id: "app-101",
    title: "Dr. Meron Haile — Senior Cardiologist & Interventional Specialist",
    contentType: "Doctor",
    department: "Cardiology & Vascular Center",
    submittedBy: "Dr. Bethlehem Tadesse",
    submitterRole: "Medical Director",
    submittedAt: "Sep 11, 2026, 10:45 AM",
    status: "PENDING_APPROVAL",
    summary: "New full-time senior cardiologist profile with overseas fellowship credentials and clinic schedule.",
  },
  {
    id: "app-102",
    title: "Head of Intensive Care Unit (ICU) Critical Care Nurse",
    contentType: "Career",
    department: "Critical Care & ICU",
    submittedBy: "Hanna Worku",
    submitterRole: "HR Staff",
    submittedAt: "Sep 11, 2026, 09:15 AM",
    status: "PENDING_APPROVAL",
    summary: "Urgent recruitment posting for senior ICU nurse with 5+ years critical care experience. Application deadline Oct 15.",
  },
  {
    id: "app-103",
    title: "Hospital Commissioning: 128-Slice Low-Dose CT Scanner",
    contentType: "News",
    department: "Diagnostic Radiology",
    submittedBy: "Abel Girma",
    submitterRole: "Content Staff",
    submittedAt: "Sep 10, 2026, 04:30 PM",
    status: "PENDING_APPROVAL",
    summary: "Press release announcing new cutting-edge imaging technology installed in the hospital radiology wing.",
  },
  {
    id: "app-104",
    title: "Minimally Invasive Endoscopic Spine Surgery Protocol",
    contentType: "Service",
    department: "Orthopedics & Neurosurgery",
    submittedBy: "Dr. Bethlehem Tadesse",
    submitterRole: "Medical Director",
    submittedAt: "Sep 09, 2026, 02:00 PM",
    status: "APPROVED",
    summary: "Service overview page details for spine surgery patients with post-op care guidance.",
  },
  {
    id: "app-105",
    title: "Annual Community Hypertension & Diabetes Screening Day",
    contentType: "Event",
    department: "Community Outreach",
    submittedBy: "Abel Girma",
    submitterRole: "Content Staff",
    submittedAt: "Sep 08, 2026, 11:20 AM",
    status: "PUBLISHED",
    summary: "Public health outreach event on hospital campus with free blood pressure and glucose checks.",
  },
  {
    id: "app-106",
    title: "Junior Laboratory Technician Vacancy",
    contentType: "Career",
    department: "Clinical Laboratory",
    submittedBy: "Hanna Worku",
    submitterRole: "HR Staff",
    submittedAt: "Sep 07, 2026, 01:15 PM",
    status: "REJECTED",
    rejectionReason: "Please update the required license qualifications to match the revised Ministry of Health 2026 standards.",
    summary: "Entry-level position for medical laboratory science degree holders.",
  },
];

export default function ApprovalsPage() {
  const { currentRole, currentUser, canApprove, canPublish } = useAdminRole();
  const [items, setItems] = useState<ApprovalItem[]>(INITIAL_APPROVAL_ITEMS);
  const [activeTab, setActiveTab] = useState<string>("PENDING_APPROVAL");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("ALL");
  const [reviewModalItem, setReviewModalItem] = useState<ApprovalItem | null>(null);
  const [rejectModalItem, setRejectModalItem] = useState<ApprovalItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleApprove = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "APPROVED" as ContentStatusType } : item))
    );
    setReviewModalItem(null);
  };

  const handlePublish = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "PUBLISHED" as ContentStatusType } : item))
    );
    setReviewModalItem(null);
  };

  const handleConfirmReject = () => {
    if (!rejectModalItem) return;
    setItems((prev) =>
      prev.map((item) =>
        item.id === rejectModalItem.id
          ? {
              ...item,
              status: "REJECTED" as ContentStatusType,
              rejectionReason: rejectionReason || "Rejected by Hospital Director. Revisions needed.",
            }
          : item
      )
    );
    setRejectModalItem(null);
    setRejectionReason("");
    setReviewModalItem(null);
  };

  // Filter items based on active tab & type
  const tabItems = items.filter((item) => {
    const matchesTab = item.status === activeTab;
    const matchesType = selectedTypeFilter === "ALL" || item.contentType === selectedTypeFilter;
    return matchesTab && matchesType;
  });

  const getTabCount = (status: ContentStatusType) => {
    return items.filter((i) => i.status === status).length;
  };

  const getTypeIcon = (type: ApprovalItem["contentType"]) => {
    switch (type) {
      case "Doctor":
        return Stethoscope;
      case "Career":
        return Briefcase;
      case "News":
        return Newspaper;
      case "Service":
        return Building2;
      default:
        return FileCheck;
    }
  };

  return (
    <RoleGuard
      allowedRoles={[
        "HOSPITAL_DIRECTOR",
        "MEDICAL_DIRECTOR",
        "HR_STAFF",
        "CONTENT_STAFF",
      ]}
    >
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-h3 font-bold text-text tracking-tight">
                {canApprove ? "Hospital Content Approval Queue" : "My Content Submission Status"}
              </h1>
              <span className="rounded-pill bg-primary-light px-2.5 py-0.5 text-xs font-semibold text-primary-dark border border-primary/20">
                Workflow Hub
              </span>
            </div>
            <p className="text-small text-text-muted mt-1">
              {canApprove
                ? "Hospital Director final approval and publishing gatekeeper for all medical and non-medical website content."
                : "Track the review, approval, and publishing progression of your department's submitted content."}
            </p>
          </div>
        </div>

        {/* Role Notice Banner */}
        {canApprove ? (
          <div className="rounded-lg border border-primary/20 bg-primary-light/40 p-4 text-xs text-primary-dark flex items-start gap-3">
            <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-text">Director Authority Active</p>
              <p className="text-text-muted mt-0.5">
                You have final approval authority. Approved items can be published immediately to make them live on the public website.
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-900 flex items-start gap-3">
            <Clock className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Submission Status Tracking Mode</p>
              <p className="text-amber-800 text-[11px] mt-0.5">
                Logged in as <strong>{currentUser.roleTitle}</strong>. As per hospital governance rules, content must be approved by the Hospital Director before going live.
              </p>
            </div>
          </div>
        )}

        {/* Main Tabs Container */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full space-y-4"
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface p-2 rounded-lg border border-border">
            {/* Tabs List */}
            <TabsList className="bg-background border border-border h-10 p-1">
              <TabsTrigger value="PENDING_APPROVAL" className="text-xs px-3">
                <Clock className="h-3.5 w-3.5 mr-1.5 text-amber-600" />
                Pending ({getTabCount("PENDING_APPROVAL")})
              </TabsTrigger>
              <TabsTrigger value="APPROVED" className="text-xs px-3">
                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-primary" />
                Approved ({getTabCount("APPROVED")})
              </TabsTrigger>
              <TabsTrigger value="REJECTED" className="text-xs px-3">
                <XCircle className="h-3.5 w-3.5 mr-1.5 text-emergency" />
                Rejected ({getTabCount("REJECTED")})
              </TabsTrigger>
              <TabsTrigger value="PUBLISHED" className="text-xs px-3">
                <Globe className="h-3.5 w-3.5 mr-1.5 text-emerald-600" />
                Published ({getTabCount("PUBLISHED")})
              </TabsTrigger>
            </TabsList>

            {/* Content Type Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-text-light" />
              <select
                value={selectedTypeFilter}
                onChange={(e) => setSelectedTypeFilter(e.target.value)}
                className="h-8 rounded-md border border-border bg-background px-2.5 text-xs text-text focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="ALL">All Content Types</option>
                <option value="Doctor">Doctors</option>
                <option value="News">News</option>
                <option value="Career">Careers</option>
                <option value="Service">Services</option>
                <option value="Facility">Facilities</option>
                <option value="Event">Events</option>
              </select>
            </div>
          </div>

          {/* Submissions List */}
          <div className="space-y-3">
            {tabItems.length === 0 ? (
              <div className="rounded-lg border border-border bg-surface p-12 text-center space-y-2">
                <FileCheck className="h-8 w-8 text-text-light mx-auto" />
                <p className="text-sm font-semibold text-text">
                  No items in {activeTab.replace("_", " ").toLowerCase()}
                </p>
                <p className="text-xs text-text-muted">
                  There are currently no submissions matching your active filter criteria.
                </p>
              </div>
            ) : (
              tabItems.map((item) => {
                const IconComponent = getTypeIcon(item.contentType);

                return (
                  <div
                    key={item.id}
                    className="rounded-lg border border-border bg-surface p-5 hover:border-primary/40 transition-all shadow-none space-y-4"
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1 rounded bg-background px-2 py-0.5 text-xs font-semibold text-text border border-border">
                            <IconComponent className="h-3.5 w-3.5 text-primary" />
                            {item.contentType}
                          </span>
                          <span className="text-xs text-text-light">•</span>
                          <span className="text-xs text-text-muted font-medium">
                            {item.department}
                          </span>
                          <StatusBadge status={item.status} size="sm" />
                        </div>

                        <h2 className="text-base font-bold text-text leading-snug">
                          {item.title}
                        </h2>
                      </div>

                      {/* Top Right: Actions */}
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setReviewModalItem(item)}
                          className="h-8 text-xs bg-surface"
                        >
                          <Eye className="h-3.5 w-3.5 text-text-muted" />
                          Review Details
                        </Button>

                        {/* Hospital Director Approval Actions */}
                        {canApprove && item.status === "PENDING_APPROVAL" && (
                          <>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleApprove(item.id)}
                              className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white border-0"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setRejectModalItem(item)}
                              className="h-8 text-xs text-emergency hover:bg-emergency-light"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                              Reject
                            </Button>
                          </>
                        )}

                        {canPublish && (item.status === "APPROVED" || item.status === "PENDING_APPROVAL") && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handlePublish(item.id)}
                            className="h-8 text-xs"
                          >
                            <Globe className="h-3.5 w-3.5" />
                            Publish Now
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Content Summary */}
                    <p className="text-xs text-text-muted leading-relaxed bg-background p-3 rounded-md border border-border">
                      {item.summary}
                    </p>

                    {/* Rejection Alert if present */}
                    {item.status === "REJECTED" && item.rejectionReason && (
                      <div className="rounded-md bg-emergency-light/60 border border-emergency/20 p-3 text-xs text-emergency-dark flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-emergency shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold">Rejection Feedback / Required Changes:</p>
                          <p className="mt-0.5">{item.rejectionReason}</p>
                        </div>
                      </div>
                    )}

                    {/* Submitter Details Meta */}
                    <div className="flex flex-wrap items-center justify-between text-xs text-text-light pt-2 border-t border-border gap-2">
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-text-muted" />
                        <span>
                          Submitted by <strong>{item.submittedBy}</strong> ({item.submitterRole})
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-text-muted" />
                        <span>{item.submittedAt}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Tabs>

        {/* Review & Approve Modal */}
        {reviewModalItem && (
          <Dialog open={!!reviewModalItem} onOpenChange={() => setReviewModalItem(null)}>
            <DialogContent className="max-w-2xl bg-surface p-0 overflow-hidden">
              <div className="p-6 border-b border-border bg-background">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-text-light px-2 py-0.5 rounded bg-surface border border-border">
                    {reviewModalItem.contentType} Review
                  </span>
                  <StatusBadge status={reviewModalItem.status} size="sm" />
                </div>
                <DialogTitle className="text-lg font-bold text-text">
                  {reviewModalItem.title}
                </DialogTitle>
                <DialogDescription className="text-xs text-text-muted mt-1">
                  Submitted by {reviewModalItem.submittedBy} ({reviewModalItem.submitterRole}) on {reviewModalItem.submittedAt}
                </DialogDescription>
              </div>

              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto text-xs">
                <div className="space-y-1">
                  <span className="font-semibold text-text">Department:</span>
                  <p className="text-text-muted">{reviewModalItem.department}</p>
                </div>

                <div className="space-y-1">
                  <span className="font-semibold text-text">Content Summary:</span>
                  <p className="text-text-muted bg-background p-3 rounded border border-border leading-relaxed">
                    {reviewModalItem.summary}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="font-semibold text-text">Clinical & Organizational Compliance:</span>
                  <div className="p-3 bg-emerald-50 text-emerald-800 rounded border border-emerald-200 space-y-1 text-[11px]">
                    <p className="font-semibold">✓ Verified Checklist:</p>
                    <p>• Medical specialty terminology verified</p>
                    <p>• Department head endorsement signed</p>
                    <p>• Photo/media asset copyrights cleared</p>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-border bg-background flex flex-col sm:flex-row items-center justify-between gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReviewModalItem(null)}
                  className="text-xs text-text-muted"
                >
                  Close
                </Button>

                <div className="flex items-center gap-2">
                  {canApprove && reviewModalItem.status === "PENDING_APPROVAL" && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setRejectModalItem(reviewModalItem);
                          setReviewModalItem(null);
                        }}
                        className="text-xs text-emergency hover:bg-emergency-light"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Reject Submission
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleApprove(reviewModalItem.id)}
                        className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Approve Content
                      </Button>
                    </>
                  )}

                  {canPublish && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handlePublish(reviewModalItem.id)}
                      className="text-xs"
                    >
                      <Globe className="h-3.5 w-3.5" />
                      Publish Live
                    </Button>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Reject Dialog with Reason Form */}
        {rejectModalItem && (
          <Dialog open={!!rejectModalItem} onOpenChange={() => setRejectModalItem(null)}>
            <DialogContent className="max-w-md bg-surface p-6">
              <DialogHeader>
                <DialogTitle className="text-base font-bold text-text flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-emergency" />
                  Reject Submission
                </DialogTitle>
                <DialogDescription className="text-xs text-text-muted">
                  Provide constructive feedback for {rejectModalItem.submittedBy} explaining why this item was returned.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 my-4">
                <p className="text-xs font-semibold text-text">
                  Item: <span className="font-normal text-text-muted">{rejectModalItem.title}</span>
                </p>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text">
                    Rejection Feedback / Action Required:
                  </label>
                  <textarea
                    rows={4}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="e.g. Please update the salary grade and verify doctor specialty certification details..."
                    className="w-full rounded-md border border-border bg-background p-2.5 text-xs text-text focus:outline-none focus:ring-2 focus:ring-emergency"
                  />
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setRejectModalItem(null)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleConfirmReject}
                  className="text-xs bg-emergency hover:bg-emergency-dark text-white shadow-emergency"
                >
                  Confirm Rejection
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </RoleGuard>
  );
}
