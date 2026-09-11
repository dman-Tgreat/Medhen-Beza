"use client";

import React, { useState } from "react";
import { DataTable, ColumnDef } from "@/components/admin/data-table";
import { ContentFormModal, FormFieldConfig } from "@/components/admin/content-form-modal";
import { RoleGuard } from "@/components/admin/role-guard";
import { ContentStatusType } from "@/lib/admin/types";
import { Activity, Building2 } from "lucide-react";

interface ServiceRecord {
  id: string;
  title: string;
  department: string;
  availability: string;
  status: ContentStatusType;
  description: string;
}

const INITIAL_SERVICES: ServiceRecord[] = [
  {
    id: "srv-1",
    title: "24/7 Advanced Emergency & Resuscitation",
    department: "Emergency Medicine",
    availability: "24 Hours / 7 Days",
    status: "PUBLISHED",
    description: "Full emergency room trauma care, ICU resuscitation, and triage.",
  },
  {
    id: "srv-2",
    title: "Interventional Cardiac Catheterization",
    department: "Cardiology",
    availability: "Mon – Sat (Emergency On-Call)",
    status: "PUBLISHED",
    description: "Angiography, stent placement, and pacemaker implantation.",
  },
  {
    id: "srv-3",
    title: "Minimally Invasive Laparoscopic Surgery",
    department: "General Surgery",
    availability: "Scheduled Operating Days",
    status: "PENDING_APPROVAL",
    description: "Keyhole abdominal surgeries with shortened recovery times.",
  },
  {
    id: "srv-4",
    title: "Comprehensive Neonatal Intensive Care (NICU)",
    department: "Pediatrics",
    availability: "24 Hours / 7 Days",
    status: "APPROVED",
    description: "Level 3 NICU incubators, infant ventilation, and phototherapy.",
  },
  {
    id: "srv-5",
    title: "Diagnostic MRI & 128-Slice CT Imaging",
    department: "Radiology",
    availability: "Daily 08:00 – 20:00",
    status: "DRAFT",
    description: "High-resolution non-invasive diagnostic scans and digital radiography.",
  },
];

const SERVICE_FORM_FIELDS: FormFieldConfig[] = [
  {
    name: "title",
    label: "Service Title",
    type: "text",
    placeholder: "e.g. Echocardiography & Stress Testing",
    required: true,
  },
  {
    name: "department",
    label: "Associated Department",
    type: "select",
    options: [
      { label: "Cardiology", value: "Cardiology" },
      { label: "Neurology", value: "Neurology" },
      { label: "Emergency Medicine", value: "Emergency Medicine" },
      { label: "Pediatrics", value: "Pediatrics" },
      { label: "Orthopedics", value: "Orthopedics" },
      { label: "Radiology", value: "Radiology" },
    ],
    required: true,
  },
  {
    name: "availability",
    label: "Availability / Schedule",
    type: "text",
    placeholder: "e.g. 24/7 or Mon - Fri 08:00 - 17:00",
  },
  {
    name: "description",
    label: "Service Overview & Clinical Capabilities",
    type: "textarea",
    placeholder: "Explain what conditions are treated, equipment used, and patient prep requirements...",
  },
];

export default function ServicesAdminPage() {
  const [services, setServices] = useState<ServiceRecord[]>(INITIAL_SERVICES);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceRecord | null>(null);

  const columns: ColumnDef<ServiceRecord>[] = [
    {
      key: "title",
      header: "Service",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary-light text-secondary-dark border border-secondary/20 shrink-0">
            <Activity className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-text">{item.title}</span>
            <span className="text-xs text-text-muted">{item.description}</span>
          </div>
        </div>
      ),
    },
    {
      key: "department",
      header: "Department",
      sortable: true,
      render: (item) => (
        <span className="rounded bg-background px-2 py-0.5 text-xs border border-border text-text-muted">
          {item.department}
        </span>
      ),
    },
    {
      key: "availability",
      header: "Availability",
      render: (item) => <span className="text-xs text-text-muted">{item.availability}</span>,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
    },
  ];

  const handleAddNew = () => {
    setEditingService(null);
    setModalOpen(true);
  };

  const handleEdit = (service: ServiceRecord) => {
    setEditingService(service);
    setModalOpen(true);
  };

  const handleDelete = (service: ServiceRecord) => {
    if (confirm(`Delete service: ${service.title}?`)) {
      setServices((prev) => prev.filter((s) => s.id !== service.id));
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

    if (editingService) {
      setServices((prev) =>
        prev.map((s) =>
          s.id === editingService.id
            ? { ...s, ...values, status: statusMap[actionType] || s.status }
            : s
        )
      );
    } else {
      const newService: ServiceRecord = {
        id: `srv-${Date.now()}`,
        title: values.title || "New Service",
        department: values.department || "Cardiology",
        availability: values.availability || "Mon – Fri 08:00 – 17:00",
        status: statusMap[actionType],
        description: values.description || "",
      };
      setServices((prev) => [newService, ...prev]);
    }
  };

  return (
    <RoleGuard allowedRoles={["HOSPITAL_DIRECTOR", "MEDICAL_DIRECTOR"]}>
      <div className="space-y-6">
        <DataTable
          title="Clinical Services Directory"
          description="Manage specialized diagnostic, outpatient, surgical, and therapeutic medical services."
          data={services}
          columns={columns}
          searchPlaceholder="Search clinical services..."
          onAddNew={handleAddNew}
          addNewLabel="Add Clinical Service"
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <ContentFormModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingService ? `Edit Service: ${editingService.title}` : "Create Clinical Service"}
          fields={SERVICE_FORM_FIELDS}
          initialValues={editingService || {}}
          onSubmit={handleFormSubmit}
        />
      </div>
    </RoleGuard>
  );
}
