"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable, ColumnDef } from "@/components/admin/data-table";
import { ContentFormModal, FormFieldConfig } from "@/components/admin/content-form-modal";
import { RoleGuard } from "@/components/admin/role-guard";
import { ContentStatusType } from "@/lib/admin/types";
import { saveDepartmentAction, deleteDepartmentAction, updateDepartmentStatusAction } from "@/lib/actions/content";
import { Activity, Building2 } from "lucide-react";

interface DepartmentRecord {
  id: string;
  name: string;
  headDoctor: string;
  specializations: string[];
  description?: string;
  image?: string;
  doctorsCount: number;
  servicesCount: number;
  phone: string;
  email?: string;
  location: string;
  operatingHours?: string;
  status: ContentStatusType;
  translations?: any;
}

interface DepartmentsAdminClientProps {
  initialDepartments: any[];
}

export function DepartmentsAdminClient({ initialDepartments }: DepartmentsAdminClientProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<DepartmentRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const formattedDepartments: DepartmentRecord[] = initialDepartments.map((dept) => ({
    id: dept.id,
    name: dept.name,
    headDoctor: dept.headDoctor || "",
    specializations: dept.specializations || [],
    description: dept.description || "",
    image: dept.image || undefined,
    doctorsCount: dept._count?.doctors || 0,
    servicesCount: dept._count?.services || 0,
    phone: dept.phone || "+251 11 654 3000",
    email: dept.email || "",
    location: dept.location || "Main Building",
    operatingHours: dept.operatingHours || dept.workingHours || "24/7",
    status: dept.status as ContentStatusType,
    translations: dept.translations,
  }));

  const formFields: FormFieldConfig[] = [
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
      placeholder: "e.g. Dr. Samuel Bekele, MD",
      helperText: "Doctor leading this department (displayed as Department Lead on the public page).",
    },
    {
      name: "specializations",
      label: "Core Specializations",
      type: "tags",
      placeholder: "Type a specialization and press Enter or Add (e.g. Pediatric Ophthalmology, Retina Surgery)",
      helperText: "Clinical capabilities and specializations featured on the department detail page.",
    },
    {
      name: "description",
      label: "Department Description & Overview",
      type: "textarea",
      placeholder: "Clinical objectives, diagnostic capabilities, patient care mission...",
    },
    {
      name: "image",
      label: "Department Cover Image",
      type: "image",
      folder: "departments",
      aspectRatio: 16 / 9,
      aspectLabel: "16:9 landscape",
      helperText: "Recommended for department directory cards and detail headers.",
    },
    {
      name: "phone",
      label: "Department Extension / Phone",
      type: "tel",
      placeholder: "e.g. +251 11 654 3000",
      helperText: "Direct contact line for this clinical department (accepts Ethiopian phone numbers).",
    },
    {
      name: "email",
      label: "Contact Email",
      type: "email",
      placeholder: "dept@medhenbeza.com",
    },
    {
      name: "location",
      label: "Physical Location / Floor",
      type: "text",
      placeholder: "e.g. Block A, 2nd Floor",
    },
    {
      name: "operatingHours",
      label: "Operating Hours",
      type: "text",
      placeholder: "e.g. 24/7 Emergency & Inpatient Care",
    },
  ];

  const columns: ColumnDef<DepartmentRecord>[] = [
    {
      key: "name",
      header: "Department",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary-light flex items-center justify-center text-primary shrink-0">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-text">{item.name}</span>
            <span className="text-xs text-text-muted">Head: {item.headDoctor || "Not assigned"}</span>
          </div>
        </div>
      ),
    },
    {
      key: "location",
      header: "Location",
      sortable: true,
      render: (item) => <span className="text-sm text-text-muted">{item.location}</span>,
    },
    {
      key: "doctorsCount",
      header: "Specialists",
      sortable: true,
      render: (item) => (
        <span className="font-semibold text-text text-sm">{item.doctorsCount} doctors</span>
      ),
    },
    {
      key: "servicesCount",
      header: "Services",
      sortable: true,
      render: (item) => (
        <span className="font-semibold text-text text-sm">{item.servicesCount} services</span>
      ),
    },
    {
      key: "phone",
      header: "Contact",
      render: (item) => <span className="text-xs text-text-muted">{item.phone}</span>,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
    },
  ];

  const handleAddNew = () => {
    setEditingDept(null);
    setErrorMessage(null);
    setModalOpen(true);
  };

  const handleEdit = (dept: DepartmentRecord) => {
    setEditingDept(dept);
    setErrorMessage(null);
    setModalOpen(true);
  };

  const handleDelete = async (dept: DepartmentRecord) => {
    if (confirm(`Are you sure you want to delete ${dept.name}? This may impact linked doctors and services.`)) {
      const res = await deleteDepartmentAction(dept.id);
      if (res.error) alert(res.error);
      else router.refresh();
    }
  };

  const handleSubmitForApproval = async (dept: DepartmentRecord) => {
    const res = await updateDepartmentStatusAction(dept.id, "PENDING_APPROVAL" as any);
    if (res.error) alert(res.error);
    else router.refresh();
  };

  const handleApprove = async (dept: DepartmentRecord) => {
    const res = await updateDepartmentStatusAction(dept.id, "APPROVED" as any);
    if (res.error) alert(res.error);
    else router.refresh();
  };

  const handlePublish = async (dept: DepartmentRecord) => {
    const res = await updateDepartmentStatusAction(dept.id, "PUBLISHED" as any);
    if (res.error) alert(res.error);
    else router.refresh();
  };

  const handleFormSubmit = async (
    values: Record<string, any>,
    actionType: "draft" | "submit" | "publish"
  ) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const res = await saveDepartmentAction(
      {
        id: editingDept?.id,
        name: values.name,
        description: values.description,
        headDoctor: values.headDoctor,
        specializations: values.specializations || [],
        image: values.image,
        phone: values.phone,
        email: values.email,
        location: values.location,
        workingHours: values.workingHours || values.operatingHours,
        translations: values.translations,
      },
      actionType
    );

    setIsSubmitting(false);

    if (res.error) {
      setErrorMessage(res.error);
      return { error: res.error };
    } else {
      setModalOpen(false);
      router.refresh();
      return { success: true };
    }
  };

  return (
    <RoleGuard allowedRoles={["HOSPITAL_DIRECTOR", "MEDICAL_DIRECTOR"]}>
      <div className="space-y-6">
        {errorMessage && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {errorMessage}
          </div>
        )}

        <DataTable
          title="Clinical Departments & Units"
          description="Manage clinical departments, units, medical director assignments, and locations."
          data={formattedDepartments}
          columns={columns}
          searchPlaceholder="Search departments by name, head physician, location..."
          onAddNew={handleAddNew}
          addNewLabel="Add Department"
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSubmitForApproval={handleSubmitForApproval}
          onApprove={handleApprove}
          onPublish={handlePublish}
          extraActions={[
            {
              label: "Add Service to Department",
              icon: Activity,
              variant: "primary",
              onClick: (dept) => router.push(`/admin/content/services?departmentId=${dept.id}`),
            },
          ]}
        />

        <ContentFormModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingDept ? `Edit Department: ${editingDept.name}` : "Create Clinical Department"}
          description="Configure department information. Publishing requires Hospital Director approval."
          fields={formFields}
          initialValues={editingDept || {}}
          onSubmit={handleFormSubmit}
          isLoading={isSubmitting}
        />
      </div>
    </RoleGuard>
  );
}
