"use client";

import { useRef, useState } from "react";
import {
  Image as ImageIcon,
  Loader2,
  UploadCloud,
  Video,
  X,
  Link as LinkIcon,
  RefreshCw,
  AlertCircle,
  Check,
} from "lucide-react";
import { uploadMediaAction } from "@/lib/actions/media";
import { MEDIA_CONSTRAINTS, validateMediaFile, type MediaKind } from "@/lib/media/constraints";

interface MediaUploadFieldProps {
  value?: string;
  onChange: (value: string) => void;
  kind?: MediaKind;
  folder?: string;
  label?: string;
  helperText?: string;
  aspectRatio?: number;
  aspectLabel?: string;
}

export function MediaUploadField({
  value,
  onChange,
  kind = "image",
  folder = "content",
  helperText,
  aspectRatio,
  aspectLabel,
}: MediaUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<"file" | "url">("file");
  const [urlInput, setUrlInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  const constraints = MEDIA_CONSTRAINTS[kind];

  const upload = async (file: File) => {
    setError(null);
    setWarning(null);

    const validationError = validateMediaFile(file, kind);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Soft aspect ratio check (informative guidance instead of hard blocking)
    if (kind === "image" && aspectRatio) {
      const previewUrl = URL.createObjectURL(file);
      try {
        const image = new Image();
        image.src = previewUrl;
        await image.decode();
        const actualRatio = image.width / image.height;
        const deviation = Math.abs(actualRatio - aspectRatio) / aspectRatio;
        if (deviation > 0.35) {
          setWarning(
            `Notice: Image is ${actualRatio.toFixed(2)}:1 (recommended ${aspectLabel || `${aspectRatio.toFixed(2)}:1`}). It has been uploaded and will be automatically centered and fitted.`
          );
        }
      } catch {
        // Non-fatal if browser cannot decode locally
      } finally {
        URL.revokeObjectURL(previewUrl);
      }
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("kind", kind);
      formData.append("folder", folder);

      const result = await uploadMediaAction(formData);
      setIsUploading(false);

      if (result.error || !result.data) {
        setError(result.error || "Upload failed. Please try again.");
        return;
      }

      onChange(result.data.url);
    } catch (err: any) {
      setIsUploading(false);
      setError(err?.message || "An unexpected error occurred during upload.");
    }
  };

  const handleApplyUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      setError("Please paste a valid media URL.");
      return;
    }
    setError(null);
    setWarning(null);
    onChange(trimmed);
    setUrlInput("");
  };

  return (
    <div className="space-y-2">
      {/* Active Media Preview */}
      {value ? (
        <div className="relative overflow-hidden rounded-lg border border-border bg-background group">
          {kind === "image" ? (
            <img
              src={value}
              alt="Uploaded preview"
              className="h-44 w-full object-cover"
              onError={() => setError("Preview could not be loaded. Please ensure the URL is valid.")}
            />
          ) : (
            <video src={value} controls className="h-44 w-full object-contain bg-black" />
          )}

          {/* Action Overlay */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2.5 flex items-center justify-between text-white">
            <span className="text-[11px] truncate max-w-[70%] font-mono text-white/90" title={value}>
              {value}
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="px-2 py-1 rounded bg-white/20 hover:bg-white/30 text-[11px] font-medium flex items-center gap-1 transition"
                title="Replace with new file"
              >
                <RefreshCw className="h-3 w-3" />
                Replace
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setError(null);
                  setWarning(null);
                }}
                className="rounded-full bg-emergency p-1 text-white hover:bg-emergency/80 transition"
                aria-label="Remove uploaded asset"
                title="Remove asset"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State: File Upload or Direct URL */
        <div className="space-y-2">
          {/* Mode Switcher */}
          <div className="flex items-center justify-between text-xs text-text-muted">
            <div className="inline-flex rounded-lg border border-border bg-surface p-0.5">
              <button
                type="button"
                onClick={() => setMode("file")}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                  mode === "file" ? "bg-background text-primary shadow-sm" : "text-text-muted hover:text-text"
                }`}
              >
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setMode("url")}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                  mode === "url" ? "bg-background text-primary shadow-sm" : "text-text-muted hover:text-text"
                }`}
              >
                Paste URL
              </button>
            </div>
            {aspectLabel && (
              <span className="text-[11px] text-text-light font-medium">
                Recommended: {aspectLabel}
              </span>
            )}
          </div>

          {mode === "file" ? (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              onDragEnter={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragOver={(e) => e.preventDefault()}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const file = e.dataTransfer.files[0];
                if (file) void upload(file);
              }}
              disabled={isUploading}
              className={`flex min-h-36 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 text-center transition cursor-pointer ${
                isDragging
                  ? "border-primary bg-primary-light/40"
                  : "border-border bg-background hover:border-primary/60 hover:bg-surface/50"
              }`}
            >
              {isUploading ? (
                <Loader2 className="mb-2 h-7 w-7 animate-spin text-primary" />
              ) : kind === "image" ? (
                <ImageIcon className="mb-2 h-7 w-7 text-primary" />
              ) : (
                <Video className="mb-2 h-7 w-7 text-primary" />
              )}
              <span className="text-xs font-semibold text-text">
                {isUploading ? "Uploading & saving media…" : "Drag and drop or choose file"}
              </span>
              <span className="mt-1 text-[11px] text-text-muted">
                {constraints.label}
              </span>
              <UploadCloud className="mt-2 h-4 w-4 text-text-light" />
            </button>
          ) : (
            <div className="flex items-center gap-2 p-3 rounded-lg border border-border bg-background">
              <LinkIcon className="h-4 w-4 text-text-light shrink-0" />
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleApplyUrl();
                  }
                }}
                placeholder="Paste direct image or video URL (e.g. https://... or /uploads/...)"
                className="flex-1 bg-transparent text-xs text-text focus:outline-none"
              />
              <button
                type="button"
                onClick={handleApplyUrl}
                className="px-3 py-1.5 rounded-md bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition shrink-0"
              >
                Apply
              </button>
            </div>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={inputRef}
        type="file"
        accept={constraints.accept}
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void upload(file);
          event.currentTarget.value = "";
        }}
      />

      {/* Visible Error Banner */}
      {error && (
        <div className="flex items-start justify-between gap-2 p-2.5 rounded-md bg-emergency-light border border-emergency/20 text-xs text-emergency">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="hover:opacity-80 text-emergency shrink-0"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Non-blocking Guidance / Warning */}
      {warning && (
        <div className="flex items-start justify-between gap-2 p-2 rounded-md bg-amber-50 border border-amber-200 text-[11px] text-amber-800">
          <div className="flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 shrink-0 text-amber-600" />
            <span>{warning}</span>
          </div>
          <button
            type="button"
            onClick={() => setWarning(null)}
            className="hover:opacity-80 text-amber-700 shrink-0"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Default Helper Text */}
      {helperText && !error && !warning && (
        <p className="text-[11px] text-text-light">{helperText}</p>
      )}
    </div>
  );
}
