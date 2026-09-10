import Image from "next/image";
import { CalendarDays } from "lucide-react";
import { CardRoot, CardImageSlot, CardBody, CardLink } from "./Card";
import { cn } from "@/lib/utils";

export interface EventCardData {
  image?: string;
  imageAlt?: string;
  /** Day number, e.g. 15 */
  day: number | string;
  /** Short month label, e.g. "SEP" */
  month: string;
  title: string;
  /** Route to the event detail page */
  href: string;
}

export interface EventCardProps {
  data: EventCardData;
  className?: string;
}

/**
 * EventCard — image top with an overlaid date badge,
 * prominent "15 / SEP" date treatment in the card body.
 */
export function EventCard({ data, className }: EventCardProps) {
  return (
    <CardRoot className={cn("group", className)}>
      {/* Image */}
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
            <CalendarDays className="w-10 h-10 text-primary/30" strokeWidth={1} />
          </div>
        )}

        {/* Date badge — overlaid top-left corner */}
        <div className="absolute top-3 left-3 flex flex-col items-center justify-center rounded-md bg-primary text-white shadow-modal min-w-[56px] px-2 py-1.5 leading-none">
          <span className="text-h4 font-black tabular-nums leading-none">
            {data.day}
          </span>
          <span className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-primary-light">
            {data.month}
          </span>
        </div>
      </CardImageSlot>

      <CardBody>
        {/* Prominent date text */}
        <p className="text-small font-bold text-primary uppercase tracking-wider">
          {data.day}&thinsp;/&thinsp;{data.month}
        </p>

        {/* Title */}
        <h3 className="text-h4 font-semibold text-text leading-snug line-clamp-3 flex-1">
          {data.title}
        </h3>

        <CardLink href={data.href} label="View event" className="mt-auto" />
      </CardBody>
    </CardRoot>
  );
}
