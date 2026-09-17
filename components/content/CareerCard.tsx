import { MapPin, Briefcase, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardRoot, CardBody } from "./Card";
import { cn } from "@/lib/utils";

export type EmploymentType = "Full-time" | "Part-time" | "Contract" | "Internship";

export interface CareerCardData {
  position: string;
  department: string;
  /** Employment type */
  type: EmploymentType;
  location: string;
  /** Human-readable deadline, e.g. "October 31, 2026" */
  deadline: string;
  /** Route to the position detail / application page */
  href: string;
}

export interface CareerCardProps {
  data: CareerCardData;
  className?: string;
}

/** Maps employment type to a color class pair */
const typeColors: Record<EmploymentType, string> = {
  "Full-time": "bg-secondary-light text-secondary",
  "Part-time": "bg-primary-light text-primary",
  Contract: "bg-amber-50 text-amber-700",
  Internship: "bg-violet-50 text-violet-700",
};

/**
 * CareerCard — text-only card (no image).
 * Shows position title, department, employment type badge,
 * location, deadline, and an "Apply / View Position" button.
 */
export function CareerCard({ data, className }: CareerCardProps) {
  const badgeClass = typeColors[data.type] ?? "bg-muted text-text-muted";

  return (
    <CardRoot className={cn("group", className)}>
      <CardBody className="gap-4">
        {/* Header row: position + type badge */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-h4 font-semibold text-text leading-snug">
            {data.position}
          </h3>
          <span
            className={cn(
              "shrink-0 rounded-sm px-2.5 py-0.5 text-caption font-semibold",
              badgeClass
            )}
          >
            {data.type}
          </span>
        </div>

        {/* Department */}
        <p className="text-small font-medium text-secondary -mt-2">
          {data.department}
        </p>

        {/* Meta rows */}
        <ul className="space-y-2 text-small text-text-muted">
          <li className="flex items-center gap-2">
            <MapPin className="w-4 h-4 shrink-0 text-text-light" aria-hidden />
            {data.location}
          </li>
          <li className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 shrink-0 text-text-light" aria-hidden />
            {data.type}
          </li>
          <li className="flex items-center gap-2">
            <Calendar className="w-4 h-4 shrink-0 text-text-light" aria-hidden />
            <span>
              Deadline:{" "}
              <span className="font-medium text-text">{data.deadline}</span>
            </span>
          </li>
        </ul>

        {/* Divider pinned to bottom */}
        <div className="border-t border-border mt-auto pt-1" />

        {/* CTA */}
        <Button asChild variant="secondary" size="default" className="w-full min-h-[44px]">
          <a href={data.href} className="w-full justify-center">View Position</a>
        </Button>
      </CardBody>
    </CardRoot>
  );
}
