import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "gold";
type Size = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
  fullWidth?: boolean;
}

const base =
  "inline-flex items-center justify-center gap-2 font-medium rounded-md transition-all duration-fast ease-out focus-ring select-none whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "bg-navy-800 text-ink-inverse hover:bg-navy-900 active:bg-navy-950 shadow-sm hover:shadow-md",
  secondary:
    "bg-surface-0 text-navy-800 border border-navy-800 hover:bg-navy-800/5 active:bg-navy-800/10",
  ghost:
    "bg-transparent text-navy-800 hover:bg-surface-100 active:bg-surface-200",
  danger:
    "bg-danger-600 text-ink-inverse hover:brightness-110 active:brightness-95 shadow-sm",
  gold:
    "bg-gold-500 text-navy-950 hover:bg-gold-400 active:bg-gold-600 shadow-sm hover:shadow-md font-semibold",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading,
      disabled,
      iconStart,
      iconEnd,
      fullWidth,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;
    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          base,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          isDisabled && "opacity-50 cursor-not-allowed pointer-events-none",
          className,
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin-smooth" aria-hidden />
        ) : (
          iconStart
        )}
        {children}
        {!loading && iconEnd}
      </button>
    );
  },
);
Button.displayName = "Button";
