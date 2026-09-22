import Link from "next/link";
import Image from "next/image";
import { Building2, ArrowRight } from "lucide-react";
import { CardRoot, CardImageSlot, CardBody, CardLink } from "./Card";
import { cn } from "@/lib/utils";

export interface FacilityCardData {
  image?: string;
  imageAlt?: string;
  name: string;
  description?: string;
  location?: string;
  /** Route to the facility detail page */
  href: string;
}

export interface FacilityCardProps {
  data: FacilityCardData;
  className?: string;
  featured?: boolean;
}

/**
 * FacilityCard — image-forward, responsive facility showcase card.
 * When featured=true, renders a full-bleed visual showcase card filling parent height.
 * When featured=false (default), renders a compact card with image and explore link.
 */
export function FacilityCard({ data, className, featured = false }: FacilityCardProps) {
  if (featured) {
    return (
      <CardRoot
        className={cn(
          "group relative flex flex-col justify-end overflow-hidden",
          "min-h-[360px] lg:min-h-full",
          className
        )}
      >
        {/* Full-bleed background image */}
        {data.image ? (
          <Image
            src={data.image}
            alt={data.imageAlt ?? data.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            sizes="(max-width: 1024px) 100vw, 66vw"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-secondary flex items-center justify-center">
            <Building2 className="w-16 h-16 text-white/40" strokeWidth={1} />
          </div>
        )}

        {/* Gradient overlay for contrast & readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-text/95 via-text/40 to-transparent pointer-events-none" />

        {/* Entire card click target */}
        <Link
          href={data.href}
          className="absolute inset-0 z-10"
          aria-label={`Explore ${data.name}`}
        />

        {/* Floating content */}
        <div className="relative z-20 p-6 sm:p-8 space-y-3 text-white pointer-events-none">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-caption font-bold uppercase tracking-wider text-white">
            <Building2 className="w-3.5 h-3.5 text-secondary-light" />
            {data.location || "Featured Facility"}
          </div>

          <h3 className="text-h3 sm:text-h2 font-bold text-white leading-tight">
            {data.name}
          </h3>

          {data.description && (
            <p className="text-small text-white/85 line-clamp-2 max-w-xl leading-relaxed">
              {data.description}
            </p>
          )}

          <div className="pt-2">
            <span className="inline-flex items-center gap-2 rounded-md bg-white text-primary px-5 py-2.5 text-small font-bold transition-all duration-200 group-hover:bg-primary-light">
              Explore Facility
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </CardRoot>
    );
  }

  return (
    <CardRoot className={cn("group", className)}>
      {/* Image */}
      <CardImageSlot aspect="aspect-[4/3]">
        {data.image ? (
          <Image
            src={data.image}
            alt={data.imageAlt ?? data.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-secondary-light to-primary-light flex items-center justify-center">
            <Building2 className="w-12 h-12 text-secondary/40" strokeWidth={1} />
          </div>
        )}

        {/* Bottom gradient + floating name */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-text/80 via-text/30 to-transparent px-4 pt-8 pb-3">
          <h3 className="text-h4 font-bold text-white leading-snug drop-shadow">
            {data.name}
          </h3>
        </div>
      </CardImageSlot>

      <CardBody className="pt-3 pb-4 gap-1.5">
        <CardLink href={data.href} label="Explore facility" />
      </CardBody>
    </CardRoot>
  );
}
