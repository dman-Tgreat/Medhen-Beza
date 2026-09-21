export const MEDIA_CONSTRAINTS = {
  image: {
    accept: "image/jpeg,image/png,image/webp,image/avif",
    maxBytes: 8 * 1024 * 1024,
    label: "JPG, PNG, WebP, or AVIF up to 8 MB",
  },
  video: {
    accept: "video/mp4,video/webm,video/quicktime",
    maxBytes: 100 * 1024 * 1024,
    label: "MP4, WebM, or MOV up to 100 MB",
  },
} as const;

export type MediaKind = keyof typeof MEDIA_CONSTRAINTS;

export function validateMediaFile(file: File, kind: MediaKind): string | null {
  const constraints = MEDIA_CONSTRAINTS[kind];
  if (!constraints.accept.split(",").some((type) => type === file.type)) {
    return `Unsupported file type. Use ${constraints.label}.`;
  }
  if (file.size > constraints.maxBytes) return `File is too large. Use ${constraints.label}.`;
  return null;
}
