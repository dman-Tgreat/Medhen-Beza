import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-md border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-current transition-colors",
  {
    variants: {
      variant: {
        primary:
          "bg-primary-light text-primary-dark border-primary/30 [&>svg]:text-primary-dark",
        secondary:
          "bg-secondary-light text-secondary-dark border-secondary/30 [&>svg]:text-secondary-dark",
        success:
          "bg-secondary-light text-secondary-dark border-secondary/30 [&>svg]:text-secondary-dark",
        warning:
          "bg-amber-50 text-amber-900 border-amber-200 [&>svg]:text-amber-700",
        emergency:
          "bg-emergency-light text-emergency-dark border-emergency/30 [&>svg]:text-emergency-dark",
        destructive:
          "bg-emergency-light text-emergency-dark border-emergency/30 [&>svg]:text-emergency-dark",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-semibold leading-none tracking-tight text-small", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-small [&_p]:line-height-1.5 opacity-90", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
