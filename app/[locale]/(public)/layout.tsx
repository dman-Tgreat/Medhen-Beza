import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getPublicSiteSettings } from "@/lib/queries/public";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { I18nProvider } from "@/components/i18n/I18nProvider";
import { isValidLocale, DEFAULT_LOCALE, LOCALES, type SupportedLocale } from "@/lib/i18n/config";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function PublicLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await props.params;
  const locale: SupportedLocale = isValidLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const [dictionary, settings] = await Promise.all([
    getDictionary(locale),
    getPublicSiteSettings(locale),
  ]);

  return (
    <I18nProvider locale={locale} dictionary={dictionary}>
      <div className="flex flex-col min-h-screen">
        {/*
          Header is fixed-positioned and renders its own spacer div,
          so the page content naturally starts below it without extra padding here.
        */}
        <Header settings={settings} currentLocale={locale} />
        <main className="flex-1">{props.children}</main>
        <Footer settings={settings} currentLocale={locale} />
      </div>
    </I18nProvider>
  );
}
