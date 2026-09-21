"use client";

import React, { useState, useEffect } from "react";
import { DataTable, ColumnDef } from "@/components/admin/data-table";
import { ContentFormModal, FormFieldConfig } from "@/components/admin/content-form-modal";
import { RoleGuard } from "@/components/admin/role-guard";
import { UserRoleType } from "@/lib/admin/types";
import { Users, Shield, Key, Check, X, ShieldAlert, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  getAdminUsersAction,
  saveAdminUserAction,
  toggleAdminUserActiveAction,
  deleteAdminUserAction,
  type AdminUserItem,
} from "@/lib/actions/users";

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
  {
    name: "password",
    label: "Account Password (Leave blank to keep current if editing)",
    type: "text",
    placeholder: "Minimum 6 characters",
    required: false,
  },
];

export default function UsersAdminPage() {
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUserItem | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await getAdminUsersAction();
    if (res.data) {
      setUsers(res.data);
    } else if (res.error) {
      setActionError(res.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns: ColumnDef<AdminUserItem>[] = [
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
        const badgeClasses: Record<string, string> = {
          HOSPITAL_DIRECTOR: "bg-primary-light text-primary-dark border-primary/20",
          MEDICAL_DIRECTOR: "bg-secondary-light text-secondary-dark border-secondary/20",
          HR_STAFF: "bg-indigo-50 text-indigo-700 border-indigo-200",
          CONTENT_STAFF: "bg-amber-50 text-amber-700 border-amber-200",
          SYSTEM_ADMIN: "bg-slate-100 text-slate-800 border-slate-200",
        };

        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-pill text-xs font-semibold border ${
              badgeClasses[item.role] || "bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            {item.roleTitle}
          </span>
        );
      },
    },
    {
      key: "lastLogin",
      header: "Last Updated",
      render: (item) => <span className="text-xs text-text-muted font-mono">{item.lastLogin}</span>,
    },
    {
      key: "isActive",
      header: "Status",
      render: (item) => (
        <button
          onClick={async () => {
            setActionError(null);
            const res = await toggleAdminUserActiveAction(item.id);
            if (res.error) {
              setActionError(res.error);
            } else {
              setUsers((prev) =>
                prev.map((u) => (u.id === item.id ? { ...u, isActive: !u.isActive } : u))
              );
            }
          }}
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-pill text-xs font-semibold border transition-colors ${
            item.isActive
              ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
              : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
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

  const handleEdit = (item: AdminUserItem) => {
    setEditingUser(item);
    setModalOpen(true);
  };

  const handleDelete = async (item: AdminUserItem) => {
    if (confirm(`Revoke administrative access and delete user ${item.name}?`)) {
      setActionError(null);
      const res = await deleteAdminUserAction(item.id);
      if (res.error) {
        setActionError(res.error);
      } else {
        setUsers((prev) => prev.filter((u) => u.id !== item.id));
        setActionSuccess(`User ${item.name} removed successfully.`);
        setTimeout(() => setActionSuccess(null), 3000);
      }
    }
  };

  const handleFormSubmit = async (values: Record<string, any>) => {
    setActionError(null);
    const res = await saveAdminUserAction({
      id: editingUser?.id,
      name: values.name,
      email: values.email,
      roleCode: values.role,
      password: values.password,
    });

    if (res.error) {
      setActionError(res.error);
    } else if (res.data) {
      const saved = res.data;
      if (editingUser) {
        setUsers((prev) => prev.map((u) => (u.id === saved.id ? saved : u)));
        setActionSuccess(`User ${saved.name} updated successfully.`);
      } else {
        setUsers((prev) => [...prev, saved]);
        setActionSuccess(`User ${saved.name} created successfully.`);
      }
      setTimeout(() => setActionSuccess(null), 3000);
      setModalOpen(false);
    }
  };

  return (
    <RoleGuard allowedRoles={["HOSPITAL_DIRECTOR", "SYSTEM_ADMIN"]}>
      <div className="space-y-6">
        {actionError && (
          <Alert variant="emergency">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Operation Failed</AlertTitle>
            <AlertDescription>{actionError}</AlertDescription>
          </Alert>
        )}

        {actionSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
            <Check className="h-4 w-4" />
            {actionSuccess}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-small text-text-muted">Loading administrative staff from PostgreSQL...</p>
          </div>
        ) : (
          <DataTable
            title="Administrative CMS Staff Users"
            description="Manage authorized hospital staff accounts, assigned administrative roles, and credential access persisted directly in the database."
            data={users}
            columns={columns}
            searchPlaceholder="Search staff by name, email, department..."
            onAddNew={handleAddNew}
            addNewLabel="Create Staff User"
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        <ContentFormModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingUser ? `Edit Staff Account: ${editingUser.name}` : "Create Staff Account"}
          fields={USER_FORM_FIELDS}
          initialValues={
            editingUser
              ? {
                  name: editingUser.name,
                  email: editingUser.email,
                  role: editingUser.role,
                  password: "",
                }
              : {}
          }
          onSubmit={(values) => handleFormSubmit(values)}
        />
      </div>
    </RoleGuard>
  );
}
