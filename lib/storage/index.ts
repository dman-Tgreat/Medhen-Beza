import { cloudinaryProvider } from "./cloudinary";
import type { StorageProvider } from "./types";

export function getStorageProvider(name = process.env.STORAGE_PROVIDER || "cloudinary"): StorageProvider {
  if (name === "cloudinary") return cloudinaryProvider;
  throw new Error(`Unsupported storage provider: ${name}`);
}
