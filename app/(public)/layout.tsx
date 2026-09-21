import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getPublicSiteSettings } from "@/lib/queries/public";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getPublicSiteSettings();

  return (
    <div className="flex flex-col min-h-screen">
      {/*
        Header is fixed-positioned and renders its own spacer div,
        so the page content naturally starts below it without extra padding here.
      */}
      <Header settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </div>
  );
}
