"use client";

import React, { useState } from "react";
import { DataTable, ColumnDef } from "@/components/admin/data-table";
import { ContentFormModal, FormFieldConfig } from "@/components/admin/content-form-modal";
import { RoleGuard } from "@/components/admin/role-guard";
import { ContentStatusType } from "@/lib/admin/types";
import { HelpCircle } from "lucide-react";

interface FAQRecord {
  id: string;
  question: string;
  category: string;
  order: number;
  status: ContentStatusType;
}

const INITIAL_FAQS: FAQRecord[] = [
  {
    id: "faq-1",
    question: "What are the emergency department operating hours?",
    category: "Emergency & Hours",
    order: 1,
    status: "PUBLISHED",
  },
  {
    id: "faq-2",
    question: "How do I schedule an outpatient consultation with a specialist?",
    category: "Appointments",
    order: 2,
    status: "PUBLISHED",
  },
  {
    id: "faq-3",
    question: "What insurance providers and direct billing are accepted?",
    category: "Billing & Insurance",
    order: 3,
    status: "PUBLISHED",
  },
  {
    id: "faq-4",
    question: "What are the visiting hours for inpatient and ICU wards?",
    category: "Visitor Guidelines",
    order: 4,
    status: "APPROVED",
  },
];

const FAQ_FORM_FIELDS: FormFieldConfig[] = [
  {
    name: "question",
    label: "Question",
    type: "text",
    placeholder: "e.g. Do I need a doctor's referral for an MRI scan?",
    required: true,
  },
  {
    name: "category",
    label: "Category",
    type: "select",
    options: [
      { label: "Emergency & Hours", value: "Emergency & Hours" },
      { label: "Appointments & Registration", value: "Appointments" },
      { label: "Billing & Insurance", value: "Billing & Insurance" },
      { label: "Visitor Guidelines", value: "Visitor Guidelines" },
    ],
    required: true,
  },
  {
    name: "answer",
    label: "Answer",
    type: "textarea",
    placeholder: "Clear and helpful answer for patients and visitors...",
    required: true,
  },
  {
    name: "order",
    label: "Display Order / Position",
    type: "number",
    placeholder: "1",
  },
];

export default function FAQsAdminPage() {
  const [faqs, setFaqs] = useState<FAQRecord[]>(INITIAL_FAQS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQRecord | null>(null);

  const columns: ColumnDef<FAQRecord>[] = [
    {
      key: "question",
      header: "Question",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary-light text-primary-dark border border-primary/20 shrink-0">
            <HelpCircle className="h-4 w-4" />
          </div>
          <span className="font-semibold text-text">{item.question}</span>
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
      key: "order",
      header: "Order",
      sortable: true,
      render: (item) => <span className="text-xs font-mono font-medium text-text">{item.order}</span>,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
    },
  ];

  const handleAddNew = () => {
    setEditingFaq(null);
    setModalOpen(true);
  };

  const handleEdit = (item: FAQRecord) => {
    setEditingFaq(item);
    setModalOpen(true);
  };

  const handleDelete = (item: FAQRecord) => {
    if (confirm(`Delete FAQ: "${item.question}"?`)) {
      setFaqs((prev) => prev.filter((f) => f.id !== item.id));
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

    if (editingFaq) {
      setFaqs((prev) =>
        prev.map((f) =>
          f.id === editingFaq.id
            ? { ...f, ...values, status: statusMap[actionType] || f.status }
            : f
        )
      );
    } else {
      const newFaq: FAQRecord = {
        id: `faq-${Date.now()}`,
        question: values.question || "New FAQ",
        category: values.category || "General",
        order: Number(values.order) || faqs.length + 1,
        status: statusMap[actionType],
      };
      setFaqs((prev) => [newFaq, ...prev]);
    }
  };

  return (
    <RoleGuard allowedRoles={["HOSPITAL_DIRECTOR", "CONTENT_STAFF"]}>
      <div className="space-y-6">
        <DataTable
          title="Frequently Asked Questions (FAQs)"
          description="Manage patient, visitor, and insurance FAQs across website sections."
          data={faqs}
          columns={columns}
          searchPlaceholder="Search FAQs..."
          onAddNew={handleAddNew}
          addNewLabel="Add FAQ"
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <ContentFormModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingFaq ? `Edit FAQ` : "Create FAQ"}
          fields={FAQ_FORM_FIELDS}
          initialValues={editingFaq || {}}
          onSubmit={handleFormSubmit}
        />
      </div>
    </RoleGuard>
  );
}
