"use client";

import * as React from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQAccordionProps {
  items: FAQItem[];
  /** If true, multiple items can be open simultaneously. Defaults to false (single-open). */
  allowMultiple?: boolean;
  className?: string;
}

/**
 * FAQAccordion — accessible, animated question/answer accordion.
 *
 * - Single-open by default (opening one closes the previous)
 * - Smooth CSS height animation via max-height transition
 * - Keyboard accessible (Enter / Space toggles)
 * - Mobile-friendly: full-width tap targets, generous spacing
 */
export function FAQAccordion({
  items,
  allowMultiple = false,
  className,
}: FAQAccordionProps) {
  const [openIndexes, setOpenIndexes] = React.useState<Set<number>>(
    new Set()
  );

  const toggle = (index: number) => {
    setOpenIndexes((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        if (!allowMultiple) next.clear();
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div
      className={cn("divide-y divide-border rounded-lg border border-border overflow-hidden", className)}
      role="list"
    >
      {items.map((item, index) => {
        const isOpen = openIndexes.has(index);
        const panelId = `faq-panel-${index}`;
        const triggerId = `faq-trigger-${index}`;

        return (
          <div key={index} role="listitem">
            {/* Question row / trigger */}
            <button
              id={triggerId}
              aria-controls={panelId}
              aria-expanded={isOpen}
              onClick={() => toggle(index)}
              className={cn(
                "group w-full flex items-center justify-between gap-4",
                "px-5 py-4 sm:py-5 min-h-[48px] text-left",
                "bg-surface hover:bg-primary-light/40",
                "transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
              )}
            >
              <span
                className={cn(
                  "text-small sm:text-body font-semibold leading-snug text-text",
                  "transition-colors duration-150",
                  isOpen && "text-primary"
                )}
              >
                {item.question}
              </span>

              {/* Icon — Plus when closed, Minus when open */}
              <span
                className={cn(
                  "shrink-0 w-7 h-7 rounded-full flex items-center justify-center border",
                  "transition-colors duration-150",
                  isOpen
                    ? "border-primary bg-primary text-white"
                    : "border-border bg-background text-text-muted group-hover:border-primary-light group-hover:text-primary"
                )}
                aria-hidden
              >
                {isOpen ? (
                  <Minus className="w-3.5 h-3.5" />
                ) : (
                  <Plus className="w-3.5 h-3.5" />
                )}
              </span>
            </button>

            {/* Answer panel — animated via grid rows trick for smooth height */}
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <div className="overflow-hidden">
                <div className="px-5 pb-5 pt-1 text-small text-text-muted leading-relaxed">
                  {item.answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Mock data for local preview ──────────────────────────────────────────────

export const FAQ_MOCK: FAQItem[] = [
  {
    question: "What are your emergency department hours?",
    answer:
      "Our emergency department operates 24 hours a day, 7 days a week, 365 days a year. We have a dedicated trauma team always on standby for critical cases.",
  },
  {
    question: "How do I book an appointment with a specialist?",
    answer:
      "You can book an appointment through our online portal, by calling our general line at +251 116 000 111, or by visiting the hospital reception desk. Walk-in consultations are also available subject to specialist availability.",
  },
  {
    question: "Do you accept health insurance?",
    answer:
      "Yes, we work with most major Ethiopian and international health insurance providers. Please bring your insurance card and a valid photo ID to your appointment. Contact our billing department for a full list of accepted providers.",
  },
  {
    question: "What should I bring for my first visit?",
    answer:
      "Please bring a valid government-issued photo ID, your insurance card (if applicable), any previous medical records or imaging relevant to your condition, and a list of current medications.",
  },
  {
    question: "Is parking available at the hospital?",
    answer:
      "Yes, we have a multi-level parking facility adjacent to the main building with over 300 spaces. The first two hours are complimentary for outpatients.",
  },
];
