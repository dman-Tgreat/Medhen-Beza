"use client";

import * as React from "react";
import Link from "next/link";
import {
  Briefcase,
  MapPin,
  Calendar,
  Search,
  ArrowRight,
} from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import type { CareerDetailData, DepartmentDetailData } from "@/lib/mock-data";
import { useI18n } from "@/components/i18n/I18nProvider";

export function CareersDirectoryClient({
  initialCareers,
  departments,
}: {
  initialCareers: CareerDetailData[];
  departments: DepartmentDetailData[];
}) {
  const { t, locale } = useI18n();
  const [selectedDept, setSelectedDept] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const filteredCareers = React.useMemo(() => {
    return initialCareers.filter((job) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        job.position.toLowerCase().includes(q) ||
        job.department.toLowerCase().includes(q) ||
        (job.overview && job.overview.toLowerCase().includes(q));

      const matchesDept =
        selectedDept === "all" || job.departmentSlug === selectedDept;

      return matchesSearch && matchesDept;
    });
  }, [initialCareers, searchQuery, selectedDept]);

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      {/* Search and filter toolbar */}
      <div className="mb-10 rounded-2xl border border-border bg-surface p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-light" />
            <Input
              type="search"
              placeholder={t("careers.searchPlaceholder") || "Search positions, medical departments, qualifications..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 text-small bg-background"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="h-11 rounded-lg border border-border bg-background px-3 py-2 text-small text-text focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">{t("departments.all") || "All Departments"}</option>
              {departments.map((dept) => (
                <option key={dept.slug} value={dept.slug}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Careers Listing */}
      {filteredCareers.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title={t("careers.empty") || "No Vacancies Matching Criteria"}
          description={t("common.noResults") || "We do not currently have open positions matching your query. Explore all roles or send your spontaneous CV."}
          actionLabel={t("common.viewAllOpenings") || t("common.viewAll") || "View All Openings"}
          onAction={() => {
            setSearchQuery("");
            setSelectedDept("all");
          }}
        />
      ) : (
        <div className="space-y-4">
          {filteredCareers.map((job, idx) => (
            <ScrollReveal key={job.slug} delay={idx * 0.05}>
              <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm hover:border-primary/50 transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-block rounded-pill bg-primary-light px-3 py-1 text-caption font-bold text-primary-dark">
                        {job.type}
                      </span>
                      <span className="text-caption text-text-light flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" /> {job.location}
                      </span>
                    </div>

                    <h3 className="text-h4 font-bold text-text hover:text-primary transition-colors">
                      <Link href={`/${locale}/careers/${job.slug}`}>{job.position}</Link>
                    </h3>

                    <p className="text-small text-text-muted line-clamp-2">
                      {job.overview}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 shrink-0">
                    <span className="text-caption text-text-light flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-emergency" /> {t("careers.deadline") || "Deadline"}: {job.deadline}
                    </span>

                    <Button asChild variant="primary" size="sm">
                      <Link href={`/${locale}/careers/${job.slug}`} className="flex items-center gap-1.5">
                        {t("careers.viewDetails") || "View Details & Apply"} <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      )}
    </div>
  );
}
