"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Building2, ArrowRight, Sparkles, Filter, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { FacilityCard } from "@/components/content/FacilityCard";
import type { FacilityDetailData } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/i18n/I18nProvider";

interface FacilitiesDirectoryClientProps {
  initialFacilities: FacilityDetailData[];
}

function isValidImageUrl(url?: string): boolean {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  if (trimmed.includes("youtube.com/watch") || trimmed.includes("youtu.be/")) return false;
  return trimmed.startsWith("/") || trimmed.startsWith("http://") || trimmed.startsWith("https://");
}

export function FacilitiesDirectoryClient({
  initialFacilities,
}: FacilitiesDirectoryClientProps) {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");

  const categories = React.useMemo(() => {
    const set = new Set<string>();
    initialFacilities.forEach((f) => {
      if (f.category) set.add(f.category);
    });
    return ["all", ...Array.from(set)];
  }, [initialFacilities]);

  const filteredFacilities = React.useMemo(() => {
    return initialFacilities.filter((fac) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        fac.name.toLowerCase().includes(q) ||
        (fac.tagline && fac.tagline.toLowerCase().includes(q)) ||
        (fac.description && fac.description.toLowerCase().includes(q)) ||
        (fac.category && fac.category.toLowerCase().includes(q)) ||
        (fac.capacity && fac.capacity.toLowerCase().includes(q)) ||
        (fac.features && fac.features.some((f) => f.toLowerCase().includes(q)));

      const matchesCategory =
        selectedCategory === "all" ||
        (fac.category && fac.category.toLowerCase() === selectedCategory.toLowerCase());

      return matchesSearch && matchesCategory;
    });
  }, [initialFacilities, searchQuery, selectedCategory]);

  const isDefaultView = selectedCategory === "all" && searchQuery.trim() === "";
  const [featuredFacility, secondFacility, ...restFacilities] = filteredFacilities;

  return (
    <div className="space-y-10">
      {/* 1. Filter & Search Toolbar */}
      <section className="bg-surface border-y border-border py-6 shadow-2xs">
        <div className="layout-container space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
              <Input
                type="text"
                placeholder={t("facilities.searchPlaceholder") || "Search wings, units, equipment, or capacity..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-background"
              />
            </div>

            {/* Results Counter */}
            <div className="text-small text-text-muted flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              <span>
                Showing <strong>{filteredFacilities.length}</strong> of{" "}
                <strong>{initialFacilities.length}</strong> medical units
              </span>
            </div>
          </div>

          {/* Dynamic Category Pills */}
          {categories.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
              <span className="text-xs font-semibold text-text-muted flex items-center gap-1 shrink-0 mr-1">
                <Filter className="h-3.5 w-3.5" />
                Category:
              </span>
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                const label = cat === "all" ? (t("common.all") || "All Wings & Facilities") : cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "rounded-full px-3.5 py-1.5 text-xs font-medium transition-all shrink-0 cursor-pointer",
                      isSelected
                        ? "bg-primary text-white shadow-xs font-semibold"
                        : "bg-background border border-border text-text hover:border-primary hover:text-primary"
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 2. Facility Cards Display */}
      <div className="layout-container">
        {filteredFacilities.length === 0 ? (
          <EmptyState
            title="No facilities found"
            description="No clinical facilities match your current search or category filter. Try clearing filters to see all wings."
            actionLabel="Reset Filters"
            onAction={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
          />
        ) : isDefaultView ? (
          /* Default Asymmetric Showcase Layout */
          <div className="space-y-12">
            {/* Flagship Hero Card */}
            {featuredFacility && (
              <ScrollReveal>
                <Link
                  href={featuredFacility.href}
                  className="group block relative aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden border border-border bg-primary-light shadow-md hover:border-primary transition-all duration-300"
                >
                  {featuredFacility.image && isValidImageUrl(featuredFacility.image) ? (
                    <Image
                      src={featuredFacility.image}
                      alt={featuredFacility.imageAlt || featuredFacility.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      priority
                      sizes="100vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-secondary flex flex-col items-center justify-center p-8 text-center text-white/80">
                      <Building2 className="w-20 h-20 text-white/40 mb-3" strokeWidth={1.25} />
                      <span className="text-caption font-semibold text-secondary-light uppercase tracking-widest">
                        Flagship Facility
                      </span>
                      <h2 className="text-h2 font-black text-white mt-1">
                        {featuredFacility.name}
                      </h2>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-text/95 via-text/40 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-2.5 max-w-2xl text-white">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-caption font-bold uppercase tracking-wider text-white">
                          <Sparkles className="w-3.5 h-3.5 text-secondary-light" />
                          {featuredFacility.category || "Flagship Wing"}
                        </span>
                        {featuredFacility.capacity && (
                          <span className="inline-block rounded-full bg-white/15 backdrop-blur-sm px-3 py-1 text-caption font-medium text-white/90">
                            {featuredFacility.capacity}
                          </span>
                        )}
                      </div>
                      <h3 className="text-h2 font-bold text-white leading-tight">
                        {featuredFacility.name}
                      </h3>
                      <p className="text-small text-white/85 line-clamp-2 leading-relaxed">
                        {featuredFacility.tagline || featuredFacility.description}
                      </p>
                    </div>

                    <span className="inline-flex items-center gap-2 rounded-md bg-white text-primary px-5 py-2.5 text-small font-bold shrink-0 group-hover:bg-primary-light transition-colors">
                      Explore Facility
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            )}

            {/* Asymmetric Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {secondFacility && (
                <div className="md:col-span-7">
                  <ScrollReveal>
                    <Link
                      href={secondFacility.href}
                      className="group block relative aspect-[4/3] rounded-xl overflow-hidden border border-border bg-surface shadow-xs hover:border-primary transition-all duration-300 h-full"
                    >
                      {secondFacility.image && isValidImageUrl(secondFacility.image) ? (
                        <Image
                          src={secondFacility.image}
                          alt={secondFacility.imageAlt || secondFacility.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 60vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-secondary-light to-primary-light flex flex-col items-center justify-center p-6 text-center text-primary/40">
                          <Building2 className="w-16 h-16 mb-2" strokeWidth={1.25} />
                          <span className="text-caption font-semibold text-text-muted">
                            {secondFacility.name}
                          </span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-text/90 via-text/40 to-transparent" />

                      <div className="absolute inset-x-0 bottom-0 p-6 text-white space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-caption font-bold text-secondary-light uppercase tracking-wider">
                            {secondFacility.category || secondFacility.location}
                          </span>
                          {secondFacility.capacity && (
                            <span className="text-caption text-white/70">
                              · {secondFacility.capacity}
                            </span>
                          )}
                        </div>
                        <h3 className="text-h3 font-bold text-white">
                          {secondFacility.name}
                        </h3>
                        <p className="text-caption text-white/80 line-clamp-2">
                          {secondFacility.tagline || secondFacility.description}
                        </p>
                      </div>
                    </Link>
                  </ScrollReveal>
                </div>
              )}

              {restFacilities.slice(0, 1).map((fac) => (
                <div key={fac.slug} className="md:col-span-5">
                  <ScrollReveal>
                    <Link
                      href={fac.href}
                      className="group block relative aspect-[4/3] rounded-xl overflow-hidden border border-border bg-surface shadow-xs hover:border-primary transition-all duration-300 h-full"
                    >
                      {fac.image && isValidImageUrl(fac.image) ? (
                        <Image
                          src={fac.image}
                          alt={fac.imageAlt || fac.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 40vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-light to-secondary-light flex flex-col items-center justify-center p-6 text-center text-primary/40">
                          <Building2 className="w-14 h-14 mb-2" strokeWidth={1.25} />
                          <span className="text-caption font-semibold text-text-muted">
                            {fac.name}
                          </span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-text/90 via-text/40 to-transparent" />

                      <div className="absolute inset-x-0 bottom-0 p-6 text-white space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-caption font-bold text-secondary-light uppercase tracking-wider">
                            {fac.category || fac.location}
                          </span>
                          {fac.capacity && (
                            <span className="text-caption text-white/70">
                              · {fac.capacity}
                            </span>
                          )}
                        </div>
                        <h3 className="text-h3 font-bold text-white">
                          {fac.name}
                        </h3>
                        <p className="text-caption text-white/80 line-clamp-2">
                          {fac.tagline || fac.description}
                        </p>
                      </div>
                    </Link>
                  </ScrollReveal>
                </div>
              ))}

              {restFacilities.slice(1).map((fac) => (
                <div key={fac.slug} className="md:col-span-4">
                  <ScrollReveal>
                    <Link
                      href={fac.href}
                      className="group block relative aspect-[4/3] rounded-xl overflow-hidden border border-border bg-surface shadow-xs hover:border-primary transition-all duration-300"
                    >
                      {fac.image && isValidImageUrl(fac.image) ? (
                        <Image
                          src={fac.image}
                          alt={fac.imageAlt || fac.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-secondary-light/60 to-primary-light flex flex-col items-center justify-center p-4 text-center text-primary/40">
                          <Building2 className="w-12 h-12 mb-1.5" strokeWidth={1.25} />
                          <span className="text-caption font-semibold text-text-muted">
                            {fac.name}
                          </span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-text/90 via-text/35 to-transparent" />

                      <div className="absolute inset-x-0 bottom-0 p-5 text-white space-y-1">
                        <span className="text-caption font-bold text-secondary-light uppercase tracking-wider text-[11px]">
                          {fac.category || fac.location}
                        </span>
                        <h3 className="text-h4 font-bold text-white leading-tight">
                          {fac.name}
                        </h3>
                        <p className="text-caption text-white/75 line-clamp-1">
                          {fac.tagline || fac.description}
                        </p>
                      </div>
                    </Link>
                  </ScrollReveal>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Filtered Results Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFacilities.map((fac) => (
              <ScrollReveal key={fac.slug} className="h-full">
                <FacilityCard data={fac} className="h-full" />
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
