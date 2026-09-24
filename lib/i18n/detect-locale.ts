import { SupportedLocale, DEFAULT_LOCALE, LOCALES, isValidLocale } from "./config";

/**
 * Parses browser's Accept-Language header to determine the best matching supported locale.
 * Supported locales: 'en' (English), 'am' (Amharic), 'om' (Afan Oromo).
 */
export function detectBrowserLocale(acceptLanguageHeader: string | null | undefined): SupportedLocale {
  if (!acceptLanguageHeader) {
    return DEFAULT_LOCALE;
  }

  // Parse accept-language header: e.g. "am-ET,am;q=0.9,en-US;q=0.8,en;q=0.7"
  const preferences = acceptLanguageHeader
    .split(",")
    .map((part) => {
      const [langTag, qPart] = part.trim().split(";q=");
      const q = qPart ? parseFloat(qPart) : 1.0;
      return {
        tag: langTag.trim().toLowerCase(),
        q: isNaN(q) ? 0 : q,
      };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of preferences) {
    // Check exact matches or prefixes
    if (tag.startsWith("am") || tag.includes("ethiopic")) {
      return "am";
    }
    if (tag.startsWith("om") || tag.startsWith("gaz") || tag.includes("oromo")) {
      return "om";
    }
    if (tag.startsWith("en")) {
      return "en";
    }
  }

  return DEFAULT_LOCALE;
}
