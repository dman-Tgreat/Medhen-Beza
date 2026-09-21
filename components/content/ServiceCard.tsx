"use client";

import { Stethoscope, type LucideIcon } from "lucide-react";
import { CardRoot, CardBody, CardLink } from "./Card";
import { cn } from "@/lib/utils";

export interface ServiceCardData {
  /** A Lucide icon component — optional; defaults to Stethoscope when omitted */
  icon?: LucideIcon;
  /** Service name */
  name: string;
  /** One-to-two sentence description */
  description: string;
  /** Route to the service detail page */
  href: string;
}

export interface ServiceCardProps {
  data: ServiceCardData;
  className?: string;
}

/**
 * ServiceCard — icon swatch → name → short description → "Learn more →" link.
 * No image; the icon carries the visual identity of the service.
 * `icon` defaults to Stethoscope when not provided (e.g. from DB data).
 */
export function ServiceCard({ data, className }: ServiceCardProps) {
  const Icon = data.icon ?? Stethoscope;

  return (
    <CardRoot className={cn("group", className)}>
      <CardBody>
        {/* Icon swatch */}
        <div
          className={cn(
            "w-12 h-12 rounded-md flex items-center justify-center shrink-0",
            "bg-primary-light text-primary",
            "transition-colors duration-200",
            "group-hover:bg-primary group-hover:text-white"
          )}
        >
          <Icon className="w-6 h-6" strokeWidth={1.75} aria-hidden />
        </div>

        {/* Name */}
        <h3 className="text-h4 font-semibold text-text leading-snug">
          {data.name}
        </h3>

        {/* Description */}
        <p className="text-small text-text-muted leading-relaxed flex-1">
          {data.description}
        </p>

        {/* CTA */}
        <CardLink href={data.href} label="Learn more" className="mt-auto" />
      </CardBody>
    </CardRoot>
  );
}

// ─── Mock data for local preview ──────────────────────────────────────────────
export const SERVICE_CARD_MOCK: ServiceCardData[] = [
  // imported inline so pages can spread this in when there's no CMS yet
];
