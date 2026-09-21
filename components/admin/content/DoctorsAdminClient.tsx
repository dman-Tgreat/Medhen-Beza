"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable, ColumnDef } from "@/components/admin/data-table";
import { ContentFormModal, FormFieldConfig } from "@/components/admin/content-form-modal";
import { RoleGuard } from "@/components/admin/role-guard";
import { ContentStatusType } from "@/lib/admin/types";
import { saveDoctorAction, deleteDoctorAction, updateDoctorStatusAction } from "@/lib/actions/content";

interface DoctorRecord {
  id: string;
  fullName: string;
  specialty: string;
  departmentId?: string;
  departmentName?: string;
  department?: { id: string; name: string };
  position: string;
  experience?: string;
  experienceYears?: number;
  status: ContentStatusType;
  profilePhoto?: string;
  languages: string[];
  biography?: string;
  qualifications: string[];
  areasOfExpertise: string[];
  availability?: string;
  isFeatured: boolean;
}

interface DoctorsAdminClientProps {
  initialDoctors: any[];
  departments: Array<{ id: string; name: string }>;
}

export function DoctorsAdminClient({ initialDoctors, departments }: DoctorsAdminClientProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<DoctorRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const formattedDoctors: DoctorRecord[] = initialDoctors.map((doc) => ({
    id: doc.id,
    fullName: doc.fullName,
    specialty: doc.specialty,
    departmentId: doc.departmentId,
    departmentName: doc.department?.name || "General",
    department: doc.department,
    position: doc.position || "Specialist",
    experience: doc.experience || "5+ years",
    status: doc.status as ContentStatusType,
    profilePhoto: doc.profilePhoto || undefined,
    languages: doc.languages || ["Amharic", "English"],
    biography: doc.biography || "",
    qualifications: doc.qualifications || [],
    areasOfExpertise: doc.areasOfExpertise || [],
    availability: doc.availability || "",
    isFeatured: Boolean(doc.isFeatured),
  }));

  const formFields: FormFieldConfig[] = [
    {
      name: "fullName",
      label: "Doctor Full Name",
      type: "text",
      placeholder: "e.g. Dr. Meron Haile",
      required: true,
    },
    {
      name: "specialty",
      label: "Medical Specialty",
      type: "text",
      placeholder: "e.g. Consultant Pediatric Cardiologist",
      required: true,
    },
    {
      name: "departmentId",
      label: "Clinical Department",
      type: "select",
      options: departments.map((d) => ({ label: d.name, value: d.id })),
      required: true,
    },
    {
      name: "position",
      label: "Position / Title",
      type: "text",
      placeholder: "e.g. Senior Consultant Surgeon",
    },
    {
      name: "experience",
      label: "Clinical Experience Description",
      type: "text",
      placeholder: "e.g. 12+ years of surgical experience",
    },
    {
      name: "profilePhoto",
      label: "Doctor Profile Photo",
      type: "image",
      folder: "doctors",
      aspectRatio: 1,
      aspectLabel: "1:1 portrait",
      helperText: "Use a centered clinical portrait so the circular doctor cards crop cleanly.",
    },
    {
      name: "biography",
      label: "Professional Biography & Credentials",
      type: "textarea",
      placeholder: "Detailed career background, fellowships, and clinical accomplishments...",
    },
    {
      name: "languages",
      label: "Languages Spoken",
      type: "tags",
    },
    {
      name: "qualifications",
      label: "Qualifications & Fellowships",
      type: "tags",
      helperText: "Add degrees, board certifications, and fellowships one at a time.",
    },
    {
      name: "areasOfExpertise",
      label: "Areas of Clinical Expertise",
      type: "tags",
      helperText: "Add the procedures or clinical focus areas shown on the public profile.",
    },
    {
      name: "availability",
      label: "Consultation Availability",
      type: "text",
      placeholder: "e.g. Monday - Friday: 9:00 AM - 5:00 PM",
    },
    {
      name: "isFeatured",
      label: "Feature this doctor in directory highlights",
      type: "checkbox",
    },
  ];

  const columns: ColumnDef<DoctorRecord>[] = [
    {
      key: "fullName",
      header: "Doctor Details",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          {item.profilePhoto ? (
            <img
              src={item.profilePhoto}
              alt={item.fullName}
              className="h-10 w-10 rounded-full object-cover border border-border shrink-0"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold text-xs shrink-0">
              {item.fullName.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-semibold text-text">{item.fullName}</span>
            <span className="text-xs text-text-muted">{item.position}</span>
          </div>
        </div>
      ),
    },
    {
      key: "specialty",
      header: "Specialty",
      sortable: true,
      render: (item) => <span className="font-medium text-text">{item.specialty}</span>,
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
      key: "languages",
      header: "Languages",
      render: (item) => (
        <div className="flex flex-wrap gap-1">
          {item.languages.map((l) => (
            <span
              key={l}
              className="text-[10px] bg-primary-light/60 text-primary-dark px-1.5 py-0.5 rounded font-medium"
            >
              {l}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
    },
  ];

  const handleAddNew = () => {
    setEditingDoctor(null);
    setErrorMessage(null);
    setModalOpen(true);
  };

  const handleEdit = (doctor: DoctorRecord) => {
    setEditingDoctor(doctor);
    setErrorMessage(null);
    setModalOpen(true);
  };

  const handleDelete = async (doctor: DoctorRecord) => {
    if (confirm(`Are you sure you want to remove ${doctor.fullName}?`)) {
      const res = await deleteDoctorAction(doctor.id);
      if (res.error) {
        alert(res.error);
      } else {
        router.refresh();
      }
    }
  };

  const handleSubmitForApproval = async (doctor: DoctorRecord) => {
    const res = await updateDoctorStatusAction(doctor.id, "PENDING_APPROVAL" as any);
    if (res.error) alert(res.error);
    else router.refresh();
  };

  const handleApprove = async (doctor: DoctorRecord) => {
    const res = await updateDoctorStatusAction(doctor.id, "APPROVED" as any);
    if (res.error) alert(res.error);
    else router.refresh();
  };

  const handlePublish = async (doctor: DoctorRecord) => {
    const res = await updateDoctorStatusAction(doctor.id, "PUBLISHED" as any);
    if (res.error) alert(res.error);
    else router.refresh();
  };

  const handleFormSubmit = async (
    values: Record<string, any>,
    actionType: "draft" | "submit" | "publish"
  ) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const res = await saveDoctorAction(
      {
        id: editingDoctor?.id,
        fullName: values.fullName,
        specialty: values.specialty,
        departmentId: values.departmentId || departments[0]?.id,
        position: values.position,
        experience: values.experience,
        biography: values.biography,
        languages: values.languages,
        profilePhoto: values.profilePhoto,
        qualifications: values.qualifications,
        areasOfExpertise: values.areasOfExpertise,
        availability: values.availability,
        isFeatured: Boolean(values.isFeatured),
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
          title="Doctors & Medical Specialists Directory"
          description="Manage hospital physician profiles, medical specialties, clinical credentials, and publication status."
          data={formattedDoctors}
          columns={columns}
          searchPlaceholder="Search doctors by name, specialty, department..."
          onAddNew={handleAddNew}
          addNewLabel="Add Doctor Profile"
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSubmitForApproval={handleSubmitForApproval}
          onApprove={handleApprove}
          onPublish={handlePublish}
        />

        <ContentFormModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingDoctor ? `Edit Profile: ${editingDoctor.fullName}` : "Create Doctor Profile"}
          description="Fill in doctor information. Medical Director submissions require Hospital Director approval."
          fields={formFields}
          initialValues={editingDoctor || { departmentId: departments[0]?.id }}
          onSubmit={handleFormSubmit}
          isLoading={isSubmitting}
        />
      </div>
    </RoleGuard>
  );
}
