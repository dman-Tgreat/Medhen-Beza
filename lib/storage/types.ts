export type StorageResourceType = "image" | "video" | "raw";

export interface StoredAsset {
  url: string;
  storageKey: string;
  storageProvider: string;
  resourceType: StorageResourceType;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  originalName: string;
  filename: string;
}

export interface StorageProvider {
  upload(file: File, resourceType: StorageResourceType, folder: string): Promise<StoredAsset>;
  remove(storageKey: string, resourceType: StorageResourceType): Promise<void>;
}
