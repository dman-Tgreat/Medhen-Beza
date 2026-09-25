"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable, ColumnDef } from "@/components/admin/data-table";
import { ContentFormModal, FormFieldConfig } from "@/components/admin/content-form-modal";
import { RoleGuard } from "@/components/admin/role-guard";
import { ContentStatusType } from "@/lib/admin/types";
import { saveNewsAction, deleteNewsAction, updateNewsStatusAction } from "@/lib/actions/content";
import { Newspaper } from "lucide-react";

interface NewsRecord {
  id: string;
  title: string;
  category: string;
  author: string;
  publishedDate: string;
  status: ContentStatusType;
  coverImage?: string;
  excerpt?: string;
  content?: string;
  readTime?: string;
  tags?: string[];
  translations?: any;
}

interface NewsAdminClientProps {
  initialNews: any[];
}

export function NewsAdminClient({ initialNews }: NewsAdminClientProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const existingCategories = Array.from(
    new Set(
      initialNews
        .map((item) => item.category?.name)
        .filter((cat): cat is string => Boolean(cat && cat.trim()))
    )
  );
  const defaultCategoryOptions = [
    "Hospital News",
    "Clinical Updates",
    "Health & Wellness",
    "Technology & Equipment",
    "Community Outreach",
  ];
  const combinedCategoryOptions = Array.from(
    new Set([...existingCategories, ...defaultCategoryOptions])
  );

  const formattedNews: NewsRecord[] = initialNews.map((item) => ({
    id: item.id,
    title: item.title,
    category: item.category?.name || "Hospital News",
    author: item.authorName || item.createdBy?.name || "Medhen Beza Team",
    publishedDate: item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : "—",
    status: item.status as ContentStatusType,
    coverImage: item.coverImage || item.featuredImage || undefined,
    excerpt: item.excerpt || item.summary || "",
    content: item.content || "",
    readTime: item.readTime || "",
    tags: Array.isArray(item.tags) ? item.tags : [],
    translations: item.translations,
  }));

  const formFields: FormFieldConfig[] = [
    {
      name: "title",
      label: "Article Title",
      type: "text",
      placeholder: "e.g. Free Diabetes and Hypertension Screening Week",
      required: true,
    },
    {
      name: "categoryName",
      label: "Category / Topic",
      type: "text",
      placeholder: "e.g. Hospital News, Technology, Health Tips...",
      helperText: "Type any category or pick a suggestion below. New categories will be created automatically.",
      options: combinedCategoryOptions.map((c) => ({ label: c, value: c })),
      required: true,
    },
    {
      name: "authorName",
      label: "Author Name / Attribution",
      type: "text",
      placeholder: "e.g. Abel Girma or Dr. Bethlehem Tadesse",
      required: true,
    },
    {
      name: "readTime",
      label: "Estimated Read Time (optional)",
      type: "text",
      placeholder: "e.g. 3 min read (calculated automatically if blank)",
      helperText: "Leave blank to automatically calculate based on article length, or type a custom read time.",
    },
    {
      name: "tags",
      label: "Article Hashtags & Topics",
      type: "tags",
      placeholder: "Type a tag (e.g. Cardiology, Screening) and press Enter or Add",
      helperText: "Displayed as hashtags (#tag) at the bottom of the article.",
    },
    {
      name: "coverImage",
      label: "Cover / Header Image",
      type: "image",
      folder: "news",
      aspectRatio: 16 / 9,
      aspectLabel: "16:9 landscape",
      helperText: "Use a landscape image for the featured news card and article header.",
    },
    {
      name: "excerpt",
      label: "Short Excerpt / Summary",
      type: "textarea",
      placeholder: "A brief summary for previews and search engine snippets...",
    },
    {
      name: "content",
      label: "Full Article Body",
      type: "textarea",
      placeholder: "Write the full article story, paragraphs, and announcements...",
      required: true,
    },
  ];

  const columns: ColumnDef<NewsRecord>[] = [
    {
      key: "title",
      header: "Article Title",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary-light flex items-center justify-center text-primary shrink-0">
            <Newspaper className="h-5 w-5" />
          </div>
          <div className="flex flex-col max-w-md">
            <span className="font-semibold text-text truncate">{item.title}</span>
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
      header: "Published",
      sortable: true,
      render: (item) => <span className="text-xs text-text-muted">{item.publishedDate}</span>,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
    },
  ];

  const handleAddNew = () => {
    setEditingNews(null);
    setErrorMessage(null);
    setModalOpen(true);
  };

  const handleEdit = (item: NewsRecord) => {
    setEditingNews(item);
    setErrorMessage(null);
    setModalOpen(true);
  };

  const handleDelete = async (item: NewsRecord) => {
    if (confirm(`Are you sure you want to delete "${item.title}"?`)) {
      const res = await deleteNewsAction(item.id);
      if (res.error) alert(res.error);
      else router.refresh();
    }
  };

  const handleSubmitForApproval = async (item: NewsRecord) => {
    const res = await updateNewsStatusAction(item.id, "PENDING_APPROVAL" as any);
    if (res.error) alert(res.error);
    else router.refresh();
  };

  const handleApprove = async (item: NewsRecord) => {
    const res = await updateNewsStatusAction(item.id, "APPROVED" as any);
    if (res.error) alert(res.error);
    else router.refresh();
  };

  const handlePublish = async (item: NewsRecord) => {
    const res = await updateNewsStatusAction(item.id, "PUBLISHED" as any);
    if (res.error) alert(res.error);
    else router.refresh();
  };

  const handleFormSubmit = async (
    values: Record<string, any>,
    actionType: "draft" | "submit" | "publish"
  ) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const res = await saveNewsAction(
      {
        id: editingNews?.id,
        title: values.title,
        summary: values.summary || values.excerpt || "",
        content: values.content,
        featuredImage: values.featuredImage || values.coverImage,
        authorName: values.authorName,
        readTime: values.readTime,
        tags: values.tags,
        categoryName: values.categoryName,
        categoryId: values.categoryId,
        isFeatured: values.isFeatured === "true" || values.isFeatured === true,
        translations: values.translations,
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
          title="Hospital News & Health Articles"
          description="Manage press releases, medical updates, patient health tips, and community notices."
          data={formattedNews}
          columns={columns}
          searchPlaceholder="Search news by headline, category, author..."
          onAddNew={handleAddNew}
          addNewLabel="Write Article"
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSubmitForApproval={handleSubmitForApproval}
          onApprove={handleApprove}
          onPublish={handlePublish}
        />

        <ContentFormModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingNews ? `Edit Article: ${editingNews.title}` : "Create News Article"}
          description="Content team drafts require Hospital Director approval before publishing."
          fields={formFields}
          initialValues={
            editingNews
              ? {
                  ...editingNews,
                  authorName: editingNews.author,
                  categoryName: editingNews.category,
                  readTime: editingNews.readTime,
                  tags: editingNews.tags || [],
                }
              : { categoryName: "Hospital News", tags: [] }
          }
          onSubmit={handleFormSubmit}
          isLoading={isSubmitting}
        />
      </div>
    </RoleGuard>
  );
}
