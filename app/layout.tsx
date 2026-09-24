import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { SITE_URL } from "@/lib/seo";
import { getPublicSiteSettings } from "@/lib/queries/public";
import { isValidLocale, DEFAULT_LOCALE, type SupportedLocale } from "@/lib/i18n/config";

export async function generateMetadata(): Promise<Metadata> {
  const headerList = await headers();
  const rawLocale = headerList.get("x-locale");
  const locale: SupportedLocale = rawLocale && isValidLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const settings = await getPublicSiteSettings(locale);
  const siteTitle = settings.seoTitle || `${settings.hospitalName} | ${settings.tagline}`;
  const siteDesc = settings.seoDescription || settings.description;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: siteTitle,
      template: `%s | ${settings.hospitalName}`,
    },
    description: siteDesc,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        am: "/am",
        om: "/om",
      },
    },
    openGraph: {
      type: "website",
      siteName: settings.hospitalName,
      title: siteTitle,
      description: siteDesc,
      url: `${SITE_URL}/${locale}`,
    },
    twitter: { card: "summary" },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerList = await headers();
  const rawLocale = headerList.get("x-locale");
  const locale: SupportedLocale = rawLocale && isValidLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  return (
    <html lang={locale} className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col bg-background text-text font-sans">
        {children}
      </body>
    </html>
  );
}
