"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { UserRoleType, AdminUser, MOCK_USERS, NavGroup } from "@/lib/admin/types";

interface AdminRoleContextType {
  currentRole: UserRoleType;
  currentUser: AdminUser;
  setRole: (role: UserRoleType) => void;
  isLoggedIn: boolean;
  login: (role?: UserRoleType) => void;
  logout: () => void;
  canAccessRoute: (pathname: string) => boolean;
  canApprove: boolean;
  canPublish: boolean;
  isSysAdmin: boolean;
  navGroups: NavGroup[];
}

const AdminRoleContext = createContext<AdminRoleContextType | undefined>(undefined);

const ROLE_STORAGE_KEY = "medhen_admin_role";
const AUTH_STORAGE_KEY = "medhen_admin_auth";

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
        // Hospital Director has full approval queue; Medical Director, HR, Content Staff see their submission statuses
        // System Administrator has NO content-approval access per requirements
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

export function AdminRoleProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRoleState] = useState<UserRoleType>("HOSPITAL_DIRECTOR");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const savedRole = localStorage.getItem(ROLE_STORAGE_KEY) as UserRoleType | null;
      if (savedRole && MOCK_USERS[savedRole]) {
        setCurrentRoleState(savedRole);
      }
      const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
      if (savedAuth !== null) {
        setIsLoggedIn(savedAuth === "true");
      }
    } catch {
      // Storage access may fail in private mode
    }
    setMounted(true);
  }, []);

  const setRole = (role: UserRoleType) => {
    setCurrentRoleState(role);
    try {
      localStorage.setItem(ROLE_STORAGE_KEY, role);
    } catch {
      // no-op
    }
  };

  const login = (role: UserRoleType = "HOSPITAL_DIRECTOR") => {
    setRole(role);
    setIsLoggedIn(true);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, "true");
    } catch {
      // no-op
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, "false");
    } catch {
      // no-op
    }
  };

  const currentUser = MOCK_USERS[currentRole] || MOCK_USERS.HOSPITAL_DIRECTOR;

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

  // Avoid flash before mount
  if (!mounted) {
    return null;
  }

  return (
    <AdminRoleContext.Provider
      value={{
        currentRole,
        currentUser,
        setRole,
        isLoggedIn,
        login,
        logout,
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
