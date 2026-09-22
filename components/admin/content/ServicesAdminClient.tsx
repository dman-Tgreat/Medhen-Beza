"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable, ColumnDef } from "@/components/admin/data-table";
import { ContentFormModal, FormFieldConfig } from "@/components/admin/content-form-modal";
import { RoleGuard } from "@/components/admin/role-guard";
import { ContentStatusType } from "@/lib/admin/types";
import { saveServiceAction, deleteServiceAction, updateServiceStatusAction } from "@/lib/actions/content";
import { Activity } from "lucide-react";

interface ServiceRecord {
  id: string;
  name: string;
  title?: string;
  departmentId?: string;
  departmentName: string;
  summary: string;
  description: string;
  availabilityInfo: string;
  additionalInfo: string;
  image?: string;
  isEmergency?: boolean;
  status: ContentStatusType;
}

interface ServicesAdminClientProps {
  initialServices: any[];
  departments: Array<{ id: string; name: string }>;
  initialDepartmentId?: string;
}

export function ServicesAdminClient({ initialServices, departments, initialDepartmentId }: ServicesAdminClientProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const formattedServices: ServiceRecord[] = initialServices.map((srv) => ({
    id: srv.id,
    name: srv.title || srv.name || "Untitled Service",
    title: srv.title || srv.name || "",
    departmentId: srv.departmentId,
    departmentName: srv.department?.name || "General",
    summary: srv.description || srv.summary || "",
    description: srv.content || srv.description || "",
    availabilityInfo: srv.availabilityInfo || "",
    additionalInfo: srv.additionalInfo || "",
    image: srv.image || undefined,
    isEmergency: Boolean(srv.isFeatured),
    status: srv.status as ContentStatusType,
  }));

  const formFields: FormFieldConfig[] = [
    {
      name: "name",
      label: "Service Title / Name",
      type: "text",
      placeholder: "e.g. Echocardiography & Stress Testing",
      required: true,
    },
    {
      name: "departmentId",
      label: "Associated Department",
      type: "select",
      options: departments.map((d) => ({ label: d.name, value: d.id })),
      required: true,
    },
    {
      name: "summary",
      label: "Short Summary / Tagline",
      type: "textarea",
      placeholder: "e.g. Non-invasive cardiac diagnostic assessment and vital vascular imaging.",
      helperText: "Displayed on the service card in the public directory and in the page hero description.",
      required: true,
    },
    {
      name: "description",
      label: "Service Overview & Clinical Details",
      type: "textarea",
      placeholder: "Explain what conditions are treated, equipment used, preparation steps, and patient care procedures...",
      helperText: "Displayed under 'Service Overview' on the service detail page.",
    },
    {
      name: "availabilityInfo",
      label: "Operating Availability & Schedule",
      type: "text",
      placeholder: "e.g. Mon - Fri 8:00 AM - 5:00 PM · 24/7 Emergency",
      helperText: "Displayed in the sidebar under 'Availability'.",
    },
    {
      name: "additionalInfo",
      label: "Key Care Highlights",
      type: "textarea",
      placeholder: "Enter highlights (one per line):\n• Modern 4D Doppler ultrasound columns\n• Board-certified cardiologist oversight\n• Same-day diagnostic report delivery",
      helperText: "Each bullet or line becomes a highlight badge under 'Key Care Highlights'.",
    },
    {
      name: "image",
      label: "Service Cover Image",
      type: "image",
      folder: "services",
      aspectRatio: 16 / 9,
      aspectLabel: "16:9 landscape",
    },
    {
      name: "isEmergency",
      label: "Is this an Emergency / Priority Service?",
      type: "select",
      options: [
        { label: "No - Regular Scheduled Service", value: "false" },
        { label: "Yes - 24/7 Emergency & Urgent Care Service", value: "true" },
      ],
    },
  ];

  const columns: ColumnDef<ServiceRecord>[] = [
    {
      key: "name",
      header: "Service Name",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-secondary-light flex items-center justify-center text-secondary shrink-0">
            <Activity className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-text">{item.name}</span>
            <span className="text-xs text-text-muted line-clamp-1 max-w-sm">
              {item.summary || "Clinical service"}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "departmentName",
      header: "Department",
      sortable: true,
      render: (item) => (
        <span className="rounded bg-background px-2 py-0.5 text-xs border border-border text-text-muted">
          {item.departmentName}
        </span>
      ),
    },
    {
      key: "isEmergency",
      header: "Type",
      render: (item) => (
        <span
          className={`text-xs px-2 py-0.5 rounded font-medium ${
            item.isEmergency ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"
          }`}
        >
          {item.isEmergency ? "Emergency (24/7)" : "Standard"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
    },
  ];

  const handleAddNew = () => {
    setEditingService(null);
    setErrorMessage(null);
    setModalOpen(true);
  };

  const handleEdit = (service: ServiceRecord) => {
    setEditingService(service);
    setErrorMessage(null);
    setModalOpen(true);
  };

  const handleDelete = async (service: ServiceRecord) => {
    if (confirm(`Are you sure you want to delete ${service.name}?`)) {
      const res = await deleteServiceAction(service.id);
      if (res.error) alert(res.error);
      else router.refresh();
    }
  };

  const handleSubmitForApproval = async (service: ServiceRecord) => {
    const res = await updateServiceStatusAction(service.id, "PENDING_APPROVAL" as any);
    if (res.error) alert(res.error);
    else router.refresh();
  };

  const handleApprove = async (service: ServiceRecord) => {
    const res = await updateServiceStatusAction(service.id, "APPROVED" as any);
    if (res.error) alert(res.error);
    else router.refresh();
  };

  const handlePublish = async (service: ServiceRecord) => {
    const res = await updateServiceStatusAction(service.id, "PUBLISHED" as any);
    if (res.error) alert(res.error);
    else router.refresh();
  };

  const handleFormSubmit = async (
    values: Record<string, any>,
    actionType: "draft" | "submit" | "publish"
  ) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const res = await saveServiceAction(
      {
        id: editingService?.id,
        title: values.name || values.title,
        description: values.summary || values.description,
        content: values.description || values.content,
        availabilityInfo: values.availabilityInfo,
        additionalInfo: values.additionalInfo,
        departmentId: values.departmentId || departments[0]?.id,
        image: values.image,
        isFeatured: values.isEmergency === "true" || values.isEmergency === true,
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
    <RoleGuard allowedRoles={["HOSPITAL_DIRECTOR", "MEDICAL_DIRECTOR"]}>
      <div className="space-y-6">
        {errorMessage && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {errorMessage}
          </div>
        )}

        <DataTable
          title="Clinical & Diagnostic Services"
          description="Manage hospital treatment offerings, diagnostic capabilities, and emergency availability."
          data={formattedServices}
          columns={columns}
          searchPlaceholder="Search services by name, department..."
          onAddNew={handleAddNew}
          addNewLabel="Add Service"
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSubmitForApproval={handleSubmitForApproval}
          onApprove={handleApprove}
          onPublish={handlePublish}
        />

        <ContentFormModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingService ? `Edit Service: ${editingService.name}` : "Create Clinical Service"}
          description="Add or update medical service details, short summary, detailed overview, highlights, and schedule."
          fields={formFields}
          initialValues={
            editingService
              ? {
                  ...editingService,
                  isEmergency: editingService.isEmergency ? "true" : "false",
                }
              : { departmentId: initialDepartmentId || departments[0]?.id, isEmergency: "false" }
          }
          onSubmit={handleFormSubmit}
          isLoading={isSubmitting}
        />
      </div>
    </RoleGuard>
  );
}
