"use client";

import React, { useState } from "react";
import { DataTable, ColumnDef } from "@/components/admin/data-table";
import { ContentFormModal, FormFieldConfig } from "@/components/admin/content-form-modal";
import { RoleGuard } from "@/components/admin/role-guard";
import { ContentStatusType } from "@/lib/admin/types";
import { Hotel, CheckCircle } from "lucide-react";

interface FacilityRecord {
  id: string;
  name: string;
  category: string;
  capacity: string;
  status: ContentStatusType;
}

const INITIAL_FACILITIES: FacilityRecord[] = [
  {
    id: "fac-1",
    name: "Intensive Care Unit (ICU & CCU)",
    category: "Critical Care",
    capacity: "24 Beds with Dedicated Ventilators",
    status: "PUBLISHED",
  },
  {
    id: "fac-2",
    name: "Advanced Diagnostic Imaging Suite (MRI / CT)",
    category: "Radiology",
    capacity: "3.0T MRI & 128-Slice CT",
    status: "PUBLISHED",
  },
  {
    id: "fac-3",
    name: "Ultra-Clean Modular Operating Theaters",
    category: "Surgical Suites",
    capacity: "4 Laminar Flow Theaters",
    status: "PUBLISHED",
  },
  {
    id: "fac-4",
    name: "Automated Clinical Pathology Laboratory",
    category: "Diagnostics",
    capacity: "24/7 Automated Blood & Tissue Testing",
    status: "APPROVED",
  },
  {
    id: "fac-5",
    name: "Private Inpatient VIP Suites",
    category: "Inpatient Rooms",
    capacity: "16 Private Luxury Rooms",
    status: "DRAFT",
  },
];

const FACILITY_FORM_FIELDS: FormFieldConfig[] = [
  {
    name: "name",
    label: "Facility / Wing Name",
    type: "text",
    placeholder: "e.g. Neonatal Intensive Care Unit (NICU)",
    required: true,
  },
  {
    name: "category",
    label: "Category",
    type: "select",
    options: [
      { label: "Critical Care", value: "Critical Care" },
      { label: "Radiology & Imaging", value: "Radiology" },
      { label: "Surgical Suites", value: "Surgical Suites" },
      { label: "Diagnostics & Lab", value: "Diagnostics" },
      { label: "Inpatient Rooms", value: "Inpatient Rooms" },
    ],
    required: true,
  },
  {
    name: "capacity",
    label: "Capacity / Specifications",
    type: "text",
    placeholder: "e.g. 12 Dedicated Incubators & Phototherapy",
  },
  {
    name: "description",
    label: "Facility Overview",
    type: "textarea",
    placeholder: "Detailed specifications, infection control standards, visitor guidelines...",
  },
];

export default function FacilitiesAdminPage() {
  const [facilities, setFacilities] = useState<FacilityRecord[]>(INITIAL_FACILITIES);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFac, setEditingFac] = useState<FacilityRecord | null>(null);

  const columns: ColumnDef<FacilityRecord>[] = [
    {
      key: "name",
      header: "Facility Wing",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-light text-primary-dark border border-primary/20 shrink-0">
            <Hotel className="h-4 w-4" />
          </div>
          <span className="font-semibold text-text">{item.name}</span>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      render: (item) => (
        <span className="rounded bg-background px-2 py-0.5 text-xs border border-border text-text-muted">
          {item.category}
        </span>
      ),
    },
    {
      key: "capacity",
      header: "Capacity / Specs",
      render: (item) => <span className="text-xs text-text">{item.capacity}</span>,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
    },
  ];

  const handleAddNew = () => {
    setEditingFac(null);
    setModalOpen(true);
  };

  const handleEdit = (item: FacilityRecord) => {
    setEditingFac(item);
    setModalOpen(true);
  };

  const handleDelete = (item: FacilityRecord) => {
    if (confirm(`Delete facility: ${item.name}?`)) {
      setFacilities((prev) => prev.filter((f) => f.id !== item.id));
    }
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

    if (editingFac) {
      setFacilities((prev) =>
        prev.map((f) =>
          f.id === editingFac.id
            ? { ...f, ...values, status: statusMap[actionType] || f.status }
            : f
        )
      );
    } else {
      const newFac: FacilityRecord = {
        id: `fac-${Date.now()}`,
        name: values.name || "New Facility",
        category: values.category || "Critical Care",
        capacity: values.capacity || "General Capacity",
        status: statusMap[actionType],
      };
      setFacilities((prev) => [newFac, ...prev]);
    }
  };

  return (
    <RoleGuard allowedRoles={["HOSPITAL_DIRECTOR", "CONTENT_STAFF"]}>
      <div className="space-y-6">
        <DataTable
          title="Hospital Facilities & Clinical Infrastructure"
          description="Manage hospital wings, surgical suites, ICU capacity, and specialized equipment descriptions."
          data={facilities}
          columns={columns}
          searchPlaceholder="Search facilities..."
          onAddNew={handleAddNew}
          addNewLabel="Add Facility"
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <ContentFormModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingFac ? `Edit Facility: ${editingFac.name}` : "Add Facility"}
          fields={FACILITY_FORM_FIELDS}
          initialValues={editingFac || {}}
          onSubmit={handleFormSubmit}
        />
      </div>
    </RoleGuard>
  );
}
