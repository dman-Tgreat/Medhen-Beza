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
import type { DoctorDetailData, DepartmentDetailData } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface DoctorsDirectoryClientProps {
  initialDoctors: DoctorDetailData[];
  departments: DepartmentDetailData[];
}

export function DoctorsDirectoryClient({
  initialDoctors,
  departments,
}: DoctorsDirectoryClientProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedDept, setSelectedDept] = React.useState<string>("all");
  const [selectedSpecialty, setSelectedSpecialty] = React.useState<string>("all");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = React.useState(false);

  const allSpecialties = React.useMemo(() => {
    return Array.from(new Set(initialDoctors.map((d) => d.specialty))).sort();
  }, [initialDoctors]);

  const activeFiltersCount =
    (selectedDept !== "all" ? 1 : 0) +
    (selectedSpecialty !== "all" ? 1 : 0) +
    (searchQuery.trim() !== "" ? 1 : 0);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedDept("all");
    setSelectedSpecialty("all");
  };

  const filteredDoctors = React.useMemo(() => {
    return initialDoctors.filter((doc) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        doc.name.toLowerCase().includes(q) ||
        doc.specialty.toLowerCase().includes(q) ||
        doc.department.toLowerCase().includes(q) ||
        doc.languages.some((lang) => lang.toLowerCase().includes(q)) ||
        doc.areasOfExpertise.some((area) => area.toLowerCase().includes(q));

      const matchesDept =
        selectedDept === "all" || doc.departmentSlug === selectedDept;

      const matchesSpecialty =
        selectedSpecialty === "all" || doc.specialty === selectedSpecialty;

      return matchesSearch && matchesDept && matchesSpecialty;
    });
  }, [initialDoctors, searchQuery, selectedDept, selectedSpecialty]);

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      {/* Top Search & Filter Bar */}
      <div className="mb-8 rounded-2xl border border-border bg-surface p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-light" />
            <Input
              type="search"
              placeholder="Search by name, specialty, condition, or language..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 text-small bg-background"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-light hover:text-text"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Desktop Dropdown Filters */}
          <div className="hidden md:flex items-center gap-3">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="h-11 rounded-lg border border-border bg-background px-3 py-2 text-small text-text focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.slug} value={dept.slug}>
                  {dept.name}
                </option>
              ))}
            </select>

            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="h-11 rounded-lg border border-border bg-background px-3 py-2 text-small text-text focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Specialties</option>
              {allSpecialties.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>

            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-text-muted hover:text-emergency h-11"
              >
                <X className="h-4 w-4 mr-1" />
                Reset
              </Button>
            )}
          </div>

          {/* Mobile Filter Button */}
          <div className="flex md:hidden items-center justify-between gap-2">
            <Button
              variant="outline"
              onClick={() => setIsMobileFiltersOpen(true)}
              className="flex-1 justify-center gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                Reset
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-small text-text-muted">
          Showing <strong className="text-text">{filteredDoctors.length}</strong> qualified medical specialists
        </p>
      </div>

      {/* Doctors Grid or Empty State */}
      {filteredDoctors.length === 0 ? (
        <EmptyState
          icon={UserSearch}
          title="No Doctors Found"
          description="We couldn't find any medical specialists matching your current search criteria. Try removing some filters."
          actionLabel="Reset All Filters"
          onAction={resetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredDoctors.map((doc, idx) => (
            <ScrollReveal key={doc.id || doc.slug} delay={idx * 0.05}>
              <DoctorCard data={doc} />
            </ScrollReveal>
          ))}
        </div>
      )}
    </div>
  );
}
