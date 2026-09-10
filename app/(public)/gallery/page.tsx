"use client";

import * as React from "react";
import Image from "next/image";
import {
  Image as ImageIcon,
  Play,
  Film,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Volume2,
  VolumeX,
} from "lucide-react";
import { PageHero } from "@/components/sections/Hero";
import { GalleryCard } from "@/components/content/GalleryCard";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { MOCK_GALLERY_DETAILED, type GalleryDetailItem } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type MediaFilter = "All" | "Photos" | "Videos";

export default function GalleryPage() {
  const [filter, setFilter] = React.useState<MediaFilter>("All");
  const [activeMediaIndex, setActiveMediaIndex] = React.useState<number | null>(
    null
  );

  // Filtered gallery items
  const filteredItems = React.useMemo(() => {
    return MOCK_GALLERY_DETAILED.filter((item) => {
      if (filter === "Photos") return item.type === "image";
      if (filter === "Videos") return item.type === "video";
      return true;
    });
  }, [filter]);

  const openViewer = (item: GalleryDetailItem) => {
    const index = filteredItems.findIndex((i) => i.id === item.id);
    if (index !== -1) setActiveMediaIndex(index);
  };

  const closeViewer = () => {
    setActiveMediaIndex(null);
  };

  const nextMedia = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activeMediaIndex !== null) {
      setActiveMediaIndex((activeMediaIndex + 1) % filteredItems.length);
    }
  };

  const prevMedia = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activeMediaIndex !== null) {
      setActiveMediaIndex(
        (activeMediaIndex - 1 + filteredItems.length) % filteredItems.length
      );
    }
  };

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeMediaIndex === null) return;
      if (e.key === "Escape") closeViewer();
      if (e.key === "ArrowRight") nextMedia();
      if (e.key === "ArrowLeft") prevMedia();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeMediaIndex, filteredItems.length]);

  const currentItem =
    activeMediaIndex !== null ? filteredItems[activeMediaIndex] : null;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 1. PageHero */}
      <PageHero
        eyebrow="Visual Tour"
        title="Hospital Photo & Video Gallery"
        description="Experience the clinical environments, medical equipment, hospital campus, and care teams across Medhen Beza Hospital."
        breadcrumbs={[{ label: "Gallery" }]}
      />

      <main className="layout-container pt-10 space-y-10">
        {/* 2. Filter Tabs (All | Photos | Videos) */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter("All")}
              className={cn(
                "px-4 py-2 rounded-full text-small font-semibold transition-colors border",
                filter === "All"
                  ? "bg-primary text-white border-primary shadow-xs"
                  : "bg-surface text-text-muted border-border hover:text-primary hover:border-primary-light"
              )}
            >
              All Media ({MOCK_GALLERY_DETAILED.length})
            </button>
            <button
              onClick={() => setFilter("Photos")}
              className={cn(
                "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-small font-semibold transition-colors border",
                filter === "Photos"
                  ? "bg-primary text-white border-primary shadow-xs"
                  : "bg-surface text-text-muted border-border hover:text-primary hover:border-primary-light"
              )}
            >
              <ImageIcon className="w-4 h-4" />
              Photos (
              {MOCK_GALLERY_DETAILED.filter((i) => i.type === "image").length})
            </button>
            <button
              onClick={() => setFilter("Videos")}
              className={cn(
                "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-small font-semibold transition-colors border",
                filter === "Videos"
                  ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                  : "bg-surface text-text-muted border-border hover:text-amber-600 hover:border-amber-300"
              )}
            >
              <Film className="w-4 h-4" />
              Videos (
              {MOCK_GALLERY_DETAILED.filter((i) => i.type === "video").length})
            </button>
          </div>

          <p className="text-caption text-text-muted hidden sm:block">
            Showing {filteredItems.length} items · Click any item to inspect
          </p>
        </div>

        {/* 3. Dense, Image-Forward Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredItems.map((item) => (
              <ScrollReveal key={item.id}>
                <GalleryCard
                  data={item}
                  onClick={() => openViewer(item)}
                  className="h-full"
                />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<ImageIcon className="w-8 h-8 text-primary" />}
            title="No media found"
            description="There are currently no gallery items in this category."
            action={{
              label: "Show All Media",
              onClick: () => setFilter("All"),
            }}
          />
        )}
      </main>

      {/* 4. Fullscreen Media Viewer / Lightbox Overlay with Inline Video Playback */}
      {currentItem && (
        <div
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in-50"
          onClick={closeViewer}
          role="dialog"
          aria-modal="true"
        >
          {/* Top Bar */}
          <div
            className="flex items-center justify-between text-white w-full max-w-5xl mx-auto z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-0.5">
              <span className="text-caption uppercase tracking-wider text-secondary-light font-bold">
                {currentItem.category} · {currentItem.type === "video" ? "Video" : "Photo"}
              </span>
              <h3 className="text-small sm:text-body font-bold text-white">
                {currentItem.title}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-caption text-white/70">
                {activeMediaIndex! + 1} / {filteredItems.length}
              </span>
              <button
                onClick={closeViewer}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close viewer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Prev / Next Navigation Controls */}
          {filteredItems.length > 1 && (
            <>
              <button
                onClick={prevMedia}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors z-20"
                aria-label="Previous item"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextMedia}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors z-20"
                aria-label="Next item"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Main Media Player / Image Display */}
          <div
            className="relative w-full max-w-4xl h-[65vh] mx-auto flex items-center justify-center my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {currentItem.type === "video" ? (
              /* Inline HTML5 Video Player */
              <div className="w-full h-full max-h-[60vh] flex flex-col items-center justify-center bg-black/50 rounded-lg overflow-hidden border border-white/20">
                <video
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                  src={currentItem.videoSrc}
                  poster={currentItem.src}
                >
                  Your browser does not support HTML5 video playback.
                </video>
              </div>
            ) : (
              /* High-Resolution Photo Zoom */
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={currentItem.src}
                  alt={currentItem.alt}
                  fill
                  className="object-contain"
                  sizes="90vw"
                  priority
                />
              </div>
            )}
          </div>

          {/* Bottom Caption & Description */}
          <div
            className="w-full max-w-2xl mx-auto text-center text-white/85 text-small pb-2 z-10 px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <p>{currentItem.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}
