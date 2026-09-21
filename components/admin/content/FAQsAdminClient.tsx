"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable, ColumnDef } from "@/components/admin/data-table";
import { ContentFormModal, FormFieldConfig } from "@/components/admin/content-form-modal";
import { RoleGuard } from "@/components/admin/role-guard";
import { ContentStatusType } from "@/lib/admin/types";
import { saveFAQAction, deleteFAQAction, updateFAQStatusAction } from "@/lib/actions/content";
import { HelpCircle } from "lucide-react";

interface FAQRecord {
  id: string;
  question: string;
  category: string;
  order: number;
  answer: string;
  status: ContentStatusType;
}

interface FAQsAdminClientProps {
  initialFAQs: any[];
}

export function FAQsAdminClient({ initialFAQs }: FAQsAdminClientProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const formattedFAQs: FAQRecord[] = initialFAQs.map((f) => ({
    id: f.id,
    question: f.question,
    category: f.category || "General Inquiries",
    order: f.order || 1,
    answer: f.answer || "",
    status: f.status as ContentStatusType,
  }));

  const formFields: FormFieldConfig[] = [
    {
      name: "question",
      label: "Frequently Asked Question",
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
        { label: "Appointments & Registration", value: "Appointments & Registration" },
        { label: "Billing & Insurance", value: "Billing & Insurance" },
        { label: "Visitor Guidelines", value: "Visitor Guidelines" },
        { label: "General Inquiries", value: "General Inquiries" },
      ],
      required: true,
    },
    {
      name: "answer",
      label: "Detailed Answer",
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
      render: (item) => <span className="font-mono text-xs">{item.order}</span>,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
    },
  ];

  const handleAddNew = () => {
    setEditingFaq(null);
    setErrorMessage(null);
    setModalOpen(true);
  };

  const handleEdit = (item: FAQRecord) => {
    setEditingFaq(item);
    setErrorMessage(null);
    setModalOpen(true);
  };

  const handleDelete = async (item: FAQRecord) => {
    if (confirm(`Are you sure you want to delete FAQ "${item.question}"?`)) {
      const res = await deleteFAQAction(item.id);
      if (res.error) alert(res.error);
      else router.refresh();
    }
  };

  const handleSubmitForApproval = async (item: FAQRecord) => {
    const res = await updateFAQStatusAction(item.id, "PENDING_APPROVAL" as any);
    if (res.error) alert(res.error);
    else router.refresh();
  };

  const handleApprove = async (item: FAQRecord) => {
    const res = await updateFAQStatusAction(item.id, "APPROVED" as any);
    if (res.error) alert(res.error);
    else router.refresh();
  };

  const handlePublish = async (item: FAQRecord) => {
    const res = await updateFAQStatusAction(item.id, "PUBLISHED" as any);
    if (res.error) alert(res.error);
    else router.refresh();
  };

  const handleFormSubmit = async (
    values: Record<string, any>,
    actionType: "draft" | "submit" | "publish"
  ) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const res = await saveFAQAction(
      {
        id: editingFaq?.id,
        question: values.question,
        category: values.category,
        answer: values.answer,
        order: Number(values.order) || 1,
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
    <RoleGuard allowedRoles={["HOSPITAL_DIRECTOR", "CONTENT_STAFF"]}>
      <div className="space-y-6">
        {errorMessage && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {errorMessage}
          </div>
        )}

        <DataTable
          title="Patient FAQs & Help Center"
          description="Manage answers to frequent patient, visitor, insurance, and emergency questions."
          data={formattedFAQs}
          columns={columns}
          searchPlaceholder="Search FAQs by question, category..."
          onAddNew={handleAddNew}
          addNewLabel="Add FAQ"
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSubmitForApproval={handleSubmitForApproval}
          onApprove={handleApprove}
          onPublish={handlePublish}
        />

        <ContentFormModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingFaq ? `Edit FAQ: ${editingFaq.question}` : "Create New FAQ"}
          description="Content team drafts require Hospital Director approval before public display."
          fields={formFields}
          initialValues={editingFaq || { category: "General Inquiries", order: 1 }}
          onSubmit={handleFormSubmit}
          isLoading={isSubmitting}
        />
      </div>
    </RoleGuard>
  );
}
