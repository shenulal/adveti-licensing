/**
 * Skeleton loading primitives — semantic-token based shimmer placeholders.
 * Use specific shapes (Queue/Card/Stats/List) over the bare `Skeleton` block.
 */
import * as React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Tailwind height class, e.g. "h-4". Defaults to h-4. */
  height?: string;
  /** Tailwind width class, e.g. "w-32". Defaults to w-full. */
  width?: string;
  /** Tailwind rounded utility. Defaults to rounded-md. */
  rounded?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  height = "h-4",
  width = "w-full",
  rounded = "rounded-md",
  ...props
}) => (
  <div
    aria-hidden
    className={cn("skeleton", height, width, rounded, className)}
    {...props}
  />
);

/** Queue table skeleton — 6 rows matching standard column widths. */
export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 6,
  cols = 6,
}) => {
  const widths = ["w-24", "w-40", "w-20", "w-24", "w-28", "w-16"];
  return (
    <div
      role="status"
      aria-label="Loading rows"
      className="rounded-lg ring-1 ring-border-default bg-surface-0 overflow-hidden"
    >
      <div className="px-4 py-3 border-b border-border-default flex items-center gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton
            key={i}
            height="h-3"
            width={widths[i % widths.length]}
            rounded="rounded"
          />
        ))}
      </div>
      <ul className="divide-y divide-border-default">
        {Array.from({ length: rows }).map((_, r) => (
          <li key={r} className="px-4 py-4 flex items-center gap-4">
            {Array.from({ length: cols }).map((_, c) => (
              <Skeleton
                key={c}
                height="h-4"
                width={widths[(c + r) % widths.length]}
              />
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
};

/** Application card skeleton — header, badge, progress, CTA. */
export const ApplicationCardSkeleton: React.FC = () => (
  <div
    role="status"
    aria-label="Loading application"
    className="rounded-lg bg-surface-0 ring-1 ring-border-default p-6 space-y-4"
  >
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-2">
        <Skeleton height="h-3" width="w-24" />
        <Skeleton height="h-6" width="w-44" />
        <Skeleton height="h-3" width="w-32" />
      </div>
      <Skeleton height="h-6" width="w-24" rounded="rounded-full" />
    </div>
    <div className="space-y-2">
      <Skeleton height="h-3" width="w-40" />
      <Skeleton height="h-2" width="w-full" rounded="rounded-full" />
    </div>
    <Skeleton height="h-10" width="w-44" />
  </div>
);

/** Dashboard stats skeleton — N small cards with shimmer. */
export const StatsSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div
    role="status"
    aria-label="Loading stats"
    className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
  >
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="rounded-lg bg-surface-0 ring-1 ring-border-default p-4 space-y-3"
      >
        <Skeleton height="h-3" width="w-20" />
        <Skeleton height="h-7" width="w-16" />
        <Skeleton height="h-2" width="w-24" />
      </div>
    ))}
  </div>
);

/** Document list skeleton — file rows with icon + two text lines. */
export const DocumentListSkeleton: React.FC<{ rows?: number }> = ({
  rows = 4,
}) => (
  <ul
    role="status"
    aria-label="Loading documents"
    className="rounded-lg bg-surface-0 ring-1 ring-border-default divide-y divide-border-default"
  >
    {Array.from({ length: rows }).map((_, i) => (
      <li key={i} className="p-4 flex items-center gap-4">
        <Skeleton height="h-10" width="w-10" rounded="rounded-md" />
        <div className="flex-1 space-y-2">
          <Skeleton height="h-4" width="w-2/3" />
          <Skeleton height="h-3" width="w-1/3" />
        </div>
        <Skeleton height="h-8" width="w-20" />
      </li>
    ))}
  </ul>
);

/** Notification list skeleton — bell icon + two text bars per row. */
export const NotificationListSkeleton: React.FC<{ rows?: number }> = ({
  rows = 5,
}) => (
  <ul
    role="status"
    aria-label="Loading notifications"
    className="rounded-lg bg-surface-0 ring-1 ring-border-default divide-y divide-border-default overflow-hidden"
  >
    {Array.from({ length: rows }).map((_, i) => (
      <li key={i} className="p-4 flex items-start gap-3 border-s-4 border-s-surface-200">
        <Skeleton height="h-9" width="w-9" rounded="rounded-md" />
        <div className="flex-1 space-y-2">
          <Skeleton height="h-4" width="w-3/4" />
          <Skeleton height="h-3" width="w-full" />
          <Skeleton height="h-3" width="w-1/4" />
        </div>
      </li>
    ))}
  </ul>
);
