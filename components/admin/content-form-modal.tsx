"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Send,
  Save,
  Globe,
  X,
  Plus,
} from "lucide-react";
import { MediaUploadField } from "./media-upload-field";

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
    | "date"
    | "email";
  placeholder?: string;
  options?: { label: string; value: string }[];
  required?: boolean;
  helperText?: string;
  section?: "general" | "content" | "media" | "seo";
  defaultValue?: any;
  mediaKind?: "image" | "video" | ((values: Record<string, any>) => "image" | "video");
  folder?: string;
  aspectRatio?: number;
  aspectLabel?: string;
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
  isLoading?: boolean;
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

  const prevIsOpenRef = useRef(false);
  const prevIdRef = useRef<any>(undefined);

  useEffect(() => {
    if (isOpen) {
      const currentId = initialValues?.id;
      // Only re-initialize form data if:
      // 1. The modal just opened from closed state, OR
      // 2. The record being edited actually changed (different id)
      if (!prevIsOpenRef.current || (currentId !== undefined && currentId !== prevIdRef.current)) {
        setFormData(initialValues || {});
        setActiveTab("general");
        prevIdRef.current = currentId;
      }
    } else {
      prevIdRef.current = undefined;
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, initialValues?.id]);

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
              list={field.options && field.options.length > 0 ? `${field.name}-suggestions` : undefined}
              value={val}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              className="text-base sm:text-xs min-h-[44px] sm:min-h-[36px] sm:h-9 bg-surface"
              required={field.required}
            />
            {field.options && field.options.length > 0 && (
              <>
                <datalist id={`${field.name}-suggestions`}>
                  {field.options.map((opt) => (
                    <option key={opt.value} value={opt.label || opt.value} />
                  ))}
                </datalist>
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-text-light">Suggested:</span>
                  {field.options.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleChange(field.name, opt.label || opt.value)}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-background hover:bg-primary-light hover:text-primary border border-border transition-colors text-text-muted cursor-pointer"
                    >
                      {opt.label || opt.value}
                    </button>
                  ))}
                </div>
              </>
            )}
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
              <SelectTrigger className="text-base sm:text-xs min-h-[44px] sm:min-h-[36px] sm:h-9 bg-surface">
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

      case "checkbox":
        return (
          <label key={field.name} className="flex items-start gap-2.5 rounded-md border border-border bg-background p-3 cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(val)}
              onChange={(e) => handleChange(field.name, e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <span className="space-y-0.5">
              <span className="block text-xs font-semibold text-text">{field.label}</span>
              {field.helperText && <span className="block text-[11px] text-text-light">{field.helperText}</span>}
            </span>
          </label>
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
              className="w-full rounded-md border border-border bg-surface p-2.5 text-base sm:text-xs text-text focus:outline-none focus:ring-2 focus:ring-primary"
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
            <MediaUploadField
              value={val}
              onChange={(value) => handleChange(field.name, value)}
              kind={typeof field.mediaKind === "function" ? field.mediaKind(formData) : field.mediaKind || "image"}
              folder={field.folder || "content"}
              helperText={field.helperText}
              aspectRatio={field.aspectRatio}
              aspectLabel={field.aspectLabel}
            />
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
                    <X className="h-4.5 w-4.5" />
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
                className="text-base sm:text-xs min-h-[44px] sm:min-h-[36px] sm:h-8 bg-surface flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddTag(field.name)}
                className="text-xs shrink-0 min-h-[44px] sm:min-h-[36px] px-3"
              >
                <Plus className="h-4.5 w-4.5" />
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
      <DialogContent className="w-[calc(100vw-1.5rem)] max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden bg-surface">
        {/* Header */}
        <div className="p-4 sm:p-6 pb-3 sm:pb-4 border-b border-border bg-background">
          <DialogTitle className="text-base sm:text-lg font-bold text-text">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-xs text-text-muted mt-1">
              {description}
            </DialogDescription>
          )}
        </div>

        {/* Form Body with optional Tabs */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="space-y-4">
            {fields.map((f) => renderField(f))}
          </div>
        </div>

        {/* Footer with Workflow Action Buttons */}
        <div className="p-3 sm:p-4 border-t border-border bg-background flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="w-full sm:w-auto text-xs text-text-muted justify-center min-h-[44px] sm:min-h-[36px]"
          >
            Cancel
          </Button>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleSubmit("draft")}
              className="w-full sm:w-auto text-xs bg-surface justify-center min-h-[44px] sm:min-h-[36px]"
            >
              <Save className="h-4.5 w-4.5" />
              Save as Draft
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => handleSubmit("submit")}
              className="w-full sm:w-auto text-xs justify-center min-h-[44px] sm:min-h-[36px]"
            >
              <Send className="h-4.5 w-4.5" />
              Submit for Approval
            </Button>

            {canPublish && (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => handleSubmit("publish")}
                className="w-full sm:w-auto text-xs justify-center min-h-[44px] sm:min-h-[36px]"
              >
                <Globe className="h-4.5 w-4.5" />
                Save & Publish
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
