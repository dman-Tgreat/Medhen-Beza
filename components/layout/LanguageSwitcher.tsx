"use client";

import React, { useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Globe, ChevronDown, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LOCALES, LOCALE_METADATA, type SupportedLocale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  currentLocale: SupportedLocale;
  className?: string;
  variant?: "desktop" | "mobile";
}

export function LanguageSwitcher({
  currentLocale,
  className,
  variant = "desktop",
}: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLocaleChange = (newLocale: SupportedLocale) => {
    if (newLocale === currentLocale) return;

    // Set persistence cookie (1 year expiry)
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;

    // Compute new pathname
    let newPath = pathname;
    const currentPrefixRegex = new RegExp(`^/(${LOCALES.join("|")})(/|$)`);
    if (currentPrefixRegex.test(pathname)) {
      newPath = pathname.replace(currentPrefixRegex, `/${newLocale}$2`);
    } else {
      newPath = `/${newLocale}${pathname}`;
    }

    startTransition(() => {
      router.push(newPath);
      router.refresh();
    });
  };

  const currentMeta = LOCALE_METADATA[currentLocale] || LOCALE_METADATA.en;

  if (variant === "mobile") {
    return (
      <div className={cn("space-y-1.5", className)}>
        <div className="text-xs font-semibold uppercase tracking-wider text-text-muted px-2 flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-primary" />
          <span>Language / ቋንቋ / Afaan</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {LOCALES.map((localeCode) => {
            const meta = LOCALE_METADATA[localeCode];
            const isSelected = localeCode === currentLocale;
            return (
              <button
                key={localeCode}
                type="button"
                onClick={() => handleLocaleChange(localeCode)}
                disabled={isPending}
                className={cn(
                  "flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all",
                  isSelected
                    ? "border-primary bg-primary-light text-primary font-semibold shadow-xs"
                    : "border-border bg-surface text-text hover:bg-background hover:border-text-light/30"
                )}
              >
                <span className="text-sm font-medium">{meta.nativeName}</span>
                <span className="text-[10px] text-text-muted uppercase tracking-wider mt-0.5">
                  {meta.code}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={isPending}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-surface/80 hover:bg-surface text-sm font-medium text-text transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
          className
        )}
        aria-label="Change language"
      >
        <Globe className="w-4 h-4 text-primary shrink-0" />
        <span className="hidden sm:inline font-medium text-xs tracking-wide">
          {currentMeta.nativeName}
        </span>
        <span className="sm:hidden font-semibold text-xs uppercase">
          {currentMeta.code}
        </span>
        <ChevronDown className="w-3 h-3 opacity-60 ml-0.5" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={6}
        className="w-44 rounded-xl border border-border bg-surface shadow-dropdown p-1 z-50"
      >
        {LOCALES.map((localeCode) => {
          const meta = LOCALE_METADATA[localeCode];
          const isSelected = localeCode === currentLocale;
          return (
            <DropdownMenuItem
              key={localeCode}
              onClick={() => handleLocaleChange(localeCode)}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors",
                isSelected
                  ? "bg-primary-light text-primary font-semibold"
                  : "text-text hover:bg-background"
              )}
            >
              <div className="flex items-center gap-2">
                <span>{meta.nativeName}</span>
                <span className="text-[10px] text-text-muted uppercase font-mono">
                  ({meta.code})
                </span>
              </div>
              {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
