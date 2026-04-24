import * as React from "react";
import { useLang } from "@/hooks/useLang";
import { Card, Button, Badge } from "@/components/adveti";
import { Download, FileSpreadsheet, FileText, Lock } from "lucide-react";
import { exportCatalogue } from "@/lib/mockAudit";

const formatDate = (d: Date, lang: "en" | "ar") =>
  new Intl.DateTimeFormat(lang === "ar" ? "ar-AE-u-nu-arab" : "en-GB", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  }).format(d);

const ExportsReportPage: React.FC = () => {
  const { lang, t } = useLang();

  const handleDownload = (id: string, name: string, format: string) => {
    const csv = `"Report","${name}"\n"Generated","${new Date().toISOString()}"\n"Note","Auditor export — PII masked per RBAC"\n"Rows","mock data only"`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${id}.${format.toLowerCase()}`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-ink-primary">{t({ en: "Data Exports", ar: "تصدير البيانات" })}</h1>
        <p className="text-sm text-ink-secondary mt-1">
          {t({ en: "Read-only access to system exports. PII is masked per Auditor RBAC.", ar: "وصول للقراءة فقط لمستخرجات النظام. البيانات الشخصية مخفية وفق صلاحية المدقق." })}
        </p>
      </header>

      <div className="rounded-lg bg-info-100 border border-info-600/20 px-4 py-3 text-sm text-info-600 flex items-center gap-2">
        <Lock size={14} />
        {t({ en: "Scheduling, custom-report builder, and unmasked exports are not available in Auditor mode.", ar: "الجدولة وبناء التقارير المخصصة والتصدير غير المقنّع غير متاحة في وضع المدقق." })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exportCatalogue.map((item) => {
          const Icon = item.format === "PDF" ? FileText : FileSpreadsheet;
          return (
            <Card key={item.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-100 flex items-center justify-center text-ink-secondary">
                    <Icon size={18} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-ink-primary">{lang === "ar" ? item.nameAr : item.name}</h3>
                    <p className="text-sm text-ink-secondary mt-1">{lang === "ar" ? item.descriptionAr : item.description}</p>
                  </div>
                </div>
                <Badge variant="gold">{item.format}</Badge>
              </div>
              <div className="mt-4 pt-3 border-t border-border-default flex items-center justify-between text-xs text-ink-secondary">
                <div>
                  <div>{t({ en: "Last generated", ar: "آخر إصدار" })}: <span className="text-ink-primary">{formatDate(item.lastGeneratedAt, lang)}</span></div>
                  <div className="mt-1">{t({ en: "Rows", ar: "صفوف" })}: <span className="font-mono text-ink-primary">{item.rowCount.toLocaleString()}</span></div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Download size={14} />}
                  onClick={() => handleDownload(item.id, item.name, item.format)}
                >
                  {t({ en: "Download", ar: "تنزيل" })}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ExportsReportPage;
