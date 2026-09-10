"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { MOBILE_NAV_LINKS } from "@/lib/constants";
import { EmergencyButton } from "@/components/ui/emergency-button";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // Close on route change
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Focus first nav link for keyboard users
      firstLinkRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-text/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={cn(
          "fixed top-0 right-0 bottom-0 z-50 w-[min(320px,90vw)]",
          "bg-surface flex flex-col shadow-modal",
          "transition-transform duration-300 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <span className="font-bold text-base text-text tracking-tight">
            Navigation
          </span>
          <button
            onClick={onClose}
            aria-label="Close navigation menu"
            className={cn(
              "w-10 h-10 flex items-center justify-center rounded-lg",
              "text-text-muted hover:text-text hover:bg-background transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            )}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav links — scrollable */}
        <nav
          aria-label="Mobile navigation"
          className="flex-1 overflow-y-auto px-4 py-4"
        >
          <ul className="flex flex-col gap-1">
            {MOBILE_NAV_LINKS.map((link, i) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    ref={i === 0 ? firstLinkRef : undefined}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium",
                      "transition-colors duration-150",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset",
                      isActive
                        ? "bg-primary-light text-primary font-semibold"
                        : "text-text-muted hover:bg-background hover:text-text"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Pinned Emergency action */}
        <div className="px-5 py-5 border-t border-border bg-emergency-light/40">
          <p className="text-xs text-text-muted mb-3 font-medium uppercase tracking-wider">
            24/7 Emergency Care
          </p>
          <EmergencyButton className="w-full justify-center" size="lg" />
        </div>
      </div>
    </>
  );
}
