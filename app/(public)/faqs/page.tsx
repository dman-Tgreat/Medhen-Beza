"use client";

import * as React from "react";
import Link from "next/link";
import { Search, HelpCircle, PhoneCall, Mail, X } from "lucide-react";
import { PageHero } from "@/components/sections/Hero";
import { FAQAccordion } from "@/components/content/FAQAccordion";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { MOCK_FAQS_CATEGORIZED, type FAQCategoryGroup } from "@/lib/mock-data";
import { HOSPITAL_INFO } from "@/lib/constants";

export default function FAQsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");

  // Grouped filtered FAQs
  const filteredGroups = React.useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return MOCK_FAQS_CATEGORIZED;

    return MOCK_FAQS_CATEGORIZED.map((group) => {
      const filteredItems = group.items.filter(
        (item) =>
          item.question.toLowerCase().includes(q) ||
          item.answer.toLowerCase().includes(q)
      );
      return {
        ...group,
        items: filteredItems,
      };
    }).filter((group) => group.items.length > 0);
  }, [searchQuery]);

  const totalQuestionsFound = filteredGroups.reduce(
    (sum, g) => sum + g.items.length,
    0
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 1. PageHero */}
      <PageHero
        eyebrow="Help & Knowledge Base"
        title="Frequently Asked Questions"
        description="Find clear answers to common questions about visiting guidelines, booking appointments, health insurance, payment policies, and hospital services."
        breadcrumbs={[{ label: "FAQs" }]}
      />

      <main className="layout-container pt-10 space-y-12 max-w-4xl mx-auto">
        {/* 2. Live Search Input at the Top */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
          <Input
            type="text"
            placeholder="Type a question or keyword (e.g. visiting hours, insurance, parking, appointment)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-10 bg-surface h-13 text-body border-border shadow-xs focus-visible:ring-primary rounded-lg"
            aria-label="Search FAQs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text p-1"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 3. Categorized FAQs Accordion Groups */}
        {filteredGroups.length > 0 ? (
          <div className="space-y-12">
            {searchQuery && (
              <p className="text-small text-text-muted">
                Found <strong>{totalQuestionsFound}</strong>{" "}
                {totalQuestionsFound === 1 ? "answer" : "answers"} matching
                &ldquo;{searchQuery}&rdquo;
              </p>
            )}

            {filteredGroups.map((group) => (
              <ScrollReveal key={group.id}>
                <section className="space-y-4">
                  <div>
                    <span className="text-caption font-semibold uppercase tracking-wider text-secondary">
                      Category
                    </span>
                    <h2 className="text-h2 font-bold text-text tracking-tight">
                      {group.category}
                    </h2>
                    <p className="text-small text-text-muted mt-0.5">
                      {group.description}
                    </p>
                  </div>

                  <FAQAccordion items={group.items} allowMultiple={false} />
                </section>
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<HelpCircle className="w-8 h-8 text-primary" />}
            title="No questions found"
            description={`We couldn't find any questions matching "${searchQuery}". Please try another keyword or contact our support desk.`}
            action={{
              label: "Clear Search",
              onClick: () => setSearchQuery(""),
            }}
          />
        )}

        {/* 4. Still Have Questions? Banner */}
        <section className="rounded-xl bg-surface border border-border p-8 text-center space-y-4">
          <h3 className="text-h3 font-bold text-text">
            Still have questions? We are here to assist.
          </h3>
          <p className="text-small text-text-muted max-w-lg mx-auto">
            Our patient support and front desk reception team are ready to
            answer your questions 24/7.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="default">
              <Link href="/contact" className="gap-2">
                <Mail className="w-4 h-4" />
                Contact Us
              </Link>
            </Button>
            <Button asChild variant="secondary" size="default">
              <a
                href={`tel:${HOSPITAL_INFO.generalPhone.replace(/\s/g, "")}`}
                className="gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                Call {HOSPITAL_INFO.generalPhone}
              </a>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
