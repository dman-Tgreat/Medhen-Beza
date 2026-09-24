"use client";

import * as React from "react";
import Link from "next/link";
import { Search, Building2, ArrowRight, Stethoscope } from "lucide-react";
import { ServiceCard } from "@/components/content/ServiceCard";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import type { ServiceDetailData, DepartmentDetailData } from "@/lib/mock-data";
import { useI18n } from "@/components/i18n/I18nProvider";

interface ServicesDirectoryClientProps {
  initialServices: ServiceDetailData[];
  departments: DepartmentDetailData[];
}

export function ServicesDirectoryClient({
  initialServices,
  departments,
}: ServicesDirectoryClientProps) {
  const { t, locale } = useI18n();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedDept, setSelectedDept] = React.useState<string>("all");

  const filteredServices = React.useMemo(() => {
    return initialServices.filter((service) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        service.name.toLowerCase().includes(q) ||
        service.description.toLowerCase().includes(q) ||
        (service.features && service.features.some((f) => f.toLowerCase().includes(q)));

      const matchesDept =
        selectedDept === "all" || service.departmentSlug === selectedDept;

      return matchesSearch && matchesDept;
    });
  }, [initialServices, searchQuery, selectedDept]);

  const groupedDepartments = React.useMemo(() => {
    const activeDepts =
      selectedDept === "all"
        ? departments
        : departments.filter((d) => d.slug === selectedDept);

    return activeDepts
      .map((dept) => {
        const services = filteredServices.filter(
          (s) => s.departmentSlug.toLowerCase() === dept.slug.toLowerCase()
        );
        return {
          department: dept,
          services,
        };
      })
      .filter((group) => group.services.length > 0);
  }, [filteredServices, selectedDept, departments]);

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      {/* Search and Department Filter Bar */}
      <div className="mb-10 rounded-2xl border border-border bg-surface p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-light" />
            <Input
              type="search"
              placeholder={t("services.searchPlaceholder") || "Search clinical services, procedures, diagnostic tests..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 text-small bg-background"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            <button
              onClick={() => setSelectedDept("all")}
              className={`px-4 py-2 rounded-lg text-small font-medium whitespace-nowrap transition-colors ${
                selectedDept === "all"
                  ? "bg-primary text-white"
                  : "bg-background text-text border border-border hover:bg-surface"
              }`}
            >
              {t("common.all") || "All Clinical Units"}
            </button>
            {departments.map((dept) => (
              <button
                key={dept.slug}
                onClick={() => setSelectedDept(dept.slug)}
                className={`px-4 py-2 rounded-lg text-small font-medium whitespace-nowrap transition-colors ${
                  selectedDept === dept.slug
                    ? "bg-primary text-white"
                    : "bg-background text-text border border-border hover:bg-surface"
                }`}
              >
                {dept.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-small text-text-muted">
          Showing <strong className="text-text">{filteredServices.length}</strong> clinical services
        </p>
      </div>

      {/* Grouped Services by Department */}
      {groupedDepartments.length === 0 ? (
        <EmptyState
          icon={Stethoscope}
          title={t("services.empty") || "No Services Found"}
          description={t("common.noResults") || "We couldn't find any clinical services matching your search. Please check your keywords or reset filters."}
          actionLabel={t("common.viewAll") || "View All Services"}
          onAction={() => {
            setSearchQuery("");
            setSelectedDept("all");
          }}
        />
      ) : (
        <div className="space-y-12">
          {groupedDepartments.map(({ department, services }) => (
            <div key={department.slug} className="space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  <h2 className="text-h3 font-bold text-text">{department.name}</h2>
                </div>
                <Link
                  href={`/${locale}/departments/${department.slug}`}
                  className="text-small font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  {t("common.details") || "Department Details"} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service, idx) => (
                  <ScrollReveal key={service.slug} delay={idx * 0.05}>
                    <ServiceCard data={service} />
                  </ScrollReveal>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
