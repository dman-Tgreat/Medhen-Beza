export const LOCALES = ["en", "am", "om"] as const;
export type SupportedLocale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: SupportedLocale = "en";

export interface LocaleMeta {
  code: SupportedLocale;
  name: string;
  nativeName: string;
  flag: string;
  script: "Latin" | "Ethiopic";
  direction: "ltr";
}

export const LOCALE_METADATA: Record<SupportedLocale, LocaleMeta> = {
  en: {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇺🇸",
    script: "Latin",
    direction: "ltr",
  },
  am: {
    code: "am",
    name: "Amharic",
    nativeName: "አማርኛ",
    flag: "🇪🇹",
    script: "Ethiopic",
    direction: "ltr",
  },
  om: {
    code: "om",
    name: "Afan Oromo",
    nativeName: "Afaan Oromoo",
    flag: "🇪🇹",
    script: "Latin",
    direction: "ltr",
  },
};

export function isValidLocale(locale: string): locale is SupportedLocale {
  return LOCALES.includes(locale as SupportedLocale);
}

export const isSupportedLocale = isValidLocale;
