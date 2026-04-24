import * as React from "react";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  eyebrowEn?: string;
  eyebrowAr?: string;
  titleEn: string;
  titleAr: string;
  subtitleEn?: string;
  subtitleAr?: string;
  isAr: boolean;
  children?: React.ReactNode;
  size?: "sm" | "lg";
}

export const PageHero: React.FC<PageHeroProps> = ({
  eyebrowEn,
  eyebrowAr,
  titleEn,
  titleAr,
  subtitleEn,
  subtitleAr,
  isAr,
  children,
  size = "sm",
}) => {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-xl bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 text-ink-inverse shadow-lg",
        size === "sm" ? "p-8 md:p-10" : "p-10 md:p-14",
      )}
    >
      <div
        aria-hidden
        className="absolute -end-16 -top-16 h-64 w-64 rounded-full bg-gold-500/10 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, currentColor 0 1px, transparent 1px 14px), repeating-linear-gradient(-45deg, currentColor 0 1px, transparent 1px 14px)",
        }}
      />
      <div className="relative max-w-3xl">
        {(eyebrowEn || eyebrowAr) && (
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold-400 font-semibold mb-3">
            <span className="h-px w-8 bg-gold-400" />
            {isAr ? eyebrowAr : eyebrowEn}
          </p>
        )}
        <h1
          className={cn(
            "font-bold tracking-tight text-balance",
            size === "sm" ? "text-3xl md:text-4xl" : "text-3xl md:text-5xl",
          )}
        >
          {isAr ? titleAr : titleEn}
        </h1>
        {(subtitleEn || subtitleAr) && (
          <p className="mt-4 text-ink-inverse/80 text-pretty max-w-2xl">
            {isAr ? subtitleAr : subtitleEn}
          </p>
        )}
        {children && <div className="mt-7">{children}</div>}
      </div>
    </section>
  );
};

export default PageHero;
