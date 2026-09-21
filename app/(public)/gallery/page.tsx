import type { Metadata } from "next";
import { PageHero } from "@/components/sections/Hero";
import { GalleryDirectoryClient } from "@/components/public/GalleryDirectoryClient";
import { getPublicGallery } from "@/lib/queries/public";

export const metadata: Metadata = {
  title: "Media Gallery & Hospital Tour | Medhen Beza Hospital",
  description:
    "Take a visual and video tour of Medhen Beza Hospital's advanced diagnostic imaging suites, modern operating theatres, patient rooms, and specialized clinical centers.",
};

export default async function GalleryPage() {
  const items = await getPublicGallery();

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHero
        title="Hospital Campus & Facilities Gallery"
        description="Experience our modern medical architecture, state-of-the-art diagnostic suites, comfortable inpatient amenities, and compassionate clinical teams."
        badge="Media Gallery"
        breadcrumbs={[{ label: "Gallery" }]}
      />

      <GalleryDirectoryClient initialItems={items} />
    </div>
  );
}
