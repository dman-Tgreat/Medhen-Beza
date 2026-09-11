export type UserRoleType =
  | "HOSPITAL_DIRECTOR"
  | "MEDICAL_DIRECTOR"
  | "HR_STAFF"
  | "CONTENT_STAFF"
  | "SYSTEM_ADMIN";

export type ContentStatusType =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "PUBLISHED"
  | "REJECTED"
  | "ARCHIVED";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRoleType;
  roleTitle: string;
  department?: string;
  avatarUrl?: string;
  isActive: boolean;
}

export const MOCK_USERS: Record<UserRoleType, AdminUser> = {
  HOSPITAL_DIRECTOR: {
    id: "user-1",
    name: "Dr. Samuel Bekele",
    email: "director@medhenbeza.com",
    role: "HOSPITAL_DIRECTOR",
    roleTitle: "Hospital Director",
    department: "Executive Leadership",
    avatarUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200",
    isActive: true,
  },
  MEDICAL_DIRECTOR: {
    id: "user-2",
    name: "Dr. Bethlehem Tadesse",
    email: "medical.director@medhenbeza.com",
    role: "MEDICAL_DIRECTOR",
    roleTitle: "Medical Director",
    department: "Clinical Operations",
    avatarUrl: "https://images.unsplash.com/photo-1594824813620-460d1dd5d15b?auto=format&fit=crop&q=80&w=200",
    isActive: true,
  },
  HR_STAFF: {
    id: "user-3",
    name: "Hanna Worku",
    email: "hr@medhenbeza.com",
    role: "HR_STAFF",
    roleTitle: "HR Staff",
    department: "Human Resources",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    isActive: true,
  },
  CONTENT_STAFF: {
    id: "user-4",
    name: "Abel Girma",
    email: "content@medhenbeza.com",
    role: "CONTENT_STAFF",
    roleTitle: "Content Staff / Editor",
    department: "Communications & PR",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    isActive: true,
  },
  SYSTEM_ADMIN: {
    id: "user-5",
    name: "Dawit Abebe",
    email: "sysadmin@medhenbeza.com",
    role: "SYSTEM_ADMIN",
    roleTitle: "System Administrator",
    department: "Information Technology",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    isActive: true,
  },
};

export interface NavItem {
  title: string;
  href: string;
  iconName: string;
  badge?: string | number;
  badgeVariant?: "primary" | "secondary" | "emergency" | "outline";
  roles: UserRoleType[];
}

export interface NavGroup {
  groupTitle?: string;
  items: NavItem[];
}
