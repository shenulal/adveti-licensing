/**
 * StatusCard — application card with status-specific visual treatment.
 * Each status gets a distinct border colour/style + icon + (optional) pulse
 * or glow animation. Drives consistent rendering across dashboard, lists,
 * and detail views.
 */
import * as React from "react";
import {
  Ban,
  Bell,
  BookmarkCheck,
  CalendarX,
  CheckCircle2,
  Clock,
  FileEdit,
  FileWarning,
  Lock,
  Search,
  XCircle,
} from "lucide-react";
import type { ApplicationStatus } from "./Badge";
import { cn } from "@/lib/utils";

interface StatusVisual {
  /** Outer border classes — colour, weight, dashed/solid. */
  border: string;
  /** Background tint. */
  bg: string;
  /** Status icon shown in the corner badge. */
  icon: React.ReactNode;
  /** Icon background tint (matches status hue). */
  iconBg: string;
  /** Optional one-off animation class. */
  animation?: string;
}

export const STATUS_VISUALS: Record<ApplicationStatus, StatusVisual> = {
  Draft: {
    border: "border-2 border-dashed border-navy-700/40",
    bg: "bg-surface-0",
    icon: <FileEdit size={16} />,
    iconBg: "bg-surface-100 text-navy-800",
  },
  Submitted: {
    border: "border-2 border-info-600/30",
    bg: "bg-info-100/30",
    icon: <Clock size={16} />,
    iconBg: "bg-info-100 text-info-600",
  },
  UnderReview: {
    border: "border-2 border-warning-600/30",
    bg: "bg-warning-100/30",
    icon: <Search size={16} />,
    iconBg: "bg-warning-100 text-warning-600",
  },
  PendingApplicant: {
    border: "border-2 border-danger-600/40 animate-pulse-soft",
    bg: "bg-danger-100/30",
    icon: <Bell size={16} />,
    iconBg: "bg-gold-100 text-gold-600",
  },
  Approved: {
    border: "border-2 border-success-600/40",
    bg: "bg-success-100/30",
    icon: <BookmarkCheck size={16} />,
    iconBg: "bg-success-100 text-success-600",
    animation: "animate-gold-glow",
  },
  Incomplete: {
    border: "border-2 border-warning-600/50",
    bg: "bg-warning-100/30",
    icon: <FileWarning size={16} />,
    iconBg: "bg-warning-100 text-warning-600",
  },
  Rejected: {
    border: "border-2 border-danger-600/30",
    bg: "bg-danger-100/30",
    icon: <XCircle size={16} />,
    iconBg: "bg-danger-100 text-danger-600",
  },
  Expired: {
    border: "border-2 border-surface-200",
    bg: "bg-surface-50",
    icon: <CalendarX size={16} />,
    iconBg: "bg-surface-100 text-ink-muted",
  },
  Suspended: {
    border: "border-2 border-danger-600/60",
    bg: "bg-danger-100/40",
    icon: <Lock size={16} />,
    iconBg: "bg-danger-600 text-ink-inverse",
  },
  Revoked: {
    border: "border-2 border-navy-900",
    bg: "bg-navy-900 text-ink-inverse",
    icon: <Ban size={16} />,
    iconBg: "bg-ink-inverse text-navy-900",
  },
};

export interface StatusCardProps extends React.HTMLAttributes<HTMLDivElement> {
  status: ApplicationStatus;
  /** Apply the one-off entrance animation (e.g. gold-glow on Approved). */
  animateOnce?: boolean;
}

/** Wraps any children with status-specific border + tint. */
export const StatusCard = React.forwardRef<HTMLDivElement, StatusCardProps>(
  ({ status, animateOnce, className, children, ...props }, ref) => {
    const v = STATUS_VISUALS[status];
    return (
      <div
        ref={ref}
        data-status={status}
        className={cn(
          "rounded-lg p-6 transition-colors",
          v.border,
          v.bg,
          animateOnce && v.animation,
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
StatusCard.displayName = "StatusCard";

/** Small chip showing the status icon with tinted background. */
export const StatusIconBadge: React.FC<{ status: ApplicationStatus; className?: string }> = ({
  status,
  className,
}) => {
  const v = STATUS_VISUALS[status];
  return (
    <span
      className={cn(
        "h-9 w-9 rounded-md inline-flex items-center justify-center shrink-0",
        v.iconBg,
        className,
      )}
      aria-hidden
    >
      {v.icon}
    </span>
  );
};
