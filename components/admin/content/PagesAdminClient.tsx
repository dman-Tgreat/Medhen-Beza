"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable, ColumnDef } from "@/components/admin/data-table";
import { ContentFormModal, FormFieldConfig } from "@/components/admin/content-form-modal";
import { RoleGuard } from "@/components/admin/role-guard";
import { ContentStatusType } from "@/lib/admin/types";
import { savePageAction, deletePageAction, updatePageStatusAction } from "@/lib/actions/content";
import { FileText, ExternalLink } from "lucide-react";
import Link from "next/link";

interface PageRecord {
  id: string;
  title: string;
  slug: string;
  content: string;
  seoTitle?: string;
  seoDescription?: string;
  lastUpdated: string;
  status: ContentStatusType;
}

interface PagesAdminClientProps {
  initialPages: any[];
}

export function PagesAdminClient({ initialPages }: PagesAdminClientProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<PageRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const formattedPages: PageRecord[] = initialPages.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug.startsWith("/") ? p.slug : `/${p.slug}`,
    content: p.content || "",
    seoTitle: p.seoTitle || "",
    seoDescription: p.seoDescription || "",
    lastUpdated: p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : "—",
    status: p.status as ContentStatusType,
  }));

  const formFields: FormFieldConfig[] = [
    {
      name: "title",
      label: "Page Title",
      type: "text",
      placeholder: "e.g. Quality and Patient Safety Charter",
      required: true,
    },
    {
      name: "slug",
      label: "URL Slug / Route Path",
      type: "text",
      placeholder: "quality-charter",
      required: true,
    },
    {
      name: "content",
      label: "Page Content Body (HTML / Markdown)",
      type: "textarea",
      placeholder: "Enter full page content...",
      required: true,
    },
    {
      name: "seoTitle",
      label: "SEO Meta Title",
      type: "text",
      placeholder: "Optional search engine title",
    },
    {
      name: "seoDescription",
      label: "SEO Meta Description",
      type: "textarea",
      placeholder: "Optional search engine description",
    },
  ];

  const columns: ColumnDef<PageRecord>[] = [
    {
      key: "title",
      header: "Page Name",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary-light text-secondary-dark border border-secondary/20 shrink-0">
            <FileText className="h-4 w-4" />
          </div>
          <span className="font-semibold text-text">{item.title}</span>
        </div>
      ),
    },
    {
      key: "slug",
      header: "URL Path",
      sortable: true,
      render: (item) => (
        <Link
          href={item.slug}
          target="_blank"
          className="inline-flex items-center gap-1 font-mono text-xs text-primary hover:underline"
        >
          {item.slug}
          <ExternalLink className="h-3 w-3" />
        </Link>
      ),
    },
    {
      key: "lastUpdated",
      header: "Last Updated",
      sortable: true,
      render: (item) => <span className="text-xs text-text-muted">{item.lastUpdated}</span>,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
    },
  ];

  const handleAddNew = () => {
    setEditingPage(null);
    setErrorMessage(null);
    setModalOpen(true);
  };

  const handleEdit = (item: PageRecord) => {
    setEditingPage(item);
    setErrorMessage(null);
    setModalOpen(true);
  };

  const handleDelete = async (item: PageRecord) => {
    if (confirm(`Are you sure you want to delete page "${item.title}"?`)) {
      const res = await deletePageAction(item.id);
      if (res.error) alert(res.error);
      else router.refresh();
    }
  };

  const handleSubmitForApproval = async (item: PageRecord) => {
    const res = await updatePageStatusAction(item.id, "PENDING_APPROVAL" as any);
    if (res.error) alert(res.error);
    else router.refresh();
  };

  const handleApprove = async (item: PageRecord) => {
    const res = await updatePageStatusAction(item.id, "APPROVED" as any);
    if (res.error) alert(res.error);
    else router.refresh();
  };

  const handlePublish = async (item: PageRecord) => {
    const res = await updatePageStatusAction(item.id, "PUBLISHED" as any);
    if (res.error) alert(res.error);
    else router.refresh();
  };

  const handleFormSubmit = async (
    values: Record<string, any>,
    actionType: "draft" | "submit" | "publish"
  ) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const res = await savePageAction(
      {
        id: editingPage?.id,
        title: values.title,
        slug: values.slug,
        content: values.content,
        excerpt: values.excerpt,
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
          title="CMS Static Pages & Policy Documents"
          description="Manage standalone informational pages, patient charter, clinical disclaimers, and terms."
          data={formattedPages}
          columns={columns}
          searchPlaceholder="Search pages by title, URL slug..."
          onAddNew={handleAddNew}
          addNewLabel="Create Page"
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSubmitForApproval={handleSubmitForApproval}
          onApprove={handleApprove}
          onPublish={handlePublish}
        />

        <ContentFormModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingPage ? `Edit Page: ${editingPage.title}` : "Create CMS Page"}
          description="Content team drafts require Hospital Director approval before publishing."
          fields={formFields}
          initialValues={editingPage || {}}
          onSubmit={handleFormSubmit}
          isLoading={isSubmitting}
        />
      </div>
    </RoleGuard>
  );
}
