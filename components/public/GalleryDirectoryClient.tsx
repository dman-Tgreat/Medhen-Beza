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
} from "lucide-react";
import { GalleryCard } from "@/components/content/GalleryCard";
import { EmptyState } from "@/components/ui/empty-state";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

type MediaFilter = "All" | "Photos" | "Videos";

export function GalleryDirectoryClient({ initialItems }: { initialItems: any[] }) {
  const [filter, setFilter] = React.useState<MediaFilter>("All");
  const [activeMediaIndex, setActiveMediaIndex] = React.useState<number | null>(null);

  const filteredItems = React.useMemo(() => {
    return initialItems.filter((item) => {
      if (filter === "Photos") return item.type === "image";
      if (filter === "Videos") return item.type === "video";
      return true;
    });
  }, [initialItems, filter]);

  const activeMedia = activeMediaIndex !== null ? filteredItems[activeMediaIndex] : null;

  return (
    <main className="container mx-auto px-4 pt-10 space-y-8">
      {/* Category/Type Filter Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {(["All", "Photos", "Videos"] as MediaFilter[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-5 py-2.5 rounded-pill text-small font-bold transition-all ${
              filter === tab
                ? "bg-primary text-white shadow-sm"
                : "bg-surface text-text-muted border border-border hover:text-text"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {filteredItems.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="No Media in this Section"
          description="We are regularly updating our hospital photos and facility tours. Please check back soon."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item, idx) => (
            <ScrollReveal key={item.id} delay={idx * 0.05}>
              <div
                onClick={() => setActiveMediaIndex(idx)}
                className="cursor-pointer group rounded-2xl overflow-hidden border border-border bg-surface shadow-sm hover:shadow-md transition-all"
              >
                <div className="relative aspect-4/3 w-full bg-background overflow-hidden">
                  {item.src ? (
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-surface-raised">
                      {item.type === "video" ? (
                        <Film className="h-10 w-10 text-text-muted" />
                      ) : (
                        <ImageIcon className="h-10 w-10 text-text-muted" />
                      )}
                    </div>
                  )}
                  {item.type === "video" && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="h-12 w-12 rounded-full bg-white/90 text-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="h-5 w-5 fill-current ml-0.5" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-1">
                  <span className="text-caption font-semibold text-secondary uppercase">
                    {item.category}
                  </span>
                  <h3 className="text-small font-bold text-text line-clamp-1">{item.title}</h3>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {activeMedia && (
        <div
          onClick={() => setActiveMediaIndex(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 md:p-10"
          role="dialog"
          aria-modal="true"
        >
          {/* Close button */}
          <button
            onClick={() => setActiveMediaIndex(null)}
            className="absolute top-4 right-4 text-white hover:text-red-400 p-2 z-20 rounded-full bg-black/50 hover:bg-black/80 transition-colors"
            aria-label="Close dialog"
          >
            <X className="h-7 w-7" />
          </button>

          {/* Navigation Prev/Next */}
          {filteredItems.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMediaIndex((prev) =>
                    prev !== null ? (prev === 0 ? filteredItems.length - 1 : prev - 1) : 0
                  );
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white bg-black/50 hover:bg-black/80 rounded-full z-20 transition-colors"
                aria-label="Previous media"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMediaIndex((prev) =>
                    prev !== null ? (prev === filteredItems.length - 1 ? 0 : prev + 1) : 0
                  );
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white bg-black/50 hover:bg-black/80 rounded-full z-20 transition-colors"
                aria-label="Next media"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full bg-surface rounded-2xl overflow-hidden shadow-2xl border border-border flex flex-col"
          >
            <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
              {activeMedia.type === "video" ? (
                activeMedia.embedUrl ? (
                  <iframe
                    src={activeMedia.embedUrl}
                    title={activeMedia.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : activeMedia.url || activeMedia.videoUrl ? (
                  <video
                    src={activeMedia.url || activeMedia.videoUrl}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="flex flex-col items-center justify-center text-text-muted gap-2">
                    <Film className="h-12 w-12" />
                    <p className="text-small">Video source unavailable</p>
                  </div>
                )
              ) : (
                <Image
                  src={activeMedia.src || activeMedia.url}
                  alt={activeMedia.alt || activeMedia.title}
                  fill
                  className="object-contain"
                  priority
                />
              )}
            </div>

            <div className="p-6 space-y-1 bg-surface">
              <div className="flex items-center justify-between">
                <span className="text-caption font-bold text-secondary uppercase tracking-wider">
                  {activeMedia.category}
                </span>
                <span className="text-caption text-text-muted">
                  {activeMediaIndex! + 1} of {filteredItems.length}
                </span>
              </div>
              <h2 className="text-h3 font-bold text-text">{activeMedia.title}</h2>
              {activeMedia.description && (
                <p className="text-small text-text-muted leading-relaxed">{activeMedia.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
