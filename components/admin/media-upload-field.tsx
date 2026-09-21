"use client";

import { useRef, useState } from "react";
import { Image as ImageIcon, Loader2, UploadCloud, Video, X } from "lucide-react";
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
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const constraints = MEDIA_CONSTRAINTS[kind];

  const upload = async (file: File) => {
    setError(null);
    const validationError = validateMediaFile(file, kind);
    if (validationError) {
      setError(validationError);
      return;
    }
    if (kind === "image" && aspectRatio) {
      const previewUrl = URL.createObjectURL(file);
      try {
        const image = new Image();
        image.src = previewUrl;
        await image.decode();
        const actualRatio = image.width / image.height;
        if (Math.abs(actualRatio - aspectRatio) / aspectRatio > 0.2) {
          setError(`Use an image close to ${aspectLabel || `${aspectRatio.toFixed(2)}:1`} so cards do not crop awkwardly.`);
          return;
        }
      } finally {
        URL.revokeObjectURL(previewUrl);
      }
    }
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("kind", kind);
    formData.append("folder", folder);
    const result = await uploadMediaAction(formData);
    setIsUploading(false);
    if (result.error || !result.data) {
      setError(result.error || "Upload failed.");
      return;
    }
    onChange(result.data.url);
  };

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative overflow-hidden rounded-lg border border-border bg-background">
          {kind === "image" ? (
            <img src={value} alt="Uploaded preview" className="h-40 w-full object-cover" />
          ) : (
            <video src={value} controls className="h-40 w-full object-contain bg-black" />
          )}
          <button type="button" onClick={() => onChange("")} className="absolute right-2 top-2 rounded-full bg-emergency p-1 text-white" aria-label="Remove uploaded asset">
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragEnter={(event) => { event.preventDefault(); setIsDragging(true); }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => { event.preventDefault(); setIsDragging(false); const file = event.dataTransfer.files[0]; if (file) void upload(file); }}
          className={`flex min-h-36 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 text-center transition ${isDragging ? "border-primary bg-primary-light" : "border-border bg-background hover:border-primary/60"}`}
        >
          {isUploading ? <Loader2 className="mb-2 h-7 w-7 animate-spin text-primary" /> : kind === "image" ? <ImageIcon className="mb-2 h-7 w-7 text-primary" /> : <Video className="mb-2 h-7 w-7 text-primary" />}
          <span className="text-xs font-semibold text-text">{isUploading ? "Uploading…" : "Drag and drop or choose a file"}</span>
          <span className="mt-1 text-[11px] text-text-muted">{constraints.label}{aspectLabel ? ` • Recommended ${aspectLabel}` : ""}</span>
          <UploadCloud className="mt-2 h-4 w-4 text-text-light" />
        </button>
      )}
      <input ref={inputRef} type="file" accept={constraints.accept} className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file); event.currentTarget.value = ""; }} />
      {(helperText || error) && <p className={`text-[11px] ${error ? "text-emergency" : "text-text-light"}`}>{error || helperText}</p>}
    </div>
  );
}
