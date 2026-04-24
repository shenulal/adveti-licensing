/**
 * Spinner — navy stroke, sizes 16/20/24/32. Use inside buttons, modals, and
 * full-page overlays. Buttons already have a built-in loading spinner — prefer
 * <Button loading> over composing manually.
 */
import * as React from "react";
import { cn } from "@/lib/utils";

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: 16 | 20 | 24 | 32 | 48;
  tone?: "navy" | "gold" | "inverse";
  label?: string;
}

const TONE: Record<NonNullable<SpinnerProps["tone"]>, string> = {
  navy: "text-navy-800",
  gold: "text-gold-500",
  inverse: "text-ink-inverse",
};

export const Spinner: React.FC<SpinnerProps> = ({
  size = 24,
  tone = "navy",
  label,
  className,
  ...props
}) => (
  <span
    role="status"
    aria-label={label ?? "Loading"}
    className={cn("inline-flex items-center gap-2", TONE[tone], className)}
    {...props}
  >
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className="animate-spin-smooth"
      aria-hidden
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeOpacity="0.2"
        strokeWidth="3"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
    {label && <span className="text-sm font-medium">{label}</span>}
  </span>
);

/** Full-page semi-transparent overlay spinner. */
export const PageOverlaySpinner: React.FC<{ label?: string; visible?: boolean }> = ({
  label,
  visible = true,
}) =>
  visible ? (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[70] bg-surface-0/70 backdrop-blur-sm flex items-center justify-center animate-fade-in"
    >
      <div className="rounded-xl bg-surface-0 ring-1 ring-border-default shadow-lg px-6 py-5 flex items-center gap-3">
        <Spinner size={24} />
        <span className="text-sm font-medium text-ink-primary">
          {label ?? "Loading…"}
        </span>
      </div>
    </div>
  ) : null;
