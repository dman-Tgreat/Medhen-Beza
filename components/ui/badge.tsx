import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-pill border px-2.5 py-0.5 text-caption font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
  {
    variants: {
      variant: {
        primary:
          "border-transparent bg-primary-light text-primary-dark",
        default:
          "border-transparent bg-primary-light text-primary-dark",
        secondary:
          "border-transparent bg-secondary-light text-secondary-dark",
        outline:
          "border-border bg-surface text-text-muted",
        emergency:
          "border-transparent bg-emergency-light text-emergency-dark font-semibold",
        destructive:
          "border-transparent bg-emergency-light text-emergency-dark font-semibold",
        success:
          "border-transparent bg-secondary-light text-secondary-dark font-medium",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

