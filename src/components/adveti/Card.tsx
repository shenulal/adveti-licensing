import * as React from "react";
import { cn } from "@/lib/utils";

type CardVariant = "default" | "bordered" | "elevated" | "government";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

const variants: Record<CardVariant, string> = {
  default: "bg-surface-0 shadow-md",
  bordered: "bg-surface-0 border border-border-default",
  elevated: "bg-surface-0 shadow-lg",
  government: "bg-surface-0 shadow-md gov-stripe",
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "default", className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-lg", variants[variant], className)}
      {...props}
    />
  ),
);
Card.displayName = "Card";

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={cn("p-6 pb-4 flex flex-col gap-1", className)}
    {...props}
  />
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  ...props
}) => (
  <h3
    className={cn("text-lg font-semibold text-ink-primary", className)}
    {...props}
  />
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  ...props
}) => (
  <p className={cn("text-sm text-ink-secondary", className)} {...props} />
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => <div className={cn("p-6 pt-2", className)} {...props} />;

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={cn(
      "p-6 pt-4 border-t border-border-default flex items-center gap-3",
      className,
    )}
    {...props}
  />
);
