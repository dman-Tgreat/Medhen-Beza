import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  /** Omit href for the current (active) page. */
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Breadcrumbs — renders "Home / Section / Current Page" navigation.
 *
 * Usage (on a Doctor profile page):
 *   <Breadcrumbs items={[{ label: "Doctors", href: "/doctors" }, { label: "Dr. Abebe Example" }]} />
 *
 * "Home" is always auto-prepended. Pass items without a Home entry.
 * The last item (no href) is the current page and is styled as active.
 */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center flex-wrap gap-0.5 text-sm", className)}
    >
      <ol className="flex items-center flex-wrap gap-0.5 list-none p-0 m-0">
        {/* Home */}
        <li className="flex items-center gap-0.5">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-1 px-1 py-0.5 rounded-sm",
              "text-text-muted hover:text-primary transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
            )}
          >
            <Home className="w-3.5 h-3.5 shrink-0" aria-hidden />
            <span>Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-0.5">
              <ChevronRight
                className="w-3.5 h-3.5 text-border shrink-0"
                aria-hidden
              />
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={cn(
                    "px-1 py-0.5 rounded-sm",
                    "text-text-muted hover:text-primary transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className="px-1 py-0.5 font-semibold text-text"
                  aria-current="page"
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
