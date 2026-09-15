"use client";

import * as React from "react";
import Link from "next/link";
import {
  Briefcase,
  Building2,
  Clock,
  MapPin,
  Calendar,
  Search,
  X,
  ArrowRight,
} from "lucide-react";
import { PageHero } from "@/components/sections/Hero";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import {
  MOCK_CAREERS_DETAILED,
  MOCK_DEPARTMENTS_DETAILED,
  type CareerDetailData,
} from "@/lib/mock-data";
import { type EmploymentType } from "@/components/content/CareerCard";
import { cn } from "@/lib/utils";

const EMPLOYMENT_TYPES: (EmploymentType | "All")[] = [
  "All",
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
];

const typeColors: Record<EmploymentType, string> = {
  "Full-time": "bg-secondary-light text-secondary",
  "Part-time": "bg-primary-light text-primary",
  Contract: "bg-amber-50 text-amber-700",
  Internship: "bg-violet-50 text-violet-700",
};

export default function CareersPage() {
  const [selectedDept, setSelectedDept] = React.useState<string>("all");
  const [selectedType, setSelectedType] = React.useState<string>("All");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const filteredCareers = React.useMemo(() => {
    return MOCK_CAREERS_DETAILED.filter((job) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        job.position.toLowerCase().includes(q) ||
        job.department.toLowerCase().includes(q) ||
        job.overview.toLowerCase().includes(q);

      const matchesDept =
        selectedDept === "all" || job.departmentSlug === selectedDept;

      const matchesType =
        selectedType === "All" || job.type === selectedType;

      return matchesSearch && matchesDept && matchesType;
    });
  }, [searchQuery, selectedDept, selectedType]);

  const resetFilters = () => {
    setSelectedDept("all");
    setSelectedType("All");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 1. PageHero */}
      <PageHero
        eyebrow="Join Our Clinical Team"
        title="Career Opportunities"
        description="Explore open medical, nursing, diagnostic, and administrative positions at Medhen Beza Hospital in Addis Ababa."
        breadcrumbs={[{ label: "Careers" }]}
      />

      <main className="layout-container pt-10 space-y-10">
        {/* 2. Filter Bar */}
        <section className="p-5 rounded-xl bg-surface border border-border space-y-4 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search input */}
            <div className="md:col-span-6 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
              <Input
                type="text"
                placeholder="Search job titles or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 bg-background h-11 text-small border-border"
              />
            </div>

            {/* Department Select */}
            <div className="md:col-span-3">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full h-11 rounded-md border border-border bg-background px-3 text-small font-medium text-text focus:ring-2 focus:ring-primary cursor-pointer"
                aria-label="Filter by department"
              >
                <option value="all">All Departments</option>
                {MOCK_DEPARTMENTS_DETAILED.map((dept) => (
                  <option key={dept.slug} value={dept.slug}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Employment Type Select */}
            <div className="md:col-span-3">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full h-11 rounded-md border border-border bg-background px-3 text-small font-medium text-text focus:ring-2 focus:ring-primary cursor-pointer"
                aria-label="Filter by employment type"
              >
                <option value="All">All Job Types</option>
                {EMPLOYMENT_TYPES.filter((t) => t !== "All").map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* 3. Job Listings List Layout (Scan-friendly) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-small text-text-muted border-b border-border pb-3">
            <span>
              Showing <strong>{filteredCareers.length}</strong> open positions
            </span>
            {(selectedDept !== "all" ||
              selectedType !== "All" ||
              searchQuery) && (
              <button
                onClick={resetFilters}
                className="text-primary hover:underline text-caption font-semibold"
              >
                Reset filters
              </button>
            )}
          </div>

          {filteredCareers.length > 0 ? (
            <div className="space-y-4">
              {filteredCareers.map((job) => {
                const badgeClass =
                  typeColors[job.type] || "bg-muted text-text-muted";

                return (
                  <ScrollReveal key={job.slug}>
                    <div className="p-6 rounded-lg bg-surface border border-border hover:border-primary-light transition-all shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
                      {/* Left: Job Info */}
                      <div className="space-y-2.5 max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span
                            className={cn(
                              "px-2.5 py-0.5 rounded-sm text-caption font-bold uppercase tracking-wider",
                              badgeClass
                            )}
                          >
                            {job.type}
                          </span>
                          <span className="text-caption font-semibold text-secondary">
                            {job.department}
                          </span>
                        </div>

                        <h3 className="text-h3 font-bold text-text">
                          <Link
                            href={job.href}
                            className="hover:text-primary transition-colors"
                          >
                            {job.position}
                          </Link>
                        </h3>

                        <p className="text-small text-text-muted line-clamp-2">
                          {job.overview}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-caption text-text-muted pt-1">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-text-light" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1.5 font-medium text-text">
                            <Calendar className="w-3.5 h-3.5 text-text-light" />
                            Deadline: {job.deadline}
                          </span>
                        </div>
                      </div>

                      {/* Right: Apply / View CTA */}
                      <div className="shrink-0 flex sm:flex-col items-center sm:items-end gap-3">
                        <Button asChild size="default" className="w-full sm:w-auto">
                          <Link href={job.href} className="gap-2">
                            <span>View Details & Apply</span>
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={<Briefcase className="w-8 h-8 text-primary" />}
              title="No open vacancies match your criteria"
              description="We could not find any active job postings matching your selected filters. Try broadening your criteria."
              action={{
                label: "Clear All Filters",
                onClick: resetFilters,
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
}
