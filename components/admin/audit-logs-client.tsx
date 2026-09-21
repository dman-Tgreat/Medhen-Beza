"use client";

import React, { useState, useMemo } from "react";
import { DataTable, ColumnDef } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { ArrowRight } from "lucide-react";

interface AuditLogRecord {
  id: string;
  userName: string | null;
  userEmail: string | null;
  action: string;
  contentType: string;
  contentId: string;
  previousStatus: string | null;
  newStatus: string | null;
  createdAt: string; // ISO string
}

interface Props {
  logs: AuditLogRecord[];
  users: { id: string; name: string; email: string }[];
}

const ACTION_STYLES: Record<string, string> = {
  CREATE: "bg-blue-50 text-blue-700 border-blue-200",
  UPDATE: "bg-slate-100 text-slate-700 border-slate-200",
  DELETE: "bg-emergency-light text-emergency-dark border-emergency/30 font-semibold",
  SUBMIT: "bg-amber-50 text-amber-800 border-amber-200",
  APPROVE: "bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold",
  REJECT: "bg-emergency-light text-emergency-dark border-emergency/30",
  PUBLISH: "bg-teal-50 text-teal-800 border-teal-200 font-semibold",
  ARCHIVE: "bg-slate-100 text-slate-700 border-slate-200",
  REVERT_TO_DRAFT: "bg-amber-50 text-amber-700 border-amber-200",
  LOGIN: "bg-slate-50 text-slate-600 border-slate-200",
};

const CONTENT_TYPES = ["Doctor", "Department", "Service", "News", "Gallery", "Career", "HospitalEvent", "Page", "FAQ", "SiteSetting", "User"];

export function AuditLogsClient({ logs, users }: Props) {
  const [userFilter, setUserFilter] = useState("ALL");
  const [contentTypeFilter, setContentTypeFilter] = useState("ALL");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (contentTypeFilter !== "ALL" && log.contentType !== contentTypeFilter) return false;
      if (userFilter !== "ALL" && log.userEmail !== userFilter) return false;
      if (actionFilter !== "ALL" && log.action !== actionFilter) return false;
      if (dateFrom && new Date(log.createdAt) < new Date(dateFrom)) return false;
      if (dateTo && new Date(log.createdAt) > new Date(dateTo + "T23:59:59")) return false;
      return true;
    });
  }, [logs, userFilter, contentTypeFilter, actionFilter, dateFrom, dateTo]);

  const columns: ColumnDef<AuditLogRecord>[] = [
    {
      key: "createdAt",
      header: "Timestamp",
      sortable: true,
      render: (item) => (
        <span className="text-xs font-mono text-text-muted">
          {new Date(item.createdAt).toLocaleString("en-ET", { dateStyle: "short", timeStyle: "medium" })}
        </span>
      ),
    },
    {
      key: "userName",
      header: "User",
      sortable: true,
      render: (item) => (
        <div className="flex flex-col">
          <span className="font-semibold text-text">{item.userName ?? "—"}</span>
          <span className="text-[11px] text-text-light">{item.userEmail ?? ""}</span>
        </div>
      ),
    },
    {
      key: "action",
      header: "Action",
      sortable: true,
      render: (item) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-pill text-[10px] font-bold border ${ACTION_STYLES[item.action] ?? "bg-slate-50 text-slate-600 border-slate-200"}`}>
          {item.action.replace(/_/g, " ")}
        </span>
      ),
    },
    {
      key: "contentType",
      header: "Entity Affected",
      render: (item) => (
        <div className="flex flex-col max-w-xs">
          <span className="text-xs font-semibold text-text truncate">{item.contentId}</span>
          <span className="text-[10px] uppercase font-bold text-text-light">{item.contentType}</span>
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
  ];

  const allActions = [...new Set(logs.map((l) => l.action))].sort();

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 p-3 bg-surface rounded-lg border border-border">
        <span className="text-xs font-semibold text-text-muted">Filter:</span>

        <select value={contentTypeFilter} onChange={(e) => setContentTypeFilter(e.target.value)}
          className="h-10 rounded border border-border bg-background px-2 text-xs text-text focus:outline-none focus:ring-1 focus:ring-primary">
          <option value="ALL">All Content Types</option>
          {CONTENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>

        <select value={userFilter} onChange={(e) => setUserFilter(e.target.value)}
          className="h-10 rounded border border-border bg-background px-2 text-xs text-text focus:outline-none focus:ring-1 focus:ring-primary">
          <option value="ALL">All Users</option>
          {users.map((user) => <option key={user.id} value={user.email}>{user.name}</option>)}
        </select>

        <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)}
          className="h-10 rounded border border-border bg-background px-2 text-xs text-text focus:outline-none focus:ring-1 focus:ring-primary">
          <option value="ALL">All Actions</option>
          {allActions.map((a) => <option key={a} value={a}>{a.replace(/_/g, " ")}</option>)}
        </select>

        <div className="flex items-center gap-1">
          <label className="text-xs text-text-muted">From:</label>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
            className="h-10 rounded border border-border bg-background px-2 text-xs text-text focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>

        <div className="flex items-center gap-1">
          <label className="text-xs text-text-muted">To:</label>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
            className="h-10 rounded border border-border bg-background px-2 text-xs text-text focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>

        <button onClick={() => { setUserFilter("ALL"); setContentTypeFilter("ALL"); setActionFilter("ALL"); setDateFrom(""); setDateTo(""); }}
          className="text-xs text-primary hover:underline">
          Clear
        </button>

        <span className="ml-auto text-xs text-text-muted">{filteredLogs.length} records</span>
      </div>

      <DataTable
        title="Administrative Audit Trail & Activity Logs"
        description="Immutable record of user actions, content state transitions, publishing decisions, and security logins."
        data={filteredLogs}
        columns={columns}
        searchPlaceholder="Search audit logs by user, action, entity..."
      />
    </div>
  );
}
