"use client";

import React, { useState, useEffect } from "react";
import { DataTable, ColumnDef } from "@/components/admin/data-table";
import { ContentFormModal, FormFieldConfig } from "@/components/admin/content-form-modal";
import { RoleGuard } from "@/components/admin/role-guard";
import { Hotel, CheckCircle, Loader2, AlertCircle, Check } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  getAdminFacilitiesAction,
  saveAdminFacilityAction,
  deleteAdminFacilityAction,
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
    name: "category",
    label: "Category",
    type: "select",
    options: [
      { label: "Critical Care", value: "Critical Care" },
      { label: "Radiology & Imaging", value: "Radiology" },
      { label: "Surgical Suites", value: "Surgical Suites" },
      { label: "Diagnostics & Lab", value: "Diagnostics" },
      { label: "Inpatient Rooms", value: "Inpatient Rooms" },
    ],
    required: true,
  },
  {
    name: "capacity",
    label: "Capacity / Specifications",
    type: "text",
    placeholder: "e.g. 12 Dedicated Incubators & Phototherapy",
  },
  {
    name: "description",
    label: "Facility Overview",
    type: "textarea",
    placeholder: "Detailed specifications, infection control standards, visitor guidelines...",
  },
];

export default function FacilitiesAdminPage() {
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
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-light text-primary-dark border border-primary/20 shrink-0">
            <Hotel className="h-4 w-4" />
          </div>
          <span className="font-semibold text-text">{item.name}</span>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      render: (item) => (
        <span className="rounded bg-background px-2 py-0.5 text-xs border border-border text-text-muted">
          {item.category}
        </span>
      ),
    },
    {
      key: "capacity",
      header: "Capacity / Specs",
      render: (item) => <span className="text-xs text-text">{item.capacity}</span>,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
    },
  ];

  const handleAddNew = () => {
    setEditingFac(null);
    setModalOpen(true);
  };

  const handleEdit = (item: AdminFacilityItem) => {
    setEditingFac(item);
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

  const handleFormSubmit = async (values: Record<string, any>) => {
    setActionError(null);
    const res = await saveAdminFacilityAction({
      id: editingFac?.id,
      name: values.name,
      category: values.category,
      capacity: values.capacity,
      description: values.description,
    });

    if (res.error) {
      setActionError(res.error);
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
    }
  };

  return (
    <RoleGuard allowedRoles={["HOSPITAL_DIRECTOR", "CONTENT_STAFF"]}>
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
            searchPlaceholder="Search facilities by name, specs..."
            onAddNew={handleAddNew}
            addNewLabel="Add Facility Wing"
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        <ContentFormModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingFac ? `Edit Facility: ${editingFac.name}` : "Add Clinical Facility"}
          fields={FACILITY_FORM_FIELDS}
          initialValues={
            editingFac
              ? {
                  name: editingFac.name,
                  category: editingFac.category,
                  capacity: editingFac.capacity,
                  description: editingFac.description,
                }
              : {}
          }
          onSubmit={(values) => handleFormSubmit(values)}
        />
      </div>
    </RoleGuard>
  );
}
