import * as React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  icon?: React.ReactNode;
}

export function ErrorState({
  title = "Something went wrong",
  description = "An unexpected error occurred while processing your request. Please try again or contact support if the problem persists.",
  onRetry,
  retryLabel = "Try Again",
  icon,
  className,
  ...props
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[300px] w-full flex-col items-center justify-center rounded-md border border-emergency/20 bg-emergency-light/30 p-8 text-center animate-in fade-in-50",
        className
      )}
      {...props}
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emergency-light text-emergency mb-4">
        {icon ? (
          icon
        ) : (
          <AlertCircle className="h-7 w-7" aria-hidden="true" />
        )}
      </div>
      <h3 className="text-h4 font-semibold text-text mb-1">{title}</h3>
      <p className="max-w-md text-small text-text-muted mb-6">{description}</p>
      {onRetry && (
        <Button variant="primary" onClick={onRetry} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
