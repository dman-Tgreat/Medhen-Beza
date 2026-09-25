import type { SupportedLocale } from "./config";

export const FIELD_ALIASES: Record<string, string[]> = {
  title: ["name"],
  name: ["title", "fullName"],
  fullName: ["name", "title"],
  summary: ["excerpt", "description"],
  excerpt: ["summary", "description"],
  description: ["summary", "content", "overview"],
  content: ["description", "body", "longDescription"],
  workingHours: ["operatingHours", "hours"],
  operatingHours: ["workingHours", "hours"],
  hours: ["workingHours", "operatingHours"],
  featuredImage: ["coverImage", "image"],
  coverImage: ["featuredImage", "image"],
  image: ["featuredImage", "coverImage"],
  authorName: ["author"],
  author: ["authorName"],
  position: ["title"],
};

export function normalizeTranslations(rawTranslations: any): Record<string, any> | undefined {
  if (!rawTranslations) return undefined;
  let trans = rawTranslations;
  if (typeof trans === "string") {
    try {
      trans = JSON.parse(trans);
    } catch {
      return undefined;
    }
  }
  if (typeof trans !== "object") return undefined;

  const clean: Record<string, any> = {};
  for (const lang of ["am", "om", "en"]) {
    if (trans[lang] && typeof trans[lang] === "object") {
      const langData = { ...trans[lang] };
      // Service normalization
      if (langData.name && !langData.title) langData.title = langData.name;
      if (langData.title && !langData.name) langData.name = langData.title;
      if (langData.summary && !langData.description) langData.description = langData.summary;
      if (langData.description && !langData.summary) langData.summary = langData.description;
      if (langData.description && !langData.content) langData.content = langData.description;

      // Department normalization
      if (langData.operatingHours && !langData.workingHours) langData.workingHours = langData.operatingHours;
      if (langData.workingHours && !langData.operatingHours) langData.operatingHours = langData.workingHours;

      // News normalization
      if (langData.excerpt && !langData.summary) langData.summary = langData.excerpt;
      if (langData.summary && !langData.excerpt) langData.excerpt = langData.summary;
      if (langData.coverImage && !langData.featuredImage) langData.featuredImage = langData.coverImage;
      if (langData.featuredImage && !langData.coverImage) langData.coverImage = langData.featuredImage;

      // Doctor normalization
      if (langData.fullName && !langData.name) langData.name = langData.fullName;
      if (langData.name && !langData.fullName) langData.fullName = langData.name;

      // Career normalization
      if (langData.position && !langData.title) langData.title = langData.position;
      if (langData.title && !langData.position) langData.position = langData.title;

      // Facility normalization
      if (langData.hours && !langData.workingHours) langData.workingHours = langData.hours;
      if (langData.workingHours && !langData.hours) langData.hours = langData.workingHours;
      if (langData.operatingHours && !langData.hours) langData.hours = langData.operatingHours;

      clean[lang] = langData;
    }
  }
  return Object.keys(clean).length > 0 ? clean : undefined;
}

/**
 * Universal entity localizer with strict English fallback and alias resolution
 *
 * If the entity has a JSON translations object containing overrides for `locale`,
 * the specified fields are replaced with their translated equivalents.
 * If a translation field is empty or missing, it checks known aliases before
 * preserving the base English value.
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
    const fieldKey = field as string;
    let override = localeOverrides[fieldKey];

    // Check alias fallbacks if direct field match is missing or empty
    if (
      override === undefined ||
      override === null ||
      (typeof override === "string" && override.trim().length === 0)
    ) {
      const aliases = FIELD_ALIASES[fieldKey] || [];
      for (const alias of aliases) {
        const aliasOverride = localeOverrides[alias];
        if (aliasOverride !== undefined && aliasOverride !== null) {
          if (typeof aliasOverride === "string" && aliasOverride.trim().length > 0) {
            override = aliasOverride;
            break;
          } else if (Array.isArray(aliasOverride) && aliasOverride.length > 0) {
            override = aliasOverride;
            break;
          }
        }
      }
    }

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
