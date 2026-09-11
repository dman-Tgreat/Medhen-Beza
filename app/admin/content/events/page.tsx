"use client";

import React, { useState } from "react";
import { DataTable, ColumnDef } from "@/components/admin/data-table";
import { ContentFormModal, FormFieldConfig } from "@/components/admin/content-form-modal";
import { RoleGuard } from "@/components/admin/role-guard";
import { ContentStatusType } from "@/lib/admin/types";
import { Calendar, MapPin, Clock } from "lucide-react";

interface EventRecord {
  id: string;
  title: string;
  eventDate: string;
  location: string;
  status: ContentStatusType;
}

const INITIAL_EVENTS: EventRecord[] = [
  {
    id: "evt-1",
    title: "World Heart Day: Free Cardiac Checkup Camp",
    eventDate: "2026-09-29",
    location: "Hospital Main Auditorium & Clinic Rooms",
    status: "PUBLISHED",
  },
  {
    id: "evt-2",
    title: "Continuous Medical Education (CME): Updates in Critical Care",
    eventDate: "2026-10-12",
    location: "Conference Hall B",
    status: "APPROVED",
  },
  {
    id: "evt-3",
    title: "Maternal Health & Prenatal Care Workshop for Expecting Mothers",
    eventDate: "2026-10-24",
    location: "Maternity Ward Education Center",
    status: "PENDING_APPROVAL",
  },
];

const EVENT_FORM_FIELDS: FormFieldConfig[] = [
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
    name: "description",
    label: "Event Description & Schedule",
    type: "textarea",
    placeholder: "Provide timetable, speaker list, registration details...",
  },
];

export default function EventsAdminPage() {
  const [events, setEvents] = useState<EventRecord[]>(INITIAL_EVENTS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventRecord | null>(null);

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
          <span className="font-semibold text-text">{item.title}</span>
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
    setModalOpen(true);
  };

  const handleEdit = (event: EventRecord) => {
    setEditingEvent(event);
    setModalOpen(true);
  };

  const handleDelete = (event: EventRecord) => {
    if (confirm(`Remove event: ${event.title}?`)) {
      setEvents((prev) => prev.filter((e) => e.id !== event.id));
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

    if (editingEvent) {
      setEvents((prev) =>
        prev.map((e) =>
          e.id === editingEvent.id
            ? { ...e, ...values, status: statusMap[actionType] || e.status }
            : e
        )
      );
    } else {
      const newEvent: EventRecord = {
        id: `evt-${Date.now()}`,
        title: values.title || "New Event",
        eventDate: values.eventDate || "2026-11-01",
        location: values.location || "Hospital Main Hall",
        status: statusMap[actionType],
      };
      setEvents((prev) => [newEvent, ...prev]);
    }
  };

  return (
    <RoleGuard allowedRoles={["HOSPITAL_DIRECTOR", "CONTENT_STAFF"]}>
      <div className="space-y-6">
        <DataTable
          title="Hospital Events & Workshops"
          description="Manage public health camps, medical education seminars, and hospital community outreach days."
          data={events}
          columns={columns}
          searchPlaceholder="Search events..."
          onAddNew={handleAddNew}
          addNewLabel="Create Event"
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <ContentFormModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingEvent ? `Edit Event: ${editingEvent.title}` : "Create Event"}
          fields={EVENT_FORM_FIELDS}
          initialValues={editingEvent || {}}
          onSubmit={handleFormSubmit}
        />
      </div>
    </RoleGuard>
  );
}
