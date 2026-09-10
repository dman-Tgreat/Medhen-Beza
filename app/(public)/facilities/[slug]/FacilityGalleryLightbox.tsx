"use client";

import * as React from "react";
import Image from "next/image";
import { Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

export function FacilityGalleryLightbox({
  images,
}: {
  images: GalleryImage[];
}) {
  const [activeImageIndex, setActiveImageIndex] = React.useState<number | null>(
    null
  );

  const openLightbox = (index: number) => {
    setActiveImageIndex(index);
  };

  const closeLightbox = () => {
    setActiveImageIndex(null);
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activeImageIndex !== null) {
      setActiveImageIndex((activeImageIndex + 1) % images.length);
    }
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activeImageIndex !== null) {
      setActiveImageIndex(
        (activeImageIndex - 1 + images.length) % images.length
      );
    }
  };

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeImageIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeImageIndex, images.length]);

  return (
    <section className="space-y-6 pt-8 border-t border-border">
      <div className="flex items-end justify-between">
        <div>
          <span className="text-caption font-semibold uppercase tracking-wider text-secondary">
            Visual Walkthrough
          </span>
          <h3 className="text-h2 font-bold text-text tracking-tight mt-0.5">
            Facility Photography & Spaces
          </h3>
        </div>
        <p className="text-small text-text-muted hidden sm:block">
          Click any image to view full-screen
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((img, idx) => (
          <div
            key={idx}
            onClick={() => openLightbox(idx)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") openLightbox(idx);
            }}
            className="group relative aspect-[4/3] rounded-lg overflow-hidden border border-border bg-surface cursor-pointer shadow-xs hover:border-primary transition-all duration-200 hover:-translate-y-0.5"
            aria-label={`View image: ${img.alt}`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />

            <div className="absolute inset-0 bg-text/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-text scale-90 group-hover:scale-100 transition-transform">
                <Maximize2 className="w-5 h-5" />
              </div>
            </div>

            {img.caption && (
              <div className="absolute bottom-0 inset-x-0 bg-surface/95 backdrop-blur-xs px-3.5 py-2 border-t border-border">
                <p className="text-caption font-semibold text-text truncate">
                  {img.caption}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal Overlay */}
      {activeImageIndex !== null && images[activeImageIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 backdrop-blur-sm animate-in fade-in-50"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
        >
          {/* Top Bar */}
          <div
            className="absolute top-4 inset-x-4 flex items-center justify-between text-white z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-small font-medium">
              Image {activeImageIndex + 1} of {images.length}
            </div>
            <button
              onClick={closeLightbox}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Prev / Next Controls */}
          {images.length > 1 && (
            <>
              <button
                onClick={nextImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors z-10"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Main Display Image */}
          <div
            className="relative w-full max-w-4xl h-[70vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[activeImageIndex].src}
              alt={images[activeImageIndex].alt}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>

          {/* Caption footer */}
          {images[activeImageIndex].caption && (
            <div
              className="mt-4 text-center text-white/90 text-small max-w-xl px-4"
              onClick={(e) => e.stopPropagation()}
            >
              {images[activeImageIndex].caption}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
