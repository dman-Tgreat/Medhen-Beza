import Image from "next/image";
import { CardRoot, CardImageSlot, CardBody, CardLink } from "./Card";
import { cn } from "@/lib/utils";

export interface DepartmentCardData {
  /** Image URL for the department */
  image: string;
  imageAlt?: string;
  /** Department name */
  name: string;
  /** Short description — 1-2 sentences */
  description: string;
  /** Route to the department page */
  href: string;
}

export interface DepartmentCardProps {
  data: DepartmentCardData;
  className?: string;
}

/**
 * DepartmentCard — image-top card for a hospital department.
 * Image slides in subtly on hover (scale transform on inner img).
 */
export function DepartmentCard({ data, className }: DepartmentCardProps) {
  return (
    <CardRoot className={cn("group", className)}>
      {/* Image */}
      <CardImageSlot aspect="aspect-[16/9]">
        {data.image ? (
          <Image
            src={data.image}
            alt={data.imageAlt ?? data.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          /* Placeholder */
          <div className="absolute inset-0 bg-gradient-to-br from-secondary-light to-primary-light flex items-center justify-center">
            <svg
              viewBox="0 0 48 48"
              className="w-12 h-12 text-secondary/40"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <rect x="4" y="12" width="40" height="32" rx="4" />
              <path d="M16 12V8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v4" />
              <path d="M24 24v8M20 28h8" />
            </svg>
          </div>
        )}
      </CardImageSlot>

      <CardBody>
        <h3 className="text-h4 font-semibold text-text leading-snug">
          {data.name}
        </h3>
        <p className="text-small text-text-muted leading-relaxed flex-1 line-clamp-3">
          {data.description}
        </p>
        <CardLink href={data.href} label="View Department" className="mt-auto" />
      </CardBody>
    </CardRoot>
  );
}
