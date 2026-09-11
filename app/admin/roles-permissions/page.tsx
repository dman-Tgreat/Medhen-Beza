"use client";

import React, { useState } from "react";
import { RoleGuard } from "@/components/admin/role-guard";
import { ShieldCheck, Check, X, Lock, Info, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PermissionRow {
  resource: string;
  category: string;
  director: boolean;
  medical: boolean;
  hr: boolean;
  content: boolean;
  sysadmin: boolean;
}

const PERMISSION_MATRIX: PermissionRow[] = [
  // Medical
  { resource: "Doctors & Clinical Staff", category: "Medical Content", director: true, medical: true, hr: false, content: false, sysadmin: false },
  { resource: "Departments Directory", category: "Medical Content", director: true, medical: true, hr: false, content: false, sysadmin: false },
  { resource: "Clinical Services", category: "Medical Content", director: true, medical: true, hr: false, content: false, sysadmin: false },
  
  // HR
  { resource: "Careers & Job Vacancies", category: "Human Resources", director: true, medical: false, hr: true, content: false, sysadmin: false },
  
  // Editorial
  { resource: "News & Press Articles", category: "Editorial & Content", director: true, medical: false, hr: false, content: true, sysadmin: false },
  { resource: "Media Gallery (Photos & Video)", category: "Editorial & Content", director: true, medical: false, hr: false, content: true, sysadmin: false },
  { resource: "Events & Public Workshops", category: "Editorial & Content", director: true, medical: false, hr: false, content: true, sysadmin: false },
  { resource: "Hospital Facilities", category: "Editorial & Content", director: true, medical: false, hr: false, content: true, sysadmin: false },
  { resource: "FAQs & Static CMS Pages", category: "Editorial & Content", director: true, medical: false, hr: false, content: true, sysadmin: false },
  
  // Workflow & Approval
  { resource: "Content Approval & Rejection", category: "Governance", director: true, medical: false, hr: false, content: false, sysadmin: false },
  { resource: "Direct Website Publishing", category: "Governance", director: true, medical: false, hr: false, content: false, sysadmin: false },
  
  // System & IT
  { resource: "Media Library Uploads", category: "Digital Assets", director: true, medical: true, hr: true, content: true, sysadmin: true },
  { resource: "Patient Contact Messages", category: "Communications", director: true, medical: false, hr: false, content: true, sysadmin: false },
  { resource: "Admin User Management", category: "Technical Administration", director: true, medical: false, hr: false, content: false, sysadmin: true },
  { resource: "Roles & Permissions Matrix", category: "Technical Administration", director: true, medical: false, hr: false, content: false, sysadmin: true },
  { resource: "Audit Trail Compliance Logs", category: "Technical Administration", director: true, medical: false, hr: false, content: false, sysadmin: true },
  { resource: "Website Settings & Config", category: "Technical Administration", director: true, medical: false, hr: false, content: false, sysadmin: true },
];

export default function RolesPermissionsPage() {
  const [matrix, setMatrix] = useState<PermissionRow[]>(PERMISSION_MATRIX);

  const categories = Array.from(new Set(matrix.map((r) => r.category)));

  return (
    <RoleGuard allowedRoles={["HOSPITAL_DIRECTOR", "SYSTEM_ADMIN"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-h3 font-bold text-text tracking-tight">
                Role-Based Access Control (RBAC) Matrix
              </h1>
              <span className="rounded-pill bg-primary-light px-2.5 py-0.5 text-xs font-semibold text-primary-dark border border-primary/20">
                Security Policy
              </span>
            </div>
            <p className="text-small text-text-muted mt-1">
              Permissions configured per hospital role. Enforces separation of clinical authority, HR recruitment, editorial publishing, and technical administration.
            </p>
          </div>
        </div>

        {/* Informational Policy Banner */}
        <div className="rounded-lg border border-primary/20 bg-primary-light/30 p-4 text-xs space-y-1.5">
          <div className="flex items-center gap-2 font-semibold text-primary-dark">
            <Info className="h-4 w-4 text-primary" />
            <span>Hospital Governance Rule — Phase 1 Compliance</span>
          </div>
          <p className="text-text-muted leading-relaxed">
            The <strong>Hospital Director</strong> holds final publishing and approval authority for all website content. The <strong>System Administrator</strong> manages infrastructure and credentials without content approval access.
          </p>
        </div>

        {/* RBAC Matrix Table */}
        <div className="rounded-lg border border-border bg-surface overflow-hidden shadow-none">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-background border-b border-border text-text font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3.5 min-w-[220px]">Resource / Capability</th>
                  <th className="px-3 py-3.5 text-center min-w-[120px]">
                    <div className="flex flex-col items-center">
                      <span>Hospital Director</span>
                      <span className="text-[10px] text-text-light font-normal capitalize">Executive</span>
                    </div>
                  </th>
                  <th className="px-3 py-3.5 text-center min-w-[120px]">
                    <div className="flex flex-col items-center">
                      <span>Medical Director</span>
                      <span className="text-[10px] text-text-light font-normal capitalize">Clinical</span>
                    </div>
                  </th>
                  <th className="px-3 py-3.5 text-center min-w-[100px]">
                    <div className="flex flex-col items-center">
                      <span>HR Staff</span>
                      <span className="text-[10px] text-text-light font-normal capitalize">Recruitment</span>
                    </div>
                  </th>
                  <th className="px-3 py-3.5 text-center min-w-[110px]">
                    <div className="flex flex-col items-center">
                      <span>Content Staff</span>
                      <span className="text-[10px] text-text-light font-normal capitalize">Editorial</span>
                    </div>
                  </th>
                  <th className="px-3 py-3.5 text-center min-w-[120px]">
                    <div className="flex flex-col items-center">
                      <span>System Admin</span>
                      <span className="text-[10px] text-text-light font-normal capitalize">Technical</span>
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {categories.map((cat) => {
                  const catRows = matrix.filter((r) => r.category === cat);
                  return (
                    <React.Fragment key={cat}>
                      <tr className="bg-background/60">
                        <td
                          colSpan={6}
                          className="px-5 py-2 text-[11px] font-bold text-text-light uppercase tracking-wider border-y border-border"
                        >
                          {cat}
                        </td>
                      </tr>

                      {catRows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-background/40 transition-colors">
                          <td className="px-5 py-3 font-medium text-text">{row.resource}</td>

                          {/* Director */}
                          <td className="px-3 py-3 text-center">
                            {row.director ? (
                              <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <Check className="h-3.5 w-3.5" />
                              </div>
                            ) : (
                              <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                <X className="h-3.5 w-3.5" />
                              </div>
                            )}
                          </td>

                          {/* Medical */}
                          <td className="px-3 py-3 text-center">
                            {row.medical ? (
                              <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <Check className="h-3.5 w-3.5" />
                              </div>
                            ) : (
                              <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                <X className="h-3.5 w-3.5" />
                              </div>
                            )}
                          </td>

                          {/* HR */}
                          <td className="px-3 py-3 text-center">
                            {row.hr ? (
                              <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <Check className="h-3.5 w-3.5" />
                              </div>
                            ) : (
                              <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                <X className="h-3.5 w-3.5" />
                              </div>
                            )}
                          </td>

                          {/* Content */}
                          <td className="px-3 py-3 text-center">
                            {row.content ? (
                              <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <Check className="h-3.5 w-3.5" />
                              </div>
                            ) : (
                              <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                <X className="h-3.5 w-3.5" />
                              </div>
                            )}
                          </td>

                          {/* Sys Admin */}
                          <td className="px-3 py-3 text-center">
                            {row.sysadmin ? (
                              <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <Check className="h-3.5 w-3.5" />
                              </div>
                            ) : (
                              <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                <X className="h-3.5 w-3.5" />
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
