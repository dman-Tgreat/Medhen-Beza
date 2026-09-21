"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useAdminRole } from "@/components/admin/role-context";
import { StatusBadge } from "@/components/admin/status-badge";
import { RoleGuard } from "@/components/admin/role-guard";
import {
  CheckCircle2, XCircle, Eye, Globe, Clock, AlertCircle,
  FileCheck, Filter, User, Calendar, Building2, Stethoscope,
  Briefcase, Newspaper, Shield, MessageSquare, BookOpen, Image, Archive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import type { ApprovalQueueItem } from "@/lib/queries/admin";
import {
  approveContentAction,
  rejectContentAction,
  publishContentAction,
  archiveContentAction,
  revertToDraftAction,
} from "@/lib/actions/transitions";

interface Props {
  pending: ApprovalQueueItem[];
  approved: ApprovalQueueItem[];
  rejected: ApprovalQueueItem[];
  published: ApprovalQueueItem[];
  currentUserId: string;
}

function getTypeIcon(contentType: string) {
  switch (contentType) {
    case "Doctor": return Stethoscope;
    case "Career": return Briefcase;
    case "News": return Newspaper;
    case "Department": return Building2;
    case "Service": return Building2;
    case "Gallery": return Image;
    case "Page": return BookOpen;
    case "FAQ": return MessageSquare;
    default: return FileCheck;
  }
}

type Tab = "PENDING_APPROVAL" | "APPROVED" | "REJECTED" | "PUBLISHED";

export function ApprovalsClient({ pending, approved, rejected, published, currentUserId }: Props) {
  const { canApprove, canPublish, currentUser } = useAdminRole();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<Tab>("PENDING_APPROVAL");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("ALL");
  const [reviewModalItem, setReviewModalItem] = useState<ApprovalQueueItem | null>(null);
  const [rejectModalItem, setRejectModalItem] = useState<ApprovalQueueItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

  const tabMap: Record<Tab, ApprovalQueueItem[]> = {
    PENDING_APPROVAL: pending,
    APPROVED: approved,
    REJECTED: rejected,
    PUBLISHED: published,
  };

  const tabItems = tabMap[activeTab].filter(
    (item) => selectedTypeFilter === "ALL" || item.contentType === selectedTypeFilter
  );

  function getCount(tab: Tab) { return tabMap[tab].length; }

  async function handleApprove(item: ApprovalQueueItem) {
    setActionError(null);
    startTransition(async () => {
      const res = await approveContentAction(item.contentType as any, item.id);
      if (!res.success) { setActionError(res.error ?? "Approval failed"); return; }
      setReviewModalItem(null);
      router.refresh();
    });
  }

  async function handlePublish(item: ApprovalQueueItem) {
    setActionError(null);
    startTransition(async () => {
      const res = await publishContentAction(item.contentType as any, item.id);
      if (!res.success) { setActionError(res.error ?? "Publish failed"); return; }
      setReviewModalItem(null);
      router.refresh();
    });
  }

  async function handleArchive(item: ApprovalQueueItem) {
    setActionError(null);
    startTransition(async () => {
      const res = await archiveContentAction(item.contentType as any, item.id);
      if (!res.success) { setActionError(res.error ?? "Archive failed"); return; }
      setReviewModalItem(null);
      router.refresh();
    });
  }

  async function handleConfirmReject() {
    if (!rejectModalItem) return;
    setActionError(null);
    startTransition(async () => {
      const res = await rejectContentAction(rejectModalItem.contentType as any, rejectModalItem.id, rejectionReason);
      if (!res.success) { setActionError(res.error ?? "Rejection failed"); return; }
      setRejectModalItem(null);
      setRejectionReason("");
      setReviewModalItem(null);
      router.refresh();
    });
  }

  async function handleRevertToDraft(item: ApprovalQueueItem) {
    setActionError(null);
    startTransition(async () => {
      const res = await revertToDraftAction(item.contentType as any, item.id);
      if (!res.success) { setActionError(res.error ?? "Revert failed"); return; }
      router.refresh();
    });
  }

  return (
    <RoleGuard allowedRoles={["HOSPITAL_DIRECTOR", "MEDICAL_DIRECTOR", "HR_STAFF", "CONTENT_STAFF"]}>
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

        {/* Error Banner */}
        {actionError && (
          <div className="rounded-lg border border-emergency/30 bg-emergency-light/60 p-3 text-xs text-emergency-dark flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{actionError}</span>
            <button onClick={() => setActionError(null)} className="ml-auto text-emergency hover:underline">Dismiss</button>
          </div>
        )}

        {/* Role Notice Banner */}
        {canApprove ? (
          <div className="rounded-lg border border-primary/20 bg-primary-light/40 p-4 text-xs text-primary-dark flex items-start gap-3">
            <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-text">Director Authority Active</p>
              <p className="text-text-muted mt-0.5">You have final approval authority. Approved items can be published immediately to make them live on the public website.</p>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-900 flex items-start gap-3">
            <Clock className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Submission Status Tracking Mode</p>
              <p className="text-amber-800 text-[11px] mt-0.5">
                Logged in as <strong>{currentUser.roleTitle}</strong>. Content must be approved by the Hospital Director before going live.
              </p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Tab)} className="w-full space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface p-2 rounded-lg border border-border">
            <TabsList className="bg-background border border-border h-10 p-1">
              <TabsTrigger value="PENDING_APPROVAL" className="text-xs px-3">
                <Clock className="h-4.5 w-4.5 mr-1.5 text-amber-600" />
                Pending ({getCount("PENDING_APPROVAL")})
              </TabsTrigger>
              <TabsTrigger value="APPROVED" className="text-xs px-3">
                <CheckCircle2 className="h-4.5 w-4.5 mr-1.5 text-primary" />
                Approved ({getCount("APPROVED")})
              </TabsTrigger>
              <TabsTrigger value="REJECTED" className="text-xs px-3">
                <XCircle className="h-4.5 w-4.5 mr-1.5 text-emergency" />
                Rejected ({getCount("REJECTED")})
              </TabsTrigger>
              <TabsTrigger value="PUBLISHED" className="text-xs px-3">
                <Globe className="h-4.5 w-4.5 mr-1.5 text-emerald-600" />
                Published ({getCount("PUBLISHED")})
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-text-light" />
              <select
                value={selectedTypeFilter}
                onChange={(e) => setSelectedTypeFilter(e.target.value)}
                className="h-10 rounded-md border border-border bg-background px-2.5 text-xs text-text focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="ALL">All Content Types</option>
                <option value="Doctor">Doctors</option>
                <option value="Department">Departments</option>
                <option value="Service">Services</option>
                <option value="News">News</option>
                <option value="Gallery">Gallery</option>
                <option value="Career">Careers</option>
                <option value="HospitalEvent">Events</option>
                <option value="Page">Pages</option>
                <option value="FAQ">FAQs</option>
              </select>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-3">
            {tabItems.length === 0 ? (
              <div className="rounded-lg border border-border bg-surface p-12 text-center space-y-2">
                <FileCheck className="h-8 w-8 text-text-light mx-auto" />
                <p className="text-sm font-semibold text-text">No items in this queue</p>
                <p className="text-xs text-text-muted">There are currently no submissions matching your filter criteria.</p>
              </div>
            ) : (
              tabItems.map((item) => {
                const IconComponent = getTypeIcon(item.contentType);
                return (
                  <div key={`${item.contentType}-${item.id}`} className="rounded-lg border border-border bg-surface p-5 hover:border-primary/40 transition-all shadow-none space-y-4">
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1 rounded bg-background px-2 py-0.5 text-xs font-semibold text-text border border-border">
                            <IconComponent className="h-4.5 w-4.5 text-primary" />
                            {item.contentType}
                          </span>
                          {item.groupLabel && (
                            <>
                              <span className="text-xs text-text-light">•</span>
                              <span className="text-xs text-text-muted font-medium">{item.groupLabel}</span>
                            </>
                          )}
                          <StatusBadge status={item.status} size="sm" />
                        </div>
                        <h2 className="text-base font-bold text-text leading-snug">{item.title}</h2>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <Button variant="outline" size="sm" onClick={() => setReviewModalItem(item)} className="text-xs bg-surface">
                          <Eye className="h-4.5 w-4.5 text-text-muted" />
                          Review
                        </Button>

                        {canApprove && item.status === "PENDING_APPROVAL" && (
                          <>
                            <Button variant="primary" size="sm" onClick={() => handleApprove(item)} disabled={isPending}
                              className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white border-0">
                              <CheckCircle2 className="h-4.5 w-4.5" /> Approve
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setRejectModalItem(item)} disabled={isPending}
                              className="text-xs text-emergency hover:bg-emergency-light">
                              <XCircle className="h-4.5 w-4.5" /> Reject
                            </Button>
                          </>
                        )}

                        {canPublish && item.status === "APPROVED" && (
                          <Button variant="secondary" size="sm" onClick={() => handlePublish(item)} disabled={isPending} className="text-xs">
                            <Globe className="h-4.5 w-4.5" /> Publish Now
                          </Button>
                        )}

                        {canApprove && item.status === "PUBLISHED" && (
                          <Button variant="outline" size="sm" onClick={() => handleArchive(item)} disabled={isPending} className="text-xs text-text-muted">
                            <Archive className="h-4.5 w-4.5" /> Archive
                          </Button>
                        )}

                        {item.status === "REJECTED" && (item.createdById === currentUserId || canApprove) && (
                          <Button variant="outline" size="sm" onClick={() => handleRevertToDraft(item)} disabled={isPending}
                            className="text-xs text-text-muted hover:bg-background">
                            Revert to Draft
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Rejection Reason */}
                    {item.status === "REJECTED" && item.rejectionReason && (
                      <div className="rounded-md bg-emergency-light/60 border border-emergency/20 p-3 text-xs text-emergency-dark flex items-start gap-2">
                        <AlertCircle className="h-4.5 w-4.5 text-emergency shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold">Rejection Feedback / Required Changes:</p>
                          <p className="mt-0.5">{item.rejectionReason}</p>
                        </div>
                      </div>
                    )}

                    {/* Meta */}
                    <div className="flex flex-wrap items-center justify-between text-xs text-text-light pt-2 border-t border-border gap-2">
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-text-muted" />
                        <span>
                          {item.submittedByName
                            ? <>Submitted by <strong>{item.submittedByName}</strong></>
                            : item.createdByName
                            ? <>Created by <strong>{item.createdByName}</strong></>
                            : "Unknown submitter"}
                        </span>
                      </div>
                      {item.submittedAt && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-text-muted" />
                          <span>{new Date(item.submittedAt).toLocaleString("en-ET", { dateStyle: "medium", timeStyle: "short" })}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Tabs>

        {/* Review Modal */}
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
                <DialogTitle className="text-lg font-bold text-text">{reviewModalItem.title}</DialogTitle>
                <DialogDescription className="text-xs text-text-muted mt-1">
                  {reviewModalItem.submittedByName
                    ? `Submitted by ${reviewModalItem.submittedByName}`
                    : reviewModalItem.createdByName
                    ? `Created by ${reviewModalItem.createdByName}`
                    : "Unknown author"}
                  {reviewModalItem.submittedAt &&
                    ` on ${new Date(reviewModalItem.submittedAt).toLocaleString("en-ET", { dateStyle: "medium", timeStyle: "short" })}`}
                </DialogDescription>
              </div>

              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto text-xs">
                {reviewModalItem.groupLabel && (
                  <div className="space-y-1">
                    <span className="font-semibold text-text">Department / Category:</span>
                    <p className="text-text-muted">{reviewModalItem.groupLabel}</p>
                  </div>
                )}
                {reviewModalItem.rejectionReason && (
                  <div className="rounded-md bg-emergency-light/60 border border-emergency/20 p-3 text-emergency-dark flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-emergency shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Rejection Reason:</p>
                      <p className="mt-0.5">{reviewModalItem.rejectionReason}</p>
                    </div>
                  </div>
                )}
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded border border-emerald-200 space-y-1 text-[11px]">
                  <p className="font-semibold">✓ Verified Checklist:</p>
                  <p>• Medical specialty terminology verified</p>
                  <p>• Department head endorsement signed</p>
                  <p>• Photo/media asset copyrights cleared</p>
                </div>
              </div>

              <div className="p-4 border-t border-border bg-background flex flex-col sm:flex-row items-center justify-between gap-3">
                <Button variant="ghost" size="sm" onClick={() => setReviewModalItem(null)} className="text-xs text-text-muted">
                  Close
                </Button>
                <div className="flex items-center gap-2">
                  {canApprove && reviewModalItem.status === "PENDING_APPROVAL" && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => { setRejectModalItem(reviewModalItem); setReviewModalItem(null); }}
                        className="text-xs text-emergency hover:bg-emergency-light" disabled={isPending}>
                        <XCircle className="h-3.5 w-3.5" /> Reject
                      </Button>
                      <Button variant="primary" size="sm" onClick={() => handleApprove(reviewModalItem)}
                        className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isPending}>
                        <CheckCircle2 className="h-3.5 w-3.5" /> Approve Content
                      </Button>
                    </>
                  )}
                  {canPublish && reviewModalItem.status === "APPROVED" && (
                    <Button variant="secondary" size="sm" onClick={() => handlePublish(reviewModalItem)} className="text-xs" disabled={isPending}>
                      <Globe className="h-3.5 w-3.5" /> Publish Live
                    </Button>
                  )}
                  {canApprove && reviewModalItem.status === "PUBLISHED" && (
                    <Button variant="outline" size="sm" onClick={() => handleArchive(reviewModalItem)} className="text-xs" disabled={isPending}>
                      <Archive className="h-3.5 w-3.5" /> Archive
                    </Button>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Reject Modal */}
        {rejectModalItem && (
          <Dialog open={!!rejectModalItem} onOpenChange={() => setRejectModalItem(null)}>
            <DialogContent className="max-w-md bg-surface p-6">
              <DialogHeader>
                <DialogTitle className="text-base font-bold text-text flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-emergency" />
                  Reject Submission
                </DialogTitle>
                <DialogDescription className="text-xs text-text-muted">
                  Provide constructive feedback explaining why this item is being returned.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 my-4">
                <p className="text-xs font-semibold text-text">
                  Item: <span className="font-normal text-text-muted">{rejectModalItem.title}</span>
                </p>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text">Rejection Feedback / Action Required:</label>
                  <textarea
                    rows={4}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="e.g. Please update the salary grade and verify doctor specialty certification details..."
                    className="w-full rounded-md border border-border bg-background p-2.5 text-xs text-text focus:outline-none focus:ring-2 focus:ring-emergency"
                  />
                  {rejectionReason.trim().length > 0 && rejectionReason.trim().length < 10 && (
                    <p className="text-[11px] text-emergency">Reason must be at least 10 characters.</p>
                  )}
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button variant="ghost" size="sm" onClick={() => setRejectModalItem(null)} className="text-xs">Cancel</Button>
                <Button variant="primary" size="sm" onClick={handleConfirmReject} disabled={isPending || rejectionReason.trim().length < 10}
                  className="text-xs bg-emergency hover:bg-emergency-dark text-white shadow-emergency">
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
