# Media storage

Uploads use the `storageProvider` value already present on `Media`; the default provider is Cloudinary. Configure these values in the runtime `.env` before using the Media Library or content upload fields:

```env
STORAGE_PROVIDER=cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

Images accept JPG, PNG, WebP, and AVIF up to 8 MB. Videos accept MP4, WebM, and MOV up to 100 MB. The reusable uploader gives aspect-ratio guidance for portrait doctor cards and landscape content cards. Media deletion checks live content references first and removes the Cloudinary object only after the database record is confirmed unused.

To add another provider later, implement `StorageProvider` in `lib/storage/types.ts` and register it in `lib/storage/index.ts`; existing `Media` rows do not require a schema migration.
