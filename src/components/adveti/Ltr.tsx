import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Forces LTR direction on technical strings (Emirates IDs, IPs, phone numbers,
 * licence numbers, dates in ISO, API keys). Required even when the document
 * is RTL — these strings must remain LTR per WCAG and ADVETI style guide.
 */
export const Ltr: React.FC<
  React.HTMLAttributes<HTMLSpanElement> & { as?: "span" | "p" | "div" | "code" }
> = ({ as = "span", className, children, ...rest }) => {
  const Tag = as as React.ElementType;
  return (
    <Tag dir="ltr" className={cn("ltr-numeric", className)} {...rest}>
      {children}
    </Tag>
  );
};
