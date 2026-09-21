import { createHash } from "node:crypto";
import type { StorageProvider, StoredAsset, StorageResourceType } from "./types";

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}. Configure Cloudinary before uploading media.`);
  return value;
}

function sign(params: Record<string, string>): string {
  const payload = Object.entries(params)
    .filter(([, value]) => value !== "" && value !== undefined)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  return createHash("sha1").update(`${payload}${requiredEnv("CLOUDINARY_API_SECRET")}`).digest("hex");
}

function cloudinaryResourceType(resourceType: StorageResourceType): "image" | "video" | "raw" {
  return resourceType;
}

export const cloudinaryProvider: StorageProvider = {
  async upload(file, resourceType, folder): Promise<StoredAsset> {
    const cloudName = requiredEnv("CLOUDINARY_CLOUD_NAME");
    const apiKey = requiredEnv("CLOUDINARY_API_KEY");
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const params = { folder, timestamp };
    const body = new FormData();
    body.append("file", file);
    body.append("api_key", apiKey);
    body.append("timestamp", timestamp);
    body.append("folder", folder);
    body.append("signature", sign(params));

    const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${cloudinaryResourceType(resourceType)}/upload`;
    const response = await fetch(endpoint, { method: "POST", body });
    const result = (await response.json()) as {
      secure_url?: string;
      public_id?: string;
      resource_type?: "image" | "video" | "raw";
      bytes?: number;
      width?: number;
      height?: number;
      original_filename?: string;
      format?: string;
      error?: { message?: string };
    };
    if (!response.ok || !result.secure_url || !result.public_id) {
      throw new Error(result.error?.message || "Cloudinary upload failed.");
    }

    return {
      url: result.secure_url,
      storageKey: result.public_id,
      storageProvider: "cloudinary",
      resourceType: result.resource_type || resourceType,
      mimeType: file.type,
      sizeBytes: result.bytes || file.size,
      width: result.width,
      height: result.height,
      originalName: file.name,
      filename: `${result.original_filename || file.name}.${result.format || "bin"}`,
    };
  },

  async remove(storageKey, resourceType) {
    const cloudName = requiredEnv("CLOUDINARY_CLOUD_NAME");
    const apiKey = requiredEnv("CLOUDINARY_API_KEY");
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const params = { public_id: storageKey, timestamp };
    const body = new URLSearchParams({
      api_key: apiKey,
      public_id: storageKey,
      timestamp,
      signature: sign(params),
    });
    const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${cloudinaryResourceType(resourceType)}/destroy`;
    const response = await fetch(endpoint, { method: "POST", body });
    if (!response.ok) throw new Error("Cloudinary asset deletion failed.");
  },
};
