import fs from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";
import type { StorageProvider, StoredAsset, StorageResourceType } from "./types";

export const localStorageProvider: StorageProvider = {
  async upload(file: File, resourceType: StorageResourceType, folder: string): Promise<StoredAsset> {
    const cleanFolder = folder.replace(/\\/g, "/").replace(/^\/+|\/+$/g, "") || "general";
    const uploadDir = path.join(process.cwd(), "public", "uploads", cleanFolder);
    await fs.mkdir(uploadDir, { recursive: true });

    const rawExt = path.extname(file.name);
    const ext = rawExt ? rawExt.toLowerCase() : resourceType === "video" ? ".mp4" : ".jpg";
    const baseName = path.basename(file.name, rawExt).replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 30);
    const uniqueSuffix = `${Date.now()}_${randomBytes(4).toString("hex")}`;
    const filename = `${baseName}_${uniqueSuffix}${ext}`;
    const targetFilePath = path.join(uploadDir, filename);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(targetFilePath, buffer);

    const publicUrl = `/uploads/${cleanFolder}/${filename}`;

    return {
      url: publicUrl,
      storageKey: `uploads/${cleanFolder}/${filename}`,
      storageProvider: "local",
      resourceType,
      mimeType: file.type || (resourceType === "video" ? "video/mp4" : "image/jpeg"),
      sizeBytes: buffer.length,
      originalName: file.name,
      filename,
    };
  },

  async remove(storageKey: string) {
    try {
      const sanitizedKey = storageKey.replace(/\\/g, "/").replace(/^\/+/, "");
      // Prevent directory traversal attacks
      if (sanitizedKey.includes("..")) return;

      const targetPath = path.join(process.cwd(), "public", sanitizedKey);
      await fs.unlink(targetPath);
    } catch (err: any) {
      // Ignore if file was already removed
      if (err.code !== "ENOENT") {
        console.error("[LOCAL_STORAGE_REMOVE_ERROR]", err);
      }
    }
  },
};
