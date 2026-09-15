"use client";

import * as React from "react";
import Link from "next/link";
import { Search, Building2, ArrowRight, Stethoscope } from "lucide-react";
import { PageHero } from "@/components/sections/Hero";
import { ServiceCard } from "@/components/content/ServiceCard";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import {
  MOCK_DEPARTMENTS_DETAILED,
  MOCK_SERVICES_DETAILED,
  type ServiceDetailData,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedDept, setSelectedDept] = React.useState<string>("all");
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);

  // Filter services by search text and department
  const filteredServices = React.useMemo(() => {
    return MOCK_SERVICES_DETAILED.filter((service) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.features.some((f) =>
          f.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesDept =
        selectedDept === "all" || service.departmentSlug === selectedDept;

      return matchesSearch && matchesDept;
    });
  }, [searchQuery, selectedDept]);

  // Group filtered services by department
  const groupedDepartments = React.useMemo(() => {
    const activeDepts =
      selectedDept === "all"
        ? MOCK_DEPARTMENTS_DETAILED
        : MOCK_DEPARTMENTS_DETAILED.filter((d) => d.slug === selectedDept);

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
  }, [filteredServices, selectedDept]);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 1. PageHero */}
      <PageHero
        eyebrow="Clinical Specializations"
        title="Medical Services"
        description="Explore our full spectrum of specialized healthcare services, advanced surgical care, and diagnostic capabilities organized by department."
        breadcrumbs={[{ label: "Services" }]}
      />

      {/* 2. Filter & Search Bar */}
      <section className="bg-surface border-b border-border sticky top-16 z-20 shadow-xs">
        <div className="layout-container py-4">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className={cn(
              "relative transition-all duration-300 ease-in-out",
              isSearchFocused ? "md:flex-[3]" : "flex-1 max-w-lg"
            )}>
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light pointer-events-none"
                aria-hidden 
              />
              <Input
                type="text"
                placeholder="Search services, procedures, treatments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="pl-10 pr-4 bg-background h-11 text-small border-border focus-visible:ring-primary"
                aria-label="Search services"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-caption font-medium text-text-muted hover:text-text"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Department Filter Pills */}
            <div className={cn(
              "flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none transition-all duration-300 ease-in-out",
              isSearchFocused ? "md:flex-[1] md:opacity-60" : "md:flex-[2]"
            )}>
              <button
                onClick={() => setSelectedDept("all")}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-caption font-semibold whitespace-nowrap transition-colors border",
                  selectedDept === "all"
                    ? "bg-primary text-white border-primary shadow-xs"
                    : "bg-surface text-text-muted border-border hover:border-primary-light hover:text-primary"
                )}
              >
                All Departments ({MOCK_SERVICES_DETAILED.length})
              </button>
              {MOCK_DEPARTMENTS_DETAILED.map((dept) => {
                const count = MOCK_SERVICES_DETAILED.filter(
                  (s) => s.departmentSlug === dept.slug
                ).length;
                if (count === 0) return null;
                const isSelected = selectedDept === dept.slug;
                return (
                  <button
                    key={dept.slug}
                    onClick={() => setSelectedDept(dept.slug)}
                    className={cn(
                      "px-3.5 py-1.5 rounded-full text-caption font-semibold whitespace-nowrap transition-colors border",
                      isSelected
                        ? "bg-primary text-white border-primary shadow-xs"
                        : "bg-surface text-text-muted border-border hover:border-primary-light hover:text-primary"
                    )}
                  >
                    {dept.name} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Grouped Services List */}
      <main className="layout-container pt-10 space-y-14">
        {groupedDepartments.length > 0 ? (
          groupedDepartments.map((group) => (
            <ScrollReveal key={group.department.slug}>
              <div className="space-y-6">
                {/* Department Group Heading */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-border pb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center gap-1 rounded-sm bg-secondary-light px-2 py-0.5 text-caption font-bold text-secondary uppercase tracking-wider">
                        Department
                      </span>
                    </div>
                    <h2 className="text-h2 font-bold text-text tracking-tight">
                      {group.department.name}
                    </h2>
                    <p className="text-small text-text-muted max-w-2xl mt-1">
                      {group.department.description}
                    </p>
                  </div>
                  <Link
                    href={group.department.href}
                    className="inline-flex items-center gap-1.5 text-small font-semibold text-primary hover:text-primary-dark transition-colors group shrink-0"
                  >
                    <span>View Department</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>

                {/* Service Cards Grid for this Department */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {group.services.map((service) => (
                    <ServiceCard key={service.slug} data={service} />
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))
        ) : (
          <EmptyState
            icon={<Stethoscope className="w-7 h-7 text-primary" />}
            title="No medical services found"
            description={
              searchQuery
                ? `We couldn't find any services matching "${searchQuery}". Try a different keyword or reset your department filter.`
                : "No services are currently listed in this category."
            }
            action={{
              label: "Reset Filters",
              onClick: () => {
                setSearchQuery("");
                setSelectedDept("all");
              },
            }}
          />
        )}
      </main>
    </div>
  );
}
