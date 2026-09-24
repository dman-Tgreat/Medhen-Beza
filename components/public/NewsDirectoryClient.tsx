"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Sparkles,
  Newspaper,
} from "lucide-react";
import { NewsCard } from "@/components/content/NewsCard";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import type { NewsDetailData } from "@/lib/mock-data";
import { useI18n } from "@/components/i18n/I18nProvider";

const ITEMS_PER_PAGE = 6;

export function NewsDirectoryClient({
  initialNews,
}: {
  initialNews: NewsDetailData[];
}) {
  const { t, locale } = useI18n();
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [currentPage, setCurrentPage] = React.useState(1);

  const categories = React.useMemo(() => {
    const set = new Set<string>(["All"]);
    initialNews.forEach((n) => {
      if (n.category) set.add(n.category);
    });
    return Array.from(set);
  }, [initialNews]);

  const featuredArticle = React.useMemo(() => {
    return initialNews.find((n) => n.isFeatured) || initialNews[0];
  }, [initialNews]);

  const filteredArticles = React.useMemo(() => {
    return initialNews.filter((article) => {
      if (selectedCategory === "All") return true;
      return article.category === selectedCategory;
    });
  }, [initialNews, selectedCategory]);

  const gridArticles = React.useMemo(() => {
    if (selectedCategory === "All" && featuredArticle) {
      return filteredArticles.filter((a) => a.slug !== featuredArticle.slug);
    }
    return filteredArticles;
  }, [filteredArticles, selectedCategory, featuredArticle]);

  const totalPages = Math.ceil(gridArticles.length / ITEMS_PER_PAGE);
  const paginatedArticles = React.useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return gridArticles.slice(start, start + ITEMS_PER_PAGE);
  }, [gridArticles, currentPage]);

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      {/* Category Pills Filter */}
      <div className="mb-10 flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-pill text-small font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? "bg-primary text-white"
                : "bg-surface text-text border border-border hover:bg-background"
            }`}
          >
            {cat === "All" ? (t("common.all") || "All") : cat}
          </button>
        ))}
      </div>

      {/* Featured Headline Story (Shown on "All") */}
      {selectedCategory === "All" && featuredArticle && (
        <div className="mb-12">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              <div className="relative min-h-[300px] lg:col-span-7 lg:min-h-[440px]">
                <Image
                  src={featuredArticle.image || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200"}
                  alt={featuredArticle.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="flex flex-col justify-center p-6 sm:p-8 lg:col-span-5 lg:p-10 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-pill bg-secondary-light px-3 py-1 text-caption font-bold text-secondary-dark uppercase tracking-wider">
                    <Sparkles className="h-3 w-3" />
                    {t("common.featured") || "Featured Story"}
                  </span>
                  <span className="text-caption text-text-light">{featuredArticle.date}</span>
                </div>

                <h2 className="text-h3 font-bold text-text hover:text-primary transition-colors">
                  <Link href={`/${locale}/news/${featuredArticle.slug}`}>{featuredArticle.title}</Link>
                </h2>

                <p className="text-small text-text-muted leading-relaxed line-clamp-3">
                  {featuredArticle.summary}
                </p>

                <div className="pt-2">
                  <Button asChild variant="primary" size="default">
                    <Link href={`/${locale}/news/${featuredArticle.slug}`} className="flex items-center gap-2">
                      {t("common.readMore") || "Read Full Story"} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Articles Grid */}
      {paginatedArticles.length === 0 ? (
        <EmptyState
          icon={Newspaper}
          title={t("news.empty") || "No Articles in this Category"}
          description={t("common.noResults") || "We couldn't find any published news articles for this category. Check back soon for updates."}
          actionLabel={t("common.viewAll") || "View All News"}
          onAction={() => setSelectedCategory("All")}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedArticles.map((article, idx) => (
            <ScrollReveal key={article.slug} delay={idx * 0.05}>
              <NewsCard data={article} />
            </ScrollReveal>
          ))}
        </div>
      )}
    </div>
  );
}
