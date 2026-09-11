"use client";

import React, { useState } from "react";
import { DataTable, ColumnDef } from "@/components/admin/data-table";
import { ContentFormModal, FormFieldConfig } from "@/components/admin/content-form-modal";
import { RoleGuard } from "@/components/admin/role-guard";
import { ContentStatusType } from "@/lib/admin/types";
import { Newspaper, Calendar, Eye, User } from "lucide-react";

interface NewsRecord {
  id: string;
  title: string;
  category: string;
  author: string;
  publishedDate: string;
  views: number;
  status: ContentStatusType;
}

const INITIAL_NEWS: NewsRecord[] = [
  {
    id: "news-1",
    title: "Medhen Beza Hospital Expands 24/7 Pediatric Emergency Unit",
    category: "Hospital News",
    author: "Abel Girma",
    publishedDate: "2026-09-08",
    views: 1420,
    status: "PUBLISHED",
  },
  {
    id: "news-2",
    title: "New High-Field 3.0T MRI Technology Now Operational",
    category: "Technology",
    author: "Abel Girma",
    publishedDate: "2026-09-02",
    views: 980,
    status: "PUBLISHED",
  },
  {
    id: "news-3",
    title: "Understanding Cardiovascular Risk Factors: A Physician's Guide",
    category: "Health Tips",
    author: "Dr. Samuel Bekele",
    publishedDate: "2026-08-28",
    views: 2150,
    status: "PUBLISHED",
  },
  {
    id: "news-4",
    title: "World Heart Day: Free Cardiac Checkup Camp Announced",
    category: "Community",
    author: "Abel Girma",
    publishedDate: "2026-09-15",
    views: 0,
    status: "PENDING_APPROVAL",
  },
  {
    id: "news-5",
    title: "Annual Infection Prevention & Clinical Hygiene Guidelines 2026",
    category: "Clinical Updates",
    author: "Abel Girma",
    publishedDate: "—",
    views: 0,
    status: "DRAFT",
  },
];

const NEWS_FORM_FIELDS: FormFieldConfig[] = [
  {
    name: "title",
    label: "Article Title",
    type: "text",
    placeholder: "e.g. Free Diabetes and Hypertension Screening Week",
    required: true,
  },
  {
    name: "category",
    label: "Category",
    type: "select",
    options: [
      { label: "Hospital News", value: "Hospital News" },
      { label: "Technology & Equipment", value: "Technology" },
      { label: "Health & Wellness Tips", value: "Health Tips" },
      { label: "Community Outreach", value: "Community" },
      { label: "Clinical Updates", value: "Clinical Updates" },
    ],
    required: true,
  },
  {
    name: "author",
    label: "Author Name",
    type: "text",
    placeholder: "e.g. Abel Girma or Dr. Bethlehem Tadesse",
    required: true,
  },
  {
    name: "featuredImage",
    label: "Featured Header Image",
    type: "image",
  },
  {
    name: "summary",
    label: "Short Excerpt / Lead Paragraph",
    type: "textarea",
    placeholder: "Brief 2-sentence summary displayed on cards and search snippets...",
    required: true,
  },
  {
    name: "content",
    label: "Article Full Body Content",
    type: "richtext",
    placeholder: "Write full news article content here...",
  },
  {
    name: "tags",
    label: "Tags & Keywords",
    type: "tags",
  },
];

export default function NewsAdminPage() {
  const [news, setNews] = useState<NewsRecord[]>(INITIAL_NEWS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsRecord | null>(null);

  const columns: ColumnDef<NewsRecord>[] = [
    {
      key: "title",
      header: "Article Title",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary-light text-secondary-dark border border-secondary/20 shrink-0">
            <Newspaper className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-text">{item.title}</span>
            <span className="text-xs text-text-muted">By {item.author}</span>
          </div>
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
      key: "publishedDate",
      header: "Date",
      sortable: true,
      render: (item) => <span className="text-xs text-text-muted font-mono">{item.publishedDate}</span>,
    },
    {
      key: "views",
      header: "Views",
      sortable: true,
      render: (item) => (
        <span className="text-xs text-text font-medium flex items-center gap-1">
          <Eye className="h-3 w-3 text-text-light" />
          {item.views.toLocaleString()}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
    },
  ];

  const handleAddNew = () => {
    setEditingNews(null);
    setModalOpen(true);
  };

  const handleEdit = (item: NewsRecord) => {
    setEditingNews(item);
    setModalOpen(true);
  };

  const handleDelete = (item: NewsRecord) => {
    if (confirm(`Delete article: ${item.title}?`)) {
      setNews((prev) => prev.filter((n) => n.id !== item.id));
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

    if (editingNews) {
      setNews((prev) =>
        prev.map((n) =>
          n.id === editingNews.id
            ? { ...n, ...values, status: statusMap[actionType] || n.status }
            : n
        )
      );
    } else {
      const newArticle: NewsRecord = {
        id: `news-${Date.now()}`,
        title: values.title || "New Article",
        category: values.category || "Hospital News",
        author: values.author || "Content Staff",
        publishedDate: actionType === "publish" ? new Date().toISOString().split("T")[0] : "—",
        views: 0,
        status: statusMap[actionType],
      };
      setNews((prev) => [newArticle, ...prev]);
    }
  };

  return (
    <RoleGuard allowedRoles={["HOSPITAL_DIRECTOR", "CONTENT_STAFF"]}>
      <div className="space-y-6">
        <DataTable
          title="Hospital News & Blog Articles"
          description="Manage press releases, medical advice articles, health awareness guides, and hospital announcements."
          data={news}
          columns={columns}
          searchPlaceholder="Search news by title, category, author..."
          onAddNew={handleAddNew}
          addNewLabel="Write News Article"
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <ContentFormModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingNews ? `Edit Article: ${editingNews.title}` : "Create News Article"}
          description="Prepare article content. Editorial staff submissions require Hospital Director approval."
          fields={NEWS_FORM_FIELDS}
          initialValues={editingNews || {}}
          onSubmit={handleFormSubmit}
        />
      </div>
    </RoleGuard>
  );
}
