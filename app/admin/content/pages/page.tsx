"use client";

import React, { useState } from "react";
import { DataTable, ColumnDef } from "@/components/admin/data-table";
import { ContentFormModal, FormFieldConfig } from "@/components/admin/content-form-modal";
import { RoleGuard } from "@/components/admin/role-guard";
import { ContentStatusType } from "@/lib/admin/types";
import { FileText, Globe, ExternalLink } from "lucide-react";
import Link from "next/link";

interface PageRecord {
  id: string;
  title: string;
  slug: string;
  lastUpdated: string;
  status: ContentStatusType;
}

const INITIAL_PAGES: PageRecord[] = [
  {
    id: "pg-1",
    title: "About Us & Hospital History",
    slug: "/about",
    lastUpdated: "2026-09-01",
    status: "PUBLISHED",
  },
  {
    id: "pg-2",
    title: "Emergency Care & Critical Protocols",
    slug: "/emergency",
    lastUpdated: "2026-09-04",
    status: "PUBLISHED",
  },
  {
    id: "pg-3",
    title: "Contact, Map & Location Information",
    slug: "/contact",
    lastUpdated: "2026-08-20",
    status: "PUBLISHED",
  },
  {
    id: "pg-4",
    title: "Patient Rights & Clinical Quality Charter",
    slug: "/patient-rights",
    lastUpdated: "2026-09-10",
    status: "DRAFT",
  },
];

const PAGE_FORM_FIELDS: FormFieldConfig[] = [
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
    placeholder: "/quality-charter",
    required: true,
  },
  {
    name: "content",
    label: "Page Main Body (Rich HTML / Markdown)",
    type: "richtext",
    placeholder: "Enter full page content...",
    required: true,
  },
];

export default function StaticPagesAdminPage() {
  const [pages, setPages] = useState<PageRecord[]>(INITIAL_PAGES);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<PageRecord | null>(null);

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
          className="text-xs font-mono text-primary hover:underline inline-flex items-center gap-1"
        >
          {item.slug}
          <ExternalLink className="h-3 w-3" />
        </Link>
      ),
    },
    {
      key: "lastUpdated",
      header: "Last Modified",
      sortable: true,
      render: (item) => <span className="text-xs text-text-muted font-mono">{item.lastUpdated}</span>,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
    },
  ];

  const handleAddNew = () => {
    setEditingPage(null);
    setModalOpen(true);
  };

  const handleEdit = (item: PageRecord) => {
    setEditingPage(item);
    setModalOpen(true);
  };

  const handleDelete = (item: PageRecord) => {
    if (confirm(`Delete CMS page: ${item.title}?`)) {
      setPages((prev) => prev.filter((p) => p.id !== item.id));
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

    if (editingPage) {
      setPages((prev) =>
        prev.map((p) =>
          p.id === editingPage.id
            ? { ...p, ...values, status: statusMap[actionType] || p.status, lastUpdated: new Date().toISOString().split("T")[0] }
            : p
        )
      );
    } else {
      const newPage: PageRecord = {
        id: `pg-${Date.now()}`,
        title: values.title || "New Page",
        slug: values.slug || "/new-page",
        lastUpdated: new Date().toISOString().split("T")[0],
        status: statusMap[actionType],
      };
      setPages((prev) => [newPage, ...prev]);
    }
  };

  return (
    <RoleGuard allowedRoles={["HOSPITAL_DIRECTOR", "CONTENT_STAFF"]}>
      <div className="space-y-6">
        <DataTable
          title="Static CMS Pages"
          description="Manage main hospital informational pages, institutional leadership bios, and quality charters."
          data={pages}
          columns={columns}
          searchPlaceholder="Search pages..."
          onAddNew={handleAddNew}
          addNewLabel="Create Page"
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <ContentFormModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingPage ? `Edit Page: ${editingPage.title}` : "Create Static Page"}
          fields={PAGE_FORM_FIELDS}
          initialValues={editingPage || {}}
          onSubmit={handleFormSubmit}
        />
      </div>
    </RoleGuard>
  );
}
