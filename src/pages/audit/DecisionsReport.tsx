import * as React from "react";
import { useLang } from "@/hooks/useLang";
import { Card, Button, Badge } from "@/components/adveti";
import { Download, Lock } from "lucide-react";
import { decisionRatios } from "@/lib/mockAudit";

const total = (r: { pass: number; incomplete: number; reject: number }) => r.pass + r.incomplete + r.reject;
const pct = (n: number, d: number) => d === 0 ? 0 : Math.round((n / d) * 1000) / 10;

const DecisionsReportPage: React.FC = () => {
  const { lang, t } = useLang();

  const grand = decisionRatios.reduce(
    (acc, r) => ({ pass: acc.pass + r.pass, incomplete: acc.incomplete + r.incomplete, reject: acc.reject + r.reject }),
    { pass: 0, incomplete: 0, reject: 0 },
  );
  const grandTotal = total(grand);
  const gPass = pct(grand.pass, grandTotal);
  const gInc = pct(grand.incomplete, grandTotal);
  const gRej = pct(grand.reject, grandTotal);

  const conic = `conic-gradient(hsl(var(--success-600)) 0 ${gPass}%, hsl(var(--warning-600)) ${gPass}% ${gPass + gInc}%, hsl(var(--danger-600)) ${gPass + gInc}% 100%)`;

  const handleExport = () => {
    const headers = ["Category", "Pass", "Incomplete", "Reject", "Total", "Pass %", "Incomplete %", "Reject %"];
    const rows = decisionRatios.map((r) => {
      const tot = total(r);
      return [r.category, r.pass, r.incomplete, r.reject, tot, pct(r.pass, tot), pct(r.incomplete, tot), pct(r.reject, tot)];
    });
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `decision-ratios-${new Date().toISOString().slice(0,10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-ink-primary">{t({ en: "Decision Outcomes Report", ar: "تقرير نتائج القرارات" })}</h1>
          <p className="text-sm text-ink-secondary mt-1">
            {t({ en: "Pass / Incomplete / Reject ratios by licence category. Read-only for Auditor.", ar: "نسب النجاح / غير المكتمل / الرفض حسب فئة الترخيص. للقراءة فقط للمدقق." })}
          </p>
        </div>
        <Button variant="ghost" leftIcon={<Download size={16} />} onClick={handleExport}>
          {t({ en: "Export CSV", ar: "تصدير CSV" })}
        </Button>
      </header>

      <div className="rounded-lg bg-info-100 border border-info-600/20 px-4 py-3 text-sm text-info-600 flex items-center gap-2">
        <Lock size={14} />
        {t({ en: "Auditor read-only access — scheduling and configuration controls are hidden.", ar: "وصول للقراءة فقط للمدقق — إعدادات الجدولة والتكوين مخفية." })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <h3 className="text-sm font-semibold text-ink-primary mb-4">{t({ en: "Overall ratio", ar: "النسبة الإجمالية" })}</h3>
          <div className="flex flex-col items-center">
            <div
              className="w-44 h-44 rounded-full relative"
              style={{ background: conic }}
              role="img"
              aria-label="Decision outcome donut"
            >
              <div className="absolute inset-6 rounded-full bg-surface-0 flex flex-col items-center justify-center">
                <div className="text-2xl font-bold text-ink-primary">{grandTotal}</div>
                <div className="text-xs text-ink-secondary">{t({ en: "decisions", ar: "قرارًا" })}</div>
              </div>
            </div>
            <div className="mt-5 w-full space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-success-600" />{t({ en: "Pass", ar: "نجاح" })}</span>
                <span className="font-mono">{grand.pass} ({gPass}%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-warning-600" />{t({ en: "Incomplete", ar: "غير مكتمل" })}</span>
                <span className="font-mono">{grand.incomplete} ({gInc}%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-danger-600" />{t({ en: "Reject", ar: "رفض" })}</span>
                <span className="font-mono">{grand.reject} ({gRej}%)</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <h3 className="text-sm font-semibold text-ink-primary mb-4">{t({ en: "By licence category", ar: "حسب فئة الترخيص" })}</h3>
          <div className="space-y-5">
            {decisionRatios.map((r) => {
              const tot = total(r);
              const p = pct(r.pass, tot);
              const i = pct(r.incomplete, tot);
              const j = pct(r.reject, tot);
              return (
                <div key={r.category}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-ink-primary">{r.category}</div>
                    <Badge variant="neutral">{tot} {t({ en: "total", ar: "إجمالي" })}</Badge>
                  </div>
                  <div className="h-3 w-full rounded-full overflow-hidden flex bg-surface-100" dir="ltr">
                    <div className="bg-success-600" style={{ width: `${p}%` }} title={`Pass ${p}%`} />
                    <div className="bg-warning-600" style={{ width: `${i}%` }} title={`Incomplete ${i}%`} />
                    <div className="bg-danger-600" style={{ width: `${j}%` }} title={`Reject ${j}%`} />
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2 text-xs text-ink-secondary">
                    <div>{t({ en: "Pass", ar: "نجاح" })}: <span className="font-mono text-ink-primary">{r.pass} ({p}%)</span></div>
                    <div>{t({ en: "Incomplete", ar: "غير مكتمل" })}: <span className="font-mono text-ink-primary">{r.incomplete} ({i}%)</span></div>
                    <div>{t({ en: "Reject", ar: "رفض" })}: <span className="font-mono text-ink-primary">{r.reject} ({j}%)</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DecisionsReportPage;
