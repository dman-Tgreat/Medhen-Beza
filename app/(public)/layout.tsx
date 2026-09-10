import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/*
        Header is fixed-positioned and renders its own spacer div,
        so the page content naturally starts below it without extra padding here.
      */}
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
