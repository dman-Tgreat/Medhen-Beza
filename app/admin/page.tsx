"use client";

import React from "react";
import Link from "next/link";
import { useAdminRole } from "@/components/admin/role-context";
import { StatusBadge } from "@/components/admin/status-badge";
import {
  Stethoscope,
  CheckCircle2,
  Clock,
  Briefcase,
  Newspaper,
  Mail,
  Shield,
  ArrowRight,
  Plus,
  Users,
  AlertCircle,
  Check,
  X,
  History,
  HardDrive,
  FileCheck,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  const { currentRole, currentUser, canApprove, isSysAdmin } = useAdminRole();

  // Mock metric counters
  const stats = [
    {
      title: "Pending Approvals",
      value: "4",
      change: "+2 today",
      icon: Clock,
      href: "/admin/approvals",
      alert: currentRole === "HOSPITAL_DIRECTOR",
      color: "text-amber-700 bg-amber-50 border-amber-200",
    },
    {
      title: "Doctor Profiles",
      value: "28",
      change: "24 Published",
      icon: Stethoscope,
      href: "/admin/content/doctors",
      color: "text-primary bg-primary-light border-primary/20",
    },
    {
      title: "Active Vacancies",
      value: "6",
      change: "3 expiring soon",
      icon: Briefcase,
      href: "/admin/content/careers",
      color: "text-indigo-700 bg-indigo-50 border-indigo-200",
    },
    {
      title: "News & Articles",
      value: "18",
      change: "2 in draft",
      icon: Newspaper,
      href: "/admin/content/news",
      color: "text-secondary-dark bg-secondary-light border-secondary/20",
    },
    {
      title: "Patient Inquiries",
      value: "12",
      change: "5 unread",
      icon: Mail,
      href: "/admin/messages",
      color: "text-emerald-700 bg-emerald-50 border-emerald-200",
    },
    {
      title: "Active Users",
      value: "9",
      change: "5 Roles configured",
      icon: Users,
      href: "/admin/users",
      color: "text-slate-700 bg-slate-100 border-slate-200",
    },
  ];

  // Mock pending approvals
  const pendingApprovals = [
    {
      id: "app-1",
      title: "Dr. Meron Haile — Senior Cardiologist Profile",
      type: "Doctor Profile",
      author: "Dr. Bethlehem Tadesse (Medical Director)",
      date: "Today at 10:45 AM",
      status: "PENDING_APPROVAL",
    },
    {
      id: "app-2",
      title: "Head of Intensive Care Unit (ICU) Nurse Vacancy",
      type: "Career Opportunity",
      author: "Hanna Worku (HR Staff)",
      date: "Today at 09:15 AM",
      status: "PENDING_APPROVAL",
    },
    {
      id: "app-3",
      title: "Launch of Medhen Beza Advanced MRI Imaging Suite",
      type: "News & Press",
      author: "Abel Girma (Content Staff)",
      date: "Yesterday",
      status: "PENDING_APPROVAL",
    },
    {
      id: "app-4",
      title: "Minimally Invasive Laparoscopic Surgery Service",
      type: "Clinical Service",
      author: "Dr. Bethlehem Tadesse (Medical Director)",
      date: "Sep 09, 2026",
      status: "PENDING_APPROVAL",
    },
  ];

  // Mock audit logs
  const recentActivities = [
    {
      id: "log-1",
      user: "Dr. Samuel Bekele",
      action: "PUBLISHED",
      entity: "Doctor Profile (Dr. Dawit Mengistu)",
      time: "25 minutes ago",
    },
    {
      id: "log-2",
      user: "Hanna Worku",
      action: "SUBMITTED",
      entity: "Job Vacancy #14 (ICU Nurse)",
      time: "1 hour ago",
    },
    {
      id: "log-3",
      user: "Abel Girma",
      action: "CREATED",
      entity: "Gallery Album (New Ultrasound Wing)",
      time: "3 hours ago",
    },
    {
      id: "log-4",
      user: "Dawit Abebe",
      action: "UPDATED",
      entity: "Emergency Contact Phone Config",
      time: "5 hours ago",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-xl border border-border bg-surface p-6 shadow-none flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-h3 font-bold tracking-tight text-text">
              Welcome, {currentUser.name}
            </h1>
            <span className="inline-flex items-center rounded-pill bg-primary-light px-2.5 py-0.5 text-xs font-semibold text-primary-dark border border-primary/20">
              {currentUser.roleTitle}
            </span>
          </div>
          <p className="text-small text-text-muted">
            {currentRole === "HOSPITAL_DIRECTOR" &&
              "You have full executive authority across all hospital content, approval workflows, and administration."}
            {currentRole === "MEDICAL_DIRECTOR" &&
              "Manage clinical doctors, departments, and medical services. Submit updates for Director approval."}
            {currentRole === "HR_STAFF" &&
              "Manage job vacancies, recruitment announcements, and career requirements."}
            {currentRole === "CONTENT_STAFF" &&
              "Manage news, gallery assets, events, FAQs, and static hospital pages."}
            {currentRole === "SYSTEM_ADMIN" &&
              "Manage administrative users, RBAC permissions, audit trail compliance, and media settings."}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {currentRole === "HOSPITAL_DIRECTOR" && (
            <Button asChild variant="primary" size="sm">
              <Link href="/admin/approvals">
                <FileCheck className="w-4 h-4" />
                Review Approvals ({pendingApprovals.length})
              </Link>
            </Button>
          )}

          {currentRole === "MEDICAL_DIRECTOR" && (
            <Button asChild variant="primary" size="sm">
              <Link href="/admin/content/doctors">
                <Plus className="w-4 h-4" />
                Add Doctor Profile
              </Link>
            </Button>
          )}

          {currentRole === "HR_STAFF" && (
            <Button asChild variant="primary" size="sm">
              <Link href="/admin/content/careers">
                <Plus className="w-4 h-4" />
                Post Vacancy
              </Link>
            </Button>
          )}

          {currentRole === "CONTENT_STAFF" && (
            <Button asChild variant="primary" size="sm">
              <Link href="/admin/content/news">
                <Plus className="w-4 h-4" />
                New News Article
              </Link>
            </Button>
          )}

          {currentRole === "SYSTEM_ADMIN" && (
            <Button asChild variant="primary" size="sm">
              <Link href="/admin/users">
                <Plus className="w-4 h-4" />
                Create Admin User
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, idx) => {
          const IconComp = stat.icon;
          return (
            <Link
              key={idx}
              href={stat.href}
              className="rounded-lg border border-border bg-surface p-4 hover:border-primary/40 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-light truncate">
                  {stat.title}
                </span>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border ${stat.color}`}
                >
                  <IconComp className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-bold text-text tracking-tight">
                  {stat.value}
                </span>
                <span className="block text-[11px] text-text-muted mt-0.5">
                  {stat.change}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Main Grid: Pending Approvals & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Approval Queue / Role Priority Widget */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Approval Widget */}
          {!isSysAdmin ? (
            <div className="rounded-lg border border-border bg-surface p-5 shadow-none space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-text">
                    {canApprove ? "Pending Approvals Requiring Decision" : "My Submission Status"}
                  </h2>
                  <p className="text-xs text-text-muted mt-0.5">
                    {canApprove
                      ? "Items submitted by department heads awaiting Hospital Director approval"
                      : "Track progress of your submitted content through the editorial workflow"}
                  </p>
                </div>
                <Link
                  href="/admin/approvals"
                  className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                >
                  View All ({pendingApprovals.length})
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="divide-y divide-border border rounded-md border-border overflow-hidden bg-background">
                {pendingApprovals.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface hover:bg-background/80 transition-colors"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-text-light px-2 py-0.5 rounded bg-background border border-border">
                          {item.type}
                        </span>
                        <StatusBadge status={item.status} size="sm" />
                      </div>
                      <p className="text-xs font-semibold text-text truncate">{item.title}</p>
                      <p className="text-[11px] text-text-muted">
                        Submitted by <span className="font-medium text-text">{item.author}</span> • {item.date}
                      </p>
                    </div>

                    {/* Quick action buttons for Hospital Director */}
                    {canApprove ? (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          className=" text-xs text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                          onClick={() => alert(`Approved: ${item.title}`)}
                        >
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs text-emergency hover:bg-emergency-light"
                          onClick={() => alert(`Rejected: ${item.title}`)}
                        >
                          <X className="h-3.5 w-3.5" />
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <Button asChild variant="outline" size="sm" className="h-8 text-xs bg-surface">
                        <Link href="/admin/approvals">
                          Track Status
                        </Link>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-surface p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-text">Technical System Health & Security</h2>
                  <p className="text-xs text-text-muted mt-0.5">
                    System Administrator console metrics and infrastructure health
                  </p>
                </div>
                <Link
                  href="/admin/settings"
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  System Settings →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-md border border-border bg-background space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-text">Database Connections</span>
                    <span className="text-xs font-bold text-emerald-700">Healthy</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-1.5">
                    <div className="bg-emerald-600 h-1.5 rounded-full w-[24%]" />
                  </div>
                  <p className="text-[11px] text-text-light">12 of 50 pool slots utilized (PostgreSQL)</p>
                </div>

                <div className="p-4 rounded-md border border-border bg-background space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-text">Media Storage</span>
                    <span className="text-xs font-bold text-primary">2.4 GB / 20 GB</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-1.5">
                    <div className="bg-primary h-1.5 rounded-full w-[12%]" />
                  </div>
                  <p className="text-[11px] text-text-light">Cloudinary CDN active, SSL cert valid</p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Management Shortlinks */}
          <div className="rounded-lg border border-border bg-surface p-5 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-text-light">
              Fast Content Navigation
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <Link
                href="/admin/content/doctors"
                className="p-3 rounded-md border border-border bg-background hover:bg-primary-light/40 hover:border-primary/30 transition-colors text-center"
              >
                <Stethoscope className="h-5 w-5 mx-auto text-primary mb-1" />
                <span className="text-xs font-semibold text-text block">Doctors</span>
                <span className="text-[10px] text-text-light">28 profiles</span>
              </Link>

              <Link
                href="/admin/content/careers"
                className="p-3 rounded-md border border-border bg-background hover:bg-primary-light/40 hover:border-primary/30 transition-colors text-center"
              >
                <Briefcase className="h-5 w-5 mx-auto text-indigo-600 mb-1" />
                <span className="text-xs font-semibold text-text block">Careers</span>
                <span className="text-[10px] text-text-light">6 vacancies</span>
              </Link>

              <Link
                href="/admin/content/news"
                className="p-3 rounded-md border border-border bg-background hover:bg-primary-light/40 hover:border-primary/30 transition-colors text-center"
              >
                <Newspaper className="h-5 w-5 mx-auto text-secondary mb-1" />
                <span className="text-xs font-semibold text-text block">News & Blog</span>
                <span className="text-[10px] text-text-light">18 articles</span>
              </Link>

              <Link
                href="/admin/media"
                className="p-3 rounded-md border border-border bg-background hover:bg-primary-light/40 hover:border-primary/30 transition-colors text-center"
              >
                <HardDrive className="h-5 w-5 mx-auto text-slate-700 mb-1" />
                <span className="text-xs font-semibold text-text block">Media Library</span>
                <span className="text-[10px] text-text-light">142 assets</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Audit Trail & Hospital Info */}
        <div className="space-y-6">
          {/* Audit Trail Widget */}
          <div className="rounded-lg border border-border bg-surface p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-bold text-text">Recent Audit Logs</h2>
              </div>
              <Link
                href="/admin/audit-logs"
                className="text-xs font-medium text-primary hover:underline"
              >
                Full Trail
              </Link>
            </div>

            <div className="space-y-3">
              {recentActivities.map((log) => (
                <div
                  key={log.id}
                  className="p-2.5 rounded-md border border-border bg-background text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-text">{log.user}</span>
                    <span className="text-[10px] font-bold text-primary-dark bg-primary-light px-1.5 py-0.2 rounded">
                      {log.action}
                    </span>
                  </div>
                  <p className="text-[11px] text-text-muted truncate">{log.entity}</p>
                  <span className="text-[10px] text-text-light block">{log.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Separation of Concerns Policy Note */}
          <div className="rounded-lg border border-primary/20 bg-primary-light/30 p-4 text-xs space-y-2">
            <div className="flex items-center gap-2 font-semibold text-primary-dark">
              <Shield className="h-4 w-4 text-primary" />
              <span>Hospital Governance Protocol</span>
            </div>
            <p className="text-text-muted text-[11px] leading-relaxed">
              Medical & clinical content must be reviewed and approved by the Hospital Director before public release. System Administrators do not have content publishing authority.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
