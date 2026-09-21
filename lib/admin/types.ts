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
