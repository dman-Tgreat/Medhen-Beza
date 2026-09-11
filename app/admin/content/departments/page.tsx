"use client";

import React, { useState } from "react";
import { DataTable, ColumnDef } from "@/components/admin/data-table";
import { ContentFormModal, FormFieldConfig } from "@/components/admin/content-form-modal";
import { RoleGuard } from "@/components/admin/role-guard";
import { ContentStatusType } from "@/lib/admin/types";
import { Building2, Phone, Mail, Clock } from "lucide-react";

interface DepartmentRecord {
  id: string;
  name: string;
  headDoctor: string;
  doctorsCount: number;
  servicesCount: number;
  phone: string;
  location: string;
  status: ContentStatusType;
}

const INITIAL_DEPARTMENTS: DepartmentRecord[] = [
  {
    id: "dept-1",
    name: "Cardiology & Vascular Center",
    headDoctor: "Dr. Samuel Bekele",
    doctorsCount: 6,
    servicesCount: 8,
    phone: "+251 11 654 3210",
    location: "Block B, 2nd Floor",
    status: "PUBLISHED",
  },
  {
    id: "dept-2",
    name: "Neurology & Neurosurgery",
    headDoctor: "Dr. Bethlehem Tadesse",
    doctorsCount: 4,
    servicesCount: 5,
    phone: "+251 11 654 3211",
    location: "Block C, 3rd Floor",
    status: "PUBLISHED",
  },
  {
    id: "dept-3",
    name: "Emergency & Trauma Center",
    headDoctor: "Dr. Helen Kebede",
    doctorsCount: 8,
    servicesCount: 6,
    phone: "+251 11 654 9999",
    location: "Ground Floor, East Wing",
    status: "PUBLISHED",
  },
  {
    id: "dept-4",
    name: "Pediatrics & Child Health",
    headDoctor: "Dr. Meron Haile",
    doctorsCount: 5,
    servicesCount: 7,
    phone: "+251 11 654 3214",
    location: "Block A, 1st Floor",
    status: "APPROVED",
  },
  {
    id: "dept-5",
    name: "Orthopedics & Joint Reconstruction",
    headDoctor: "Dr. Dawit Mengistu",
    doctorsCount: 4,
    servicesCount: 4,
    phone: "+251 11 654 3215",
    location: "Block B, 1st Floor",
    status: "DRAFT",
  },
];

const DEPT_FORM_FIELDS: FormFieldConfig[] = [
  {
    name: "name",
    label: "Department Name",
    type: "text",
    placeholder: "e.g. Ophthalmology & Eye Care",
    required: true,
  },
  {
    name: "headDoctor",
    label: "Department Head / Chief Physician",
    type: "text",
    placeholder: "e.g. Dr. Samuel Bekele",
    required: true,
  },
  {
    name: "phone",
    label: "Department Extension / Phone",
    type: "text",
    placeholder: "+251 11 654 xxxx",
  },
  {
    name: "location",
    label: "Physical Location / Floor",
    type: "text",
    placeholder: "e.g. Block A, 2nd Floor",
  },
  {
    name: "description",
    label: "Department Overview & Scope",
    type: "textarea",
    placeholder: "Describe the clinical focus, specialized equipment, and inpatient/outpatient services...",
  },
];

export default function DepartmentsAdminPage() {
  const [departments, setDepartments] = useState<DepartmentRecord[]>(INITIAL_DEPARTMENTS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<DepartmentRecord | null>(null);

  const columns: ColumnDef<DepartmentRecord>[] = [
    {
      key: "name",
      header: "Department",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-light text-primary-dark border border-primary/20 shrink-0">
            <Building2 className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-text">{item.name}</span>
            <span className="text-xs text-text-muted">Head: {item.headDoctor}</span>
          </div>
        </div>
      ),
    },
    {
      key: "location",
      header: "Location",
      render: (item) => <span className="text-xs text-text-muted">{item.location}</span>,
    },
    {
      key: "doctorsCount",
      header: "Staff Count",
      sortable: true,
      render: (item) => (
        <span className="text-xs text-text font-medium">
          {item.doctorsCount} Doctors • {item.servicesCount} Services
        </span>
      ),
    },
    {
      key: "phone",
      header: "Phone Contact",
      render: (item) => <span className="text-xs font-mono text-text-muted">{item.phone}</span>,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
    },
  ];

  const handleAddNew = () => {
    setEditingDept(null);
    setModalOpen(true);
  };

  const handleEdit = (dept: DepartmentRecord) => {
    setEditingDept(dept);
    setModalOpen(true);
  };

  const handleDelete = (dept: DepartmentRecord) => {
    if (confirm(`Remove ${dept.name}?`)) {
      setDepartments((prev) => prev.filter((d) => d.id !== dept.id));
    }
  };

  const handleSubmitForApproval = (dept: DepartmentRecord) => {
    setDepartments((prev) =>
      prev.map((d) => (d.id === dept.id ? { ...d, status: "PENDING_APPROVAL" as ContentStatusType } : d))
    );
  };

  const handleApprove = (dept: DepartmentRecord) => {
    setDepartments((prev) =>
      prev.map((d) => (d.id === dept.id ? { ...d, status: "APPROVED" as ContentStatusType } : d))
    );
  };

  const handlePublish = (dept: DepartmentRecord) => {
    setDepartments((prev) =>
      prev.map((d) => (d.id === dept.id ? { ...d, status: "PUBLISHED" as ContentStatusType } : d))
    );
  };

  const handleFormSubmit = (
    values: Record<string, any>,
    actionType: "draft" | "submit" | "publish"
  ) => {
    const statusMap: Record<string, ContentStatusType> = {
      draft: "DRAFT",
      submit: "PENDING_APPROVAL",
      publish: "PUBLISHED",
    };

    if (editingDept) {
      setDepartments((prev) =>
        prev.map((d) =>
          d.id === editingDept.id
            ? { ...d, ...values, status: statusMap[actionType] || d.status }
            : d
        )
      );
    } else {
      const newDept: DepartmentRecord = {
        id: `dept-${Date.now()}`,
        name: values.name || "New Department",
        headDoctor: values.headDoctor || "TBD",
        doctorsCount: 0,
        servicesCount: 0,
        phone: values.phone || "+251 11 654 0000",
        location: values.location || "Hospital Main Building",
        status: statusMap[actionType],
      };
      setDepartments((prev) => [newDept, ...prev]);
    }
  };

  return (
    <RoleGuard allowedRoles={["HOSPITAL_DIRECTOR", "MEDICAL_DIRECTOR"]}>
      <div className="space-y-6">
        <DataTable
          title="Hospital Departments"
          description="Manage clinical departments, heads of department, clinic locations, and working hours."
          data={departments}
          columns={columns}
          searchPlaceholder="Search departments..."
          onAddNew={handleAddNew}
          addNewLabel="Add Department"
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSubmitForApproval={handleSubmitForApproval}
          onApprove={handleApprove}
          onPublish={handlePublish}
        />

        <ContentFormModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingDept ? `Edit Department: ${editingDept.name}` : "Create Clinical Department"}
          fields={DEPT_FORM_FIELDS}
          initialValues={editingDept || {}}
          onSubmit={handleFormSubmit}
        />
      </div>
    </RoleGuard>
  );
}
