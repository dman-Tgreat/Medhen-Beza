"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CalendarDays,
  Clock,
  ArrowRight,
  Sparkles,
  Newspaper,
} from "lucide-react";
import { PageHero } from "@/components/sections/Hero";
import { NewsCard } from "@/components/content/NewsCard";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { MOCK_NEWS_DETAILED, type NewsDetailData } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "All",
  "Cardiology",
  "Hospital News",
  "Community",
  "Research",
  "Maternal Health",
  "Technology",
];

const ITEMS_PER_PAGE = 6;

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [currentPage, setCurrentPage] = React.useState(1);

  // Featured article (first item with isFeatured or first overall)
  const featuredArticle = React.useMemo(() => {
    return (
      MOCK_NEWS_DETAILED.find((n) => n.isFeatured) || MOCK_NEWS_DETAILED[0]
    );
  }, []);

  // Filtered articles (excluding featured from top grid if in "All")
  const filteredArticles = React.useMemo(() => {
    return MOCK_NEWS_DETAILED.filter((article) => {
      if (selectedCategory === "All") return true;
      return article.category === selectedCategory;
    });
  }, [selectedCategory]);

  // Non-featured articles to display in the grid
  const gridArticles = React.useMemo(() => {
    if (selectedCategory === "All" && featuredArticle) {
      return filteredArticles.filter((a) => a.slug !== featuredArticle.slug);
    }
    return filteredArticles;
  }, [filteredArticles, selectedCategory, featuredArticle]);

  // Pagination calculation
  const totalPages = Math.ceil(gridArticles.length / ITEMS_PER_PAGE) || 1;
  const paginatedArticles = React.useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return gridArticles.slice(start, start + ITEMS_PER_PAGE);
  }, [gridArticles, currentPage]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 1. PageHero */}
      <PageHero
        eyebrow="Updates & Advisories"
        title="News & Health Articles"
        description="Stay informed with clinical milestones, health education guides, hospital announcements, and medical outreach reports from Medhen Beza Hospital."
        breadcrumbs={[{ label: "News & Blog" }]}
      />

      <main className="layout-container pt-12 space-y-12">
        {/* 2. Featured Article Spotlight (shown primarily when 'All' is selected) */}
        {selectedCategory === "All" && featuredArticle && (
          <ScrollReveal>
            <div className="rounded-xl overflow-hidden border border-border bg-surface shadow-xs transition-all hover:border-primary">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Photo Side */}
                <div className="lg:col-span-7 relative aspect-[16/9] lg:aspect-auto min-h-[300px] bg-primary-light">
                  {featuredArticle.image ? (
                    <Image
                      src={featuredArticle.image}
                      alt={featuredArticle.imageAlt || featuredArticle.title}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 1024px) 100vw, 58vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-secondary flex flex-col items-center justify-center p-8 text-center text-white/80">
                      <Newspaper className="w-16 h-16 text-white/40 mb-3" />
                      <span className="text-caption font-bold text-secondary-light uppercase tracking-widest">
                        Featured Announcement
                      </span>
                    </div>
                  )}

                  <span className="absolute top-4 left-4 rounded-sm bg-primary px-3 py-1 text-caption font-bold text-white uppercase tracking-wider shadow-sm">
                    {featuredArticle.category}
                  </span>
                </div>

                {/* Content Side */}
                <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-caption text-text-muted">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="w-3.5 h-3.5" />
                        {featuredArticle.date}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {featuredArticle.readTime}
                      </span>
                    </div>

                    <h2 className="text-h2 font-bold text-text leading-snug">
                      <Link
                        href={featuredArticle.href}
                        className="hover:text-primary transition-colors"
                      >
                        {featuredArticle.title}
                      </Link>
                    </h2>

                    <p className="text-body text-text-muted leading-relaxed line-clamp-3">
                      {featuredArticle.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border flex items-center justify-between">
                    <div>
                      <p className="text-small font-bold text-text">
                        {featuredArticle.author.name}
                      </p>
                      <p className="text-caption text-text-muted">
                        {featuredArticle.author.role}
                      </p>
                    </div>

                    <Button asChild size="sm">
                      <Link href={featuredArticle.href} className="gap-1.5">
                        Read Story
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* 3. Category Filter Chips */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-border">
            {CATEGORIES.map((cat) => {
              const count =
                cat === "All"
                  ? MOCK_NEWS_DETAILED.length
                  : MOCK_NEWS_DETAILED.filter((n) => n.category === cat).length;
              if (cat !== "All" && count === 0) return null;
              const isSelected = selectedCategory === cat;

              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={cn(
                    "px-4 py-2 rounded-full text-small font-semibold whitespace-nowrap transition-colors border",
                    isSelected
                      ? "bg-primary text-white border-primary shadow-xs"
                      : "bg-surface text-text-muted border-border hover:border-primary-light hover:text-primary"
                  )}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {/* Articles Grid */}
          {paginatedArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedArticles.map((article) => (
                <ScrollReveal key={article.slug}>
                  <NewsCard data={article} />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Newspaper className="w-7 h-7 text-primary" />}
              title="No articles in this category"
              description="There are currently no published articles in this category. Check back soon for updates."
              action={{
                label: "View All News",
                onClick: () => handleCategoryChange("All"),
              }}
            />
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-8">
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="text-small text-text-muted px-3">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
