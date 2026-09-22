"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAdminRole } from "./role-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
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
  Plus,
  X,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { MediaUploadField } from "./media-upload-field";
import { isValidEthiopianPhone } from "@/lib/validation/phone";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
    | "email"
    | "tel"
    | "phone";
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
  allowShortCode?: boolean;
}

export type ModalSubmitHandler = (
  values: Record<string, any>,
  actionType: "draft" | "submit" | "publish"
) => Promise<{ error?: string; success?: boolean } | void> | { error?: string; success?: boolean } | void;

interface ContentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  fields: FormFieldConfig[];
  initialValues?: Record<string, any>;
  onSubmit: ModalSubmitHandler;
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
  isLoading = false,
}: ContentFormModalProps) {
  const { canPublish } = useAdminRole();
  const [formData, setFormData] = useState<Record<string, any>>(initialValues);
  const [tagInputs, setTagInputs] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState("general");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittingAction, setSubmittingAction] = useState<string | null>(null);

  const prevIsOpenRef = useRef(false);
  const prevIdRef = useRef<any>(undefined);

  useEffect(() => {
    if (isOpen) {
      const currentId = initialValues?.id;
      // Guarded by useRef to prevent revalidations from wiping typed form data per handoff.md
      if (!prevIsOpenRef.current || (currentId !== undefined && currentId !== prevIdRef.current)) {
        setFormData(initialValues || {});
        setActiveTab("general");
        setFieldErrors({});
        setSubmitError(null);
        prevIdRef.current = currentId;
      }
    } else {
      prevIdRef.current = undefined;
      setFieldErrors({});
      setSubmitError(null);
      setSubmittingAction(null);
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, initialValues?.id]);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
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

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    let firstErrorSection: string | null = null;

    for (const field of fields) {
      const val = formData[field.name];

      // Required check
      if (field.required) {
        if (field.type === "checkbox") {
          if (!val) errors[field.name] = `${field.label} must be checked.`;
        } else if (field.type === "tags") {
          if (!Array.isArray(val) || val.length === 0) {
            errors[field.name] = `Please add at least one ${field.label.toLowerCase()}.`;
          }
        } else if (field.type === "number") {
          if (val === "" || val === undefined || isNaN(Number(val))) {
            errors[field.name] = `${field.label} is required.`;
          }
        } else {
          if (!val || (typeof val === "string" && val.trim().length === 0)) {
            errors[field.name] = `${field.label} is required.`;
          }
        }
      }

      // Format-specific checks
      if (val && typeof val === "string" && val.trim().length > 0) {
        if (field.type === "email") {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(val.trim())) {
            errors[field.name] = "Please enter a valid email address.";
          }
        }

        if (field.type === "tel" || field.type === "phone" || field.name === "phone") {
          const isValid = isValidEthiopianPhone(val, field.allowShortCode);
          if (!isValid) {
            errors[field.name] = field.allowShortCode
              ? "Please enter a valid Ethiopian phone (+251 9... / 09... / 011...) or shortcode (e.g. 911)."
              : "Please enter a valid Ethiopian phone number (e.g. +251 91 123 4567, 0911 234 567, or 011 654 3210).";
          }
        }

        if (field.type === "number") {
          if (isNaN(Number(val))) {
            errors[field.name] = `${field.label} must be a valid number.`;
          }
        }
      }

      if (errors[field.name] && !firstErrorSection) {
        firstErrorSection = field.section || "general";
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setSubmitError("Please correct the highlighted fields before submitting.");
      if (firstErrorSection) {
        setActiveTab(firstErrorSection);
      }
      return false;
    }

    setFieldErrors({});
    setSubmitError(null);
    return true;
  };

  const handleSubmit = async (actionType: "draft" | "submit" | "publish") => {
    // Run client-side validation
    if (!validateForm()) return;

    setSubmittingAction(actionType);
    setSubmitError(null);

    try {
      const result = await onSubmit(formData, actionType);

      // If the caller returned an error object, display it and keep modal open
      if (result && typeof result === "object" && result.error) {
        setSubmitError(result.error);
        setSubmittingAction(null);
        return;
      }

      // If successful, close the modal
      setSubmittingAction(null);
      onClose();
    } catch (err: any) {
      setSubmittingAction(null);
      setSubmitError(err.message || "An unexpected error occurred while saving. Please try again.");
    }
  };

  // Group fields into tabs if applicable
  const hasContentSection = fields.some((f) => f.section === "content" || f.type === "richtext" || f.type === "textarea");
  const hasMediaSection = fields.some((f) => f.section === "media" || f.type === "image");
  const hasSeoSection = fields.some((f) => f.section === "seo");

  const generalFields = fields.filter((f) => !f.section || f.section === "general");
  const contentFields = fields.filter((f) => f.section === "content" || (!f.section && (f.type === "textarea" || f.type === "richtext")));
  const mediaFields = fields.filter((f) => f.section === "media" || (!f.section && f.type === "image"));
  const seoFields = fields.filter((f) => f.section === "seo");

  const isSaving = Boolean(submittingAction) || isLoading;

  const renderField = (field: FormFieldConfig) => {
    const val = formData[field.name] ?? field.defaultValue ?? "";
    const error = fieldErrors[field.name];

    switch (field.type) {
      case "tel":
      case "phone":
        return (
          <div key={field.name} className="space-y-1.5">
            <PhoneInput
              label={field.label}
              value={String(val)}
              onChange={(formattedVal) => handleChange(field.name, formattedVal)}
              allowShortCode={field.allowShortCode}
              required={field.required}
              error={error}
              helperText={field.helperText}
              disabled={isSaving}
              className="bg-surface text-base sm:text-xs min-h-[44px] sm:min-h-[36px] sm:h-9"
            />
          </div>
        );

      case "text":
      case "number":
      case "date":
      case "email":
        // Special check: if field name includes 'phone', render PhoneInput automatically
        if (field.name.toLowerCase().includes("phone") || field.name === "phone") {
          return (
            <div key={field.name} className="space-y-1.5">
              <PhoneInput
                label={field.label}
                value={String(val)}
                onChange={(formattedVal) => handleChange(field.name, formattedVal)}
                allowShortCode={field.allowShortCode}
                required={field.required}
                error={error}
                helperText={field.helperText}
                disabled={isSaving}
                className="bg-surface text-base sm:text-xs min-h-[44px] sm:min-h-[36px] sm:h-9"
              />
            </div>
          );
        }

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
              disabled={isSaving}
              className={`text-base sm:text-xs min-h-[44px] sm:min-h-[36px] sm:h-9 bg-surface ${
                error ? "border-emergency text-emergency" : ""
              }`}
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
            {error ? (
              <p className="text-[11px] text-emergency font-medium">{error}</p>
            ) : field.helperText ? (
              <p className="text-[11px] text-text-light">{field.helperText}</p>
            ) : null}
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
              disabled={isSaving}
            >
              <SelectTrigger
                className={`text-base sm:text-xs min-h-[44px] sm:min-h-[36px] sm:h-9 bg-surface ${
                  error ? "border-emergency text-emergency" : ""
                }`}
              >
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
            {error ? (
              <p className="text-[11px] text-emergency font-medium">{error}</p>
            ) : field.helperText ? (
              <p className="text-[11px] text-text-light">{field.helperText}</p>
            ) : null}
          </div>
        );

      case "checkbox":
        return (
          <div key={field.name} className="space-y-1">
            <label className="flex items-start gap-2.5 rounded-md border border-border bg-background p-3 cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(val)}
                onChange={(e) => handleChange(field.name, e.target.checked)}
                disabled={isSaving}
                className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <span className="space-y-0.5">
                <span className="block text-xs font-semibold text-text">{field.label}</span>
                {field.helperText && <span className="block text-[11px] text-text-light">{field.helperText}</span>}
              </span>
            </label>
            {error && <p className="text-[11px] text-emergency font-medium">{error}</p>}
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
              disabled={isSaving}
              className={`w-full rounded-md border bg-surface p-2.5 text-base sm:text-xs text-text focus:outline-none focus:ring-2 focus:ring-primary ${
                error ? "border-emergency text-emergency" : "border-border"
              }`}
            />
            {error ? (
              <p className="text-[11px] text-emergency font-medium">{error}</p>
            ) : field.helperText ? (
              <p className="text-[11px] text-text-light">{field.helperText}</p>
            ) : null}
          </div>
        );

      case "richtext":
        return (
          <div key={field.name} className="space-y-1.5">
            <label className="text-xs font-semibold text-text">
              {field.label} {field.required && <span className="text-emergency">*</span>}
            </label>
            <div className={`rounded-md border bg-surface overflow-hidden ${error ? "border-emergency" : "border-border"}`}>
              <div className="flex items-center gap-1 bg-background p-1.5 border-b border-border text-xs text-text-muted">
                <span className="text-[10px] text-text-light px-1">Editor:</span>
              </div>
              <textarea
                rows={6}
                value={val}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                disabled={isSaving}
                className="w-full p-2.5 text-base sm:text-xs text-text bg-surface focus:outline-none"
              />
            </div>
            {error ? (
              <p className="text-[11px] text-emergency font-medium">{error}</p>
            ) : field.helperText ? (
              <p className="text-[11px] text-text-light">{field.helperText}</p>
            ) : null}
          </div>
        );

      case "tags": {
        const tags = (val as string[]) || [];
        return (
          <div key={field.name} className="space-y-1.5">
            <label className="text-xs font-semibold text-text">
              {field.label} {field.required && <span className="text-emergency">*</span>}
            </label>
            <div className="flex gap-2">
              <Input
                value={tagInputs[field.name] || ""}
                onChange={(e) => setTagInputs({ ...tagInputs, [field.name]: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag(field.name);
                  }
                }}
                disabled={isSaving}
                placeholder={field.placeholder || "Type item and press Enter..."}
                className="text-base sm:text-xs min-h-[44px] sm:min-h-[36px] sm:h-9 bg-surface"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddTag(field.name)}
                disabled={isSaving}
                className="h-9 px-3 text-xs"
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary-light text-primary-dark border border-primary/20"
                  >
                    {t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(field.name, t)}
                      disabled={isSaving}
                      className="hover:text-emergency"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            {error ? (
              <p className="text-[11px] text-emergency font-medium">{error}</p>
            ) : field.helperText ? (
              <p className="text-[11px] text-text-light">{field.helperText}</p>
            ) : null}
          </div>
        );
      }

      case "image": {
        const mediaKind =
          typeof field.mediaKind === "function"
            ? field.mediaKind(formData)
            : field.mediaKind || "image";

        return (
          <div key={field.name} className="space-y-1.5">
            <MediaUploadField
              label={field.label}
              value={val}
              onChange={(url) => handleChange(field.name, url)}
              kind={mediaKind}
              folder={field.folder || "content"}
              aspectRatio={field.aspectRatio}
              aspectLabel={field.aspectLabel}
              helperText={field.helperText}
            />
            {error && <p className="text-[11px] text-emergency font-medium">{error}</p>}
          </div>
        );
      }

      default:
        return null;
    }
  };

  const hasTabs = hasContentSection || hasMediaSection || hasSeoSection;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSaving && onClose()}>
      <DialogContent className="max-w-3xl sm:max-w-3xl w-[95vw] max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden bg-background">
        {/* Header */}
        <div className="p-4 sm:p-6 pb-3 sm:pb-4 border-b border-border bg-background space-y-2">
          <DialogTitle className="text-base sm:text-lg font-bold text-text">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-xs text-text-muted">
              {description}
            </DialogDescription>
          )}

          {/* Submission / Validation Error Alert */}
          {submitError && (
            <Alert variant="emergency" className="mt-2 py-2.5">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="text-xs font-bold">Action Failed</AlertTitle>
              <AlertDescription className="text-xs">{submitError}</AlertDescription>
            </Alert>
          )}
        </div>

        {/* Form Body with optional Tabs */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {hasTabs ? (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-4">
              <TabsList className="bg-surface border border-border h-10 p-1 flex">
                <TabsTrigger value="general" className="text-xs flex-1">
                  General Info
                </TabsTrigger>
                {hasContentSection && (
                  <TabsTrigger value="content" className="text-xs flex-1">
                    Details & Body
                  </TabsTrigger>
                )}
                {hasMediaSection && (
                  <TabsTrigger value="media" className="text-xs flex-1">
                    Media & Cover
                  </TabsTrigger>
                )}
                {hasSeoSection && (
                  <TabsTrigger value="seo" className="text-xs flex-1">
                    SEO
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="general" className="space-y-4 pt-2">
                {generalFields.map((f) => renderField(f))}
              </TabsContent>

              {hasContentSection && (
                <TabsContent value="content" className="space-y-4 pt-2">
                  {contentFields.map((f) => renderField(f))}
                </TabsContent>
              )}

              {hasMediaSection && (
                <TabsContent value="media" className="space-y-4 pt-2">
                  {mediaFields.map((f) => renderField(f))}
                </TabsContent>
              )}

              {hasSeoSection && (
                <TabsContent value="seo" className="space-y-4 pt-2">
                  {seoFields.map((f) => renderField(f))}
                </TabsContent>
              )}
            </Tabs>
          ) : (
            <div className="space-y-4">
              {fields.map((f) => renderField(f))}
            </div>
          )}
        </div>

        {/* Footer with Workflow Action Buttons */}
        <div className="p-3 sm:p-4 border-t border-border bg-background flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isSaving}
            className="w-full sm:w-auto text-xs text-text-muted justify-center min-h-[44px] sm:min-h-[36px]"
          >
            Cancel
          </Button>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isSaving}
              onClick={() => handleSubmit("draft")}
              className="w-full sm:w-auto text-xs bg-surface justify-center min-h-[44px] sm:min-h-[36px]"
            >
              {submittingAction === "draft" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                  Saving Draft...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-1.5" />
                  Save as Draft
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={isSaving}
              onClick={() => handleSubmit("submit")}
              className="w-full sm:w-auto text-xs justify-center min-h-[44px] sm:min-h-[36px]"
            >
              {submittingAction === "submit" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-1.5" />
                  Submit for Approval
                </>
              )}
            </Button>

            {canPublish && (
              <Button
                type="button"
                variant="primary"
                size="sm"
                disabled={isSaving}
                onClick={() => handleSubmit("publish")}
                className="w-full sm:w-auto text-xs justify-center min-h-[44px] sm:min-h-[36px]"
              >
                {submittingAction === "publish" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Globe className="h-4 w-4 mr-1.5" />
                    Save & Publish
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
