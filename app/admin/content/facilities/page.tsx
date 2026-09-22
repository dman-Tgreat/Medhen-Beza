"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DataTable, ColumnDef } from "@/components/admin/data-table";
import { ContentFormModal, FormFieldConfig } from "@/components/admin/content-form-modal";
import { RoleGuard } from "@/components/admin/role-guard";
import { Building2, Loader2, AlertCircle, Check, ExternalLink } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  getAdminFacilitiesAction,
  saveAdminFacilityAction,
  deleteAdminFacilityAction,
  updateFacilityStatusAction,
  type AdminFacilityItem,
} from "@/lib/actions/facilities";

const FACILITY_FORM_FIELDS: FormFieldConfig[] = [
  {
    name: "name",
    label: "Facility / Wing Name",
    type: "text",
    placeholder: "e.g. Neonatal Intensive Care Unit (NICU)",
    required: true,
  },
  {
    name: "tagline",
    label: "Short Tagline / Headline",
    type: "text",
    placeholder: "e.g. 24/7 Advanced Neonatal Life Support & Family-Centered Care",
    helperText: "Displayed as the primary bold headline under Facility Overview on the public detail page.",
    required: true,
  },
  {
    name: "category",
    label: "Care Category / Classification",
    type: "text",
    placeholder: "e.g. Critical Care, Surgical Suites, Inpatient Rooms, or type any custom category",
    helperText: "Used for directory filtering, classification badges, and the Location & Access sidebar. You can type any new category.",
    required: true,
  },
  {
    name: "capacity",
    label: "Capacity / Specifications",
    type: "text",
    placeholder: "e.g. 16 Dedicated Incubators & Phototherapy Units",
    helperText: "Displayed under 'Capacity / Size' in the Location & Access sidebar.",
  },
  {
    name: "location",
    label: "Campus Wing & Floor Location",
    type: "text",
    placeholder: "e.g. Maternal & Child Pavilion, 3rd Floor",
    helperText: "Displayed under 'Campus Wing' in the Location & Access sidebar.",
  },
  {
    name: "hours",
    label: "Operating & Visiting Hours",
    type: "text",
    placeholder: "e.g. 24/7 Clinical Care · Visiting Hours: 10:00 AM – 8:00 PM",
    helperText: "Displayed under 'Operating & Visiting Hours' in the Location & Access sidebar.",
  },
  {
    name: "phone",
    label: "Direct Extension / Unit Contact Phone",
    type: "text",
    placeholder: "e.g. +251 11 654 3030",
    helperText: "Clickable direct inquiry phone in the sidebar.",
  },
  {
    name: "features",
    label: "Key Specifications & Amenities",
    type: "tags",
    placeholder: "Type a specification/amenity and press Enter or Add",
    helperText: "Each item becomes a highlighted badge with a checkmark under 'Key Specifications & Amenities'.",
  },
  {
    name: "description",
    label: "Detailed Clinical Overview",
    type: "textarea",
    placeholder: "Explain clinical capabilities, patient recovery mission, infection control protocols, air handling systems, and visitor guidelines...",
    helperText: "Displayed as the comprehensive narrative paragraph under Facility Overview.",
  },
  {
    name: "image",
    label: "Facility Cover Photo",
    type: "image",
    folder: "facilities",
    aspectRatio: 16 / 9,
    aspectLabel: "16:9 landscape",
    helperText: "Recommended high-resolution landscape photo of the wing or clinical suite.",
  },
];

export default function FacilitiesAdminPage() {
  const router = useRouter();
  const [facilities, setFacilities] = useState<AdminFacilityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFac, setEditingFac] = useState<AdminFacilityItem | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchFacilities = async () => {
    setLoading(true);
    const res = await getAdminFacilitiesAction();
    if (res.data) {
      setFacilities(res.data);
    } else if (res.error) {
      setActionError(res.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  const columns: ColumnDef<AdminFacilityItem>[] = [
    {
      key: "name",
      header: "Facility Wing",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-light text-primary border border-primary/20 shrink-0">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-text">{item.name}</span>
            <span className="text-xs text-text-muted line-clamp-1 max-w-sm">
              {item.tagline || item.description || "Hospital clinical unit"}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      render: (item) => (
        <span className="rounded-full bg-primary-light px-2.5 py-0.5 text-xs font-semibold text-primary">
          {item.category}
        </span>
      ),
    },
    {
      key: "capacity",
      header: "Capacity / Specs",
      render: (item) => (
        <span className="text-xs text-text font-medium">{item.capacity || "—"}</span>
      ),
    },
    {
      key: "location",
      header: "Location",
      render: (item) => (
        <span className="text-xs text-text-muted">{item.location || "Main Campus"}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
    },
  ];

  const handleAddNew = () => {
    setEditingFac(null);
    setActionError(null);
    setModalOpen(true);
  };

  const handleEdit = (item: AdminFacilityItem) => {
    setEditingFac(item);
    setActionError(null);
    setModalOpen(true);
  };

  const handleDelete = async (item: AdminFacilityItem) => {
    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
      setActionError(null);
      const res = await deleteAdminFacilityAction(item.id);
      if (res.error) {
        setActionError(res.error);
      } else {
        setFacilities((prev) => prev.filter((f) => f.id !== item.id));
        setActionSuccess(`Facility "${item.name}" deleted.`);
        setTimeout(() => setActionSuccess(null), 3000);
      }
    }
  };

  const handleSubmitForApproval = async (item: AdminFacilityItem) => {
    const res = await updateFacilityStatusAction(item.id, "PENDING_APPROVAL" as any);
    if (res.error) alert(res.error);
    else {
      setFacilities((prev) =>
        prev.map((f) => (f.id === item.id ? { ...f, status: "PENDING_APPROVAL" as any } : f))
      );
      router.refresh();
    }
  };

  const handleApprove = async (item: AdminFacilityItem) => {
    const res = await updateFacilityStatusAction(item.id, "APPROVED" as any);
    if (res.error) alert(res.error);
    else {
      setFacilities((prev) =>
        prev.map((f) => (f.id === item.id ? { ...f, status: "APPROVED" as any } : f))
      );
      router.refresh();
    }
  };

  const handlePublish = async (item: AdminFacilityItem) => {
    const res = await updateFacilityStatusAction(item.id, "PUBLISHED" as any);
    if (res.error) alert(res.error);
    else {
      setFacilities((prev) =>
        prev.map((f) => (f.id === item.id ? { ...f, status: "PUBLISHED" as any } : f))
      );
      router.refresh();
    }
  };

  const handleFormSubmit = async (
    values: Record<string, any>,
    actionType: "draft" | "submit" | "publish" = "draft"
  ) => {
    setActionError(null);
    const res = await saveAdminFacilityAction(
      {
        id: editingFac?.id,
        name: values.name,
        tagline: values.tagline,
        category: values.category,
        capacity: values.capacity,
        location: values.location,
        hours: values.hours,
        phone: values.phone,
        features: values.features,
        description: values.description,
        image: values.image,
      },
      actionType
    );

    if (res.error) {
      setActionError(res.error);
      alert(res.error);
    } else if (res.data) {
      const saved = res.data;
      if (editingFac) {
        setFacilities((prev) => prev.map((f) => (f.id === saved.id ? saved : f)));
        setActionSuccess(`Facility "${saved.name}" updated successfully.`);
      } else {
        setFacilities((prev) => [saved, ...prev]);
        setActionSuccess(`Facility "${saved.name}" created successfully.`);
      }
      setTimeout(() => setActionSuccess(null), 3000);
      setModalOpen(false);
      router.refresh();
    }
  };

  return (
    <RoleGuard allowedRoles={["HOSPITAL_DIRECTOR", "MEDICAL_DIRECTOR", "CONTENT_STAFF"]}>
      <div className="space-y-6">
        {actionError && (
          <Alert variant="emergency">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Facility Operation Failed</AlertTitle>
            <AlertDescription>{actionError}</AlertDescription>
          </Alert>
        )}

        {actionSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
            <Check className="h-4 w-4" />
            {actionSuccess}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-small text-text-muted">Loading hospital facilities from database...</p>
          </div>
        ) : (
          <DataTable
            title="Hospital Wings & Clinical Facilities"
            description="Manage hospital infrastructure, critical care units, inpatient suites, and advanced diagnostic spaces."
            data={facilities}
            columns={columns}
            searchPlaceholder="Search facilities by wing, category, specs, location..."
            onAddNew={handleAddNew}
            addNewLabel="Add Facility Wing"
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSubmitForApproval={handleSubmitForApproval}
            onApprove={handleApprove}
            onPublish={handlePublish}
            extraActions={[
              {
                label: "View Live Page",
                icon: ExternalLink,
                onClick: (item) => window.open(`/facilities/${item.slug || item.id}`, "_blank"),
              },
            ]}
          />
        )}

        <ContentFormModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingFac ? `Edit Facility: ${editingFac.name}` : "Add Clinical Facility"}
          description="Configure clinical facility specifications, location, amenities, and hours."
          fields={FACILITY_FORM_FIELDS}
          initialValues={
            editingFac
              ? {
                  name: editingFac.name,
                  tagline: editingFac.tagline,
                  category: editingFac.category,
                  capacity: editingFac.capacity,
                  location: editingFac.location,
                  hours: editingFac.hours,
                  phone: editingFac.phone,
                  features: editingFac.features || [],
                  description: editingFac.description,
                  image: editingFac.image,
                }
              : {}
          }
          onSubmit={handleFormSubmit}
        />
      </div>
    </RoleGuard>
  );
}
