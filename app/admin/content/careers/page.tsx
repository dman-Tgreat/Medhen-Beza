"use client";

import React, { useState } from "react";
import { DataTable, ColumnDef } from "@/components/admin/data-table";
import { ContentFormModal, FormFieldConfig } from "@/components/admin/content-form-modal";
import { RoleGuard } from "@/components/admin/role-guard";
import { ContentStatusType } from "@/lib/admin/types";
import { Briefcase, Calendar, MapPin, Building2 } from "lucide-react";

interface CareerRecord {
  id: string;
  position: string;
  department: string;
  employmentType: string;
  location: string;
  deadline: string;
  status: ContentStatusType;
}

const INITIAL_CAREERS: CareerRecord[] = [
  {
    id: "car-1",
    position: "Senior ICU Staff Nurse",
    department: "Critical Care",
    employmentType: "FULL_TIME",
    location: "Addis Ababa, Ethiopia",
    deadline: "2026-10-15",
    status: "PENDING_APPROVAL",
  },
  {
    id: "car-2",
    position: "Clinical Pharmacist Specialist",
    department: "Pharmacy",
    employmentType: "FULL_TIME",
    location: "Addis Ababa, Ethiopia",
    deadline: "2026-09-30",
    status: "PUBLISHED",
  },
  {
    id: "car-3",
    position: "Biomedical Equipment Maintenance Engineer",
    department: "Facilities & Biomedical",
    employmentType: "FULL_TIME",
    location: "Addis Ababa, Ethiopia",
    deadline: "2026-10-01",
    status: "PUBLISHED",
  },
  {
    id: "car-4",
    position: "Junior Laboratory Technician",
    department: "Laboratory",
    employmentType: "FULL_TIME",
    location: "Addis Ababa, Ethiopia",
    deadline: "2026-09-25",
    status: "REJECTED",
  },
  {
    id: "car-5",
    position: "Emergency Medical Dispatcher / Call Center",
    department: "Emergency Medicine",
    employmentType: "FULL_TIME",
    location: "Addis Ababa, Ethiopia",
    deadline: "2026-10-20",
    status: "DRAFT",
  },
];

const CAREER_FORM_FIELDS: FormFieldConfig[] = [
  {
    name: "position",
    label: "Job Position Title",
    type: "text",
    placeholder: "e.g. Senior Pediatric Nurse Specialist",
    required: true,
  },
  {
    name: "department",
    label: "Hiring Department",
    type: "select",
    options: [
      { label: "Critical Care & ICU", value: "Critical Care" },
      { label: "Pharmacy", value: "Pharmacy" },
      { label: "Facilities & Biomedical", value: "Facilities & Biomedical" },
      { label: "Laboratory", value: "Laboratory" },
      { label: "Emergency Medicine", value: "Emergency Medicine" },
      { label: "Human Resources", value: "Human Resources" },
    ],
    required: true,
  },
  {
    name: "employmentType",
    label: "Employment Type",
    type: "select",
    options: [
      { label: "Full Time", value: "FULL_TIME" },
      { label: "Part Time", value: "PART_TIME" },
      { label: "Contract", value: "CONTRACT" },
      { label: "Internship", value: "INTERNSHIP" },
    ],
    required: true,
  },
  {
    name: "deadline",
    label: "Application Deadline",
    type: "date",
    required: true,
  },
  {
    name: "description",
    label: "Job Overview & Role Purpose",
    type: "textarea",
    placeholder: "Provide a summary of the role, department culture, and key outcomes...",
  },
  {
    name: "requirements",
    label: "Key Qualifications & Certifications",
    type: "tags",
  },
];

export default function CareersAdminPage() {
  const [careers, setCareers] = useState<CareerRecord[]>(INITIAL_CAREERS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCareer, setEditingCareer] = useState<CareerRecord | null>(null);

  const columns: ColumnDef<CareerRecord>[] = [
    {
      key: "position",
      header: "Position Title",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0">
            <Briefcase className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-text">{item.position}</span>
            <span className="text-xs text-text-muted">{item.location}</span>
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
      key: "employmentType",
      header: "Type",
      render: (item) => (
        <span className="text-xs font-medium text-text">
          {item.employmentType.replace("_", " ")}
        </span>
      ),
    },
    {
      key: "deadline",
      header: "Deadline",
      sortable: true,
      render: (item) => <span className="text-xs text-text-muted font-mono">{item.deadline}</span>,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
    },
  ];

  const handleAddNew = () => {
    setEditingCareer(null);
    setModalOpen(true);
  };

  const handleEdit = (career: CareerRecord) => {
    setEditingCareer(career);
    setModalOpen(true);
  };

  const handleDelete = (career: CareerRecord) => {
    if (confirm(`Remove vacancy: ${career.position}?`)) {
      setCareers((prev) => prev.filter((c) => c.id !== career.id));
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

    if (editingCareer) {
      setCareers((prev) =>
        prev.map((c) =>
          c.id === editingCareer.id
            ? { ...c, ...values, status: statusMap[actionType] || c.status }
            : c
        )
      );
    } else {
      const newCareer: CareerRecord = {
        id: `car-${Date.now()}`,
        position: values.position || "New Job Opening",
        department: values.department || "General",
        employmentType: values.employmentType || "FULL_TIME",
        location: "Addis Ababa, Ethiopia",
        deadline: values.deadline || "2026-12-31",
        status: statusMap[actionType],
      };
      setCareers((prev) => [newCareer, ...prev]);
    }
  };

  return (
    <RoleGuard allowedRoles={["HOSPITAL_DIRECTOR", "HR_STAFF"]}>
      <div className="space-y-6">
        <DataTable
          title="Hospital Careers & Job Vacancies"
          description="Manage open hospital positions, nurse/physician recruitment, requirements, and application deadlines."
          data={careers}
          columns={columns}
          searchPlaceholder="Search careers by title, department..."
          onAddNew={handleAddNew}
          addNewLabel="Post Job Vacancy"
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <ContentFormModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingCareer ? `Edit Vacancy: ${editingCareer.position}` : "Create Job Vacancy"}
          description="Fill out vacancy details. HR submissions require Hospital Director approval before public display."
          fields={CAREER_FORM_FIELDS}
          initialValues={editingCareer || {}}
          onSubmit={handleFormSubmit}
        />
      </div>
    </RoleGuard>
  );
}
