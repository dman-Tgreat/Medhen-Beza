"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable, ColumnDef } from "@/components/admin/data-table";
import { ContentFormModal, FormFieldConfig } from "@/components/admin/content-form-modal";
import { RoleGuard } from "@/components/admin/role-guard";
import { ContentStatusType } from "@/lib/admin/types";
import { saveCareerAction, deleteCareerAction, updateCareerStatusAction } from "@/lib/actions/content";
import { Briefcase } from "lucide-react";

interface CareerRecord {
  id: string;
  position: string;
  departmentId?: string;
  departmentName: string;
  employmentType: string;
  location: string;
  deadline: string;
  description?: string;
  requirements?: string[];
  status: ContentStatusType;
}

interface CareersAdminClientProps {
  initialCareers: any[];
  departments: Array<{ id: string; name: string }>;
}

export function CareersAdminClient({ initialCareers, departments }: CareersAdminClientProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCareer, setEditingCareer] = useState<CareerRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const formattedCareers: CareerRecord[] = initialCareers.map((car) => ({
    id: car.id,
    position: car.title || car.position,
    departmentId: car.departmentId,
    departmentName: car.department?.name || "General Hospital",
    employmentType: car.employmentType || "FULL_TIME",
    location: car.location || "Addis Ababa, Ethiopia",
    deadline: car.deadline ? new Date(car.deadline).toISOString().split("T")[0] : "Open Until Filled",
    description: car.description || "",
    requirements: car.requirements || [],
    status: car.status as ContentStatusType,
  }));

  const formFields: FormFieldConfig[] = [
    {
      name: "position",
      label: "Job Position Title",
      type: "text",
      placeholder: "e.g. Senior Pediatric Nurse Specialist",
      required: true,
    },
    {
      name: "departmentId",
      label: "Hiring Department",
      type: "select",
      options: departments.map((d) => ({ label: d.name, value: d.id })),
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
      name: "location",
      label: "Work Location",
      type: "text",
      placeholder: "Addis Ababa, Ethiopia",
      required: true,
    },
    {
      name: "deadline",
      label: "Application Deadline",
      type: "date",
    },
    {
      name: "description",
      label: "Job Overview & Role Duties",
      type: "textarea",
      placeholder: "Describe primary responsibilities and daily expectations...",
      required: true,
    },
    {
      name: "requirements",
      label: "Key Qualifications & Certifications",
      type: "tags",
    },
  ];

  const columns: ColumnDef<CareerRecord>[] = [
    {
      key: "position",
      header: "Position Title",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary-light flex items-center justify-center text-primary shrink-0">
            <Briefcase className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-text">{item.position}</span>
            <span className="text-xs text-text-muted">{item.departmentName}</span>
          </div>
        </div>
      ),
    },
    {
      key: "employmentType",
      header: "Type",
      sortable: true,
      render: (item) => (
        <span className="text-xs px-2 py-0.5 rounded bg-background border border-border text-text font-medium">
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
    setErrorMessage(null);
    setModalOpen(true);
  };

  const handleEdit = (item: CareerRecord) => {
    setEditingCareer(item);
    setErrorMessage(null);
    setModalOpen(true);
  };

  const handleDelete = async (item: CareerRecord) => {
    if (confirm(`Are you sure you want to delete job opening "${item.position}"?`)) {
      const res = await deleteCareerAction(item.id);
      if (res.error) alert(res.error);
      else router.refresh();
    }
  };

  const handleSubmitForApproval = async (item: CareerRecord) => {
    const res = await updateCareerStatusAction(item.id, "PENDING_APPROVAL" as any);
    if (res.error) alert(res.error);
    else router.refresh();
  };

  const handleApprove = async (item: CareerRecord) => {
    const res = await updateCareerStatusAction(item.id, "APPROVED" as any);
    if (res.error) alert(res.error);
    else router.refresh();
  };

  const handlePublish = async (item: CareerRecord) => {
    const res = await updateCareerStatusAction(item.id, "PUBLISHED" as any);
    if (res.error) alert(res.error);
    else router.refresh();
  };

  const handleFormSubmit = async (
    values: Record<string, any>,
    actionType: "draft" | "submit" | "publish"
  ) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const res = await saveCareerAction(
      {
        id: editingCareer?.id,
        position: values.position,
        departmentId: values.departmentId || departments[0]?.id,
        employmentType: values.employmentType,
        location: values.location,
        deadline: values.deadline,
        description: values.description,
        requirements: values.requirements,
      },
      actionType
    );

    setIsSubmitting(false);

    if (res.error) {
      setErrorMessage(res.error);
      alert(res.error);
    } else {
      setModalOpen(false);
      router.refresh();
    }
  };

  return (
    <RoleGuard allowedRoles={["HOSPITAL_DIRECTOR", "HR_STAFF"]}>
      <div className="space-y-6">
        {errorMessage && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {errorMessage}
          </div>
        )}

        <DataTable
          title="Career Opportunities & Vacancies"
          description="Manage hospital job openings, clinical and non-clinical recruitment, and candidate applications."
          data={formattedCareers}
          columns={columns}
          searchPlaceholder="Search vacancies by title, department..."
          onAddNew={handleAddNew}
          addNewLabel="Post Vacancy"
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSubmitForApproval={handleSubmitForApproval}
          onApprove={handleApprove}
          onPublish={handlePublish}
        />

        <ContentFormModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingCareer ? `Edit Vacancy: ${editingCareer.position}` : "Post New Vacancy"}
          description="HR staff drafts require Hospital Director approval before public posting."
          fields={formFields}
          initialValues={
            editingCareer || {
              departmentId: departments[0]?.id,
              employmentType: "FULL_TIME",
              location: "Addis Ababa, Ethiopia",
            }
          }
          onSubmit={handleFormSubmit}
          isLoading={isSubmitting}
        />
      </div>
    </RoleGuard>
  );
}
