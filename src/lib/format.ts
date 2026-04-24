/**
 * Formatting helpers for ADVETI bilingual content.
 * Uses Intl APIs with the appropriate locale + numbering system.
 */

export const formatAED = (amount: number, lang: "en" | "ar"): string => {
  if (lang === "ar") {
    const n = new Intl.NumberFormat("ar-AE-u-nu-arab", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
    return `${n} د.إ`;
  }
  const n = new Intl.NumberFormat("en-AE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  return `${n} AED`;
};

export const formatDate = (date: Date | string, lang: "en" | "ar"): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  if (lang === "ar") {
    return new Intl.DateTimeFormat("ar-AE-u-nu-arab", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(d);
  }
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
};

export const formatNumber = (n: number, lang: "en" | "ar"): string => {
  if (lang === "ar") {
    return new Intl.NumberFormat("ar-AE-u-nu-arab").format(n);
  }
  return new Intl.NumberFormat("en-AE").format(n);
};
