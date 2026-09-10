import * as React from "react";
import { FolderSearch } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "@/components/ui/button";

export interface EmptyStateActionProps {
  label: string;
  onClick?: () => void;
  variant?: ButtonProps["variant"];
  asChild?: boolean;
}

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode | EmptyStateActionProps;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[300px] w-full flex-col items-center justify-center rounded-md border border-dashed border-border bg-surface/50 p-8 text-center animate-in fade-in-50",
        className
      )}
      {...props}
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-light text-primary mb-4">
        {icon ? (
          icon
        ) : (
          <FolderSearch className="h-7 w-7" aria-hidden="true" />
        )}
      </div>
      <h3 className="text-h4 font-semibold text-text mb-1">{title}</h3>
      <p className="max-w-md text-small text-text-muted mb-6">{description}</p>
      {action && (
        <div className="flex items-center justify-center">
          {React.isValidElement(action) ? (
            action
          ) : typeof action === "object" && "label" in action ? (
            <Button
              variant={action.variant || "primary"}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
}
