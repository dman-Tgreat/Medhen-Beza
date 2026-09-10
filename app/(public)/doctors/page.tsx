"use client";

import * as React from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  UserSearch,
  Building2,
  Stethoscope,
  Filter,
} from "lucide-react";
import { PageHero } from "@/components/sections/Hero";
import { DoctorCard } from "@/components/content/DoctorCard";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import {
  MOCK_DOCTORS_DETAILED,
  MOCK_DEPARTMENTS_DETAILED,
  type DoctorDetailData,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

// Unique specialties
const ALL_SPECIALTIES = Array.from(
  new Set(MOCK_DOCTORS_DETAILED.map((d) => d.specialty))
).sort();

export default function DoctorsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedDept, setSelectedDept] = React.useState<string>("all");
  const [selectedSpecialty, setSelectedSpecialty] =
    React.useState<string>("all");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = React.useState(false);

  // Active filter count
  const activeFiltersCount =
    (selectedDept !== "all" ? 1 : 0) +
    (selectedSpecialty !== "all" ? 1 : 0) +
    (searchQuery.trim() !== "" ? 1 : 0);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedDept("all");
    setSelectedSpecialty("all");
  };

  // Filtered doctors
  const filteredDoctors = React.useMemo(() => {
    return MOCK_DOCTORS_DETAILED.filter((doc) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        doc.name.toLowerCase().includes(q) ||
        doc.specialty.toLowerCase().includes(q) ||
        doc.department.toLowerCase().includes(q) ||
        doc.areasOfExpertise.some((a) => a.toLowerCase().includes(q)) ||
        doc.languages.some((l) => l.toLowerCase().includes(q));

      const matchesDept =
        selectedDept === "all" || doc.departmentSlug === selectedDept;

      const matchesSpecialty =
        selectedSpecialty === "all" || doc.specialty === selectedSpecialty;

      return matchesSearch && matchesDept && matchesSpecialty;
    });
  }, [searchQuery, selectedDept, selectedSpecialty]);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 1. PageHero */}
      <PageHero
        eyebrow="Medical Staff Directory"
        title="Find a Doctor"
        description="Search our directory of certified consultant physicians, surgeons, and specialists by name, department, or clinical specialty."
        breadcrumbs={[{ label: "Doctors" }]}
      />

      {/* 2. Persistent Sticky Search & Filter Bar */}
      <section className="bg-surface border-b border-border sticky top-16 z-20 shadow-xs">
        <div className="layout-container py-4">
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light"
                aria-hidden
              />
              <Input
                type="text"
                placeholder="Search doctors by name, specialty, or condition..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-9 bg-background h-11 text-small border-border focus-visible:ring-primary"
                aria-label="Search doctors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light hover:text-text p-1"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Desktop Filters (Hidden on Mobile) */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Department Dropdown */}
              <div className="relative">
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="h-11 rounded-md border border-border bg-background px-3.5 pr-8 text-small font-medium text-text focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                  aria-label="Filter by department"
                >
                  <option value="all">All Departments</option>
                  {MOCK_DEPARTMENTS_DETAILED.map((dept) => (
                    <option key={dept.slug} value={dept.slug}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-light">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>

              {/* Specialty Dropdown */}
              <div className="relative">
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="h-11 rounded-md border border-border bg-background px-3.5 pr-8 text-small font-medium text-text focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                  aria-label="Filter by specialty"
                >
                  <option value="all">All Specialties</option>
                  {ALL_SPECIALTIES.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-light">
                  <Stethoscope className="w-4 h-4" />
                </div>
              </div>

              {/* Reset Filters button if active */}
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="h-11 text-text-muted hover:text-text gap-1.5"
                >
                  <X className="w-4 h-4" />
                  Reset ({activeFiltersCount})
                </Button>
              )}
            </div>

            {/* Mobile Filters Trigger (Sheet/Dialog) */}
            <div className="lg:hidden">
              <Dialog
                open={isMobileFiltersOpen}
                onOpenChange={setIsMobileFiltersOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant={activeFiltersCount > 0 ? "default" : "secondary"}
                    size="default"
                    className="h-11 gap-2 shrink-0"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    <span>Filters</span>
                    {activeFiltersCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-white text-primary text-[11px] font-bold flex items-center justify-center">
                        {activeFiltersCount}
                      </span>
                    )}
                  </Button>
                </DialogTrigger>

                <DialogContent className="max-w-sm sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Filter Doctors</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-5 py-4">
                    {/* Department Select */}
                    <div className="space-y-2">
                      <label className="text-caption font-semibold uppercase tracking-wider text-text-muted">
                        Department
                      </label>
                      <select
                        value={selectedDept}
                        onChange={(e) => setSelectedDept(e.target.value)}
                        className="w-full h-11 rounded-md border border-border bg-background px-3 text-small font-medium text-text focus:ring-2 focus:ring-primary"
                      >
                        <option value="all">All Departments</option>
                        {MOCK_DEPARTMENTS_DETAILED.map((dept) => (
                          <option key={dept.slug} value={dept.slug}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Specialty Select */}
                    <div className="space-y-2">
                      <label className="text-caption font-semibold uppercase tracking-wider text-text-muted">
                        Specialty
                      </label>
                      <select
                        value={selectedSpecialty}
                        onChange={(e) => setSelectedSpecialty(e.target.value)}
                        className="w-full h-11 rounded-md border border-border bg-background px-3 text-small font-medium text-text focus:ring-2 focus:ring-primary"
                      >
                        <option value="all">All Specialties</option>
                        {ALL_SPECIALTIES.map((spec) => (
                          <option key={spec} value={spec}>
                            {spec}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-4 border-t border-border">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        resetFilters();
                        setIsMobileFiltersOpen(false);
                      }}
                    >
                      Reset All
                    </Button>
                    <DialogClose asChild>
                      <Button variant="default">
                        Show Results ({filteredDoctors.length})
                      </Button>
                    </DialogClose>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Active Filter Chips Strip */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-3 text-caption">
              <span className="text-text-muted font-medium">Active:</span>
              {selectedDept !== "all" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary-light text-primary px-3 py-0.5 font-semibold">
                  Dept:{" "}
                  {
                    MOCK_DEPARTMENTS_DETAILED.find(
                      (d) => d.slug === selectedDept
                    )?.name
                  }
                  <button
                    onClick={() => setSelectedDept("all")}
                    aria-label="Remove department filter"
                  >
                    <X className="w-3 h-3 hover:opacity-75" />
                  </button>
                </span>
              )}
              {selectedSpecialty !== "all" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-secondary-light text-secondary px-3 py-0.5 font-semibold">
                  Specialty: {selectedSpecialty}
                  <button
                    onClick={() => setSelectedSpecialty("all")}
                    aria-label="Remove specialty filter"
                  >
                    <X className="w-3 h-3 hover:opacity-75" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 rounded-full bg-background border border-border text-text px-3 py-0.5 font-semibold">
                  Keyword: &ldquo;{searchQuery}&rdquo;
                  <button
                    onClick={() => setSearchQuery("")}
                    aria-label="Remove keyword filter"
                  >
                    <X className="w-3 h-3 hover:opacity-75" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 3. Results Header & Grid */}
      <main className="layout-container pt-8 space-y-8">
        <div className="flex items-center justify-between text-small text-text-muted border-b border-border pb-3">
          <p>
            Showing <strong>{filteredDoctors.length}</strong>{" "}
            {filteredDoctors.length === 1 ? "doctor" : "doctors"}
          </p>
        </div>

        {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredDoctors.map((doctor) => (
              <ScrollReveal key={doctor.slug}>
                <DoctorCard data={doctor} />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<UserSearch className="w-8 h-8 text-primary" />}
            title="No doctors found"
            description="We couldn't find any doctors matching your search criteria. Try adjusting your keywords, department selection, or specialty filter."
            action={{
              label: "Reset All Filters",
              onClick: resetFilters,
            }}
          />
        )}
      </main>
    </div>
  );
}
