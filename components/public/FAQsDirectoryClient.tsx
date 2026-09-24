"use client";

import * as React from "react";
import { Search, HelpCircle, X } from "lucide-react";
import { FAQAccordion } from "@/components/content/FAQAccordion";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import type { FAQCategoryGroup } from "@/lib/mock-data";
import { useI18n } from "@/components/i18n/I18nProvider";

export function FAQsDirectoryClient({
  initialGroups,
}: {
  initialGroups: FAQCategoryGroup[];
}) {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredGroups = React.useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return initialGroups;

    return initialGroups
      .map((group) => {
        const filteredItems = group.items.filter(
          (item) =>
            item.question.toLowerCase().includes(q) ||
            item.answer.toLowerCase().includes(q)
        );
        return {
          ...group,
          items: filteredItems,
        };
      })
      .filter((group) => group.items.length > 0);
  }, [initialGroups, searchQuery]);

  return (
    <main className="container mx-auto px-4 pt-10 space-y-12 max-w-4xl">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light pointer-events-none" />
        <Input
          type="text"
          placeholder={t("faqs.searchPlaceholder") || "Type a question or keyword (e.g. visiting hours, insurance, emergency)..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-11 pr-10 bg-surface min-h-[48px] h-12 text-base sm:text-body border-border shadow-xs focus-visible:ring-primary rounded-lg"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-light hover:text-text"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {filteredGroups.length === 0 ? (
        <EmptyState
          icon={HelpCircle}
          title={t("faqs.empty") || "No Matching Questions Found"}
          description={t("common.noResults") || "We couldn't find an answer to your specific query. Contact our patient helpdesk directly."}
          actionLabel={t("common.clearAll") || "Clear Search"}
          onAction={() => setSearchQuery("")}
        />
      ) : (
        <div className="space-y-10">
          {filteredGroups.map((group) => (
            <ScrollReveal key={group.id || group.category} className="space-y-4">
              <h2 className="text-h3 font-bold text-text border-b border-border pb-2">
                {group.category}
              </h2>
              <FAQAccordion items={group.items} />
            </ScrollReveal>
          ))}
        </div>
      )}
    </main>
  );
}
