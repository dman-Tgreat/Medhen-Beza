"use client";

import React, { createContext, useContext, useMemo } from "react";
import type { SupportedLocale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

interface I18nContextType {
  locale: SupportedLocale;
  dictionary: Dictionary;
  t: (path: string, fallback?: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({
  children,
  locale,
  dictionary,
}: {
  children: React.ReactNode;
  locale: SupportedLocale;
  dictionary: Dictionary;
}) {
  const value = useMemo<I18nContextType>(() => {
    return {
      locale,
      dictionary,
      t: (path: string, fallback?: string): string => {
        const parts = path.split(".");
        let current: any = dictionary;
        for (const part of parts) {
          if (current && typeof current === "object" && part in current) {
            current = current[part];
          } else {
            return fallback ?? path;
          }
        }
        return typeof current === "string" ? current : fallback ?? path;
      },
    };
  }, [locale, dictionary]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
