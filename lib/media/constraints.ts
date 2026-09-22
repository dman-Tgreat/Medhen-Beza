export const MEDIA_CONSTRAINTS = {
  image: {
    accept: "image/jpeg,image/png,image/webp,image/avif,image/gif,image/svg+xml,image/pjpeg,image/jpg",
    extensions: [".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".svg"],
    maxBytes: 15 * 1024 * 1024,
    label: "JPG, PNG, WebP, AVIF, or SVG up to 15 MB",
  },
  video: {
    accept: "video/mp4,video/webm,video/quicktime,video/x-m4v,video/m4v,video/x-matroska",
    extensions: [".mp4", ".webm", ".mov", ".m4v", ".mkv"],
    maxBytes: 150 * 1024 * 1024,
    label: "MP4, WebM, or MOV up to 150 MB",
  },
} as const;

export type MediaKind = keyof typeof MEDIA_CONSTRAINTS;

export function validateMediaFile(file: File, kind: MediaKind): string | null {
  const constraints = MEDIA_CONSTRAINTS[kind];
  const fileMime = (file.type || "").toLowerCase().trim();
  const fileName = (file.name || "").toLowerCase().trim();

  const mimeMatch = constraints.accept
    .split(",")
    .some((type) => type.trim().toLowerCase() === fileMime);

  const extMatch = (constraints.extensions as readonly string[]).some((ext) =>
    fileName.endsWith(ext)
  );

  if (!mimeMatch && !extMatch) {
    return `Unsupported file format. Please upload a ${constraints.label}.`;
  }

  if (file.size > constraints.maxBytes) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return `File is too large (${sizeMb} MB). Maximum allowed size is ${constraints.label}.`;
  }

  return null;
}
