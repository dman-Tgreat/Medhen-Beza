import Image from "next/image";
import { Building2 } from "lucide-react";
import { CardRoot, CardImageSlot, CardBody, CardLink } from "./Card";
import { cn } from "@/lib/utils";

export interface FacilityCardData {
  image?: string;
  imageAlt?: string;
  name: string;
  /** Route to the facility detail page */
  href: string;
}

export interface FacilityCardProps {
  data: FacilityCardData;
  className?: string;
}

/**
 * FacilityCard — image-forward, minimal text.
 * Name floats over a dark gradient at the bottom of the image.
 * "Explore facility →" link in the body below.
 */
export function FacilityCard({ data, className }: FacilityCardProps) {
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
