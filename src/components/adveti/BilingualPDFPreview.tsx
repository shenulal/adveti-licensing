import * as React from "react";
import { Download, Printer, ShieldCheck, GraduationCap } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";
import { useLang } from "@/hooks/useLang";

export type BilingualViewMode = "side" | "en" | "ar";

export interface BilingualPDFPreviewProps {
  /** Document title shown in the gold header band, EN. */
  titleEn: string;
  /** Document title shown in the gold header band, AR. */
  titleAr: string;
  /** Reference / certificate / receipt number — rendered LTR in both panels. */
  referenceNumber: string;
  /** English column body. */
  bodyEn: React.ReactNode;
  /** Arabic column body. */
  bodyAr: React.ReactNode;
  /** Optional QR data URL or any element rendered in the QR slot. */
  qrSlot?: React.ReactNode;
  /** Signatory line, EN. */
  signatoryEn?: string;
  /** Signatory line, AR. */
  signatoryAr?: string;
  /** Filename for the PDF download stub. */
  filename?: string;
  /** Hide the toolbar (download / print / view toggle). */
  hideToolbar?: boolean;
  /** Defaults to "side". */
  defaultView?: BilingualViewMode;
  className?: string;
}

/**
 * Reusable A4-proportioned bilingual document preview.
 * Used by Certificate, VAT invoice/receipt, and decision letter screens.
 *
 * - 700×990 logical canvas, scaled to fit container (max-w-[760px]).
 * - View toggle: side-by-side | EN only | AR only.
 * - Gold decorative borders top/bottom, ADVETI seal in header.
 * - Each column carries its own dir + lang attribute so RTL text shapes correctly
 *   even when embedded in an LTR page (and vice-versa).
 */
export const BilingualPDFPreview: React.FC<BilingualPDFPreviewProps> = ({
  titleEn,
  titleAr,
  referenceNumber,
  bodyEn,
  bodyAr,
  qrSlot,
  signatoryEn = "ADVETI Authorised Signatory",
  signatoryAr = "الموقّع المعتمد لدى أدفيتي",
  filename = "adveti-document.pdf",
  hideToolbar,
  defaultView = "side",
  className,
}) => {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const [view, setView] = React.useState<BilingualViewMode>(defaultView);

  const showEn = view === "side" || view === "en";
  const showAr = view === "side" || view === "ar";

  return (
    <div className={cn("w-full", className)}>
      {!hideToolbar && (
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div
            role="radiogroup"
            aria-label={isAr ? "وضع عرض المستند" : "Document view mode"}
            className="inline-flex items-center bg-surface-100 rounded-full p-1 gap-1 ring-1 ring-border-default"
          >
            {(
              [
                { id: "side", labelEn: "Side by side", labelAr: "جنبًا إلى جنب" },
                { id: "en", labelEn: "English only", labelAr: "الإنجليزية فقط" },
                { id: "ar", labelEn: "Arabic only", labelAr: "العربية فقط" },
              ] as const
            ).map((opt) => {
              const active = view === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setView(opt.id)}
                  className={cn(
                    "h-8 px-3 rounded-full text-xs font-semibold transition-all duration-fast focus-ring",
                    active
                      ? "bg-navy-800 text-ink-inverse shadow-sm"
                      : "text-ink-secondary hover:text-ink-primary",
                  )}
                >
                  {isAr ? opt.labelAr : opt.labelEn}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              iconStart={<Printer size={14} />}
              onClick={() => window.print()}
              aria-label={isAr ? "طباعة المستند" : "Print document"}
            >
              {isAr ? "طباعة" : "Print"}
            </Button>
            <Button
              variant="primary"
              size="sm"
              iconStart={<Download size={14} />}
              onClick={() => {
                /* PDF generation is wired downstream */
                const a = document.createElement("a");
                a.href = "#";
                a.download = filename;
                a.click();
              }}
            >
              {isAr ? "تنزيل PDF" : "Download PDF"}
            </Button>
          </div>
        </div>
      )}

      {/* A4 canvas — aspect ratio ~ 1:1.414 */}
      <div
        className="mx-auto bg-surface-0 shadow-xl ring-1 ring-border-default w-full max-w-[760px] aspect-[1/1.414] overflow-hidden flex flex-col"
        role="region"
        aria-label={isAr ? `معاينة ${titleAr}` : `Preview of ${titleEn}`}
      >
        {/* Top decorative gold border */}
        <div
          className="h-2 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 shrink-0"
          aria-hidden
        />

        {/* Header: seal + bilingual title bar */}
        <header className="flex items-center gap-3 px-6 py-4 border-b border-border-default bg-surface-50 shrink-0">
          <span
            className="h-12 w-12 rounded-md bg-navy-900 inline-flex items-center justify-center text-ink-inverse ring-2 ring-gold-500/40 shrink-0"
            aria-hidden
          >
            <GraduationCap size={22} />
          </span>
          <div className="flex-1 grid grid-cols-2 gap-3 min-w-0">
            <div lang="en" dir="ltr" className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.2em] text-gold-600 font-semibold">
                ADVETI · Abu Dhabi
              </p>
              <p className="text-sm font-bold text-navy-900 truncate">{titleEn}</p>
            </div>
            <div lang="ar" dir="rtl" className="min-w-0 text-right">
              <p className="text-[10px] uppercase tracking-[0.15em] text-gold-600 font-semibold">
                أدفيتي · أبوظبي
              </p>
              <p className="text-sm font-bold text-navy-900 truncate">{titleAr}</p>
            </div>
          </div>
        </header>

        {/* Reference bar — always LTR */}
        <div className="px-6 py-2 border-b border-border-default bg-surface-0 flex items-center justify-between text-[11px] text-ink-secondary shrink-0">
          <span>{isAr ? "رقم المرجع" : "Reference"}</span>
          <span dir="ltr" className="ltr-numeric font-mono font-semibold text-navy-900">
            {referenceNumber}
          </span>
        </div>

        {/* Body — split EN | AR */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 min-h-0">
          {showEn && (
            <article
              lang="en"
              dir="ltr"
              className={cn(
                "p-5 text-[12px] leading-relaxed text-ink-primary overflow-y-auto",
                showAr && "border-b sm:border-b-0 sm:border-e border-border-default",
              )}
            >
              {bodyEn}
            </article>
          )}
          {showAr && (
            <article
              lang="ar"
              dir="rtl"
              className="p-5 text-[12px] leading-[1.8] text-ink-primary overflow-y-auto font-arabic"
            >
              {bodyAr}
            </article>
          )}
        </div>

        {/* Footer: signature + QR. Order honours per-side direction */}
        <footer className="border-t border-border-default px-6 py-4 grid grid-cols-2 gap-4 items-end shrink-0 bg-surface-50">
          <div lang="en" dir="ltr" className="text-[10px] text-ink-secondary">
            <div className="border-t border-navy-900/40 pt-1 inline-block min-w-[140px]">
              <p className="font-semibold text-navy-900 text-[11px]">
                {signatoryEn}
              </p>
              <p className="inline-flex items-center gap-1 text-success-600">
                <ShieldCheck size={10} />
                Digitally signed
              </p>
            </div>
          </div>
          <div lang="ar" dir="rtl" className="text-[10px] text-ink-secondary text-right">
            <div className="border-t border-navy-900/40 pt-1 inline-block min-w-[140px]">
              <p className="font-semibold text-navy-900 text-[11px]">
                {signatoryAr}
              </p>
              <p className="inline-flex items-center gap-1 text-success-600">
                <ShieldCheck size={10} />
                موقّع رقميًا
              </p>
            </div>
          </div>
        </footer>

        {/* QR strip — bottom; placement flips with locale */}
        <div
          className={cn(
            "shrink-0 px-6 py-3 border-t border-border-default bg-surface-0 flex items-center gap-3",
            isAr ? "justify-start flex-row-reverse" : "justify-end",
          )}
        >
          <div className="text-[10px] text-ink-muted text-end">
            <p>{isAr ? "تحقّق عبر مسح الرمز" : "Scan to verify"}</p>
            <p dir="ltr" className="ltr-numeric font-mono">verify.adveti.ae</p>
          </div>
          <div
            className="h-16 w-16 bg-navy-950 text-ink-inverse rounded-sm grid place-items-center"
            aria-label={isAr ? "رمز الاستجابة السريعة للتحقق" : "Verification QR code"}
            role="img"
          >
            {qrSlot ?? <QrPlaceholder />}
          </div>
        </div>

        {/* Bottom decorative gold border */}
        <div
          className="h-2 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 shrink-0"
          aria-hidden
        />
      </div>
    </div>
  );
};

/** Tiny inline pattern used when no real QR is supplied. */
const QrPlaceholder: React.FC = () => (
  <svg viewBox="0 0 21 21" className="h-12 w-12" aria-hidden>
    {Array.from({ length: 21 }).map((_, y) =>
      Array.from({ length: 21 }).map((_, x) => {
        // Deterministic pseudo-noise so previews are stable
        const on = ((x * 7 + y * 13) % 5) < 2 || (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
        return on ? (
          <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="white" />
        ) : null;
      }),
    )}
  </svg>
);
