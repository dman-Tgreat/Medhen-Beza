import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  CalendarDays,
  Clock,
  UserCircle2,
  Tag,
  ArrowRight,
  ArrowLeft,
  Quote,
  CheckCircle2,
  Share2,
  Newspaper,
} from "lucide-react";
import { PageHero } from "@/components/sections/Hero";
import { NewsCard } from "@/components/content/NewsCard";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import {
  getNewsBySlug,
  getRelatedNews,
  MOCK_NEWS_DETAILED,
} from "@/lib/mock-data";

interface NewsArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return MOCK_NEWS_DETAILED.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: NewsArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getNewsBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found | Medhen Beza Hospital",
    };
  }

  return {
    title: `${article.title} | Medhen Beza Hospital News`,
    description: article.summary,
  };
}

export default async function NewsArticleDetailPage({
  params,
}: NewsArticlePageProps) {
  const { slug } = await params;
  const article = getNewsBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedNews(article.slug, article.category, 3);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 1. PageHero with Breadcrumbs */}
      <PageHero
        eyebrow={article.category}
        title={article.title}
        description={`Published on ${article.date} · ${article.readTime}`}
        breadcrumbs={[
          { label: "News & Blog", href: "/news" },
          { label: article.title },
        ]}
      />

      <main className="layout-container pt-10 space-y-16 max-w-4xl mx-auto">
        {/* 2. Article Header Meta & Featured Banner */}
        <article className="space-y-8">
          {/* Author & Meta Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-lg bg-surface border border-border">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold shrink-0">
                <UserCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-small font-bold text-text">
                  {article.author.name}
                </p>
                <p className="text-caption text-text-muted">
                  {article.author.role}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-caption text-text-muted">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4 text-text-light" />
                {article.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-text-light" />
                {article.readTime}
              </span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-border bg-primary-light shadow-xs">
            {article.image ? (
              <Image
                src={article.image}
                alt={article.imageAlt || article.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 896px"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary-light via-surface to-secondary-light/40 flex flex-col items-center justify-center p-6 text-center text-primary/40">
                <Newspaper className="w-16 h-16 mb-2" strokeWidth={1.25} />
                <span className="text-small font-semibold text-text">
                  Medhen Beza Press & Clinical Updates
                </span>
              </div>
            )}
          </div>

          {/* Article Summary Lead */}
          <div className="text-h4 font-medium text-text border-l-4 border-primary pl-5 py-1 leading-relaxed">
            {article.summary}
          </div>

          {/* Key Takeaways Box (if present) */}
          {article.keyTakeaways && article.keyTakeaways.length > 0 && (
            <div className="rounded-lg bg-surface border border-border p-6 space-y-3">
              <h3 className="text-small font-bold text-text uppercase tracking-wider">
                Key Highlights
              </h3>
              <ul className="space-y-2">
                {article.keyTakeaways.map((point, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-small text-text-muted"
                  >
                    <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Full Content Paragraphs */}
          <div className="space-y-5 text-body text-text-muted leading-relaxed">
            {article.contentParagraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          {/* Quote Highlight (if present) */}
          {article.quote && (
            <div className="relative rounded-lg bg-primary-light/50 border border-primary/20 p-6 sm:p-8 space-y-3">
              <Quote className="w-8 h-8 text-primary/40" />
              <blockquote className="text-h3 font-medium text-text italic">
                &ldquo;{article.quote.text}&rdquo;
              </blockquote>
              <cite className="block text-small font-semibold text-secondary not-italic">
                — {article.quote.author}
              </cite>
            </div>
          )}

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="pt-6 border-t border-border flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-caption font-semibold text-text-muted mr-1">
                <Tag className="w-3.5 h-3.5" />
                Tags:
              </span>
              {article.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="rounded-full bg-surface border border-border px-3 py-1 text-caption font-medium text-text"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>

        {/* 3. Back to News & Related Articles Row */}
        <ScrollReveal>
          <div className="space-y-8 pt-10 border-t border-border">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <span className="text-caption font-semibold uppercase tracking-wider text-secondary">
                  Continue Reading
                </span>
                <h3 className="text-h2 font-bold text-text tracking-tight mt-0.5">
                  Related Stories & Articles
                </h3>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link href="/news" className="gap-1.5">
                  <ArrowLeft className="w-4 h-4" />
                  All News
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => (
                <NewsCard key={rel.slug} data={rel} />
              ))}
            </div>
          </div>
        </ScrollReveal>
      </main>
    </div>
  );
}
