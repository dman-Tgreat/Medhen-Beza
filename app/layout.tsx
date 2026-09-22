import type { Metadata } from "next";
import "./globals.css";
import { SITE_URL } from "@/lib/seo";
import { getPublicSiteSettings } from "@/lib/queries/public";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSiteSettings();
  const siteTitle = settings.seoTitle || `${settings.hospitalName} | ${settings.tagline}`;
  const siteDesc = settings.seoDescription || settings.description;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: siteTitle,
      template: `%s | ${settings.hospitalName}`,
    },
    description: siteDesc,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      siteName: settings.hospitalName,
      title: siteTitle,
      description: siteDesc,
      url: SITE_URL,
    },
    twitter: { card: "summary" },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col bg-background text-text font-sans">
        {children}
      </body>
    </html>
  );
}
