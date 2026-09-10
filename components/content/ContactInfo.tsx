import {
  MapPin,
  Phone,
  Mail,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ContactInfoData {
  address?: string;
  /** General / reception phone number */
  phone?: string;
  email?: string;
  /** e.g. "Mon – Fri: 8 AM – 6 PM; Sat: 9 AM – 2 PM" */
  hours?: string;
  /** Emergency phone number — rendered with red accent */
  emergency?: string;
}

export interface ContactInfoProps extends ContactInfoData {
  /** Compact: tighter spacing and smaller text — use in footer */
  compact?: boolean;
  /** Optionally override the container class */
  className?: string;
}

interface RowProps {
  icon: React.ElementType;
  label: string;
  value: string;
  compact: boolean;
  accent?: "emergency";
  href?: string;
}

function ContactRow({ icon: Icon, label, value, compact, accent, href }: RowProps) {
  const isEmergency = accent === "emergency";

  const content = (
    <span
      className={cn(
        "font-medium",
        isEmergency ? "text-emergency" : "text-text",
        compact ? "text-small" : "text-body"
      )}
    >
      {value}
    </span>
  );

  return (
    <li className={cn("flex items-start gap-3", compact ? "gap-2" : "gap-3")}>
      {/* Icon */}
      <div
        className={cn(
          "shrink-0 rounded-md flex items-center justify-center",
          compact ? "w-7 h-7 mt-0.5" : "w-9 h-9",
          isEmergency
            ? "bg-emergency-light text-emergency"
            : "bg-primary-light text-primary"
        )}
      >
        <Icon className={cn(compact ? "w-3.5 h-3.5" : "w-4.5 h-4.5")} strokeWidth={1.75} aria-hidden />
      </div>

      {/* Text */}
      <div className="min-w-0">
        <p
          className={cn(
            "text-caption font-semibold uppercase tracking-wider text-text-muted",
            compact && "text-[10px]"
          )}
        >
          {label}
        </p>
        {href ? (
          <a
            href={href}
            className={cn(
              "font-medium transition-colors hover:underline focus-visible:outline-none focus-visible:underline",
              isEmergency
                ? "text-emergency hover:text-emergency-dark"
                : "text-text hover:text-primary",
              compact ? "text-small" : "text-body"
            )}
          >
            {value}
          </a>
        ) : (
          content
        )}
      </div>
    </li>
  );
}

/**
 * ContactInfo — renders address, phone, email, hours, and emergency line
 * from props. Can be used in the Contact page, footer, sidebar, or anywhere
 * contact details are needed.
 *
 * All fields are optional — only non-null props are rendered.
 * Pass `compact` for footer usage (smaller text, tighter spacing).
 */
export function ContactInfo({
  address,
  phone,
  email,
  hours,
  emergency,
  compact = false,
  className,
}: ContactInfoProps) {
  const rows: RowProps[] = [];

  if (address) {
    rows.push({
      icon: MapPin,
      label: "Address",
      value: address,
      compact,
    });
  }
  if (phone) {
    rows.push({
      icon: Phone,
      label: "General Phone",
      value: phone,
      compact,
      href: `tel:${phone.replace(/\s/g, "")}`,
    });
  }
  if (email) {
    rows.push({
      icon: Mail,
      label: "Email",
      value: email,
      compact,
      href: `mailto:${email}`,
    });
  }
  if (hours) {
    rows.push({
      icon: Clock,
      label: "Hours",
      value: hours,
      compact,
    });
  }
  if (emergency) {
    rows.push({
      icon: AlertTriangle,
      label: "Emergency",
      value: emergency,
      compact,
      accent: "emergency",
      href: `tel:${emergency.replace(/\s/g, "")}`,
    });
  }

  if (rows.length === 0) return null;

  return (
    <ul
      className={cn(
        "space-y-4",
        compact && "space-y-3",
        className
      )}
      aria-label="Contact information"
    >
      {rows.map((row) => (
        <ContactRow key={row.label} {...row} />
      ))}
    </ul>
  );
}

// ─── Default data pulled from HOSPITAL_INFO for convenience ──────────────────

export const CONTACT_INFO_DEFAULTS: ContactInfoData = {
  address: "Bole Road, Addis Ababa, Ethiopia",
  phone: "+251 116 000 111",
  email: "info@medhenbeza.com",
  hours: "Mon – Fri: 8 AM – 6 PM · Sat: 9 AM – 2 PM · Emergency: 24/7",
  emergency: "+251 911 000 999",
};
