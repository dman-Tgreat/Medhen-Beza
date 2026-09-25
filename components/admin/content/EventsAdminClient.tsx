"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable, ColumnDef } from "@/components/admin/data-table";
import { ContentFormModal, FormFieldConfig } from "@/components/admin/content-form-modal";
import { RoleGuard } from "@/components/admin/role-guard";
import { ContentStatusType } from "@/lib/admin/types";
import { saveEventAction, deleteEventAction, updateEventStatusAction } from "@/lib/actions/content";
import { Calendar } from "lucide-react";

interface EventRecord {
  id: string;
  title: string;
  eventDate: string;
  location: string;
  description?: string;
  image?: string;
  organizer?: string;
  status: ContentStatusType;
  translations?: any;
}

interface EventsAdminClientProps {
  initialEvents: any[];
}

export function EventsAdminClient({ initialEvents }: EventsAdminClientProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const formattedEvents: EventRecord[] = initialEvents.map((evt) => ({
    id: evt.id,
    title: evt.title,
    eventDate: evt.eventDate ? new Date(evt.eventDate).toISOString().split("T")[0] : "",
    location: evt.location || "Hospital Main Campus",
    description: evt.description || "",
    image: evt.image || undefined,
    organizer: evt.organizer || "Medhen Beza Administration",
    status: evt.status as ContentStatusType,
    translations: evt.translations,
  }));

  const formFields: FormFieldConfig[] = [
    {
      name: "title",
      label: "Event Title",
      type: "text",
      placeholder: "e.g. World Diabetes Awareness Screening",
      required: true,
    },
    {
      name: "eventDate",
      label: "Event Date",
      type: "date",
      required: true,
    },
    {
      name: "location",
      label: "Venue / Room Location",
      type: "text",
      placeholder: "e.g. Hospital Auditorium, Ground Floor",
      required: true,
    },
    {
      name: "organizer",
      label: "Organizer / Department",
      type: "text",
      placeholder: "e.g. Public Health & Community Outreach",
    },
    {
      name: "description",
      label: "Event Description & Timetable",
      type: "textarea",
      placeholder: "Provide schedule, speaker list, registration details...",
      required: true,
    },
    {
      name: "image",
      label: "Event Cover Image",
      type: "image",
      folder: "events",
      aspectRatio: 16 / 9,
      aspectLabel: "16:9 landscape",
    },
  ];

  const columns: ColumnDef<EventRecord>[] = [
    {
      key: "title",
      header: "Event",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
            <Calendar className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-text">{item.title}</span>
            <span className="text-xs text-text-muted">{item.organizer}</span>
          </div>
        </div>
      ),
    },
    {
      key: "eventDate",
      header: "Event Date",
      sortable: true,
      render: (item) => <span className="text-xs text-text-muted font-mono">{item.eventDate}</span>,
    },
    {
      key: "location",
      header: "Venue",
      render: (item) => <span className="text-xs text-text">{item.location}</span>,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
    },
  ];

  const handleAddNew = () => {
    setEditingEvent(null);
    setErrorMessage(null);
    setModalOpen(true);
  };

  const handleEdit = (item: EventRecord) => {
    setEditingEvent(item);
    setErrorMessage(null);
    setModalOpen(true);
  };

  const handleDelete = async (item: EventRecord) => {
    if (confirm(`Are you sure you want to delete "${item.title}"?`)) {
      const res = await deleteEventAction(item.id);
      if (res.error) alert(res.error);
      else router.refresh();
    }
  };

  const handleSubmitForApproval = async (item: EventRecord) => {
    const res = await updateEventStatusAction(item.id, "PENDING_APPROVAL" as any);
    if (res.error) alert(res.error);
    else router.refresh();
  };

  const handleApprove = async (item: EventRecord) => {
    const res = await updateEventStatusAction(item.id, "APPROVED" as any);
    if (res.error) alert(res.error);
    else router.refresh();
  };

  const handlePublish = async (item: EventRecord) => {
    const res = await updateEventStatusAction(item.id, "PUBLISHED" as any);
    if (res.error) alert(res.error);
    else router.refresh();
  };

  const handleFormSubmit = async (
    values: Record<string, any>,
    actionType: "draft" | "submit" | "publish"
  ) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const res = await saveEventAction(
      {
        id: editingEvent?.id,
        title: values.title,
        eventDate: values.eventDate,
        location: values.location,
        description: values.description,
        image: values.image,
        isFeatured: values.isFeatured === "true" || values.isFeatured === true,
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
    <RoleGuard allowedRoles={["HOSPITAL_DIRECTOR", "CONTENT_STAFF"]}>
      <div className="space-y-6">
        {errorMessage && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {errorMessage}
          </div>
        )}

        <DataTable
          title="Hospital Events & Medical Workshops"
          description="Manage public screening camps, medical conferences, and health education workshops."
          data={formattedEvents}
          columns={columns}
          searchPlaceholder="Search events by title, venue..."
          onAddNew={handleAddNew}
          addNewLabel="Schedule Event"
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSubmitForApproval={handleSubmitForApproval}
          onApprove={handleApprove}
          onPublish={handlePublish}
        />

        <ContentFormModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingEvent ? `Edit Event: ${editingEvent.title}` : "Schedule New Event"}
          description="Content team drafts require Hospital Director approval before publishing."
          fields={formFields}
          initialValues={editingEvent || {}}
          onSubmit={handleFormSubmit}
          isLoading={isSubmitting}
        />
      </div>
    </RoleGuard>
  );
}
