"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminRole } from "./role-context";
import { UserRoleType } from "@/lib/admin/types";
import {
  Menu,
  ExternalLink,
  Bell,
  Check,
  ChevronDown,
  UserCheck,
  LogOut,
  Shield,
  Stethoscope,
  Briefcase,
  Edit3,
  Sliders,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { NotificationItem } from "@/components/admin/admin-layout-shell";
import { markAllNotificationsReadAction, markNotificationReadAction } from "@/lib/actions/transitions";

interface AdminTopbarProps {
  onToggleMobileSidebar: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  initialNotifications?: NotificationItem[];
}

const ROLE_OPTIONS: {
  role: UserRoleType;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
}[] = [
  {
    role: "HOSPITAL_DIRECTOR",
    label: "Hospital Director",
    sublabel: "Full oversight & approval",
    icon: Shield,
    colorClass: "text-primary bg-primary-light border-primary/20",
  },
  {
    role: "MEDICAL_DIRECTOR",
    label: "Medical Director",
    sublabel: "Clinical content author",
    icon: Stethoscope,
    colorClass: "text-secondary-dark bg-secondary-light border-secondary/20",
  },
  {
    role: "HR_STAFF",
    label: "HR Staff",
    sublabel: "Careers & vacancies",
    icon: Briefcase,
    colorClass: "text-indigo-700 bg-indigo-50 border-indigo-200",
  },
  {
    role: "CONTENT_STAFF",
    label: "Content Staff / Editor",
    sublabel: "News, gallery & events",
    icon: Edit3,
    colorClass: "text-amber-700 bg-amber-50 border-amber-200",
  },
  {
    role: "SYSTEM_ADMIN",
    label: "System Administrator",
    sublabel: "Technical IT & RBAC",
    icon: Sliders,
    colorClass: "text-slate-700 bg-slate-100 border-slate-200",
  },
];

export function AdminTopbar({
  onToggleMobileSidebar,
  isCollapsed = false,
  onToggleCollapse,
  initialNotifications = [],
}: AdminTopbarProps) {
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const [renderedAt] = useState(() => Date.now());
  const {
    currentRole,
    currentUser,
    realUser,
    isSimulating,
    canSimulate,
    setRole,
    resetRole,
    logout,
  } = useAdminRole();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  function handleMarkAllRead() {
    startTransition(async () => {
      await markAllNotificationsReadAction();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    });
  }

  function handleMarkOneRead(id: string) {
    startTransition(async () => {
      await markNotificationReadAction(id);
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
    });
  }

  function getNotificationBg(type: string) {
    switch (type) {
      case "SUBMITTED": return "bg-amber-50/70 border-amber-100";
      case "APPROVED": return "bg-emerald-50/70 border-emerald-100";
      case "REJECTED": return "bg-red-50/70 border-red-100";
      case "PUBLISHED": return "bg-teal-50/70 border-teal-100";
      default: return "bg-background border-border";
    }
  }

  function getRelativeTime(iso: string) {
    const diff = renderedAt - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  // Generate page heading from pathname
  const getPageTitle = (path: string) => {
    if (path === "/admin") return "Dashboard Overview";
    if (path === "/admin/approvals") {
      return currentRole === "HOSPITAL_DIRECTOR" ? "Content Approval Queue" : "My Submission Status";
    }
    if (path === "/admin/messages") return "Contact Inquiries";
    if (path === "/admin/media") return "Media Assets Library";
    if (path === "/admin/users") return "Administrative Users";
    if (path === "/admin/roles-permissions") return "Role-Based Access Control (RBAC)";
    if (path === "/admin/audit-logs") return "Audit Trail & Activity Log";
    if (path === "/admin/settings") return "System & CMS Settings";

    if (path.startsWith("/admin/content/")) {
      const slug = path.replace("/admin/content/", "");
      const titleMap: Record<string, string> = {
        doctors: "Doctors Directory",
        departments: "Departments Management",
        services: "Clinical Services",
        facilities: "Hospital Facilities",
        news: "News & Articles",
        gallery: "Media Gallery",
        events: "Events & Workshops",
        careers: "Job Vacancies",
        faqs: "Frequently Asked Questions",
        pages: "Static CMS Pages",
      };
      return titleMap[slug] || "Content Management";
    }

    return "Hospital CMS";
  };

  const currentRoleOption = ROLE_OPTIONS.find((r) => r.role === currentRole) || ROLE_OPTIONS[0];
  const IconComponent = currentRoleOption.icon;

  return (
    <header className="sticky top-0 z-30 flex min-h-[72px] lg:min-h-[76px] py-2.5 sm:py-3 w-full items-center justify-between border-b border-border bg-surface px-3 sm:px-4 md:px-6 shadow-sm gap-3">
      {/* Left: Mobile menu button / Desktop rail toggle & page title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Mobile menu button (>=44px touch target) */}
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg border border-border bg-surface text-text hover:bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer shrink-0"
          aria-label="Toggle mobile navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Tablet / Desktop rail toggle button */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="hidden md:flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-text-muted hover:text-text hover:bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer shrink-0"
            title={isCollapsed ? "Expand sidebar (256px)" : "Collapse sidebar to rail (64px)"}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Menu className="h-4 w-4" />
          </button>
        )}

        <div className="flex flex-col min-w-0">
          <div className="hidden sm:flex items-center gap-2 text-xs text-text-light">
            <span>Medhen Beza CMS</span>
            <span>/</span>
            <span className="font-medium text-text capitalize">
              {pathname.split("/")[2] || "Dashboard"}
            </span>
          </div>
          <h1 className="text-sm sm:text-base md:text-lg font-bold text-text tracking-tight truncate">
            {getPageTitle(pathname)}
          </h1>
        </div>
      </div>

      {/* Right: Role Switcher, Public link, Notifications, Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0">
        {/* Role Display or Role Simulation Toggle (Dev/QA) */}
        {canSimulate ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`flex items-center gap-1.5 sm:gap-2 rounded-lg border px-2 sm:px-3 py-1.5 min-h-[44px] sm:min-h-[36px] text-xs font-medium transition-colors shadow-none focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer ${
                  isSimulating
                    ? "border-amber-400 bg-amber-50 text-amber-900 ring-1 ring-amber-400/50"
                    : "border-border bg-background text-text hover:bg-primary-light/50"
                }`}
                title="Switch simulated user role for QA and permission testing"
              >
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-xs ${currentRoleOption.colorClass}`}
                >
                  <IconComponent className="h-3.5 w-3.5" />
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-[9px] uppercase tracking-wider text-text-light font-bold leading-none flex items-center gap-1">
                    {isSimulating ? (
                      <span className="text-amber-700 flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5" /> Simulating
                      </span>
                    ) : (
                      "Active Role"
                    )}
                  </span>
                  <span className="text-xs font-semibold text-text leading-tight whitespace-nowrap">
                    {currentRoleOption.label}
                  </span>
                </div>
                <span className="hidden sm:inline-block lg:hidden text-xs font-semibold text-text whitespace-nowrap">
                  {currentRoleOption.label.split(" ")[0]}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-text-muted shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-76 p-2">
              <div className="px-2 py-1 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-text flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Role Simulation (QA Mode)
                  </span>
                  <p className="text-[11px] text-text-muted mt-0.5 leading-snug">
                    Test filtered navigation and RBAC guards across staff roles:
                  </p>
                </div>
              </div>

              {isSimulating && (
                <div className="mx-1 my-1 p-2 rounded-md bg-amber-50 border border-amber-200 flex items-center justify-between">
                  <span className="text-[11px] text-amber-800 font-medium">
                    Simulating <strong>{currentRoleOption.label}</strong>
                  </span>
                  <button
                    onClick={resetRole}
                    className="text-[10px] font-semibold text-amber-900 hover:underline flex items-center gap-1 cursor-pointer bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300"
                  >
                    <RotateCcw className="w-2.5 h-2.5" /> Reset
                  </button>
                </div>
              )}

              <DropdownMenuSeparator />
              <div className="space-y-1">
                {ROLE_OPTIONS.map((item) => {
                  const ItemIcon = item.icon;
                  const isSelected = item.role === currentRole;
                  const isActual = realUser?.primaryRole === item.role;

                  return (
                    <DropdownMenuItem
                      key={item.role}
                      onClick={() => setRole(item.role)}
                      className={`flex items-start gap-2.5 p-2 rounded-md cursor-pointer ${
                        isSelected ? "bg-primary-light text-primary-dark font-medium" : ""
                      }`}
                    >
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border text-xs mt-0.5 ${item.colorClass}`}
                      >
                        <ItemIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold flex items-center gap-1">
                            {item.label}
                            {isActual && (
                              <span className="text-[9px] bg-slate-200 text-slate-700 px-1 py-0.2 rounded font-normal">
                                Your Role
                              </span>
                            )}
                          </span>
                          {isSelected && <Check className="h-3.5 w-3.5 text-primary" />}
                        </div>
                        <span className="text-[11px] text-text-muted block">
                          {item.sublabel}
                        </span>
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          /* Production Static Role Badge */
          <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 min-h-[36px]">
            <div
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-xs ${currentRoleOption.colorClass}`}
            >
              <IconComponent className="h-3.5 w-3.5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[9px] uppercase tracking-wider text-text-light font-bold leading-none">
                Role
              </span>
              <span className="text-xs font-semibold text-text leading-tight whitespace-nowrap">
                {currentRoleOption.label}
              </span>
            </div>
          </div>
        )}

        {/* View Public Site Link */}
        <Link
          href="/"
          target="_blank"
          className="hidden md:inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text hover:bg-background hover:text-primary transition-colors"
        >
          <span>Public Site</span>
          <ExternalLink className="h-3.5 w-3.5 text-text-light" />
        </Link>

        {/* Notifications Icon */}
        <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
          <DropdownMenuTrigger asChild>
            <button
              className="relative min-h-[44px] min-w-[44px] sm:min-h-[36px] sm:min-w-[36px] sm:h-9 sm:w-9 flex items-center justify-center rounded-lg border border-border bg-surface text-text hover:bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer shrink-0"
              aria-label="View notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 sm:top-1 sm:right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emergency text-[10px] font-bold text-white">{unreadCount > 9 ? "9+" : unreadCount}</span>}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-2">
            <div className="flex items-center justify-between px-2 py-1.5">
              <span className="text-xs font-semibold text-text">Notifications</span>
              <button type="button" onClick={handleMarkAllRead} className="text-[11px] text-primary hover:underline cursor-pointer">
                Mark all as read
              </button>
            </div>
            <DropdownMenuSeparator />
            <div className="space-y-2 py-1">
              {notifications.length === 0 ? <p className="px-2 py-3 text-xs text-text-muted">No notifications.</p> : notifications.map((notification) => (
                <button key={notification.id} type="button" onClick={() => handleMarkOneRead(notification.id)} className={`w-full rounded-md border p-2.5 text-left text-xs ${getNotificationBg(notification.type)} ${notification.isRead ? "opacity-70" : ""}`}>
                  <p className="font-semibold text-text">{notification.title}</p>
                  <p className="mt-0.5 text-[11px] text-text-muted">{notification.message}</p>
                  <span className="mt-1 block text-[10px] text-text-light">{getRelativeTime(notification.createdAt)}</span>
                </button>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="min-h-[44px] min-w-[44px] sm:min-h-[36px] sm:min-w-[36px] flex items-center justify-center rounded-full border border-border p-0.5 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer shrink-0">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="h-8 w-8 rounded-full object-cover border border-border"
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-2">
            <div className="px-2 py-1.5">
              <p className="text-xs font-semibold text-text truncate">{currentUser.name}</p>
              <p className="text-[11px] text-text-muted truncate">{currentUser.email}</p>
              <span className="mt-1.5 inline-block rounded-pill bg-primary-light px-2 py-0.5 text-[10px] font-semibold text-primary-dark">
                {currentUser.roleTitle}
              </span>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/settings" className="cursor-pointer text-xs">
                <UserCheck className="mr-2 h-4 w-4" />
                Account Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => logout()}
              className="cursor-pointer text-xs text-emergency focus:text-emergency focus:bg-red-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
