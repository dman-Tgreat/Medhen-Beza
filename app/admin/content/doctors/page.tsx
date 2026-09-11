"use client";

import React, { useState } from "react";
import { DataTable, ColumnDef } from "@/components/admin/data-table";
import { ContentFormModal, FormFieldConfig } from "@/components/admin/content-form-modal";
import { RoleGuard } from "@/components/admin/role-guard";
import { ContentStatusType } from "@/lib/admin/types";
import { Stethoscope, User, Calendar, Award } from "lucide-react";

interface DoctorRecord {
  id: string;
  fullName: string;
  specialty: string;
  department: string;
  position: string;
  experienceYears: number;
  status: ContentStatusType;
  profilePhoto: string;
  languages: string[];
}

const INITIAL_DOCTORS: DoctorRecord[] = [
  {
    id: "doc-1",
    fullName: "Dr. Samuel Bekele",
    specialty: "Chief of Surgery & Interventional Cardiology",
    department: "Cardiology & Surgery",
    position: "Chief Medical Officer",
    experienceYears: 22,
    status: "PUBLISHED",
    profilePhoto: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200",
    languages: ["Amharic", "English", "French"],
  },
  {
    id: "doc-2",
    fullName: "Dr. Bethlehem Tadesse",
    specialty: "Lead Neurologist & Neurovascular Surgeon",
    department: "Neurology",
    position: "Medical Director",
    experienceYears: 16,
    status: "PUBLISHED",
    profilePhoto: "https://images.unsplash.com/photo-1594824813620-460d1dd5d15b?auto=format&fit=crop&q=80&w=200",
    languages: ["Amharic", "English"],
  },
  {
    id: "doc-3",
    fullName: "Dr. Meron Haile",
    specialty: "Consultant Pediatric Cardiologist",
    department: "Pediatrics",
    position: "Senior Specialist",
    experienceYears: 12,
    status: "PENDING_APPROVAL",
    profilePhoto: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200",
    languages: ["Amharic", "English", "German"],
  },
  {
    id: "doc-4",
    fullName: "Dr. Dawit Mengistu",
    specialty: "Orthopedic & Joint Reconstruction Surgeon",
    department: "Orthopedics",
    position: "Consultant Surgeon",
    experienceYears: 14,
    status: "APPROVED",
    profilePhoto: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200",
    languages: ["Amharic", "English"],
  },
  {
    id: "doc-5",
    fullName: "Dr. Helen Kebede",
    specialty: "Emergency & Critical Care Specialist",
    department: "Emergency Medicine",
    position: "Head of Emergency Response",
    experienceYears: 9,
    status: "DRAFT",
    profilePhoto: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200",
    languages: ["Amharic", "English", "Oromo"],
  },
];

const DOCTOR_FORM_FIELDS: FormFieldConfig[] = [
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
    name: "department",
    label: "Clinical Department",
    type: "select",
    options: [
      { label: "Cardiology", value: "Cardiology" },
      { label: "Neurology", value: "Neurology" },
      { label: "Pediatrics", value: "Pediatrics" },
      { label: "Orthopedics", value: "Orthopedics" },
      { label: "Emergency Medicine", value: "Emergency Medicine" },
      { label: "Obstetrics & Gynecology", value: "Obstetrics & Gynecology" },
    ],
    required: true,
  },
  {
    name: "position",
    label: "Position / Title",
    type: "text",
    placeholder: "e.g. Senior Consultant Surgeon",
  },
  {
    name: "experienceYears",
    label: "Years of Clinical Experience",
    type: "number",
    placeholder: "12",
  },
  {
    name: "profilePhoto",
    label: "Doctor Profile Photo",
    type: "image",
    helperText: "Professional clinical portrait photo with white or neutral background.",
  },
  {
    name: "biography",
    label: "Professional Biography & Credentials",
    type: "textarea",
    placeholder: "Detailed career background, overseas fellowships, and clinical accomplishments...",
  },
  {
    name: "languages",
    label: "Languages Spoken",
    type: "tags",
  },
];

export default function DoctorsAdminPage() {
  const [doctors, setDoctors] = useState<DoctorRecord[]>(INITIAL_DOCTORS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<DoctorRecord | null>(null);

  const columns: ColumnDef<DoctorRecord>[] = [
    {
      key: "fullName",
      header: "Doctor Details",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          <img
            src={item.profilePhoto}
            alt={item.fullName}
            className="h-10 w-10 rounded-full object-cover border border-border shrink-0"
          />
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
      key: "department",
      header: "Department",
      sortable: true,
      render: (item) => (
        <span className="rounded bg-background px-2 py-0.5 text-xs border border-border text-text-muted">
          {item.department}
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
    setModalOpen(true);
  };

  const handleEdit = (doctor: DoctorRecord) => {
    setEditingDoctor(doctor);
    setModalOpen(true);
  };

  const handleDelete = (doctor: DoctorRecord) => {
    if (confirm(`Are you sure you want to remove ${doctor.fullName}?`)) {
      setDoctors((prev) => prev.filter((d) => d.id !== doctor.id));
    }
  };

  const handleSubmitForApproval = (doctor: DoctorRecord) => {
    setDoctors((prev) =>
      prev.map((d) => (d.id === doctor.id ? { ...d, status: "PENDING_APPROVAL" as ContentStatusType } : d))
    );
  };

  const handleApprove = (doctor: DoctorRecord) => {
    setDoctors((prev) =>
      prev.map((d) => (d.id === doctor.id ? { ...d, status: "APPROVED" as ContentStatusType } : d))
    );
  };

  const handlePublish = (doctor: DoctorRecord) => {
    setDoctors((prev) =>
      prev.map((d) => (d.id === doctor.id ? { ...d, status: "PUBLISHED" as ContentStatusType } : d))
    );
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

    if (editingDoctor) {
      setDoctors((prev) =>
        prev.map((d) =>
          d.id === editingDoctor.id
            ? { ...d, ...values, status: statusMap[actionType] || d.status }
            : d
        )
      );
    } else {
      const newDoctor: DoctorRecord = {
        id: `doc-${Date.now()}`,
        fullName: values.fullName || "New Doctor",
        specialty: values.specialty || "General Specialist",
        department: values.department || "Cardiology",
        position: values.position || "Staff Physician",
        experienceYears: Number(values.experienceYears) || 5,
        status: statusMap[actionType],
        profilePhoto:
          values.profilePhoto ||
          "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200",
        languages: values.languages || ["Amharic", "English"],
      };
      setDoctors((prev) => [newDoctor, ...prev]);
    }
  };

  return (
    <RoleGuard allowedRoles={["HOSPITAL_DIRECTOR", "MEDICAL_DIRECTOR"]}>
      <div className="space-y-6">
        <DataTable
          title="Doctors & Medical Specialists Directory"
          description="Manage hospital physician profiles, medical specialties, clinical credentials, and publication status."
          data={doctors}
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
          fields={DOCTOR_FORM_FIELDS}
          initialValues={editingDoctor || {}}
          onSubmit={handleFormSubmit}
        />
      </div>
    </RoleGuard>
  );
}
