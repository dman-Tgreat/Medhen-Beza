"use client";

import * as React from "react";
import { PhoneCall } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "@/components/ui/button";

export interface EmergencyButtonProps
  extends Omit<ButtonProps, "variant" | "children"> {
  /** Optional phone number. When provided, renders as an <a href="tel:..."> link. */
  phone?: string;
  /** Override the label text. Defaults to "Emergency". */
  label?: string;
  /** Control icon visibility. Defaults to true. */
  showIcon?: boolean;
  /** Size preset. Defaults to "default". */
  size?: ButtonProps["size"];
}

/**
 * EmergencyButton — a single reusable emergency CTA used in:
 *   • Header (desktop far-right)
 *   • MobileNav (pinned at bottom)
 *   • Homepage hero / emergency section
 *   • Footer emergency block
 *   • /emergency page
 *
 * When `phone` is provided the button renders as an anchor tag so the device
 * can dial directly. When omitted it renders as a plain button that can have
 * an onClick wired up later.
 *
 * Touch target: always at least 44 × 44 px, compliant with WCAG 2.5.5.
 */
const EmergencyButton = React.forwardRef<
  HTMLButtonElement,
  EmergencyButtonProps
>(
  (
    {
      phone,
      label = "Emergency",
      showIcon = true,
      size = "default",
      className,
      ...props
    },
    ref
  ) => {
    const content = (
      <>
        {showIcon && <PhoneCall className="w-4 h-4 shrink-0" aria-hidden />}
        <span>🚨 {label}</span>
        {phone && (
          <span className="font-normal opacity-90 tracking-tight">{phone}</span>
        )}
      </>
    );

    const sharedClassName = cn(
      // Generous touch targets — never smaller than 44 px tall
      "font-semibold tracking-wide animate-pulse-subtle hover:[animation:none]",
      size === "lg" ? "min-h-[48px] h-12 sm:h-14 px-6 text-body" : "min-h-[44px] px-4 sm:px-5",
      className
    );

    if (phone) {
      return (
        <Button
          asChild
          variant="emergency"
          size={size}
          className={sharedClassName}
        >
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            aria-label={`Call emergency line: ${phone}`}
          >
            {content}
          </a>
        </Button>
      );
    }

    return (
      <Button
        ref={ref}
        variant="emergency"
        size={size}
        className={sharedClassName}
        aria-label="Emergency — contact our 24/7 emergency team"
        {...props}
      >
        {content}
      </Button>
    );
  }
);
EmergencyButton.displayName = "EmergencyButton";

export { EmergencyButton };
