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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AdminSidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  sidebarWidth?: number;
  isResizing?: boolean;
  onStartResize?: (e: React.MouseEvent) => void;
  onResetWidth?: () => void;
  hospitalName?: string;
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

export function AdminSidebar({
  mobileOpen,
  onCloseMobile,
  isCollapsed,
  onToggleCollapse,
  sidebarWidth = 260,
  isResizing = false,
  onStartResize,
  onResetWidth,
  hospitalName = "Medhen Beza Hospital",
}: AdminSidebarProps) {
  const pathname = usePathname();
  const { currentUser, navGroups, logout } = useAdminRole();

  const brandName = hospitalName.replace(/hospital|specialized/gi, "").trim() || hospitalName;

  const isLinkActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  /** Content rendered inside desktop rail / expanded sidebar */
  const renderSidebarContent = (isMobileDrawer = false) => {
    const collapsed = !isMobileDrawer && isCollapsed;

    return (
      <div className="flex h-full flex-col bg-surface border-r border-border select-none overflow-hidden">
        {/* Hospital CMS Brand Header */}
        <div
          className={cn(
            "flex h-[72px] lg:h-[76px] items-center border-b border-border shrink-0 transition-all",
            collapsed ? "justify-center px-2" : "justify-between px-4"
          )}
        >
          <Link
            href="/admin"
            onClick={isMobileDrawer ? onCloseMobile : undefined}
            className="flex items-center gap-3 group focus:outline-none min-w-0"
            title={`${hospitalName} CMS`}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-white shadow-cta transition-transform group-hover:scale-105">
              <Cross className="h-5 w-5 rotate-45" />
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold tracking-tight text-text leading-tight group-hover:text-primary transition-colors whitespace-nowrap truncate max-w-[170px]" title={hospitalName}>
                  {brandName}
                </span>
                <span className="text-[10px] font-semibold text-secondary-dark tracking-wide uppercase whitespace-nowrap">
                  Hospital CMS
                </span>
              </div>
            )}
          </Link>

          {/* Desktop collapse toggle button */}
          {!isMobileDrawer && (
            <button
              onClick={onToggleCollapse}
              className={cn(
                "hidden md:flex h-8 w-8 items-center justify-center rounded-md text-text-muted hover:text-text hover:bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer",
                collapsed && "mt-1 h-7 w-7"
              )}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar to icons"}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
          )}

          {/* Mobile close button (>=44px touch target) */}
          {isMobileDrawer && (
            <button
              onClick={onCloseMobile}
              className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md text-text-muted hover:text-text hover:bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              aria-label="Close navigation sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Role Badge Indicator */}
        {!collapsed ? (
          <div className="px-4 py-2.5 bg-background border-b border-border shrink-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-light whitespace-nowrap">
                Current Access
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-pill text-[10px] font-bold bg-primary-light text-primary-dark border border-primary/20 whitespace-nowrap">
                {currentUser.roleTitle}
              </span>
            </div>
          </div>
        ) : (
          <div
            className="py-2 flex justify-center bg-background border-b border-border shrink-0"
            title={`Active Role: ${currentUser.roleTitle}`}
          >
            <span className="inline-block h-2 w-2 rounded-full bg-primary" />
          </div>
        )}

        {/* Nav Items List */}
        <div
          className={cn(
            "flex-1 overflow-y-auto overflow-x-hidden py-3",
            collapsed ? "px-2 space-y-4" : "px-3 space-y-5"
          )}
        >
          {navGroups.map((group, gIdx) => (
            <div key={group.groupTitle || gIdx} className="space-y-1">
              {group.groupTitle && !collapsed && (
                <h3 className="px-3 text-[10px] font-bold uppercase tracking-wider text-text-light/90 whitespace-normal break-words">
                  {group.groupTitle}
                </h3>
              )}
              {collapsed && gIdx > 0 && (
                <div className="h-px bg-border/60 my-2 mx-1" />
              )}
              <div className="space-y-1 mt-1">
                {group.items.map((item) => {
                  const IconComponent = ICON_MAP[item.iconName] || FileText;
                  const active = isLinkActive(item.href);

                  if (collapsed) {
                    // Icon-only rail mode with accessible hover tooltip
                    return (
                      <div
                        key={item.href}
                        className="relative group/navtip flex justify-center"
                      >
                        <Link
                          href={item.href}
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary",
                            active
                              ? "bg-primary text-white shadow-xs"
                              : "text-text-muted hover:bg-background hover:text-text"
                          )}
                          aria-label={item.title}
                        >
                          <IconComponent className="h-5 w-5 shrink-0" />
                          {item.badge !== undefined && (
                            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-emergency" />
                          )}
                        </Link>

                        {/* Floating Tooltip */}
                        <div className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 hidden group-hover/navtip:flex group-focus-within/navtip:flex items-center gap-2 whitespace-nowrap rounded-md bg-text px-3 py-1.5 text-xs font-semibold text-white shadow-lg animate-in fade-in-0 zoom-in-95">
                          <span>{item.title}</span>
                          {item.badge !== undefined && (
                            <Badge
                              variant={item.badgeVariant || "primary"}
                              className="px-1.5 py-0 text-[10px] font-bold h-4"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  }

                  // Expanded mode: readable wrapped text, never cut off mid-word
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={isMobileDrawer ? onCloseMobile : undefined}
                      className={cn(
                        "flex items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-all group min-h-[40px] focus:outline-none focus:ring-2 focus:ring-primary",
                        active
                          ? "bg-primary-light text-primary-dark font-semibold border border-primary/20 shadow-none"
                          : "text-text-muted hover:bg-background hover:text-text"
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <IconComponent
                          className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            active
                              ? "text-primary"
                              : "text-text-light group-hover:text-primary"
                          )}
                        />
                        <span className="break-words whitespace-normal leading-snug">
                          {item.title}
                        </span>
                      </div>

                      {item.badge !== undefined && (
                        <Badge
                          variant={item.badgeVariant || "primary"}
                          className={cn(
                            "shrink-0 px-1.5 py-0 text-[10px] font-bold h-4 min-w-4 flex items-center justify-center",
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
        <div className="border-t border-border p-2.5 bg-background shrink-0">
          {!collapsed ? (
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
                className="min-h-[36px] min-w-[36px] flex items-center justify-center text-text-light hover:text-emergency hover:bg-emergency-light/50 rounded-md transition-colors"
                title="Sign out of CMS"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="h-8 w-8 rounded-full object-cover border border-border"
                title={`${currentUser.name} (${currentUser.roleTitle})`}
              />
              <Link
                href="/admin/login"
                onClick={logout}
                className="h-8 w-8 flex items-center justify-center text-text-light hover:text-emergency hover:bg-emergency-light/50 rounded-md transition-colors"
                title="Sign out of CMS"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Desktop / Tablet Persistent Sidebar (Resizable) */}
      <aside
        style={{
          width: isCollapsed ? 64 : sidebarWidth,
          transition: isResizing ? "none" : "width 0.2s ease",
        }}
        className={cn(
          "hidden md:flex flex-col fixed inset-y-0 left-0 z-30",
          isCollapsed ? "w-16" : ""
        )}
      >
        {renderSidebarContent(false)}

        {/* Interactive Resizer Handle on right border */}
        {!isCollapsed && onStartResize && (
          <div
            onMouseDown={onStartResize}
            onDoubleClick={onResetWidth}
            title="Drag to resize sidebar width (double-click to reset)"
            className={cn(
              "hidden md:flex items-center justify-center absolute top-0 -right-1.5 bottom-0 w-3 hover:w-4 cursor-col-resize z-40 select-none group",
              isResizing ? "bg-primary/20" : "hover:bg-primary/10"
            )}
          >
            {/* Grip line indicator */}
            <div
              className={cn(
                "w-0.5 h-12 rounded-full transition-colors",
                isResizing ? "bg-primary w-1" : "bg-border group-hover:bg-primary"
              )}
            />
          </div>
        )}
      </aside>

      {/* Mobile Slide-Over Drawer with Backdrop (Matches Public MobileNav pattern) */}
      <div
        aria-hidden={!mobileOpen}
        className={cn(
          "fixed inset-0 z-50 md:hidden transition-all duration-300",
          mobileOpen ? "visible" : "invisible pointer-events-none"
        )}
      >
        {/* Backdrop */}
        <div
          className={cn(
            "fixed inset-0 bg-text/50 backdrop-blur-xs transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={onCloseMobile}
        />

        {/* Drawer Panel */}
        <div
          className={cn(
            "fixed inset-y-0 left-0 flex w-[min(300px,85vw)] flex-col bg-surface shadow-modal transition-transform duration-300 ease-in-out z-10",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Admin Navigation Menu"
        >
          {renderSidebarContent(true)}
        </div>
      </div>
    </>
  );
}
