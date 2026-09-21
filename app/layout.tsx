import type { Metadata } from "next";
import "./globals.css";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Medhen Beza Hospital | Compassionate Care & Advanced Medicine",
    template: "%s | Medhen Beza Hospital",
  },
  description:
    "Medhen Beza Hospital in Addis Ababa providing 24/7 emergency response, specialized healthcare services, and advanced clinical care.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Medhen Beza Hospital",
    title: "Medhen Beza Hospital | Compassionate Care & Advanced Medicine",
    description: "Specialized healthcare services and advanced clinical care in Addis Ababa.",
    url: SITE_URL,
  },
  twitter: { card: "summary" },
};

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
