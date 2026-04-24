import * as React from "react";
import { cn } from "@/lib/utils";

export interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (v: string) => void;
  onComplete?: (v: string) => void;
  disabled?: boolean;
  error?: boolean;
  autoFocus?: boolean;
  className?: string;
}

/**
 * Numeric OTP input. Renders `length` boxes that always read LTR
 * regardless of document direction (per spec).
 */
export const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled,
  error,
  autoFocus,
  className,
}) => {
  const refs = React.useRef<Array<HTMLInputElement | null>>([]);

  React.useEffect(() => {
    if (autoFocus) refs.current[0]?.focus();
  }, [autoFocus]);

  const setDigit = (idx: number, digit: string) => {
    const chars = value.split("");
    chars[idx] = digit;
    const next = chars.join("").slice(0, length);
    onChange(next);
    if (digit && next.length === length) onComplete?.(next);
  };

  const handleChange =
    (idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, "");
      if (!raw) {
        setDigit(idx, "");
        return;
      }
      // If the user pasted multiple digits in one box, distribute them
      if (raw.length > 1) {
        const chars = value.split("");
        for (let i = 0; i < raw.length && idx + i < length; i++) {
          chars[idx + i] = raw[i];
        }
        const next = chars.join("").slice(0, length);
        onChange(next);
        const focusIdx = Math.min(idx + raw.length, length - 1);
        refs.current[focusIdx]?.focus();
        if (next.length === length) onComplete?.(next);
        return;
      }
      setDigit(idx, raw);
      if (idx < length - 1) refs.current[idx + 1]?.focus();
    };

  const handleKeyDown =
    (idx: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        if (!value[idx] && idx > 0) {
          e.preventDefault();
          setDigit(idx - 1, "");
          refs.current[idx - 1]?.focus();
        }
      } else if (e.key === "ArrowLeft" && idx > 0) {
        e.preventDefault();
        refs.current[idx - 1]?.focus();
      } else if (e.key === "ArrowRight" && idx < length - 1) {
        e.preventDefault();
        refs.current[idx + 1]?.focus();
      }
    };

  return (
    <div
      dir="ltr"
      className={cn("flex items-center justify-center gap-2", className)}
      role="group"
      aria-label="One-time code"
    >
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={value[i] ?? ""}
          disabled={disabled}
          aria-invalid={error || undefined}
          aria-label={`Digit ${i + 1}`}
          onChange={handleChange(i)}
          onKeyDown={handleKeyDown(i)}
          onFocus={(e) => e.currentTarget.select()}
          className={cn(
            "h-12 w-10 sm:w-12 text-center rounded-md border bg-surface-0 text-ink-primary",
            "text-xl font-semibold tabular-nums",
            "transition-colors duration-fast focus:outline-none focus:ring-2",
            error
              ? "border-danger-600 focus:border-danger-600 focus:ring-danger-600/20"
              : "border-border-default focus:border-navy-800 focus:ring-navy-800/20",
            disabled && "bg-surface-100 opacity-60 cursor-not-allowed",
          )}
        />
      ))}
    </div>
  );
};