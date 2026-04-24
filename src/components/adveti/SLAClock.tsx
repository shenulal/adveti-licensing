import * as React from "react";
import { cn } from "@/lib/utils";

export interface SLAClockProps {
  /** Hours elapsed since SLA started */
  elapsedHours: number;
  /** Total SLA hours (e.g. 72) */
  totalHours: number;
  size?: number;
  className?: string;
  label?: string;
}

export const SLAClock: React.FC<SLAClockProps> = ({
  elapsedHours,
  totalHours,
  size = 64,
  className,
  label,
}) => {
  const pct = Math.min(1, Math.max(0, elapsedHours / totalHours));
  const stroke = 6;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct);

  // color escalation
  const color =
    pct >= 0.9
      ? "hsl(var(--danger-600))"
      : pct >= 0.75
        ? "hsl(var(--warning-600))"
        : "hsl(var(--navy-700))";

  const remaining = Math.max(0, totalHours - elapsedHours);

  return (
    <div
      className={cn("inline-flex flex-col items-center gap-1", className)}
      role="img"
      aria-label={`SLA: ${remaining}h remaining of ${totalHours}h`}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="-rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="hsl(var(--surface-200))"
            strokeWidth={stroke}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            fill="none"
            style={{ transition: "stroke-dashoffset 380ms cubic-bezier(0.16,1,0.3,1), stroke 220ms" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-sm font-bold leading-none"
            style={{ color }}
          >
            {Math.round(remaining)}h
          </span>
          <span className="text-[10px] text-ink-muted leading-none mt-0.5">
            left
          </span>
        </div>
      </div>
      {label && (
        <span className="text-xs text-ink-secondary">{label}</span>
      )}
    </div>
  );
};
