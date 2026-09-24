import type { SupportedLocale } from "./config";
import { DEFAULT_LOCALE } from "./config";

const dictionaries = {
  en: () => import("./dictionaries/en.json").then((m) => m.default),
  am: () => import("./dictionaries/am.json").then((m) => m.default),
  om: () => import("./dictionaries/om.json").then((m) => m.default),
};

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["en"]>>;

export async function getDictionary(locale: SupportedLocale): Promise<Dictionary> {
  const loader = dictionaries[locale] || dictionaries[DEFAULT_LOCALE];
  return loader();
}
