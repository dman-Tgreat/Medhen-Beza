import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/Hero";
import { getPublicPageBySlug, getPublicSiteSettings } from "@/lib/queries/public";
import { contentMetadata } from "@/lib/seo";
import { Clock, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";
import { ContentStatus } from "@prisma/client";
import { LOCALES, isSupportedLocale, DEFAULT_LOCALE, type SupportedLocale } from "@/lib/i18n/config";

interface StaticPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export const dynamic = "force-dynamic";

// Reserved routes that have their own dedicated folders in app/[locale]/(public)
const RESERVED_SLUGS = new Set([
  "about",
  "careers",
  "contact",
  "departments",
  "doctors",
  "emergency",
  "events",
  "facilities",
  "faqs",
  "gallery",
  "news",
  "services",
  "admin",
  "api",
]);

export async function generateStaticParams() {
  try {
    const pages = await db.page.findMany({
      where: { status: ContentStatus.PUBLISHED },
      select: { slug: true },
    });
    const validPages = pages
      .map((p) => p.slug.replace(/^\/+/, ""))
      .filter((slug) => !RESERVED_SLUGS.has(slug));

    return LOCALES.flatMap((locale) =>
      validPages.map((slug) => ({
        locale,
        slug,
      }))
    );
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: StaticPageProps): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  if (RESERVED_SLUGS.has(slug)) {
    return {};
  }
  const locale: SupportedLocale = isSupportedLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const page = await getPublicPageBySlug(slug, locale);
  if (!page) {
    return { title: "Page Not Found" };
  }

  return contentMetadata({
    title: page.metaTitle || page.title,
    description: page.metaDescription || page.excerpt || undefined,
    path: `/${locale}/${slug}`,
  });
}

export default async function StaticPage({ params }: StaticPageProps) {
  const { locale: rawLocale, slug } = await params;

  if (RESERVED_SLUGS.has(slug)) {
    notFound();
  }
  const locale: SupportedLocale = isSupportedLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const [page, settings] = await Promise.all([
    getPublicPageBySlug(slug, locale),
    getPublicSiteSettings(locale),
  ]);

  if (!page) {
    notFound();
  }

  // Parse paragraphs or formatted markdown-like text
  const paragraphs = page.content.split("\n\n").filter(Boolean);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 1. PageHero */}
      <PageHero
        eyebrow="Hospital Information"
        title={page.title}
        description={page.excerpt || undefined}
        breadcrumbs={[{ label: page.title }]}
      />

      {/* 2. Page Content */}
      <main className="layout-container py-12 lg:py-16 max-w-4xl mx-auto space-y-8">
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-10 shadow-xs space-y-6">
          <div className="flex items-center gap-3 text-xs text-text-muted border-b border-border/70 pb-4">
            <span className="flex items-center gap-1.5 font-medium text-primary">
              <ShieldCheck className="h-4 w-4" />
              Official Institutional Policy
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              Last Updated: {page.updatedAt ? new Date(page.updatedAt).toLocaleDateString() : "Recently"}
            </span>
          </div>

          {/* Formatted body content */}
          <div className="space-y-4 text-base text-text/90 leading-relaxed font-sans">
            {paragraphs.map((para, idx) => {
              const trimmed = para.trim();

              if (trimmed.startsWith("## ")) {
                return (
                  <h2
                    key={idx}
                    className="text-xl sm:text-2xl font-bold text-text pt-4 pb-1 border-b border-border/40"
                  >
                    {trimmed.replace(/^##\s+/, "")}
                  </h2>
                );
              }

              if (trimmed.startsWith("# ")) {
                return (
                  <h1 key={idx} className="text-2xl sm:text-3xl font-bold text-text pt-4 pb-1">
                    {trimmed.replace(/^#\s+/, "")}
                  </h1>
                );
              }

              if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                const listItems = trimmed.split("\n").filter(Boolean);
                return (
                  <ul key={idx} className="list-disc pl-6 space-y-2 text-text/85 my-3">
                    {listItems.map((item, i) => (
                      <li key={i}>{item.replace(/^[-*]\s*/, "")}</li>
                    ))}
                  </ul>
                );
              }

              return (
                <p key={idx} className="text-text/90 leading-relaxed">
                  {trimmed}
                </p>
              );
            })}
          </div>

          {/* Helpdesk Notice */}
          <div className="pt-6 border-t border-border/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-text-muted">
            <p>
              Questions regarding this document? Contact our administrative desk at{" "}
              <strong className="text-text">{settings.email}</strong>.
            </p>
            <Link
              href={`/${locale}/contact`}
              className="font-semibold text-primary hover:text-primary-dark underline"
            >
              Contact Administration
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
