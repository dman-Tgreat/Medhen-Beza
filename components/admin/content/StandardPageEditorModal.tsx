"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Save,
  Send,
  Globe,
  FileText,
  Eye,
  Edit3,
  ExternalLink,
  Heading1,
  Heading2,
  List,
  Bold,
} from "lucide-react";
import { useAdminRole } from "@/components/admin/role-context";

interface StandardPageEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPage?: any;
  onSubmit: (
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
  ) => void;
  isLoading?: boolean;
}

export function StandardPageEditorModal({
  isOpen,
  onClose,
  initialPage,
  onSubmit,
  isLoading = false,
}: StandardPageEditorModalProps) {
  const { canPublish } = useAdminRole();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
  const [activeTab, setActiveTab] = useState("content");

  useEffect(() => {
    if (!isOpen) return;

    if (initialPage) {
      setTitle(initialPage.title || "");
      setSlug(initialPage.slug ? initialPage.slug.replace(/^\/+/, "") : "");
      setExcerpt(initialPage.excerpt || "");
      setContent(initialPage.content || "");
      setSeoTitle(initialPage.seoTitle || "");
      setSeoDescription(initialPage.seoDescription || "");
    } else {
      setTitle("");
      setSlug("");
      setExcerpt("");
      setContent("");
      setSeoTitle("");
      setSeoDescription("");
    }
    setViewMode("edit");
    setActiveTab("content");
  }, [isOpen, initialPage]);

  // Auto-generate slug when creating a new page if user hasn't typed custom slug
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!initialPage && (!slug || slug === title.toLowerCase().replace(/[^a-z0-9]+/g, "-"))) {
      setSlug(
        newTitle
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
      );
    }
  };

  const handleInsertHelper = (snippet: string) => {
    setContent((prev) => prev + (prev.endsWith("\n") ? "" : "\n") + snippet);
  };

  const handleSubmit = (actionType: "draft" | "submit" | "publish") => {
    if (!title.trim()) {
      alert("Page Title is required.");
      return;
    }
    const cleanSlug = slug.replace(/^\/+/, "").trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    onSubmit(
      {
        id: initialPage?.id,
        title: title.trim(),
        slug: cleanSlug,
        content: content.trim(),
        excerpt: excerpt.trim(),
        seoTitle: seoTitle.trim(),
        seoDescription: seoDescription.trim(),
        translations: initialPage?.translations,
      },
      actionType
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl sm:max-w-4xl w-[95vw] h-[90vh] max-h-[850px] flex flex-col p-0 gap-0 overflow-hidden bg-background">
        {/* Header */}
        <DialogHeader className="p-5 sm:p-6 border-b border-border bg-surface shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary-light text-secondary border border-secondary/20 shrink-0">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-text">
                {initialPage ? `Edit Page: ${initialPage.title}` : "Create Standard Static Page"}
              </DialogTitle>
              <DialogDescription className="text-xs text-text-muted mt-0.5">
                Manage policy documents, clinical charters, legal disclaimers, or institutional information.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-5">
            <div className="border-b border-border pb-1">
              <TabsList className="bg-surface p-1 h-auto flex gap-1 border border-border/60">
                <TabsTrigger value="content" className="text-xs py-1.5 px-3">
                  Document Content
                </TabsTrigger>
                <TabsTrigger value="seo" className="text-xs py-1.5 px-3">
                  SEO & URL Route
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-4 m-0">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-8 space-y-1.5">
                  <label className="text-xs font-semibold text-text">
                    Page Title <span className="text-emergency">*</span>
                  </label>
                  <Input
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Patient Safety Charter or Privacy Policy"
                    className="bg-surface text-sm"
                    required
                  />
                </div>

                <div className="sm:col-span-4 space-y-1.5">
                  <label className="text-xs font-semibold text-text">
                    URL Slug <span className="text-emergency">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-text-muted">
                      /
                    </span>
                    <Input
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.replace(/^\/+/, ""))}
                      placeholder="patient-safety"
                      className="bg-surface text-xs font-mono pl-6"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text">
                  Short Excerpt / Summary Statement
                </label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={2}
                  placeholder="Brief 1-2 sentence description shown in page headers and summaries..."
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
                />
              </div>

              {/* Main Content Box with formatting toolbar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-text">
                    Page Body Content <span className="text-emergency">*</span>
                  </label>
                  <div className="flex items-center gap-1.5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleInsertHelper("## Section Heading\n\n")}
                      className="h-7 text-xs px-2 gap-1 text-text-muted hover:text-text"
                      title="Add Section Heading"
                    >
                      <Heading2 className="h-3.5 w-3.5" />
                      Heading
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleInsertHelper("- Point 1\n- Point 2\n- Point 3\n\n")}
                      className="h-7 text-xs px-2 gap-1 text-text-muted hover:text-text"
                      title="Add Bulleted List"
                    >
                      <List className="h-3.5 w-3.5" />
                      Bullets
                    </Button>
                    <div className="h-4 w-[1px] bg-border mx-1" />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setViewMode(viewMode === "edit" ? "preview" : "edit")}
                      className="h-7 text-xs px-2.5 gap-1.5 border-border"
                    >
                      {viewMode === "edit" ? (
                        <>
                          <Eye className="h-3.5 w-3.5 text-primary" />
                          Preview
                        </>
                      ) : (
                        <>
                          <Edit3 className="h-3.5 w-3.5 text-text-muted" />
                          Edit
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {viewMode === "edit" ? (
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={12}
                    placeholder="Enter document text, clinical policy, or patient instructions. Paragraphs separated by blank lines format cleanly..."
                    className="w-full rounded-lg border border-border bg-surface p-4 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary leading-relaxed font-sans"
                    required
                  />
                ) : (
                  <div className="min-h-[260px] p-6 rounded-lg border border-border bg-background prose prose-slate max-w-none text-sm leading-relaxed">
                    {content ? (
                      content.split("\n\n").map((para, idx) => {
                        if (para.startsWith("## ")) {
                          return (
                            <h2 key={idx} className="text-lg font-bold text-text mt-4 mb-2">
                              {para.replace("## ", "")}
                            </h2>
                          );
                        }
                        if (para.startsWith("# ")) {
                          return (
                            <h1 key={idx} className="text-xl font-bold text-text mt-4 mb-2">
                              {para.replace("# ", "")}
                            </h1>
                          );
                        }
                        if (para.startsWith("- ") || para.startsWith("* ")) {
                          const items = para.split("\n").filter(Boolean);
                          return (
                            <ul key={idx} className="list-disc pl-5 space-y-1 my-2 text-text-muted">
                              {items.map((item, i) => (
                                <li key={i}>{item.replace(/^[-*]\s*/, "")}</li>
                              ))}
                            </ul>
                          );
                        }
                        return (
                          <p key={idx} className="text-text-muted my-2">
                            {para}
                          </p>
                        );
                      })
                    ) : (
                      <p className="text-text-muted italic">No content written yet.</p>
                    )}
                  </div>
                )}
                <p className="text-[11px] text-text-muted">
                  Tip: Use double enter (blank lines) between paragraphs. Markdown style headings (##) and bullet points (-) are rendered automatically.
                </p>
              </div>
            </TabsContent>

            {/* SEO Tab */}
            <TabsContent value="seo" className="space-y-4 m-0">
              <div className="space-y-4 max-w-xl">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text">SEO Meta Title</label>
                  <Input
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder="e.g. Privacy Policy & Patient Confidentiality | Medhen Beza Hospital"
                    className="bg-surface text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text">SEO Meta Description</label>
                  <textarea
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    rows={4}
                    placeholder="Search engine summary text..."
                    className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
                  />
                </div>

                <div className="p-3 rounded-lg border border-border bg-surface text-xs text-text-muted flex items-center justify-between">
                  <span>Public Route Preview:</span>
                  <span className="font-mono text-primary font-medium">/{slug || "page-path"}</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Modal Footer */}
        <DialogFooter className="p-4 sm:p-5 border-t border-border bg-surface shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-text-muted">
            Status: <span className="font-semibold text-text">{initialPage?.status || "NEW DRAFT"}</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleSubmit("draft")}
              disabled={isLoading}
              className="text-xs gap-1.5 border-border"
            >
              <Save className="h-3.5 w-3.5 text-text-muted" />
              Save Draft
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleSubmit("submit")}
              disabled={isLoading}
              className="text-xs gap-1.5 border-primary/40 text-primary hover:bg-primary-light"
            >
              <Send className="h-3.5 w-3.5" />
              Submit for Approval
            </Button>
            {canPublish && (
              <Button
                type="button"
                size="sm"
                onClick={() => handleSubmit("publish")}
                disabled={isLoading}
                className="text-xs gap-1.5 bg-primary hover:bg-primary-dark text-white shadow-xs"
              >
                <Globe className="h-3.5 w-3.5" />
                Publish Live
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
