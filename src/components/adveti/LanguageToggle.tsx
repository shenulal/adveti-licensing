import * as React from "react";
import { cn } from "@/lib/utils";

export type Lang = "en" | "ar";

const STORAGE_KEY = "adveti.lang";

export const applyLang = (lang: Lang) => {
  const html = document.documentElement;
  html.setAttribute("lang", lang);
  html.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* ignore */
  }
};

export const getInitialLang = (): Lang => {
  if (typeof window === "undefined") return "en";
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (saved === "en" || saved === "ar") return saved;
  } catch {
    /* ignore */
  }
  return "en";
};

export interface LanguageToggleProps {
  value: Lang;
  onChange: (lang: Lang) => void;
  className?: string;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  value,
  onChange,
  className,
}) => {
  return (
    <div
      role="radiogroup"
      aria-label="Language"
      className={cn(
        "inline-flex items-center bg-surface-100 rounded-full p-1 gap-1 ring-1 ring-border-default",
        className,
      )}
    >
      {([
        { code: "en", label: "EN" },
        { code: "ar", label: "AR" },
      ] as const).map((opt) => {
        const active = value === opt.code;
        return (
          <button
            key={opt.code}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.code)}
            className={cn(
              "h-7 min-w-[40px] px-3 rounded-full text-xs font-semibold transition-all duration-fast focus-ring",
              active
                ? "bg-navy-800 text-ink-inverse shadow-sm"
                : "text-ink-secondary hover:text-ink-primary",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};
