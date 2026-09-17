"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminRole } from "./role-context";
import { UserRoleType, MOCK_USERS } from "@/lib/admin/types";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminTopbarProps {
  onToggleMobileSidebar: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
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
}: AdminTopbarProps) {
  const pathname = usePathname();
  const { currentRole, currentUser, setRole, logout } = useAdminRole();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

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
        {/* Interactive Role Switcher Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-1.5 sm:gap-2 rounded-lg border border-border bg-background px-2 sm:px-3 py-1.5 min-h-[44px] sm:min-h-[36px] text-xs font-medium text-text hover:bg-primary-light/50 transition-colors shadow-none focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              title="Switch simulated user role to test permissions"
            >
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-xs ${currentRoleOption.colorClass}`}
              >
                <IconComponent className="h-3.5 w-3.5" />
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-[10px] uppercase tracking-wider text-text-light font-semibold leading-none">
                  Simulating Role
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
          <DropdownMenuContent align="end" className="w-72 p-2">
            <DropdownMenuLabel className="text-xs font-semibold text-text-light px-2 pb-1">
              Switch Role for Testing (RBAC UI)
            </DropdownMenuLabel>
            <p className="text-[11px] text-text-muted px-2 pb-2 leading-relaxed">
              Select a hospital role to instantly test its filtered navigation and authorization permissions:
            </p>
            <DropdownMenuSeparator />
            <div className="space-y-1">
              {ROLE_OPTIONS.map((item) => {
                const ItemIcon = item.icon;
                const isSelected = item.role === currentRole;
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
                        <span className="text-xs font-semibold">{item.label}</span>
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

        {/* View Public Site Link */}
        <Link
          href="/"
          target="_blank"
          className="hidden md:inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text hover:bg-background hover:text-primary transition-colors"
        >
          <span>Public Site</span>
          <ExternalLink className="h-3.5 w-3.5 text-text-light" />
        </Link>

        {/* Notifications Icon (Stubbed) */}
        <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
          <DropdownMenuTrigger asChild>
            <button
              className="relative min-h-[44px] min-w-[44px] sm:min-h-[36px] sm:min-w-[36px] sm:h-9 sm:w-9 flex items-center justify-center rounded-lg border border-border bg-surface text-text hover:bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer shrink-0"
              aria-label="View notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute 1 top-1.5 right-1.5 sm:top-1 sm:right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emergency text-[10px] font-bold text-white">
                3
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-2">
            <div className="flex items-center justify-between px-2 py-1.5">
              <span className="text-xs font-semibold text-text">Notifications</span>
              <span className="text-[11px] text-primary hover:underline cursor-pointer">
                Mark all as read
              </span>
            </div>
            <DropdownMenuSeparator />
            <div className="space-y-2 py-1">
              <div className="rounded-md bg-amber-50/70 p-2.5 text-xs text-text border border-amber-100">
                <p className="font-semibold text-amber-900">Pending Review</p>
                <p className="text-amber-800 text-[11px] mt-0.5">
                  Dr. Bethlehem submitted "Senior Cardiologist Profile" for approval.
                </p>
                <span className="text-[10px] text-amber-600 mt-1 block">15 minutes ago</span>
              </div>
              <div className="rounded-md bg-background p-2.5 text-xs text-text border border-border">
                <p className="font-semibold text-text">New Inbound Inquiry</p>
                <p className="text-text-muted text-[11px] mt-0.5">
                  Patient message received regarding Cardiology consultation hours.
                </p>
                <span className="text-[10px] text-text-light mt-1 block">1 hour ago</span>
              </div>
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
              <p className="text-xs font-semibold text-text">{currentUser.name}</p>
              <p className="text-[11px] text-text-muted">{currentUser.email}</p>
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
            <DropdownMenuItem asChild>
              <Link href="/admin/login" onClick={logout} className="cursor-pointer text-xs text-emergency">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
