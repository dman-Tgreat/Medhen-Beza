"use client";

import React, { useState, useEffect } from "react";
import { useAdminRole } from "./role-context";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Upload,
  Send,
  Save,
  Globe,
  Image as ImageIcon,
  X,
  Plus,
  Info,
} from "lucide-react";

export interface FormFieldConfig {
  name: string;
  label: string;
  type:
    | "text"
    | "number"
    | "textarea"
    | "richtext"
    | "select"
    | "checkbox"
    | "tags"
    | "image"
    | "date";
  placeholder?: string;
  options?: { label: string; value: string }[];
  required?: boolean;
  helperText?: string;
  section?: "general" | "content" | "media" | "seo";
  defaultValue?: any;
}

interface ContentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  fields: FormFieldConfig[];
  initialValues?: Record<string, any>;
  onSubmit: (values: Record<string, any>, actionType: "draft" | "submit" | "publish") => void;
  submitLabel?: string;
}

export function ContentFormModal({
  isOpen,
  onClose,
  title,
  description,
  fields,
  initialValues = {},
  onSubmit,
}: ContentFormModalProps) {
  const { canPublish } = useAdminRole();
  const [formData, setFormData] = useState<Record<string, any>>(initialValues);
  const [tagInputs, setTagInputs] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    if (isOpen) {
      setFormData(initialValues || {});
      setActiveTab("general");
    }
  }, [isOpen, initialValues]);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTag = (fieldName: string) => {
    const currentInput = (tagInputs[fieldName] || "").trim();
    if (!currentInput) return;

    const currentTags = (formData[fieldName] as string[]) || [];
    if (!currentTags.includes(currentInput)) {
      handleChange(fieldName, [...currentTags, currentInput]);
    }
    setTagInputs((prev) => ({ ...prev, [fieldName]: "" }));
  };

  const handleRemoveTag = (fieldName: string, tagToRemove: string) => {
    const currentTags = (formData[fieldName] as string[]) || [];
    handleChange(
      fieldName,
      currentTags.filter((t) => t !== tagToRemove)
    );
  };

  const handleSubmit = (actionType: "draft" | "submit" | "publish") => {
    onSubmit(formData, actionType);
    onClose();
  };

  // Group fields into tabs if applicable
  const hasContentSection = fields.some((f) => f.section === "content" || f.type === "richtext" || f.type === "textarea");
  const hasMediaSection = fields.some((f) => f.section === "media" || f.type === "image");
  const hasSeoSection = fields.some((f) => f.section === "seo");

  const generalFields = fields.filter((f) => !f.section || f.section === "general");
  const contentFields = fields.filter((f) => f.section === "content" || (!f.section && (f.type === "textarea" || f.type === "richtext")));
  const mediaFields = fields.filter((f) => f.section === "media" || (!f.section && f.type === "image"));
  const seoFields = fields.filter((f) => f.section === "seo");

  const renderField = (field: FormFieldConfig) => {
    const val = formData[field.name] ?? field.defaultValue ?? "";

    switch (field.type) {
      case "text":
      case "number":
      case "date":
        return (
          <div key={field.name} className="space-y-1.5">
            <label className="text-xs font-semibold text-text flex items-center justify-between">
              <span>
                {field.label} {field.required && <span className="text-emergency">*</span>}
              </span>
            </label>
            <Input
              type={field.type}
              value={val}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              className="text-xs h-9 bg-surface"
              required={field.required}
            />
            {field.helperText && <p className="text-[11px] text-text-light">{field.helperText}</p>}
          </div>
        );

      case "select":
        return (
          <div key={field.name} className="space-y-1.5">
            <label className="text-xs font-semibold text-text">
              {field.label} {field.required && <span className="text-emergency">*</span>}
            </label>
            <Select
              value={String(val || "")}
              onValueChange={(v) => handleChange(field.name, v)}
            >
              <SelectTrigger className="text-xs h-9 bg-surface">
                <SelectValue placeholder={field.placeholder || "Select option"} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {field.helperText && <p className="text-[11px] text-text-light">{field.helperText}</p>}
          </div>
        );

      case "textarea":
        return (
          <div key={field.name} className="space-y-1.5">
            <label className="text-xs font-semibold text-text">
              {field.label} {field.required && <span className="text-emergency">*</span>}
            </label>
            <textarea
              rows={4}
              value={val}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              className="w-full rounded-md border border-border bg-surface p-2.5 text-xs text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {field.helperText && <p className="text-[11px] text-text-light">{field.helperText}</p>}
          </div>
        );

      case "richtext":
        return (
          <div key={field.name} className="space-y-1.5">
            <label className="text-xs font-semibold text-text">
              {field.label} {field.required && <span className="text-emergency">*</span>}
            </label>
            <div className="rounded-md border border-border bg-surface overflow-hidden">
              <div className="flex items-center gap-1 bg-background p-1.5 border-b border-border text-xs text-text-muted">
                <button type="button" className="px-2 py-0.5 font-bold hover:bg-surface rounded">B</button>
                <button type="button" className="px-2 py-0.5 italic hover:bg-surface rounded">I</button>
                <button type="button" className="px-2 py-0.5 underline hover:bg-surface rounded">U</button>
                <span className="text-border mx-1">|</span>
                <button type="button" className="px-2 py-0.5 hover:bg-surface rounded">H2</button>
                <button type="button" className="px-2 py-0.5 hover:bg-surface rounded">List</button>
                <button type="button" className="px-2 py-0.5 hover:bg-surface rounded">Link</button>
              </div>
              <textarea
                rows={6}
                value={val}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={field.placeholder || "Enter rich formatted article content..."}
                className="w-full p-3 text-xs text-text focus:outline-none resize-y bg-surface"
              />
            </div>
            {field.helperText && <p className="text-[11px] text-text-light">{field.helperText}</p>}
          </div>
        );

      case "image":
        return (
          <div key={field.name} className="space-y-2">
            <label className="text-xs font-semibold text-text">
              {field.label} {field.required && <span className="text-emergency">*</span>}
            </label>
            <div className="flex flex-col sm:flex-row items-start gap-3">
              {val ? (
                <div className="relative h-24 w-32 rounded-lg border border-border overflow-hidden bg-background shrink-0">
                  <img src={val} alt="Preview" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleChange(field.name, "")}
                    className="absolute top-1 right-1 rounded-full bg-emergency text-white p-0.5 shadow-sm"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="h-24 w-32 rounded-lg border-2 border-dashed border-border bg-background flex flex-col items-center justify-center text-text-light shrink-0">
                  <ImageIcon className="h-6 w-6 mb-1 text-text-muted" />
                  <span className="text-[10px]">No image</span>
                </div>
              )}

              <div className="flex-1 w-full space-y-2">
                <Input
                  type="text"
                  value={val}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  placeholder="https://images.unsplash.com/... or paste image URL"
                  className="text-xs h-9 bg-surface"
                />
                <p className="text-[11px] text-text-light">
                  Paste asset URL or select from hospital media library.
                </p>
              </div>
            </div>
          </div>
        );

      case "tags":
        const tags = (formData[field.name] as string[]) || [];
        return (
          <div key={field.name} className="space-y-2">
            <label className="text-xs font-semibold text-text">
              {field.label} {field.required && <span className="text-emergency">*</span>}
            </label>
            <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 bg-background rounded-md border border-border">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-pill bg-primary-light px-2.5 py-0.5 text-xs font-medium text-primary-dark border border-primary/20"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(field.name, tag)}
                    className="hover:text-emergency"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {tags.length === 0 && (
                <span className="text-xs text-text-light italic">No items added yet</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="text"
                value={tagInputs[field.name] || ""}
                onChange={(e) =>
                  setTagInputs((prev) => ({ ...prev, [field.name]: e.target.value }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag(field.name);
                  }
                }}
                placeholder="Type and press add (e.g. Cardiology, Amharic, English)"
                className="text-xs h-8 bg-surface"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddTag(field.name)}
                className="h-8 text-xs shrink-0"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden bg-surface">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-border bg-background">
          <DialogTitle className="text-lg font-bold text-text">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-xs text-text-muted mt-1">
              {description}
            </DialogDescription>
          )}
        </div>

        {/* Form Body with optional Tabs */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="space-y-4">
            {fields.map((f) => renderField(f))}
          </div>
        </div>

        {/* Footer with Workflow Action Buttons */}
        <div className="p-4 border-t border-border bg-background flex flex-col sm:flex-row items-center justify-between gap-3">
          <Button variant="ghost" size="sm" onClick={onClose} className="text-xs text-text-muted">
            Cancel
          </Button>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleSubmit("draft")}
              className="text-xs bg-surface"
            >
              <Save className="h-3.5 w-3.5 mr-1.5" />
              Save as Draft
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => handleSubmit("submit")}
              className="text-xs"
            >
              <Send className="h-3.5 w-3.5 mr-1.5" />
              Submit for Approval
            </Button>

            {canPublish && (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => handleSubmit("publish")}
                className="text-xs shadow-cta"
              >
                <Globe className="h-3.5 w-3.5 mr-1.5" />
                Save & Publish
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
