import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  CalendarDays,
  Clock,
  Tag,
  ArrowLeft,
  Newspaper,
} from "lucide-react";
import { PageHero } from "@/components/sections/Hero";
import { Button } from "@/components/ui/button";
import { getPublicNewsBySlug, getPublicNews, getPublicSiteSettings } from "@/lib/queries/public";
import { contentMetadata, absoluteUrl, hospitalReference } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { LOCALES, isSupportedLocale, DEFAULT_LOCALE, type SupportedLocale } from "@/lib/i18n/config";

interface NewsArticlePageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const news = await getPublicNews();
  return LOCALES.flatMap((locale) =>
    news.map((article) => ({
      locale,
      slug: article.slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: NewsArticlePageProps): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale: SupportedLocale = isSupportedLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const [article, settings] = await Promise.all([
    getPublicNewsBySlug(slug, locale),
    getPublicSiteSettings(locale),
  ]);

  if (!article) {
    return {
      title: "Article Not Found",
    };
  }

  return contentMetadata({
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.summary,
    path: `/${locale}/news/${article.slug}`,
    canonicalUrl: article.canonicalUrl,
    image: article.ogImage || article.image,
    type: "article",
    siteName: settings.hospitalName,
  });
}

export default async function NewsArticleDetailPage({
  params,
}: NewsArticlePageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale: SupportedLocale = isSupportedLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const [article, settings, dict] = await Promise.all([
    getPublicNewsBySlug(slug, locale),
    getPublicSiteSettings(locale),
    getDictionary(locale),
  ]);

  if (!article) {
    notFound();
  }

  const allNews = await getPublicNews(locale);
  const relatedNews = allNews
    .filter((n) => n.slug !== article.slug)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background pb-20">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.summary,
          url: absoluteUrl(`/${locale}/news/${article.slug}`),
          image: article.image ? absoluteUrl(article.image) : undefined,
          author: { "@type": "Organization", name: settings.hospitalName },
          publisher: hospitalReference(settings.hospitalName),
        }}
      />
      <PageHero
        title={article.title}
        description={`Published on ${article.date} · ${article.readTime}`}
        badge={article.category}
        breadcrumbs={[
          { label: dict.nav?.news || "News", href: `/${locale}/news` },
          { label: article.title },
        ]}
      />

      <div className="container mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Article Main Body */}
          <main className="lg:col-span-8 space-y-8">
            <article className="bg-surface rounded-2xl border border-border p-6 sm:p-10 shadow-sm space-y-6">
              {/* Featured Image */}
              {article.image && (
                <div className="relative h-[260px] sm:h-[400px] w-full rounded-xl overflow-hidden border border-border">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              {/* Author & Read Time Header */}
              <div className="flex items-center justify-between border-b border-border pb-4 text-small text-text-muted">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden border border-border bg-background">
                    {article.author.photo ? (
                      <Image
                        src={article.author.photo}
                        alt={article.author.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-primary-light flex items-center justify-center font-bold text-xs text-primary">
                        {article.author.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="font-semibold text-text block">{article.author.name}</span>
                    <span className="text-caption text-text-light">{article.author.role}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-caption">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {article.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {article.readTime}
                  </span>
                </div>
              </div>

              {/* Executive Summary Quote Callout */}
              <div className="rounded-xl border-l-4 border-primary bg-primary-light/40 p-4 sm:p-5">
                <p className="text-small font-medium text-text italic leading-relaxed">
                  &ldquo;{article.summary}&rdquo;
                </p>
              </div>

              {/* Article Content */}
              <div className="text-body text-text-muted leading-relaxed space-y-4">
                {article.contentParagraphs.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="border-t border-border pt-6 flex flex-wrap items-center gap-2">
                  <Tag className="h-4 w-4 text-text-light" />
                  {article.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-pill bg-background border border-border text-caption font-medium text-text"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </article>

            {/* Back link */}
            <div>
              <Button asChild variant="outline" size="sm">
                <Link href={`/${locale}/news`} className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" /> {dict.common?.back || "Back to News Index"}
                </Link>
              </Button>
            </div>
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Related News */}
            {relatedNews.length > 0 && (
              <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm space-y-4">
                <h3 className="text-h4 font-bold text-text flex items-center gap-2">
                  <Newspaper className="h-5 w-5 text-primary" />
                  {dict.news?.relatedArticles || "Related News"}
                </h3>
                <div className="space-y-4">
                  {relatedNews.map((item) => (
                    <div key={item.slug} className="border-b border-border pb-4 last:border-0 last:pb-0 space-y-1">
                      <span className="text-caption font-semibold text-secondary uppercase">
                        {item.category}
                      </span>
                      <h4 className="text-small font-bold text-text hover:text-primary transition-colors line-clamp-2">
                        <Link href={`/${locale}/news/${item.slug}`}>{item.title}</Link>
                      </h4>
                      <span className="text-caption text-text-light block">{item.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
