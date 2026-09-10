"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { HeartPulse, Menu, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  PRIMARY_NAV_LINKS,
  MORE_NAV_LINKS,
  CONTACT_NAV_LINK,
} from "@/lib/constants";
import { EmergencyButton } from "@/components/ui/emergency-button";
import { MobileNav } from "@/components/layout/MobileNav";

// ─── Logo ─────────────────────────────────────────────────────────────────────
function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 group shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
      aria-label="Medhen Beza Hospital — home"
    >
      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-cta group-hover:bg-primary-dark transition-colors">
        <HeartPulse className="w-5 h-5" aria-hidden />
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-extrabold text-lg tracking-tight text-text">
          Medhen Beza
        </span>
        <span className="text-[10px] font-semibold text-primary tracking-[0.12em] uppercase">
          Hospital
        </span>
      </div>
    </Link>
  );
}

// ─── Desktop nav link ─────────────────────────────────────────────────────────
interface NavLinkProps {
  href: string;
  name: string;
  pathname: string;
}

function NavLink({ href, name, pathname }: NavLinkProps) {
  const isActive =
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "relative px-1 py-1 text-sm font-medium transition-colors duration-150",
        "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:rounded-full",
        "after:origin-left after:scale-x-0 after:transition-transform after:duration-200",
        "hover:text-primary hover:after:scale-x-100 hover:after:bg-primary",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm",
        isActive
          ? "text-primary font-semibold after:scale-x-100 after:bg-primary"
          : "text-text-muted"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {name}
    </Link>
  );
}

// ─── "More" Dropdown ─────────────────────────────────────────────────────────
function MoreDropdown({ pathname }: { pathname: string }) {
  const isAnyMoreActive = MORE_NAV_LINKS.some((l) =>
    pathname.startsWith(l.href)
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex items-center gap-0.5 px-1 py-1 text-sm font-medium",
          "transition-colors duration-150 rounded-sm",
          "hover:text-primary",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          isAnyMoreActive ? "text-primary font-semibold" : "text-text-muted"
        )}
      >
        More
        <ChevronDown className="w-3.5 h-3.5 opacity-60 transition-transform duration-200 group-data-[state=open]:rotate-180" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        sideOffset={12}
        className="w-48 rounded-xl border border-border bg-surface shadow-dropdown p-1"
      >
        {MORE_NAV_LINKS.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <DropdownMenuItem key={link.href} asChild>
              <Link
                href={link.href}
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium",
                  "transition-colors duration-100 cursor-pointer",
                  "focus-visible:outline-none focus-visible:bg-primary-light",
                  isActive
                    ? "text-primary bg-primary-light"
                    : "text-text-muted hover:text-primary hover:bg-primary-light"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {link.name}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── Header ──────────────────────────────────────────────────────────────────
export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Scroll detection — transition header bg after 80px
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobileNav = useCallback(() => setIsMobileNavOpen(false), []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-surface/95 backdrop-blur-md border-b border-border shadow-nav"
            : "bg-transparent"
        )}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-[72px]">
            {/* Logo — always visible */}
            <Logo />

            {/* Desktop nav — hidden on mobile */}
            <nav
              aria-label="Primary navigation"
              className="hidden lg:flex items-center gap-6"
            >
              {PRIMARY_NAV_LINKS.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  name={link.name}
                  pathname={pathname}
                />
              ))}
              <MoreDropdown pathname={pathname} />
              <NavLink
                href={CONTACT_NAV_LINK.href}
                name={CONTACT_NAV_LINK.name}
                pathname={pathname}
              />
            </nav>

            {/* Right-side actions */}
            <div className="flex items-center gap-3">
              {/* Emergency button — always visible on desktop, hidden on mobile (accessible in drawer) */}
              <EmergencyButton
                className="hidden lg:inline-flex"
                size="default"
              />

              {/* Hamburger — mobile only */}
              <button
                onClick={() => setIsMobileNavOpen((prev) => !prev)}
                aria-expanded={isMobileNavOpen}
                aria-controls="mobile-nav"
                aria-label={
                  isMobileNavOpen ? "Close navigation menu" : "Open navigation menu"
                }
                className={cn(
                  "lg:hidden w-11 h-11 flex items-center justify-center rounded-xl",
                  "transition-colors duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  isScrolled
                    ? "text-text hover:bg-background"
                    : "text-text hover:bg-white/20"
                )}
              >
                <Menu className="w-5 h-5" aria-hidden />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer to prevent content from sitting under fixed header */}
      <div className="h-16 lg:h-[72px]" aria-hidden="true" />

      {/* Mobile Nav Drawer */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={closeMobileNav}
      />
    </>
  );
}
