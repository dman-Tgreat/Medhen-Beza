"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useTransition } from "react";
import { UserRoleType, AdminUser, MOCK_USERS, NavGroup } from "@/lib/admin/types";
import { SessionUser } from "@/lib/auth/jwt";
import { logoutAction } from "@/lib/actions/auth";

interface AdminRoleContextType {
  currentRole: UserRoleType;
  realUser: SessionUser | null;
  currentUser: AdminUser;
  setRole: (role: UserRoleType) => void;
  resetRole: () => void;
  isLoggedIn: boolean;
  isSimulating: boolean;
  canSimulate: boolean;
  logout: () => Promise<void>;
  canAccessRoute: (pathname: string) => boolean;
  canApprove: boolean;
  canPublish: boolean;
  isSysAdmin: boolean;
  navGroups: NavGroup[];
}

const AdminRoleContext = createContext<AdminRoleContextType | undefined>(undefined);

const ROLE_SIMULATION_STORAGE_KEY = "medhen_admin_simulated_role";

// Feature flag: Role simulation is enabled in dev or when explicitly enabled
const IS_SIMULATION_ENABLED =
  process.env.NEXT_PUBLIC_ENABLE_ROLE_SIMULATION === "true" ||
  process.env.NODE_ENV !== "production";

// Master navigation catalog with role-based visibility according to requirements
const ALL_NAV_GROUPS: NavGroup[] = [
  {
    groupTitle: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/admin",
        iconName: "LayoutDashboard",
        roles: [
          "HOSPITAL_DIRECTOR",
          "MEDICAL_DIRECTOR",
          "HR_STAFF",
          "CONTENT_STAFF",
          "SYSTEM_ADMIN",
        ],
      },
    ],
  },
  {
    groupTitle: "Medical Content",
    items: [
      {
        title: "Doctors Directory",
        href: "/admin/content/doctors",
        iconName: "Stethoscope",
        roles: ["HOSPITAL_DIRECTOR", "MEDICAL_DIRECTOR"],
      },
      {
        title: "Departments",
        href: "/admin/content/departments",
        iconName: "Building2",
        roles: ["HOSPITAL_DIRECTOR", "MEDICAL_DIRECTOR"],
      },
      {
        title: "Clinical Services",
        href: "/admin/content/services",
        iconName: "Activity",
        roles: ["HOSPITAL_DIRECTOR", "MEDICAL_DIRECTOR"],
      },
    ],
  },
  {
    groupTitle: "Careers & HR",
    items: [
      {
        title: "Vacancies & Careers",
        href: "/admin/content/careers",
        iconName: "Briefcase",
        roles: ["HOSPITAL_DIRECTOR", "HR_STAFF"],
      },
    ],
  },
  {
    groupTitle: "Editorial & Content",
    items: [
      {
        title: "News & Articles",
        href: "/admin/content/news",
        iconName: "Newspaper",
        roles: ["HOSPITAL_DIRECTOR", "CONTENT_STAFF"],
      },
      {
        title: "Media Gallery",
        href: "/admin/content/gallery",
        iconName: "Image",
        roles: ["HOSPITAL_DIRECTOR", "CONTENT_STAFF"],
      },
      {
        title: "Events & Workshops",
        href: "/admin/content/events",
        iconName: "Calendar",
        roles: ["HOSPITAL_DIRECTOR", "CONTENT_STAFF"],
      },
      {
        title: "Hospital Facilities",
        href: "/admin/content/facilities",
        iconName: "Hotel",
        roles: ["HOSPITAL_DIRECTOR", "CONTENT_STAFF"],
      },
      {
        title: "FAQs",
        href: "/admin/content/faqs",
        iconName: "HelpCircle",
        roles: ["HOSPITAL_DIRECTOR", "CONTENT_STAFF"],
      },
      {
        title: "Static Pages",
        href: "/admin/content/pages",
        iconName: "FileText",
        roles: ["HOSPITAL_DIRECTOR", "CONTENT_STAFF"],
      },
    ],
  },
  {
    groupTitle: "Digital Assets",
    items: [
      {
        title: "Media Library",
        href: "/admin/media",
        iconName: "FolderArchive",
        roles: [
          "HOSPITAL_DIRECTOR",
          "MEDICAL_DIRECTOR",
          "HR_STAFF",
          "CONTENT_STAFF",
          "SYSTEM_ADMIN",
        ],
      },
    ],
  },
  {
    groupTitle: "Workflows",
    items: [
      {
        title: "Approval Queue",
        href: "/admin/approvals",
        iconName: "CheckCircle2",
        badge: 3,
        badgeVariant: "primary",
        roles: [
          "HOSPITAL_DIRECTOR",
          "MEDICAL_DIRECTOR",
          "HR_STAFF",
          "CONTENT_STAFF",
        ],
      },
    ],
  },
  {
    groupTitle: "Inquiries",
    items: [
      {
        title: "Contact Messages",
        href: "/admin/messages",
        iconName: "Mail",
        badge: 5,
        badgeVariant: "emergency",
        roles: ["HOSPITAL_DIRECTOR", "CONTENT_STAFF"],
      },
    ],
  },
  {
    groupTitle: "Administration",
    items: [
      {
        title: "User Management",
        href: "/admin/users",
        iconName: "Users",
        roles: ["HOSPITAL_DIRECTOR", "SYSTEM_ADMIN"],
      },
      {
        title: "Roles & Permissions",
        href: "/admin/roles-permissions",
        iconName: "ShieldCheck",
        roles: ["HOSPITAL_DIRECTOR", "SYSTEM_ADMIN"],
      },
    ],
  },
  {
    groupTitle: "System & Compliance",
    items: [
      {
        title: "Audit Logs",
        href: "/admin/audit-logs",
        iconName: "History",
        roles: ["HOSPITAL_DIRECTOR", "SYSTEM_ADMIN"],
      },
      {
        title: "Settings",
        href: "/admin/settings",
        iconName: "Settings",
        roles: ["HOSPITAL_DIRECTOR", "SYSTEM_ADMIN"],
      },
    ],
  },
];

const ROLE_DISPLAY_NAMES: Record<UserRoleType, string> = {
  HOSPITAL_DIRECTOR: "Hospital Director",
  MEDICAL_DIRECTOR: "Medical Director",
  HR_STAFF: "HR Staff",
  CONTENT_STAFF: "Content Staff / Editor",
  SYSTEM_ADMIN: "System Administrator",
};

interface AdminRoleProviderProps {
  children: ReactNode;
  initialSession?: SessionUser | null;
}

export function AdminRoleProvider({ children, initialSession }: AdminRoleProviderProps) {
  const [, startTransition] = useTransition();

  // Primary authenticated user role from server session or fallback
  const sessionPrimaryRole = (initialSession?.primaryRole as UserRoleType) || "HOSPITAL_DIRECTOR";

  const [currentRole, setCurrentRoleState] = useState<UserRoleType>(sessionPrimaryRole);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (IS_SIMULATION_ENABLED) {
      try {
        const savedSimulatedRole = localStorage.getItem(ROLE_SIMULATION_STORAGE_KEY) as UserRoleType | null;
        if (savedSimulatedRole && MOCK_USERS[savedSimulatedRole]) {
          setCurrentRoleState(savedSimulatedRole);
        } else {
          setCurrentRoleState(sessionPrimaryRole);
        }
      } catch {
        // storage disabled / private browsing
      }
    } else {
      setCurrentRoleState(sessionPrimaryRole);
    }
    setMounted(true);
  }, [sessionPrimaryRole]);

  const setRole = (role: UserRoleType) => {
    if (!IS_SIMULATION_ENABLED) return;
    setCurrentRoleState(role);
    try {
      localStorage.setItem(ROLE_SIMULATION_STORAGE_KEY, role);
    } catch {
      // no-op
    }
  };

  const resetRole = () => {
    setCurrentRoleState(sessionPrimaryRole);
    try {
      localStorage.removeItem(ROLE_SIMULATION_STORAGE_KEY);
    } catch {
      // no-op
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem(ROLE_SIMULATION_STORAGE_KEY);
    } catch {
      // no-op
    }
    startTransition(async () => {
      await logoutAction();
    });
  };

  const isSimulating = IS_SIMULATION_ENABLED && currentRole !== sessionPrimaryRole;

  // Build the unified user object matching the current effective role
  const currentUser: AdminUser = initialSession
    ? {
        id: initialSession.id,
        name: initialSession.name,
        email: initialSession.email,
        role: currentRole,
        roleTitle: ROLE_DISPLAY_NAMES[currentRole] || currentRole,
        avatarUrl:
          initialSession.avatarUrl ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(initialSession.name)}&background=008080&color=fff`,
        isActive: true,
      }
    : MOCK_USERS[currentRole] || MOCK_USERS.HOSPITAL_DIRECTOR;

  // Filter navigation groups for the active role
  const navGroups: NavGroup[] = ALL_NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items
      .filter((item) => item.roles.includes(currentRole))
      .map((item) => {
        // Customize approval label for non-Hospital Directors
        if (item.href === "/admin/approvals" && currentRole !== "HOSPITAL_DIRECTOR") {
          return {
            ...item,
            title: "Approval Status",
          };
        }
        return item;
      }),
  })).filter((group) => group.items.length > 0);

  const canAccessRoute = (pathname: string): boolean => {
    if (pathname === "/admin" || pathname === "/admin/login") return true;

    // Check if pathname matches any accessible nav item
    for (const group of ALL_NAV_GROUPS) {
      for (const item of group.items) {
        if (pathname === item.href || pathname.startsWith(`${item.href}/`)) {
          return item.roles.includes(currentRole);
        }
      }
    }
    return true;
  };

  const canApprove = currentRole === "HOSPITAL_DIRECTOR";
  const canPublish = currentRole === "HOSPITAL_DIRECTOR";
  const isSysAdmin = currentRole === "SYSTEM_ADMIN";

  if (!mounted) {
    return null;
  }

  return (
    <AdminRoleContext.Provider
      value={{
        currentRole,
        realUser: initialSession ?? null,
        currentUser,
        setRole,
        resetRole,
        isLoggedIn: !!initialSession,
        isSimulating,
        canSimulate: IS_SIMULATION_ENABLED,
        logout: handleLogout,
        canAccessRoute,
        canApprove,
        canPublish,
        isSysAdmin,
        navGroups,
      }}
    >
      {children}
    </AdminRoleContext.Provider>
  );
}

export function useAdminRole() {
  const context = useContext(AdminRoleContext);
  if (!context) {
    throw new Error("useAdminRole must be used within an AdminRoleProvider");
  }
  return context;
}
