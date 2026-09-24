import type { SupportedLocale } from "./config";

/**
 * Universal entity localizer with strict English fallback
 *
 * If the entity has a JSON translations object containing overrides for `locale`,
 * the specified fields are replaced with their translated equivalents.
 * If a translation field is empty or missing, the base English value is preserved.
 */
export function localizeEntity<T extends Record<string, any>>(
  entity: T | null | undefined,
  locale: SupportedLocale,
  translatableFields: (keyof T)[]
): T {
  if (!entity) return entity as unknown as T;
  if (locale === "en" || !entity.translations) return entity;

  let translations: Record<string, any> | undefined;
  if (typeof entity.translations === "string") {
    try {
      translations = JSON.parse(entity.translations);
    } catch {
      translations = undefined;
    }
  } else if (typeof entity.translations === "object") {
    translations = entity.translations;
  }

  const localeOverrides = translations?.[locale];
  if (!localeOverrides || typeof localeOverrides !== "object") {
    return entity;
  }

  const localized = { ...entity };
  for (const field of translatableFields) {
    const override = localeOverrides[field as string];
    if (override !== undefined && override !== null) {
      if (typeof override === "string" && override.trim().length > 0) {
        (localized as any)[field] = override;
      } else if (Array.isArray(override) && override.length > 0) {
        (localized as any)[field] = override;
      }
    }
  }

  return localized;
}

/**
 * Localize an array of entities
 */
export function localizeEntityList<T extends Record<string, any>>(
  entities: T[],
  locale: SupportedLocale,
  translatableFields: (keyof T)[]
): T[] {
  if (!entities || !Array.isArray(entities)) return [];
  if (locale === "en") return entities;
  return entities.map((item) => localizeEntity(item, locale, translatableFields));
}

/**
 * Formats dates localized according to the current language
 */
export function formatLocalizedDate(
  dateInput: string | Date | number,
  locale: SupportedLocale,
  options?: Intl.DateTimeFormatOptions
): string {
  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return String(dateInput);

    const localeCodeMap: Record<SupportedLocale, string> = {
      en: "en-US",
      am: "am-ET",
      om: "om-ET",
    };

    const defaultOptions: Intl.DateTimeFormatOptions = options || {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    return new Intl.DateTimeFormat(localeCodeMap[locale] || "en-US", defaultOptions).format(date);
  } catch {
    return String(dateInput);
  }
}
