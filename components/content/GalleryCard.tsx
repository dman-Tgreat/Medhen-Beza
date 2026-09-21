"use client";

import Image from "next/image";
import { Search, Play, Image as ImageIcon } from "lucide-react";
import { CardRoot, CardImageSlot } from "./Card";
import { cn } from "@/lib/utils";

export interface GalleryCardData {
  /** Image or video thumbnail URL */
  src: string;
  alt: string;
  /** "image" renders a zoom/lightbox icon; "video" renders a prominent play button + amber tint */
  type: "image" | "video";
  /** Optional link — lightbox trigger if omitted */
  href?: string;
  /** Video duration label, e.g. "2:34". Displayed only on video variant. */
  duration?: string;
}

export interface GalleryCardProps {
  data: GalleryCardData;
  /** Called when the card is clicked (use for lightbox trigger) */
  onClick?: () => void;
  className?: string;
}

/**
 * GalleryCard — two visually distinct variants:
 *
 * **image**: Clean thumbnail. On hover → translucent dark overlay + magnify icon.
 *            Border transitions to primary-light (inherited from CardRoot).
 *
 * **video**: Amber/dark tinted overlay is always visible (even at rest).
 *            A large white play button sits prominently in the center.
 *            "VIDEO" pill badge in top-right corner.
 *            Duration badge in bottom-right corner.
 *
 * If `src` is empty (e.g. a video without a separate thumbnail), a styled
 * placeholder is shown instead of crashing next/image.
 */
export function GalleryCard({ data, onClick, className }: GalleryCardProps) {
  const isVideo = data.type === "video";

  const handleClick = () => {
    if (onClick) onClick();
    else if (data.href) window.location.href = data.href;
  };

  return (
    <CardRoot
      className={cn(
        "group cursor-pointer select-none",
        isVideo && "border-amber-200",
        className
      )}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={isVideo ? `Play video: ${data.alt}` : `View image: ${data.alt}`}
    >
      <CardImageSlot aspect="aspect-square">
        {/* Thumbnail — only rendered when a valid src URL exists */}
        {data.src ? (
          <Image
            src={data.src}
            alt={data.alt}
            fill
            className={cn(
              "object-cover transition-transform duration-500",
              isVideo ? "group-hover:scale-[1.02]" : "group-hover:scale-[1.06]"
            )}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          /* Placeholder gradient when no thumbnail is available */
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center",
              isVideo
                ? "bg-gradient-to-br from-amber-900/80 via-amber-700/60 to-amber-900/80"
                : "bg-gradient-to-br from-primary-light via-secondary-light to-primary-light"
            )}
          >
            {isVideo ? (
              <Play className="w-10 h-10 text-white/70" aria-hidden />
            ) : (
              <ImageIcon className="w-10 h-10 text-primary/40" aria-hidden />
            )}
          </div>
        )}

        {isVideo ? (
          /* ── Video overlay — always visible ── */
          <>
            {/* Amber-tinted dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-amber-900/70 via-amber-800/30 to-transparent" />

            {/* VIDEO badge — top right */}
            <div className="absolute top-3 right-3 flex items-center gap-1 rounded-sm bg-amber-500 px-2 py-0.5 shadow-sm">
              <Play className="w-2.5 h-2.5 text-white fill-white" aria-hidden />
              <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                Video
              </span>
            </div>

            {/* Large play button — center */}
            <div
              className={cn(
                "absolute inset-0 flex items-center justify-center",
                "transition-transform duration-250",
                "group-hover:scale-110"
              )}
            >
              <div className="w-14 h-14 rounded-full bg-white/95 shadow-modal flex items-center justify-center">
                <Play className="w-6 h-6 text-amber-600 fill-amber-600 translate-x-0.5" aria-hidden />
              </div>
            </div>

            {/* Duration badge — bottom right */}
            {data.duration && (
              <span className="absolute bottom-3 right-3 rounded-sm bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                {data.duration}
              </span>
            )}
          </>
        ) : (
          /* ── Image overlay — only on hover ── */
          <>
            <div
              className={cn(
                "absolute inset-0 bg-text/40",
                "opacity-0 transition-opacity duration-250",
                "group-hover:opacity-100"
              )}
            />
            {/* Magnify icon */}
            <div
              className={cn(
                "absolute inset-0 flex items-center justify-center",
                "opacity-0 transition-[opacity,transform] duration-250",
                "group-hover:opacity-100 group-hover:scale-100",
                "scale-90"
              )}
            >
              <div className="w-11 h-11 rounded-full bg-white/90 shadow-modal flex items-center justify-center">
                <Search className="w-5 h-5 text-text" aria-hidden />
              </div>
            </div>

            {/* IMAGE type indicator — subtle, bottom-left */}
            <div
              className={cn(
                "absolute bottom-3 left-3 flex items-center gap-1",
                "opacity-0 transition-opacity duration-250 group-hover:opacity-100"
              )}
            >
              <div className="rounded-sm bg-black/60 px-1.5 py-0.5 flex items-center gap-1">
                <ImageIcon className="w-2.5 h-2.5 text-white" aria-hidden />
                <span className="text-[10px] font-semibold text-white uppercase tracking-wide">
                  Photo
                </span>
              </div>
            </div>
          </>
        )}
      </CardImageSlot>
    </CardRoot>
  );
}


