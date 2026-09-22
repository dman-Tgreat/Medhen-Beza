import { cloudinaryProvider } from "./cloudinary";
import { localStorageProvider } from "./local";
import type { StorageProvider, StoredAsset, StorageResourceType } from "./types";

export { cloudinaryProvider, localStorageProvider };

export function getStorageProvider(name = process.env.STORAGE_PROVIDER || "cloudinary"): StorageProvider {
  if (name === "local") {
    return localStorageProvider;
  }

  // Resilient Cloudinary provider with automatic Local Storage fallback on timeout or error
  return {
    async upload(file: File, resourceType: StorageResourceType, folder: string): Promise<StoredAsset> {
      try {
        const uploadPromise = cloudinaryProvider.upload(file, resourceType, folder);
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Cloudinary connection timeout")), 5000)
        );
        return await Promise.race([uploadPromise, timeoutPromise]);
      } catch (error: any) {
        console.warn(
          "[STORAGE_PROVIDER_FALLBACK] Cloudinary upload failed or timed out. Saving locally in public/uploads:",
          error?.message || error
        );
        return await localStorageProvider.upload(file, resourceType, folder);
      }
    },

    async remove(storageKey: string, resourceType: StorageResourceType) {
      if (storageKey.startsWith("uploads/")) {
        return await localStorageProvider.remove(storageKey, resourceType);
      }
      try {
        await cloudinaryProvider.remove(storageKey, resourceType);
      } catch {
        await localStorageProvider.remove(storageKey, resourceType);
      }
    },
  };
}
