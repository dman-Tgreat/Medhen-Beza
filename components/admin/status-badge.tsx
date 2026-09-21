import React from "react";
import { ContentStatusType } from "@/lib/admin/types";
import { cn } from "@/lib/utils";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  FileEdit,
  Globe2,
  Archive,
} from "lucide-react";

interface StatusBadgeProps {
  status: ContentStatusType | string;
  className?: string;
  showIcon?: boolean;
  size?: "sm" | "md";
}

export function StatusBadge({
  status,
  className,
  showIcon = true,
  size = "md",
}: StatusBadgeProps) {
  const normalized = (status || "").toUpperCase() as ContentStatusType;

  const config: Record<
    ContentStatusType,
    { label: string; icon: React.ComponentType<{ className?: string }>; classes: string }
  > = {
    DRAFT: {
      label: "Draft",
      icon: FileEdit,
      classes: "bg-slate-100 text-slate-700 border-slate-200",
    },
    PENDING_APPROVAL: {
      label: "Pending Approval",
      icon: Clock,
      classes: "bg-amber-50 text-amber-800 border-amber-200 font-medium",
    },
    APPROVED: {
      label: "Approved",
      icon: CheckCircle2,
      classes: "bg-primary-light text-primary-dark border-primary/20 font-medium",
    },
    PUBLISHED: {
      label: "Published",
      icon: Globe2,
      classes: "bg-emerald-50 text-emerald-800 border-emerald-200 font-medium",
    },
    REJECTED: {
      label: "Rejected",
      icon: AlertCircle,
      classes: "bg-emergency-light text-emergency-dark border-emergency/30 font-medium",
    },
    ARCHIVED: {
      label: "Archived",
      icon: Archive,
      classes: "bg-slate-50 text-slate-500 border-slate-200",
    },
  };

  const current = config[normalized] || {
    label: status,
    icon: FileEdit,
    classes: "bg-slate-100 text-slate-700 border-slate-200",
  };

  const IconComponent = current.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill border tracking-tight transition-colors",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs",
        current.classes,
        className
      )}
    >
      {showIcon && <IconComponent className={cn(size === "sm" ? "h-3.5 w-3.5" : "h-4.5 w-4.5")} />}
      <span>{current.label}</span>
    </span>
  );
}
