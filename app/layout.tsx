import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Medhen Beza Hospital | Compassionate Care & Advanced Medicine",
    template: "%s | Medhen Beza Hospital",
  },
  description:
    "Medhen Beza Hospital in Addis Ababa providing 24/7 emergency response, specialized healthcare services, and advanced clinical care.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className={`${inter.className} min-h-full flex flex-col bg-slate-50 text-slate-900`}>
        {children}
      </body>
    </html>
  );
}
