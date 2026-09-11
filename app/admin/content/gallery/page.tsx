"use client";

import React, { useState } from "react";
import { DataTable, ColumnDef } from "@/components/admin/data-table";
import { ContentFormModal, FormFieldConfig } from "@/components/admin/content-form-modal";
import { RoleGuard } from "@/components/admin/role-guard";
import { ContentStatusType } from "@/lib/admin/types";
import { Image as ImageIcon, Video, Film, Eye } from "lucide-react";

interface GalleryRecord {
  id: string;
  title: string;
  album: string;
  type: "IMAGE" | "VIDEO";
  url: string;
  thumbnailUrl: string;
  status: ContentStatusType;
}

const INITIAL_GALLERY: GalleryRecord[] = [
  {
    id: "gal-1",
    title: "Advanced Modular Operating Theater Suite 1",
    album: "Facilities",
    type: "IMAGE",
    url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800",
    thumbnailUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=200",
    status: "PUBLISHED",
  },
  {
    id: "gal-2",
    title: "Hospital Building Exterior & Emergency Ambulance Bay",
    album: "Campus",
    type: "IMAGE",
    url: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=800",
    thumbnailUrl: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=200",
    status: "PUBLISHED",
  },
  {
    id: "gal-3",
    title: "Virtual Hospital Walkthrough & Patient Wing Tour",
    album: "Virtual Tour",
    type: "VIDEO",
    url: "https://assets.mixkit.co/videos/preview/mixkit-doctor-explaining-a-medical-procedure-41804-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=200",
    status: "PUBLISHED",
  },
  {
    id: "gal-4",
    title: "Cardiac Intensive Care Unit Patient Monitoring System",
    album: "Equipment",
    type: "IMAGE",
    url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800",
    thumbnailUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=200",
    status: "PENDING_APPROVAL",
  },
  {
    id: "gal-5",
    title: "Nursing Staff Annual Recognition Ceremony 2026",
    album: "Events",
    type: "IMAGE",
    url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800",
    thumbnailUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=200",
    status: "DRAFT",
  },
];

const GALLERY_FORM_FIELDS: FormFieldConfig[] = [
  {
    name: "title",
    label: "Media Title / Caption",
    type: "text",
    placeholder: "e.g. Intensive Care Wing Incubators",
    required: true,
  },
  {
    name: "album",
    label: "Album / Category",
    type: "select",
    options: [
      { label: "Hospital Facilities", value: "Facilities" },
      { label: "Campus & Architecture", value: "Campus" },
      { label: "Equipment & Technology", value: "Equipment" },
      { label: "Hospital Events", value: "Events" },
      { label: "Virtual Tour", value: "Virtual Tour" },
    ],
    required: true,
  },
  {
    name: "type",
    label: "Media Type",
    type: "select",
    options: [
      { label: "Photo / Image", value: "IMAGE" },
      { label: "Video", value: "VIDEO" },
    ],
    required: true,
  },
  {
    name: "url",
    label: "Media File URL / Video Source",
    type: "image",
    required: true,
  },
  {
    name: "description",
    label: "Description / Accessibility Alt Text",
    type: "textarea",
    placeholder: "Describe the image or video for screen readers and gallery tooltips...",
  },
];

export default function GalleryAdminPage() {
  const [items, setItems] = useState<GalleryRecord[]>(INITIAL_GALLERY);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryRecord | null>(null);

  const columns: ColumnDef<GalleryRecord>[] = [
    {
      key: "title",
      header: "Asset",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-16 rounded-md overflow-hidden bg-background border border-border shrink-0">
            <img src={item.thumbnailUrl || item.url} alt={item.title} className="h-full w-full object-cover" />
            {item.type === "VIDEO" && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                <Film className="h-4 w-4" />
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-text">{item.title}</span>
            <span className="text-xs text-text-muted">Album: {item.album}</span>
          </div>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (item) => (
        <span className="inline-flex items-center gap-1 rounded bg-background px-2 py-0.5 text-xs border border-border text-text-muted font-medium">
          {item.type === "VIDEO" ? <Video className="h-3 w-3 text-emergency" /> : <ImageIcon className="h-3 w-3 text-primary" />}
          {item.type}
        </span>
      ),
    },
    {
      key: "album",
      header: "Album",
      sortable: true,
      render: (item) => <span className="text-xs text-text">{item.album}</span>,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
    },
  ];

  const handleAddNew = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleEdit = (item: GalleryRecord) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleDelete = (item: GalleryRecord) => {
    if (confirm(`Remove gallery item: ${item.title}?`)) {
      setItems((prev) => prev.filter((i) => i.id !== item.id));
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

    if (editingItem) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === editingItem.id
            ? { ...i, ...values, status: statusMap[actionType] || i.status }
            : i
        )
      );
    } else {
      const newItem: GalleryRecord = {
        id: `gal-${Date.now()}`,
        title: values.title || "New Gallery Item",
        album: values.album || "Facilities",
        type: values.type || "IMAGE",
        url: values.url || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800",
        thumbnailUrl: values.url || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=200",
        status: statusMap[actionType],
      };
      setItems((prev) => [newItem, ...prev]);
    }
  };

  return (
    <RoleGuard allowedRoles={["HOSPITAL_DIRECTOR", "CONTENT_STAFF"]}>
      <div className="space-y-6">
        <DataTable
          title="Hospital Gallery & Video Library"
          description="Manage hospital imagery, clinical facilities photography, and video tour assets."
          data={items}
          columns={columns}
          searchPlaceholder="Search gallery photos & videos..."
          onAddNew={handleAddNew}
          addNewLabel="Add Gallery Media"
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <ContentFormModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingItem ? `Edit Media: ${editingItem.title}` : "Add Gallery Asset"}
          fields={GALLERY_FORM_FIELDS}
          initialValues={editingItem || {}}
          onSubmit={handleFormSubmit}
        />
      </div>
    </RoleGuard>
  );
}
