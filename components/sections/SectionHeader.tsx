import Link from "next/link";
import { cn } from "@/lib/utils";

export interface SectionHeaderProps {
  /** Small text rendered above the title (e.g. "Our Services") */
  eyebrow?: string;
  /** Primary section heading — rendered as <h2> */
  title: string;
  /** Optional supporting paragraph beneath the title */
  description?: string;
  /** If provided, renders a "View all →" link flush-right on desktop */
  viewAllHref?: string;
  /** Label for the view-all link. Defaults to "View all" */
  viewAllLabel?: string;
  /** Text alignment. Defaults to "center" */
  align?: "left" | "center";
  className?: string;
}

/**
 * SectionHeader — used at the top of every homepage section.
 *
 * When `viewAllHref` is provided, the heading row becomes a flex row
 * with the "View all →" link pushed to the right on md+ screens.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  viewAllHref,
  viewAllLabel = "View all",
  align = "center",
  className,
}: SectionHeaderProps) {
  const centered = align === "center";

  return (
    <div className={cn("space-y-3", centered && "text-center", className)}>
      {/* Eyebrow */}
      {eyebrow && (
        <p
          className={cn(
            "text-caption font-semibold uppercase tracking-widest text-secondary",
            centered && "mx-auto"
          )}
        >
          {eyebrow}
        </p>
      )}

      {/* Heading row — flex when viewAll link is present */}
      <div
        className={cn(
          "flex items-end gap-4",
          centered
            ? "flex-col items-center sm:flex-row sm:items-end sm:justify-center"
            : "justify-between"
        )}
      >
        <h2
          className={cn(
            "text-h2 font-bold tracking-tight text-text",
            centered && "mx-auto"
          )}
        >
          {title}
        </h2>

        {viewAllHref && (
          <Link
            href={viewAllHref}
            className={cn(
              "group shrink-0 inline-flex items-center gap-1",
              "text-small font-semibold text-primary",
              "transition-[gap] duration-200 hover:gap-2",
              "focus-visible:outline-none focus-visible:underline",
              // On centered layout push below on small screens
              centered && "sm:pb-1"
            )}
          >
            {viewAllLabel}
            <svg
              aria-hidden
              className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
        )}
      </div>

      {/* Description */}
      {description && (
        <p
          className={cn(
            "text-body text-text-muted leading-relaxed",
            centered && "max-w-2xl mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
