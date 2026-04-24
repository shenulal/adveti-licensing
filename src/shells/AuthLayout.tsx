import * as React from "react";
import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { LanguageToggle } from "@/components/adveti";
import { useLang } from "@/hooks/useLang";
import { cn } from "@/lib/utils";

/**
 * Single-column auth layout (used by MFA, reset password, lockout, etc.)
 * Login screen has its own dual-panel layout.
 */
export const AuthLayout: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  const { lang, setLang } = useLang();
  const isAr = lang === "ar";
  return (
    <div className="min-h-screen bg-surface-50 flex flex-col">
      <header className="border-b border-border-default bg-surface-0">
        <div className="container flex h-16 items-center gap-4">
          <Link to="/" className="flex items-center gap-3 focus-ring rounded-md">
            <span className="h-10 w-10 rounded-md bg-navy-900 inline-flex items-center justify-center text-ink-inverse ring-2 ring-gold-500/40">
              <GraduationCap size={20} />
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-bold tracking-wide text-navy-900">
                {isAr ? "أدفيتي" : "ADVETI"}
              </span>
              <span className="hidden sm:block text-[11px] text-ink-secondary">
                {isAr ? "هيئة الترخيص المهني" : "Professional Licensing Authority"}
              </span>
            </span>
          </Link>
          <div className="flex-1" />
          <LanguageToggle value={lang} onChange={setLang} />
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className={cn("w-full max-w-md", className)}>{children}</div>
      </main>
      <footer className="py-4 text-center text-xs text-ink-muted">
        {isAr
          ? "© 2026 دائرة التعليم والمعرفة - أبوظبي"
          : "© 2026 Abu Dhabi Department of Education and Knowledge"}
      </footer>
    </div>
  );
};