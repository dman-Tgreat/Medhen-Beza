"use server";

import { MediaType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { validateMediaFile, type MediaKind } from "@/lib/media/constraints";
import { getStorageProvider } from "@/lib/storage";
import type { StorageResourceType } from "@/lib/storage/types";

export type MediaLibraryItem = {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  type: MediaType;
  mimeType: string;
  sizeBytes: number;
  width: number | null;
  height: number | null;
  uploadedAt: string;
  uploadedBy: string;
  usage: { contentType: string; contentId: string; title: string }[];
};

function resourceTypeFor(kind: MediaKind): StorageResourceType {
  return kind === "image" ? "image" : kind === "video" ? "video" : "raw";
}

function mediaTypeFor(kind: MediaKind): MediaType {
  return kind === "image" ? MediaType.IMAGE : kind === "video" ? MediaType.VIDEO : MediaType.DOCUMENT;
}

export async function uploadMediaAction(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: "You must be signed in to upload media." };

  const file = formData.get("file");
  const kind = formData.get("kind");
  const folder = String(formData.get("folder") || "uploads");
  const altText = String(formData.get("altText") || "").trim() || null;
  if (!(file instanceof File)) return { error: "Choose a file to upload." };
  if (kind !== "image" && kind !== "video") return { error: "Unsupported media kind." };

  const validationError = validateMediaFile(file, kind);
  if (validationError) return { error: validationError };

  try {
    const stored = await getStorageProvider().upload(file, resourceTypeFor(kind), folder);

    // Safeguard uploadedById: resolve against PostgreSQL users table
    let validUserId: string | null = null;
    if (session?.id) {
      const userRecord = await db.user.findFirst({
        where: {
          OR: [{ id: session.id }, { email: session.email }],
        },
        select: { id: true },
      });
      if (userRecord) {
        validUserId = userRecord.id;
      }
    }

    const media = await db.media.create({
      data: {
        filename: stored.filename,
        originalName: stored.originalName,
        url: stored.url,
        storageProvider: stored.storageProvider,
        storageKey: stored.storageKey,
        mimeType: stored.mimeType,
        sizeBytes: stored.sizeBytes,
        width: stored.width,
        height: stored.height,
        altText,
        folder,
        uploadedById: validUserId,
      },
    });
    revalidatePath("/admin/media");
    return {
      success: true,
      data: {
        id: media.id,
        url: media.url,
        filename: media.filename,
        mimeType: media.mimeType,
        width: media.width,
        height: media.height,
      },
    };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Media upload failed." };
  }
}

async function findUsage(url: string) {
  const [departments, services, doctors, news, gallery, pages, events] = await Promise.all([
    db.department.findMany({ select: { id: true, name: true, image: true, ogImage: true } }),
    db.service.findMany({ select: { id: true, title: true, image: true, ogImage: true } }),
    db.doctor.findMany({ select: { id: true, fullName: true, profilePhoto: true, ogImage: true } }),
    db.news.findMany({ select: { id: true, title: true, featuredImage: true, ogImage: true } }),
    db.gallery.findMany({ select: { id: true, title: true, url: true, thumbnailUrl: true, videoUrl: true } }),
    db.page.findMany({ select: { id: true, title: true, ogImage: true } }),
    db.hospitalEvent.findMany({ select: { id: true, title: true, image: true } }),
  ]);
  const usage: { contentType: string; contentId: string; title: string }[] = [];
  const add = (contentType: string, rows: { id: string; title: string; values: (string | null)[] }[]) => {
    rows.forEach((row) => {
      if (row.values.includes(url)) usage.push({ contentType, contentId: row.id, title: row.title });
    });
  };
  add("Department", departments.map((row) => ({ id: row.id, title: row.name, values: [row.image, row.ogImage] })));
  add("Service", services.map((row) => ({ id: row.id, title: row.title, values: [row.image, row.ogImage] })));
  add("Doctor", doctors.map((row) => ({ id: row.id, title: row.fullName, values: [row.profilePhoto, row.ogImage] })));
  add("News", news.map((row) => ({ id: row.id, title: row.title, values: [row.featuredImage, row.ogImage] })));
  add("Gallery", gallery.map((row) => ({ id: row.id, title: row.title, values: [row.url, row.thumbnailUrl, row.videoUrl] })));
  add("Page", pages.map((row) => ({ id: row.id, title: row.title, values: [row.ogImage] })));
  add("Event", events.map((row) => ({ id: row.id, title: row.title, values: [row.image] })));
  return usage;
}

export async function getMediaLibraryAction() {
  const session = await getSession();
  if (!session) return { error: "You must be signed in to view media." };
  const media = await db.media.findMany({
    include: { uploadedBy: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });
  const items = await Promise.all(media.map(async (item) => ({
    id: item.id,
    filename: item.filename,
    originalName: item.originalName,
    url: item.url,
    type: item.mimeType.startsWith("video/") ? MediaType.VIDEO : item.mimeType.startsWith("image/") ? MediaType.IMAGE : MediaType.DOCUMENT,
    mimeType: item.mimeType,
    sizeBytes: item.sizeBytes,
    width: item.width,
    height: item.height,
    uploadedAt: item.createdAt.toISOString(),
    uploadedBy: item.uploadedBy?.name || item.uploadedBy?.email || "Unknown",
    usage: await findUsage(item.url),
  })));
  return { success: true, data: items };
}

export async function deleteMediaAction(id: string) {
  const session = await getSession();
  if (!session) return { error: "You must be signed in to delete media." };
  const media = await db.media.findUnique({ where: { id } });
  if (!media) return { error: "Media asset not found." };
  const usage = await findUsage(media.url);
  if (usage.length) {
    return { error: `This asset is still in use by ${usage.map((item) => `${item.contentType}: ${item.title}`).join(", ")}.` };
  }
  try {
    const kind: StorageResourceType = media.mimeType.startsWith("video/") ? "video" : media.mimeType.startsWith("image/") ? "image" : "raw";
    await getStorageProvider(media.storageProvider).remove(media.storageKey, kind);
    await db.media.delete({ where: { id } });
    revalidatePath("/admin/media");
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Media deletion failed." };
  }
}
