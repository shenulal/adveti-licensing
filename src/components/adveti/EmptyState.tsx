/**
 * EmptyState — illustrated empty placeholder. Always include a heading + one
 * supporting line. CTA optional. Illustrations use design-system tokens
 * (navy + gold line art) — never grey-on-grey blobs.
 */
import * as React from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  illustration?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  /** Compact = inline empty inside a smaller card. */
  size?: "default" | "compact";
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  illustration,
  title,
  description,
  action,
  size = "default",
  className,
}) => (
  <div
    role="status"
    className={cn(
      "flex flex-col items-center text-center gap-3 mx-auto",
      size === "compact" ? "py-10 max-w-sm" : "py-16 px-6 max-w-md",
      className,
    )}
  >
    {illustration && (
      <div className="mb-2" aria-hidden>
        {illustration}
      </div>
    )}
    <h2
      className={cn(
        "font-semibold text-ink-primary text-balance",
        size === "compact" ? "text-base" : "text-lg",
      )}
    >
      {title}
    </h2>
    {description && (
      <p className="text-sm text-ink-secondary text-pretty leading-relaxed max-w-prose">
        {description}
      </p>
    )}
    {action && <div className="mt-2">{action}</div>}
  </div>
);

// =====================================================
// Illustration set — minimal SVG line art, navy + gold.
// All use currentColor for navy stroke and the gold token directly.
// 96×96 base, scalable.
// =====================================================

const IllusFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg
    width="96"
    height="96"
    viewBox="0 0 96 96"
    fill="none"
    role="img"
    className="text-navy-800"
  >
    {children}
  </svg>
);

/** Empty inbox with checkmark — assessor queue cleared. */
export const EmptyInboxIllustration: React.FC = () => (
  <IllusFrame>
    <rect
      x="14"
      y="22"
      width="68"
      height="56"
      rx="8"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M14 50h22l4 8h16l4-8h22"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <circle cx="70" cy="32" r="11" fill="hsl(var(--gold-100))" stroke="hsl(var(--gold-500))" strokeWidth="2" />
    <path
      d="m65.5 32.5 3.5 3.5 6-7"
      stroke="hsl(var(--gold-600))"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </IllusFrame>
);

/** Document with plus — first application. */
export const DocumentPlusIllustration: React.FC = () => (
  <IllusFrame>
    <path
      d="M24 14h32l16 16v44a4 4 0 0 1-4 4H24a4 4 0 0 1-4-4V18a4 4 0 0 1 4-4Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path d="M56 14v16h16" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M32 50h22M32 60h28" stroke="currentColor" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" />
    <circle cx="68" cy="68" r="12" fill="hsl(var(--gold-500))" />
    <path d="M68 62v12M62 68h12" stroke="hsl(var(--navy-950))" strokeWidth="2.4" strokeLinecap="round" />
  </IllusFrame>
);

/** Bell with sparkle — all caught up. */
export const BellSparkleIllustration: React.FC = () => (
  <IllusFrame>
    <path
      d="M48 18c-9 0-16 7-16 16v8l-6 10h44l-6-10v-8c0-9-7-16-16-16Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path d="M42 60a6 6 0 0 0 12 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M48 18v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path
      d="M76 20l1.5 4.5L82 26l-4.5 1.5L76 32l-1.5-4.5L70 26l4.5-1.5z"
      fill="hsl(var(--gold-500))"
    />
    <path
      d="M22 36l1 3 3 1-3 1-1 3-1-3-3-1 3-1z"
      fill="hsl(var(--gold-400))"
    />
  </IllusFrame>
);

/** Ledger / receipt with tick — finance reconciled. */
export const LedgerCheckIllustration: React.FC = () => (
  <IllusFrame>
    <rect x="18" y="14" width="50" height="68" rx="4" stroke="currentColor" strokeWidth="2" />
    <path d="M28 28h30M28 38h30M28 48h22" stroke="currentColor" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" />
    <circle cx="64" cy="62" r="14" fill="hsl(var(--gold-100))" stroke="hsl(var(--gold-500))" strokeWidth="2" />
    <path
      d="m58 62 4 4 8-9"
      stroke="hsl(var(--gold-600))"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </IllusFrame>
);

/** Receipt + tick — refunds queue empty. */
export const ReceiptCheckIllustration: React.FC = () => (
  <IllusFrame>
    <path
      d="M22 12h36v72l-6-4-6 4-6-4-6 4-6-4-6 4V12Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path d="M30 28h20M30 38h20M30 48h14" stroke="currentColor" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" />
    <circle cx="68" cy="56" r="14" fill="hsl(var(--gold-500))" />
    <path
      d="m62 56 4 4 8-9"
      stroke="hsl(var(--navy-950))"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </IllusFrame>
);

/** Search with magnifier — no results. */
export const SearchEmptyIllustration: React.FC = () => (
  <IllusFrame>
    <circle cx="40" cy="40" r="22" stroke="currentColor" strokeWidth="2" />
    <path d="M56 56l18 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    <path d="M32 40h16M40 32v16" stroke="hsl(var(--gold-500))" strokeWidth="2.4" strokeLinecap="round" opacity="0.6" />
    <path
      d="M30 38l4 4M50 38l-4 4"
      stroke="hsl(var(--gold-500))"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
  </IllusFrame>
);

/** Cloud upload — empty media library. */
export const CloudUploadIllustration: React.FC = () => (
  <IllusFrame>
    <path
      d="M28 60a14 14 0 0 1 5-27 18 18 0 0 1 34 4 12 12 0 0 1 1 23H62"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M48 50v28M38 60l10-10 10 10"
      stroke="hsl(var(--gold-600))"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </IllusFrame>
);

/** 404 — abstract document with question mark. */
export const NotFoundIllustration: React.FC = () => (
  <IllusFrame>
    <rect x="20" y="14" width="56" height="68" rx="6" stroke="currentColor" strokeWidth="2" />
    <text
      x="48"
      y="56"
      textAnchor="middle"
      className="font-bold"
      fontSize="26"
      fill="hsl(var(--navy-900))"
    >
      404
    </text>
    <circle cx="74" cy="74" r="10" fill="hsl(var(--gold-500))" />
    <text
      x="74"
      y="78"
      textAnchor="middle"
      className="font-bold"
      fontSize="13"
      fill="hsl(var(--navy-950))"
    >
      ?
    </text>
  </IllusFrame>
);

/** 403 — shield with lock. */
export const ForbiddenIllustration: React.FC = () => (
  <IllusFrame>
    <path
      d="M48 12 22 22v22c0 16 11 30 26 36 15-6 26-20 26-36V22Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      fill="hsl(var(--navy-900) / 0.04)"
    />
    <rect x="38" y="44" width="20" height="18" rx="3" stroke="hsl(var(--gold-600))" strokeWidth="2" fill="hsl(var(--gold-100))" />
    <path d="M42 44v-6a6 6 0 0 1 12 0v6" stroke="hsl(var(--gold-600))" strokeWidth="2" />
    <circle cx="48" cy="53" r="2" fill="hsl(var(--navy-900))" />
  </IllusFrame>
);
