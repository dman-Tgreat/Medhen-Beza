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
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {item.type === "video" && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="h-12 w-12 rounded-full bg-white/90 text-primary flex items-center justify-center shadow-lg">
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
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <button
            onClick={() => setActiveMediaIndex(null)}
            className="absolute top-4 right-4 text-white hover:text-red-400 p-2"
          >
            <X className="h-8 w-8" />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full bg-surface rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="relative aspect-16/10 w-full bg-black">
              <Image
                src={activeMedia.src}
                alt={activeMedia.alt}
                fill
                className="object-contain"
              />
            </div>
            <div className="p-6 space-y-1">
              <span className="text-caption font-bold text-secondary uppercase">
                {activeMedia.category}
              </span>
              <h2 className="text-h3 font-bold text-text">{activeMedia.title}</h2>
              {activeMedia.description && (
                <p className="text-small text-text-muted">{activeMedia.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
