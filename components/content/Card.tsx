"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

import { useI18n } from "@/components/i18n/I18nProvider";

// ─── Card Root ────────────────────────────────────────────────────────────────

export interface CardRootProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Opt-out of hover lift if the card sits inside an already-interactive parent */
  noHover?: boolean;
}

/**
 * CardRoot — the single visual base for the entire card family.
 *
 * Visual contract (do not deviate in consumer components):
 *   - border: 1px solid var(--border)
 *   - radius: var(--radius-lg) = 16px
 *   - background: var(--surface) = #fff
 *   - hover: translateY(-2px), border-color → primary-light, 250ms ease
 *   - NO box-shadow on hover (borders-first rule)
 */
export const CardRoot = React.forwardRef<HTMLDivElement, CardRootProps>(
  ({ className, noHover = false, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        // Structure
        "relative flex flex-col overflow-hidden h-full",
        "rounded-lg bg-surface border border-border",
        // Hover lift — shared across ALL card types
        !noHover && [
          "transition-[transform,border-color] duration-[250ms] ease-out",
          "hover:-translate-y-0.5 hover:border-primary-light",
        ],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
CardRoot.displayName = "CardRoot";

// ─── Card Image Slot ──────────────────────────────────────────────────────────

export interface CardImageSlotProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Aspect ratio class, e.g. "aspect-video", "aspect-square", "aspect-[4/3]" */
  aspect?: string;
}

/**
 * CardImageSlot — a fixed-size container for card imagery.
 * Children (an <img> or overlay) fill it completely.
 */
export const CardImageSlot = React.forwardRef<HTMLDivElement, CardImageSlotProps>(
  ({ className, aspect = "aspect-[4/3]", children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("relative w-full overflow-hidden bg-primary-light", aspect, className)}
      {...props}
    >
      {children}
    </div>
  )
);
CardImageSlot.displayName = "CardImageSlot";

// ─── Card Body ────────────────────────────────────────────────────────────────

export const CardBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col flex-1 gap-3 p-5", className)}
    {...props}
  >
    {children}
  </div>
));
CardBody.displayName = "CardBody";

// ─── Card Footer ──────────────────────────────────────────────────────────────

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("px-5 pb-5 pt-0", className)}
    {...props}
  >
    {children}
  </div>
));
CardFooter.displayName = "CardFooter";

// ─── CardLink — inline "label →" link used in all cards ──────────────────────

export interface CardLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  label?: string;
}

export const CardLink = React.forwardRef<HTMLAnchorElement, CardLinkProps>(
  ({ label, className, children, ...props }, ref) => {
    const { t } = useI18n();
    const fallbackLabel = t("common.learnMore") || "Learn more";
    const resolvedLabel = label ?? fallbackLabel;

    return (
      <a
        ref={ref}
        className={cn(
          "group/link inline-flex items-center gap-1",
          "text-small font-semibold text-primary",
          "transition-[gap,opacity] duration-200",
          "hover:gap-2 focus-visible:outline-none focus-visible:underline",
          className
        )}
        {...props}
      >
        {children ?? resolvedLabel}
      <svg
        aria-hidden
        className="w-3.5 h-3.5 shrink-0 transition-transform duration-200 group-hover/link:translate-x-0.5"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 8h10M9 4l4 4-4 4" />
      </svg>
    </a>
  );
}
);
CardLink.displayName = "CardLink";
