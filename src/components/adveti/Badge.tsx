import * as React from "react";
import { cn } from "@/lib/utils";

export type ApplicationStatus =
  | "Draft"
  | "Submitted"
  | "UnderReview"
  | "PendingApplicant"
  | "Approved"
  | "Incomplete"
  | "Rejected"
  | "Expired"
  | "Suspended"
  | "Revoked";

const statusMap: Record<ApplicationStatus, { cls: string; label: string }> = {
  Draft:           { cls: "bg-surface-200 text-ink-secondary",       label: "Draft" },
  Submitted:       { cls: "bg-info-100 text-info-600",               label: "Submitted" },
  UnderReview:     { cls: "bg-warning-100 text-warning-600",         label: "Under Review" },
  PendingApplicant:{ cls: "bg-gold-100 text-gold-600",               label: "Pending Applicant" },
  Approved:        { cls: "bg-success-100 text-success-600",         label: "Approved" },
  Incomplete:      { cls: "bg-warning-100 text-warning-600",         label: "Incomplete" },
  Rejected:        { cls: "bg-danger-100 text-danger-600",           label: "Rejected" },
  Expired:         { cls: "bg-surface-200 text-ink-muted",           label: "Expired" },
  Suspended:       { cls: "bg-danger-100 text-danger-600",           label: "Suspended" },
  Revoked:         { cls: "bg-navy-950 text-ink-inverse",            label: "Revoked" },
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: ApplicationStatus;
  variant?: "neutral" | "info" | "success" | "warning" | "danger" | "gold";
  children?: React.ReactNode;
}

const variantMap = {
  neutral: "bg-surface-200 text-ink-secondary",
  info:    "bg-info-100 text-info-600",
  success: "bg-success-100 text-success-600",
  warning: "bg-warning-100 text-warning-600",
  danger:  "bg-danger-100 text-danger-600",
  gold:    "bg-gold-100 text-gold-600",
};

export const Badge: React.FC<BadgeProps> = ({
  status,
  variant = "neutral",
  className,
  children,
  ...props
}) => {
  const cls = status ? statusMap[status].cls : variantMap[variant];
  const text = children ?? (status ? statusMap[status].label : "");
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide",
        "ring-1 ring-inset ring-current/30",
        cls,
        className,
      )}
      {...props}
    >
      <span
        className="h-1.5 w-1.5 rounded-full bg-current opacity-70"
        aria-hidden
      />
      {text}
    </span>
  );
};
