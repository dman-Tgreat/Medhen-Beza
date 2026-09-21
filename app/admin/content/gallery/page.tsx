import { getAdminGallery } from "@/lib/queries/admin";
import { GalleryAdminClient } from "@/components/admin/content/GalleryAdminClient";

export default async function GalleryAdminPage() {
  const gallery = await getAdminGallery();

  return <GalleryAdminClient initialGallery={gallery} />;
}
