"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable, ColumnDef } from "@/components/admin/data-table";
import { ContentFormModal, FormFieldConfig } from "@/components/admin/content-form-modal";
import { RoleGuard } from "@/components/admin/role-guard";
import { ContentStatusType } from "@/lib/admin/types";
import { saveGalleryAction, deleteGalleryAction, updateGalleryStatusAction } from "@/lib/actions/content";
import { Image as ImageIcon, Video } from "lucide-react";

interface GalleryRecord {
  id: string;
  title: string;
  album: string;
  type: "IMAGE" | "VIDEO";
  url: string;
  thumbnailUrl: string;
  description?: string;
  altText?: string;
  status: ContentStatusType;
}

interface GalleryAdminClientProps {
  initialGallery: any[];
}

export function GalleryAdminClient({ initialGallery }: GalleryAdminClientProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const formattedGallery: GalleryRecord[] = initialGallery.map((item) => ({
    id: item.id,
    title: item.title,
    album: item.album || "Facilities",
    type: item.type === "VIDEO" ? "VIDEO" : "IMAGE",
    url: item.url,
    thumbnailUrl: item.thumbnailUrl || item.url,
    description: item.description || "",
    altText: item.altText || item.title,
    status: item.status as ContentStatusType,
  }));

  const formFields: FormFieldConfig[] = [
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
      label: "Media Asset",
      type: "image",
      mediaKind: (values) => values.type === "VIDEO" ? "video" : "image",
      folder: "gallery",
      aspectRatio: 16 / 9,
      aspectLabel: "16:9 landscape",
      required: true,
    },
    {
      name: "thumbnailUrl",
      label: "Thumbnail Image",
      type: "image",
      folder: "gallery/thumbnails",
      aspectRatio: 16 / 9,
      aspectLabel: "16:9 landscape",
    },
    {
      name: "altText",
      label: "Accessibility Alt Text",
      type: "text",
      placeholder: "Descriptive label for screen readers",
    },
    {
      name: "description",
      label: "Detailed Caption",
      type: "textarea",
      placeholder: "Optional context or story behind the media...",
    },
  ];

  const columns: ColumnDef<GalleryRecord>[] = [
    {
      key: "title",
      header: "Media Asset",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-16 rounded overflow-hidden bg-background border border-border shrink-0">
            {item.url ? (
              <img src={item.thumbnailUrl || item.url} alt={item.title} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gray-100">
                <ImageIcon className="h-4 w-4 text-gray-400" />
              </div>
            )}
            {item.type === "VIDEO" && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Video className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
          <div className="flex flex-col max-w-xs">
            <span className="font-semibold text-text truncate">{item.title}</span>
            <span className="text-xs text-text-muted">{item.album}</span>
          </div>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      sortable: true,
      render: (item) => (
        <span className="rounded bg-background px-2 py-0.5 text-xs border border-border text-text font-mono">
          {item.type}
        </span>
      ),
    },
    {
      key: "album",
      header: "Album",
      sortable: true,
      render: (item) => <span className="text-sm text-text-muted">{item.album}</span>,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
    },
  ];

  const handleAddNew = () => {
    setEditingItem(null);
    setErrorMessage(null);
    setModalOpen(true);
  };

  const handleEdit = (item: GalleryRecord) => {
    setEditingItem(item);
    setErrorMessage(null);
    setModalOpen(true);
  };

  const handleDelete = async (item: GalleryRecord) => {
    if (confirm(`Are you sure you want to delete media item "${item.title}"?`)) {
      const res = await deleteGalleryAction(item.id);
      if (res.error) alert(res.error);
      else router.refresh();
    }
  };

  const handleSubmitForApproval = async (item: GalleryRecord) => {
    const res = await updateGalleryStatusAction(item.id, "PENDING_APPROVAL" as any);
    if (res.error) alert(res.error);
    else router.refresh();
  };

  const handleApprove = async (item: GalleryRecord) => {
    const res = await updateGalleryStatusAction(item.id, "APPROVED" as any);
    if (res.error) alert(res.error);
    else router.refresh();
  };

  const handlePublish = async (item: GalleryRecord) => {
    const res = await updateGalleryStatusAction(item.id, "PUBLISHED" as any);
    if (res.error) alert(res.error);
    else router.refresh();
  };

  const handleFormSubmit = async (
    values: Record<string, any>,
    actionType: "draft" | "submit" | "publish"
  ) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const res = await saveGalleryAction(
      {
        id: editingItem?.id,
        title: values.title,
        album: values.album,
        type: values.type,
        url: values.url,
        thumbnailUrl: values.thumbnailUrl,
        description: values.description,
        order: values.order ? Number(values.order) : undefined,
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
          title="Hospital Photo & Video Gallery"
          description="Manage clinical photography, facility tours, medical equipment imagery, and video media."
          data={formattedGallery}
          columns={columns}
          searchPlaceholder="Search media by title, album..."
          onAddNew={handleAddNew}
          addNewLabel="Upload Media"
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSubmitForApproval={handleSubmitForApproval}
          onApprove={handleApprove}
          onPublish={handlePublish}
        />

        <ContentFormModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingItem ? `Edit Media: ${editingItem.title}` : "Add Gallery Asset"}
          description="Content team drafts require Hospital Director approval before public display."
          fields={formFields}
          initialValues={editingItem || { album: "Facilities", type: "IMAGE" }}
          onSubmit={handleFormSubmit}
          isLoading={isSubmitting}
        />
      </div>
    </RoleGuard>
  );
}
