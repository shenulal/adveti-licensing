import * as React from "react";
import { useLang } from "@/hooks/useLang";

/**
 * WCAG 2.4.1 — Skip-to-main-content link.
 * Render as the first focusable element on every shell. Hidden until focused.
 * Targets #main-content by default.
 */
export const SkipLink: React.FC<{ targetId?: string; className?: string }> = ({
  targetId = "main-content",
  className,
}) => {
  const { lang } = useLang();
  return (
    <a href={`#${targetId}`} className={`skip-link ${className ?? ""}`}>
      {lang === "ar" ? "تخطّى إلى المحتوى" : "Skip to main content"}
    </a>
  );
};
