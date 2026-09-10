import Image from "next/image";
import { UserCircle2 } from "lucide-react";
import { CardRoot, CardBody, CardLink } from "./Card";
import { cn } from "@/lib/utils";

export interface DoctorCardData {
  /** Absolute or relative URL to the doctor's portrait */
  photo?: string;
  name: string;
  /** e.g. "Cardiologist" */
  specialty: string;
  /** e.g. "Cardiology Department" */
  department: string;
  /** Route to the doctor's profile page */
  href: string;
}

export interface DoctorCardProps {
  data: DoctorCardData;
  className?: string;
}

/**
 * DoctorCard — centered portrait, name, specialty badge, department, profile link.
 * Portrait uses a circular clip; falls back to a silhouette icon.
 */
export function DoctorCard({ data, className }: DoctorCardProps) {
  return (
    <CardRoot className={cn("group items-center text-center pt-6", className)}>
      <CardBody className="items-center">
        {/* Portrait */}
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-primary-light bg-primary-light shrink-0">
          {data.photo ? (
            <Image
              src={data.photo}
              alt={`Dr. ${data.name}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              sizes="96px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-light to-secondary-light">
              <UserCircle2 className="w-14 h-14 text-primary/40" strokeWidth={1} />
            </div>
          )}
        </div>

        {/* Specialty badge */}
        <span className="inline-block rounded-full bg-secondary-light px-3 py-0.5 text-caption font-semibold text-secondary uppercase tracking-wider">
          {data.specialty}
        </span>

        {/* Name */}
        <h3 className="text-h4 font-semibold text-text leading-tight">
          {data.name}
        </h3>

        {/* Department */}
        <p className="text-small text-text-muted">{data.department}</p>

        {/* CTA */}
        <CardLink href={data.href} label="View Profile" className="mt-auto justify-center" />
      </CardBody>
    </CardRoot>
  );
}
