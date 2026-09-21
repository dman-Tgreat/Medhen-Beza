"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-small font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98] select-none relative overflow-hidden shrink-0 [&_svg]:shrink-0 [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-white hover:bg-primary-dark shadow-cta border border-transparent",
        default:
          "bg-primary text-white hover:bg-primary-dark shadow-cta border border-transparent",
        secondary:
          "bg-surface text-primary border border-primary hover:bg-primary-light hover:text-primary-dark hover:border-primary-dark font-medium",
        outline:
          "bg-surface text-text border border-border hover:bg-background hover:text-text-muted",
        ghost:
          "bg-transparent text-text hover:bg-primary-light hover:text-primary-dark border border-transparent",
        emergency:
          "bg-emergency text-white hover:bg-emergency-dark shadow-emergency font-semibold border border-transparent",
      },
      size: {
        default: "min-h-[44px] h-11 sm:h-10 px-4 py-2 text-small [&_svg]:size-4",
        sm: "min-h-[40px] h-10 rounded-sm px-3 text-small [&_svg]:size-3.5",
        lg: "min-h-[48px] h-12 sm:h-14 rounded-lg px-6 text-body font-semibold [&_svg]:size-5",
        icon: "min-h-[44px] min-w-[44px] h-11 w-11 sm:min-h-[40px] sm:min-w-[40px] sm:h-10 sm:w-10 p-0 shrink-0 [&_svg]:size-4",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

