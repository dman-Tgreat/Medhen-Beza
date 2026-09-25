"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable, ColumnDef, DataTableAction } from "@/components/admin/data-table";
import { RoleGuard } from "@/components/admin/role-guard";
import { ContentStatusType } from "@/lib/admin/types";
import { savePageAction, deletePageAction, updatePageStatusAction } from "@/lib/actions/content";
import { AboutPageVisualEditorModal } from "./AboutPageVisualEditorModal";
import { StandardPageEditorModal } from "./StandardPageEditorModal";
import {
  FileText,
  ExternalLink,
  Sparkles,
  Users,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PageRecord {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  seoTitle?: string;
  seoDescription?: string;
  lastUpdated: string;
  status: ContentStatusType;
  translations?: any;
}

interface PagesAdminClientProps {
  initialPages: any[];
}

export function PagesAdminClient({ initialPages }: PagesAdminClientProps) {
  const router = useRouter();
  const [standardModalOpen, setStandardModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<PageRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const formattedPages: PageRecord[] = initialPages.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug.startsWith("/") ? p.slug : `/${p.slug}`,
    content: p.content || "",
    excerpt: p.excerpt || "",
    seoTitle: p.metaTitle || p.seoTitle || "",
    seoDescription: p.metaDescription || p.seoDescription || "",
    lastUpdated: p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : "—",
    status: p.status as ContentStatusType,
    translations: p.translations,
  }));

  const aboutPageRecord = formattedPages.find(
    (p) => p.slug === "/about" || p.slug === "about"
  );

  const columns: ColumnDef<PageRecord>[] = [
    {
      key: "title",
      header: "Page Name",
      sortable: true,
      render: (item) => {
        const isAbout = item.slug === "/about" || item.slug === "about";
        return (
          <div className="flex items-center gap-3">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg shrink-0 border ${
                isAbout
                  ? "bg-primary-light text-primary border-primary/30"
                  : "bg-secondary-light text-secondary-dark border-secondary/20"
              }`}
            >
              {isAbout ? <Sparkles className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-text">{item.title}</span>
                {isAbout && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    <Sparkles className="h-2.5 w-2.5" />
                    Visual Builder
                  </span>
                )}
              </div>
              {item.excerpt && (
                <span className="text-xs text-text-muted line-clamp-1 max-w-md">
                  {item.excerpt}
                </span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: "slug",
      header: "Public URL",
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

  const extraActions: DataTableAction<PageRecord>[] = [
    {
      label: "Visual Page Builder",
      icon: Sparkles,
      onClick: (item) => {
        setEditingPage(item);
        setErrorMessage(null);
        setAboutModalOpen(true);
      },
      show: (item) => item.slug === "/about" || item.slug === "about",
    },
  ];

  const handleAddNew = () => {
    setEditingPage(null);
    setErrorMessage(null);
    setStandardModalOpen(true);
  };

  const handleEdit = (item: PageRecord) => {
    setEditingPage(item);
    setErrorMessage(null);
    if (item.slug === "/about" || item.slug === "about") {
      setAboutModalOpen(true);
    } else {
      setStandardModalOpen(true);
    }
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

  const handleSavePage = async (
    data: {
      id?: string;
      title: string;
      slug: string;
      content: string;
      excerpt?: string;
      seoTitle?: string;
      seoDescription?: string;
      translations?: any;
    },
    actionType: "draft" | "submit" | "publish"
  ) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const res = await savePageAction(
      {
        id: data.id || editingPage?.id,
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt,
        metaTitle: data.seoTitle,
        metaDescription: data.seoDescription,
        translations: data.translations ?? editingPage?.translations,
      },
      actionType
    );

    setIsSubmitting(false);

    if (res.error) {
      setErrorMessage(res.error);
      alert(res.error);
    } else {
      setAboutModalOpen(false);
      setStandardModalOpen(false);
      setEditingPage(null);
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

        {/* Featured Visual Editor Spotlight Card */}
        <div className="rounded-xl border border-primary/20 bg-gradient-to-r from-primary-light/40 via-surface to-secondary-light/30 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white text-xs">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Visual Page Builder Available
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-text">
              About Us Page & Leadership Management
            </h3>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              Easily update hospital story paragraphs, upload campus photos, add or reorder executive leadership team members (with doctor portrait photos), edit core principles, and showcase hospital facilities without writing any code.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
            <Button
              type="button"
              onClick={() => {
                setEditingPage(aboutPageRecord || null);
                setAboutModalOpen(true);
              }}
              className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary-dark text-white font-semibold text-xs h-10 px-5 shadow-xs"
            >
              <Sparkles className="h-4 w-4" />
              Launch About Page Visual Editor
            </Button>
            {aboutPageRecord && (
              <Button
                type="button"
                variant="outline"
                asChild
                className="h-10 text-xs gap-1.5 border-border bg-surface"
              >
                <Link href="/about" target="_blank">
                  View Live
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* CMS Pages Table */}
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
          extraActions={extraActions}
        />

        {/* Specialized About Page Visual Editor */}
        <AboutPageVisualEditorModal
          isOpen={aboutModalOpen}
          onClose={() => {
            setAboutModalOpen(false);
            setEditingPage(null);
          }}
          initialPage={editingPage || aboutPageRecord}
          onSubmit={handleSavePage}
          isLoading={isSubmitting}
        />

        {/* Standard Page Document Editor */}
        <StandardPageEditorModal
          isOpen={standardModalOpen}
          onClose={() => {
            setStandardModalOpen(false);
            setEditingPage(null);
          }}
          initialPage={editingPage}
          onSubmit={handleSavePage}
          isLoading={isSubmitting}
        />
      </div>
    </RoleGuard>
  );
}
