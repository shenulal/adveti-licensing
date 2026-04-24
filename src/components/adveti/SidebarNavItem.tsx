import * as React from "react";
import { cn } from "@/lib/utils";

export interface SidebarNavItemProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  icon?: React.ReactNode;
  label: React.ReactNode;
  active?: boolean;
  badge?: React.ReactNode;
  asButton?: boolean;
  onSelect?: () => void;
}

export const SidebarNavItem = React.forwardRef<
  HTMLAnchorElement,
  SidebarNavItemProps
>(
  (
    { icon, label, active, badge, className, asButton, onSelect, ...props },
    ref,
  ) => {
    const inner = (
      <>
        {/* gold left-border accent on active */}
        <span
          aria-hidden
          className={cn(
            "absolute inset-y-1 start-0 w-[3px] rounded-e-full transition-all duration-fast",
            active ? "bg-gold-500" : "bg-transparent",
          )}
        />
        {icon && (
          <span
            className={cn(
              "shrink-0 inline-flex items-center justify-center",
              active ? "text-gold-400" : "text-ink-inverse/70 group-hover:text-ink-inverse",
            )}
          >
            {icon}
          </span>
        )}
        <span className="flex-1 min-w-0 truncate">{label}</span>
        {badge}
      </>
    );

    const cls = cn(
      "group relative flex w-full items-center gap-3 ps-4 pe-3 py-2.5 rounded-md text-start text-sm font-medium transition-colors duration-fast focus-ring",
      active
        ? "bg-navy-800 text-ink-inverse"
        : "text-ink-inverse/80 hover:bg-navy-800/60 hover:text-ink-inverse",
      className,
    );

    if (asButton) {
      return (
        <button
          type="button"
          onClick={onSelect}
          className={cls}
          aria-current={active ? "page" : undefined}
        >
          {inner}
        </button>
      );
    }

    return (
      <a
        ref={ref}
        className={cls}
        aria-current={active ? "page" : undefined}
        {...props}
      >
        {inner}
      </a>
    );
  },
);
SidebarNavItem.displayName = "SidebarNavItem";
