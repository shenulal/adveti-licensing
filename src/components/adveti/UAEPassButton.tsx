import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface UAEPassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  label: string;
}

/**
 * UAE Pass branded sign-in button.
 * Uses the official UAE Pass blue (#004B8D).
 */
export const UAEPassButton = React.forwardRef<
  HTMLButtonElement,
  UAEPassButtonProps
>(({ loading, label, className, disabled, ...props }, ref) => {
  const isDisabled = disabled || loading;
  return (
    <button
      ref={ref}
      type="button"
      disabled={isDisabled}
      className={cn(
        "group relative w-full inline-flex items-center justify-center gap-3",
        "h-12 rounded-md px-5 text-base font-semibold text-white",
        "bg-[#004B8D] hover:bg-[#003B70] active:bg-[#002B55]",
        "shadow-sm hover:shadow-md transition-all duration-fast focus-ring",
        isDisabled && "opacity-60 cursor-not-allowed pointer-events-none",
        className,
      )}
      {...props}
    >
      <span className="inline-flex items-center justify-center h-7 w-7 rounded bg-white/95 text-[#004B8D]">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <UAEPassMark />
        )}
      </span>
      <span>{label}</span>
    </button>
  );
});
UAEPassButton.displayName = "UAEPassButton";

const UAEPassMark: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    aria-hidden
    role="img"
  >
    {/* Stylised UAE Pass mark (placeholder, brand-safe geometric form) */}
    <path
      fill="currentColor"
      d="M5 4h6.4a4.6 4.6 0 1 1 0 9.2H8.4V20H5V4zm3.4 6.2h2.8a1.6 1.6 0 1 0 0-3.2H8.4v3.2z"
    />
    <circle cx="17.5" cy="17.5" r="2.2" fill="#C9A84C" />
  </svg>
);