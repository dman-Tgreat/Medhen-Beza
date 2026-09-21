"use client";

import React, { useState } from "react";
import { DataTable, ColumnDef } from "@/components/admin/data-table";
import { ContentFormModal, FormFieldConfig } from "@/components/admin/content-form-modal";
import { RoleGuard } from "@/components/admin/role-guard";
import { UserRoleType } from "@/lib/admin/types";
import { Users, Shield, Key, Check, X, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StaffUserRecord {
  id: string;
  name: string;
  email: string;
  role: UserRoleType;
  roleTitle: string;
  department: string;
  isActive: boolean;
  lastLogin: string;
}

const INITIAL_STAFF_USERS: StaffUserRecord[] = [
  {
    id: "usr-1",
    name: "Dr. Samuel Bekele",
    email: "director@medhenbeza.com",
    role: "HOSPITAL_DIRECTOR",
    roleTitle: "Hospital Director",
    department: "Executive Leadership",
    isActive: true,
    lastLogin: "Today, 10:45 AM",
  },
  {
    id: "usr-2",
    name: "Dr. Bethlehem Tadesse",
    email: "medical.director@medhenbeza.com",
    role: "MEDICAL_DIRECTOR",
    roleTitle: "Medical Director",
    department: "Clinical Operations",
    isActive: true,
    lastLogin: "Today, 09:30 AM",
  },
  {
    id: "usr-3",
    name: "Hanna Worku",
    email: "hr@medhenbeza.com",
    role: "HR_STAFF",
    roleTitle: "HR Staff",
    department: "Human Resources",
    isActive: true,
    lastLogin: "Yesterday",
  },
  {
    id: "usr-4",
    name: "Abel Girma",
    email: "content@medhenbeza.com",
    role: "CONTENT_STAFF",
    roleTitle: "Content Staff / Editor",
    department: "Communications",
    isActive: true,
    lastLogin: "Sep 10, 2026",
  },
  {
    id: "usr-5",
    name: "Dawit Abebe",
    email: "sysadmin@medhenbeza.com",
    role: "SYSTEM_ADMIN",
    roleTitle: "System Administrator",
    department: "IT & Infrastructure",
    isActive: true,
    lastLogin: "Today, 07:15 AM",
  },
];

const USER_FORM_FIELDS: FormFieldConfig[] = [
  {
    name: "name",
    label: "Staff Full Name",
    type: "text",
    placeholder: "e.g. Dr. Meron Haile",
    required: true,
  },
  {
    name: "email",
    label: "Institutional Email",
    type: "text",
    placeholder: "staff@medhenbeza.com",
    required: true,
  },
  {
    name: "department",
    label: "Department",
    type: "text",
    placeholder: "e.g. Pediatrics or Nursing",
    required: true,
  },
  {
    name: "role",
    label: "Assigned Role (RBAC)",
    type: "select",
    options: [
      { label: "Hospital Director", value: "HOSPITAL_DIRECTOR" },
      { label: "Medical Director", value: "MEDICAL_DIRECTOR" },
      { label: "HR Staff", value: "HR_STAFF" },
      { label: "Content Staff / Editor", value: "CONTENT_STAFF" },
      { label: "System Administrator", value: "SYSTEM_ADMIN" },
    ],
    required: true,
  },
];

export default function UsersAdminPage() {
  const [users, setUsers] = useState<StaffUserRecord[]>(INITIAL_STAFF_USERS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<StaffUserRecord | null>(null);

  const columns: ColumnDef<StaffUserRecord>[] = [
    {
      key: "name",
      header: "Staff Member",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light text-primary-dark border border-primary/20 font-bold text-xs shrink-0">
            {item.name.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-text">{item.name}</span>
            <span className="text-xs text-text-muted">{item.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: "roleTitle",
      header: "Assigned Role",
      sortable: true,
      render: (item) => {
        const badgeClasses: Record<UserRoleType, string> = {
          HOSPITAL_DIRECTOR: "bg-primary-light text-primary-dark border-primary/20",
          MEDICAL_DIRECTOR: "bg-secondary-light text-secondary-dark border-secondary/20",
          HR_STAFF: "bg-indigo-50 text-indigo-700 border-indigo-200",
          CONTENT_STAFF: "bg-amber-50 text-amber-700 border-amber-200",
          SYSTEM_ADMIN: "bg-slate-100 text-slate-800 border-slate-200",
        };

        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-pill text-xs font-semibold border ${badgeClasses[item.role]}`}>
            {item.roleTitle}
          </span>
        );
      },
    },
    {
      key: "department",
      header: "Department",
      render: (item) => <span className="text-xs text-text">{item.department}</span>,
    },
    {
      key: "lastLogin",
      header: "Last Login",
      render: (item) => <span className="text-xs text-text-muted font-mono">{item.lastLogin}</span>,
    },
    {
      key: "isActive",
      header: "Status",
      render: (item) => (
        <button
          onClick={() => {
            setUsers((prev) =>
              prev.map((u) => (u.id === item.id ? { ...u, isActive: !u.isActive } : u))
            );
          }}
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-pill text-xs font-semibold border transition-colors ${
            item.isActive
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-slate-100 text-slate-500 border-slate-200"
          }`}
        >
          {item.isActive ? "Active" : "Disabled"}
        </button>
      ),
    },
  ];

  const handleAddNew = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const handleEdit = (item: StaffUserRecord) => {
    setEditingUser(item);
    setModalOpen(true);
  };

  const handleDelete = (item: StaffUserRecord) => {
    if (confirm(`Revoke administrative access for ${item.name}?`)) {
      setUsers((prev) => prev.filter((u) => u.id !== item.id));
    }
  };

  const handleFormSubmit = (values: Record<string, any>) => {
    const roleMap: Record<UserRoleType, string> = {
      HOSPITAL_DIRECTOR: "Hospital Director",
      MEDICAL_DIRECTOR: "Medical Director",
      HR_STAFF: "HR Staff",
      CONTENT_STAFF: "Content Staff / Editor",
      SYSTEM_ADMIN: "System Administrator",
    };

    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                name: values.name || u.name,
                email: values.email || u.email,
                role: values.role || u.role,
                roleTitle: roleMap[values.role as UserRoleType] || u.roleTitle,
                department: values.department || u.department,
              }
            : u
        )
      );
    } else {
      const newUser: StaffUserRecord = {
        id: `usr-${Date.now()}`,
        name: values.name || "New Staff User",
        email: values.email || "staff@medhenbeza.com",
        role: values.role || "CONTENT_STAFF",
        roleTitle: roleMap[values.role as UserRoleType] || "Content Staff",
        department: values.department || "General Administration",
        isActive: true,
        lastLogin: "Never",
      };
      setUsers((prev) => [newUser, ...prev]);
    }
  };

  return (
    <RoleGuard allowedRoles={["HOSPITAL_DIRECTOR", "SYSTEM_ADMIN"]}>
      <div className="space-y-6">
        <DataTable
          title="Administrative CMS Staff Users"
          description="Manage authorized hospital staff accounts, assigned administrative roles, and credential access."
          data={users}
          columns={columns}
          searchPlaceholder="Search staff by name, email, department..."
          onAddNew={handleAddNew}
          addNewLabel="Create Staff User"
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <ContentFormModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingUser ? `Edit Staff Account: ${editingUser.name}` : "Create Staff Account"}
          fields={USER_FORM_FIELDS}
          initialValues={editingUser || {}}
          onSubmit={(values) => handleFormSubmit(values)}
        />
      </div>
    </RoleGuard>
  );
}
