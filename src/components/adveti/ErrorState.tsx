/**
 * ErrorState — inline + page-level error patterns.
 *
 *   <ErrorState onRetry={refetch} />          // generic with default copy
 *   <ErrorState size="page" title="…" />      // full bleed page-level
 *
 * Used wherever data loading fails. Pairs naturally with TanStack Query's
 * `isError` boolean.
 */
import * as React from "react";
import { AlertOctagon, RefreshCcw } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

export interface ErrorStateProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  onRetry?: () => void;
  retryLabel?: React.ReactNode;
  /** "inline" sits inside an existing card; "block" renders its own card; "page" full-bleed. */
  size?: "inline" | "block" | "page";
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  description,
  onRetry,
  retryLabel,
  size = "block",
  className,
}) => {
  const body = (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center text-center gap-3",
        size === "page" ? "py-16 max-w-md mx-auto" : "py-10 max-w-md mx-auto",
      )}
    >
      <span className="h-14 w-14 rounded-full bg-danger-100 text-danger-600 inline-flex items-center justify-center">
        <AlertOctagon size={26} />
      </span>
      <h2 className="text-base font-semibold text-ink-primary">
        {title ?? "Something went wrong"}
      </h2>
      <p className="text-sm text-ink-secondary leading-relaxed">
        {description ??
          "We couldn't load this section. Please check your connection and try again."}
      </p>
      {onRetry && (
        <Button
          variant="primary"
          size="sm"
          iconStart={<RefreshCcw size={14} />}
          onClick={onRetry}
        >
          {retryLabel ?? "Try again"}
        </Button>
      )}
    </div>
  );

  if (size === "inline") return <div className={className}>{body}</div>;

  return (
    <div
      className={cn(
        "rounded-lg bg-surface-0 ring-1 ring-border-default",
        size === "page" && "min-h-[60vh] flex items-center justify-center",
        className,
      )}
    >
      {body}
    </div>
  );
};
