import Image from "next/image";
import { CalendarDays, Newspaper } from "lucide-react";
import { CardRoot, CardImageSlot, CardBody, CardLink } from "./Card";
import { cn } from "@/lib/utils";

export interface NewsCardData {
  image?: string;
  imageAlt?: string;
  /** e.g. "Cardiology", "Hospital News" */
  category: string;
  /** Human-readable date string, e.g. "September 8, 2026" */
  date: string;
  title: string;
  /** Route to the full article */
  href: string;
}

export interface NewsCardProps {
  data: NewsCardData;
  className?: string;
}

/**
 * NewsCard — category badge, date, article title, "Read more →" link.
 * Image-top layout with horizontal meta row beneath.
 */
export function NewsCard({ data, className }: NewsCardProps) {
  return (
    <CardRoot className={cn("group", className)}>
      {/* Thumbnail */}
      <CardImageSlot aspect="aspect-[16/9]">
        {data.image ? (
          <Image
            src={data.image}
            alt={data.imageAlt ?? data.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-light to-secondary-light flex items-center justify-center">
            <Newspaper className="w-10 h-10 text-primary/30" strokeWidth={1} />
          </div>
        )}

        {/* Category badge — overlaid on image */}
        <span className="absolute top-3 left-3 rounded-sm bg-primary px-2.5 py-0.5 text-caption font-semibold text-white uppercase tracking-wide shadow-sm">
          {data.category}
        </span>
      </CardImageSlot>

      <CardBody>
        {/* Date row */}
        <div className="flex items-center gap-1.5 text-caption text-text-muted">
          <CalendarDays className="w-3.5 h-3.5 shrink-0" aria-hidden />
          <time>{data.date}</time>
        </div>

        {/* Title */}
        <h3 className="text-h4 font-semibold text-text leading-snug line-clamp-3 flex-1">
          {data.title}
        </h3>

        <CardLink href={data.href} label="Read more" className="mt-auto" />
      </CardBody>
    </CardRoot>
  );
}
