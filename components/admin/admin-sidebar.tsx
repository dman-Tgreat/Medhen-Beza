"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminRole } from "./role-context";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Stethoscope,
  Building2,
  Activity,
  Briefcase,
  Newspaper,
  Image as ImageIcon,
  Calendar,
  Hotel,
  HelpCircle,
  FileText,
  FolderArchive,
  CheckCircle2,
  Mail,
  Users,
  ShieldCheck,
  History,
  Settings,
  X,
  Cross,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AdminSidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Stethoscope,
  Building2,
  Activity,
  Briefcase,
  Newspaper,
  Image: ImageIcon,
  Calendar,
  Hotel,
  HelpCircle,
  FileText,
  FolderArchive,
  CheckCircle2,
  Mail,
  Users,
  ShieldCheck,
  History,
  Settings,
};

export function AdminSidebar({ mobileOpen, onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();
  const { currentRole, currentUser, navGroups, logout } = useAdminRole();

  const isLinkActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const sidebarContent = (
    <div className="flex h-full flex-col bg-surface border-r border-border select-none">
      {/* Hospital CMS Brand Header */}
      <div className="flex h-16 items-center justify-between px-5 border-b border-border">
        <Link
          href="/admin"
          onClick={onCloseMobile}
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white shadow-cta transition-transform group-hover:scale-105">
            <Cross className="h-5 w-5 rotate-45" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-text leading-tight group-hover:text-primary transition-colors">
              Medhen Beza
            </span>
            <span className="text-[11px] font-semibold text-secondary-dark tracking-wide uppercase">
              Hospital CMS
            </span>
          </div>
        </Link>

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1 rounded-md text-text-muted hover:text-text hover:bg-background"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Role Badge Indicator */}
      <div className="px-4 py-3 bg-background border-b border-border">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-text-light">
            Current Access
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-pill text-[10px] font-bold bg-primary-light text-primary-dark border border-primary/20">
            {currentUser.roleTitle}
          </span>
        </div>
      </div>

      {/* Nav Items List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navGroups.map((group, gIdx) => (
          <div key={group.groupTitle || gIdx} className="space-y-1">
            {group.groupTitle && (
              <h3 className="px-3 text-[11px] font-bold uppercase tracking-wider text-text-light/90">
                {group.groupTitle}
              </h3>
            )}
            <div className="space-y-0.5 mt-1">
              {group.items.map((item) => {
                const IconComponent = ICON_MAP[item.iconName] || FileText;
                const active = isLinkActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onCloseMobile}
                    className={cn(
                      "flex items-center justify-between rounded-md px-3 py-2 text-xs font-medium transition-all group",
                      active
                        ? "bg-primary-light text-primary-dark font-semibold border border-primary/20 shadow-none"
                        : "text-text-muted hover:bg-background hover:text-text"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <IconComponent
                        className={cn(
                          "h-4 w-4 shrink-0 transition-colors",
                          active
                            ? "text-primary"
                            : "text-text-light group-hover:text-primary"
                        )}
                      />
                      <span className="truncate">{item.title}</span>
                    </div>

                    {item.badge !== undefined && (
                      <Badge
                        variant={item.badgeVariant || "primary"}
                        className={cn(
                          "px-1.5 py-0 text-[10px] font-bold h-4 min-w-4 flex items-center justify-center",
                          item.badgeVariant === "emergency"
                            ? "bg-emergency-light text-emergency-dark border-emergency/20"
                            : ""
                        )}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* User Profile Footer */}
      <div className="border-t border-border p-3 bg-background">
        <div className="flex items-center justify-between gap-2 p-1.5 rounded-lg">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="h-8 w-8 shrink-0 rounded-full object-cover border border-border"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-text truncate">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-text-light truncate">
                {currentUser.department || currentUser.roleTitle}
              </span>
            </div>
          </div>

          <Link
            href="/admin/login"
            onClick={logout}
            className="p-1.5 text-text-light hover:text-emergency hover:bg-emergency-light/50 rounded-md transition-colors"
            title="Sign out of CMS"
          >
            <LogOut className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed) */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay & Sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-text/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative flex w-72 flex-1 flex-col bg-surface shadow-modal z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
