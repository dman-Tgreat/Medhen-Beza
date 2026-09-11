"use client";

import React, { useState } from "react";
import { DataTable, ColumnDef } from "@/components/admin/data-table";
import { RoleGuard } from "@/components/admin/role-guard";
import { StatusBadge } from "@/components/admin/status-badge";
import { History, User, Activity, ArrowRight } from "lucide-react";

interface AuditLogRecord {
  id: string;
  user: string;
  userRole: string;
  action: "CREATE" | "UPDATE" | "DELETE" | "APPROVE" | "REJECT" | "PUBLISH" | "UNPUBLISH" | "LOGIN";
  entityType: string;
  entityName: string;
  previousStatus?: string;
  newStatus?: string;
  timestamp: string;
  ipAddress: string;
}

const INITIAL_AUDIT_LOGS: AuditLogRecord[] = [
  {
    id: "log-101",
    user: "Dr. Samuel Bekele",
    userRole: "Hospital Director",
    action: "APPROVE",
    entityType: "Doctor",
    entityName: "Dr. Meron Haile Profile",
    previousStatus: "PENDING_APPROVAL",
    newStatus: "APPROVED",
    timestamp: "2026-09-11 10:48:12",
    ipAddress: "192.168.1.10",
  },
  {
    id: "log-102",
    user: "Dr. Bethlehem Tadesse",
    userRole: "Medical Director",
    action: "CREATE",
    entityType: "Doctor",
    entityName: "Dr. Meron Haile Profile",
    previousStatus: "DRAFT",
    newStatus: "PENDING_APPROVAL",
    timestamp: "2026-09-11 10:45:00",
    ipAddress: "192.168.1.14",
  },
  {
    id: "log-103",
    user: "Hanna Worku",
    userRole: "HR Staff",
    action: "CREATE",
    entityType: "Career",
    entityName: "Senior ICU Staff Nurse Vacancy",
    previousStatus: "DRAFT",
    newStatus: "PENDING_APPROVAL",
    timestamp: "2026-09-11 09:15:30",
    ipAddress: "192.168.1.22",
  },
  {
    id: "log-104",
    user: "Abel Girma",
    userRole: "Content Staff",
    action: "PUBLISH",
    entityType: "News",
    entityName: "Pediatric Emergency Unit Expansion",
    previousStatus: "APPROVED",
    newStatus: "PUBLISHED",
    timestamp: "2026-09-10 16:30:10",
    ipAddress: "192.168.1.18",
  },
  {
    id: "log-105",
    user: "Dr. Samuel Bekele",
    userRole: "Hospital Director",
    action: "REJECT",
    entityType: "Career",
    entityName: "Junior Laboratory Technician",
    previousStatus: "PENDING_APPROVAL",
    newStatus: "REJECTED",
    timestamp: "2026-09-07 14:20:45",
    ipAddress: "192.168.1.10",
  },
  {
    id: "log-106",
    user: "Dawit Abebe",
    userRole: "System Administrator",
    action: "UPDATE",
    entityType: "SiteSetting",
    entityName: "Emergency Contact Hotline (+251 11 654 9999)",
    timestamp: "2026-09-06 11:05:00",
    ipAddress: "192.168.1.5",
  },
  {
    id: "log-107",
    user: "Dawit Abebe",
    userRole: "System Administrator",
    action: "LOGIN",
    entityType: "Session",
    entityName: "Admin Portal Authentication",
    timestamp: "2026-09-06 11:00:15",
    ipAddress: "192.168.1.5",
  },
];

export default function AuditLogsAdminPage() {
  const [logs, setLogs] = useState<AuditLogRecord[]>(INITIAL_AUDIT_LOGS);

  const columns: ColumnDef<AuditLogRecord>[] = [
    {
      key: "timestamp",
      header: "Timestamp",
      sortable: true,
      render: (item) => <span className="text-xs font-mono text-text-muted">{item.timestamp}</span>,
    },
    {
      key: "user",
      header: "User & Role",
      sortable: true,
      render: (item) => (
        <div className="flex flex-col">
          <span className="font-semibold text-text">{item.user}</span>
          <span className="text-[11px] text-text-light">{item.userRole}</span>
        </div>
      ),
    },
    {
      key: "action",
      header: "Action",
      sortable: true,
      render: (item) => {
        const actionStyles: Record<string, string> = {
          CREATE: "bg-blue-50 text-blue-700 border-blue-200",
          UPDATE: "bg-slate-100 text-slate-700 border-slate-200",
          DELETE: "bg-emergency-light text-emergency-dark border-emergency/30 font-semibold",
          APPROVE: "bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold",
          REJECT: "bg-emergency-light text-emergency-dark border-emergency/30",
          PUBLISH: "bg-teal-50 text-teal-800 border-teal-200 font-semibold",
          LOGIN: "bg-slate-50 text-slate-600 border-slate-200",
        };

        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-pill text-[10px] font-bold border ${actionStyles[item.action] || ""}`}>
            {item.action}
          </span>
        );
      },
    },
    {
      key: "entityName",
      header: "Entity Affected",
      render: (item) => (
        <div className="flex flex-col max-w-xs">
          <span className="text-xs font-semibold text-text truncate">{item.entityName}</span>
          <span className="text-[10px] uppercase font-bold text-text-light">{item.entityType}</span>
        </div>
      ),
    },
    {
      key: "statusDiff",
      header: "Status Transition",
      render: (item) => {
        if (!item.previousStatus && !item.newStatus) return <span className="text-text-light">—</span>;
        return (
          <div className="flex items-center gap-1.5 text-xs">
            {item.previousStatus && <StatusBadge status={item.previousStatus} size="sm" />}
            {item.previousStatus && item.newStatus && <ArrowRight className="h-3 w-3 text-text-light" />}
            {item.newStatus && <StatusBadge status={item.newStatus} size="sm" />}
          </div>
        );
      },
    },
    {
      key: "ipAddress",
      header: "IP Address",
      render: (item) => <span className="text-xs font-mono text-text-muted">{item.ipAddress}</span>,
    },
  ];

  return (
    <RoleGuard allowedRoles={["HOSPITAL_DIRECTOR", "SYSTEM_ADMIN"]}>
      <div className="space-y-6">
        <DataTable
          title="Administrative Audit Trail & Activity Logs"
          description="Immutable record of user actions, content state transitions, publishing decisions, and security logins."
          data={logs}
          columns={columns}
          searchPlaceholder="Search audit logs by user, action, entity..."
        />
      </div>
    </RoleGuard>
  );
}
