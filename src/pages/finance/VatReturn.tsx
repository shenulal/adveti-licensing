import * as React from "react";
import { Download, Info } from "lucide-react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Select,
  useToast,
} from "@/components/adveti";
import { useLang } from "@/hooks/useLang";
import { formatAED } from "@/lib/format";
import { vatQuarters } from "@/lib/mockFinance";

const VatReturn: React.FC = () => {
  const { lang } = useLang();
  const { push } = useToast();
  const isAr = lang === "ar";

  const [quarterId, setQuarterId] = React.useState<string>(vatQuarters[1].id);
  const quarter = vatQuarters.find((q) => q.id === quarterId)!;

  const handleDownload = () => {
    // Mock VAT return XLSX — in V1 calls backend; for now produce CSV
    const headers = isAr
      ? [
          "البند",
          "المبلغ (د.إ)",
          "ضريبة القيمة المضافة 5% (د.إ)",
        ]
      : ["Item", "Amount (AED)", "VAT 5% (AED)"];
    const rows = [
      [
        isAr ? "التوريدات الخاضعة للنسبة الأساسية" : "Standard-rated supplies",
        quarter.standardRated,
        quarter.vatCollected,
      ],
      [
        isAr ? "التوريدات بنسبة صفرية" : "Zero-rated supplies",
        quarter.zeroRated,
        0,
      ],
      [
        isAr ? "المبالغ المستردة" : "Refunds issued",
        -quarter.refundsIssued,
        -quarter.vatOnRefunds,
      ],
      [isAr ? "صافي الضريبة المستحقة" : "Net VAT payable", "", quarter.netVatPayable],
    ];
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${c}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vat-return-${quarter.id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    push({
      title: isAr ? "تم التنزيل" : "Downloaded",
      description: isAr
        ? `حزمة إقرار ضريبة ${isAr ? quarter.labelAr : quarter.labelEn}`
        : `VAT return package for ${quarter.labelEn}`,
      type: "success",
    });
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-ink-primary">
          {isAr ? "تصدير إقرار ضريبة القيمة المضافة" : "VAT Return Export"}
        </h1>
        <p className="text-sm text-ink-secondary mt-1">
          {isAr
            ? "حزم إقرار ربع سنوية بصيغة هيئة الضرائب الاتحادية"
            : "Quarterly returns formatted per UAE FTA requirements"}
        </p>
      </header>

      <Card variant="bordered">
        <CardContent className="pt-5 grid gap-4 md:grid-cols-[1fr_auto] items-end">
          <Select
            label={isAr ? "اختر الربع" : "Select quarter"}
            value={quarterId}
            onChange={(e) => setQuarterId(e.target.value)}
            options={vatQuarters.map((q) => ({
              value: q.id,
              label: isAr ? q.labelAr : q.labelEn,
            }))}
          />
          <Button
            variant="primary"
            iconStart={<Download size={16} />}
            onClick={handleDownload}
          >
            {isAr
              ? "تنزيل حزمة إقرار ضريبة القيمة (XLSX)"
              : "Download VAT Return Package (XLSX)"}
          </Button>
        </CardContent>
      </Card>

      <Card variant="bordered">
        <CardContent className="pt-5">
          <h2 className="text-base font-semibold text-ink-primary mb-4">
            {isAr
              ? `ملخص ${quarter.labelAr}`
              : `Summary — ${quarter.labelEn}`}
          </h2>
          <div className="overflow-x-auto rounded-md border border-border-default">
            <table className="w-full text-sm">
              <thead className="bg-surface-50 border-b border-border-default">
                <tr>
                  <th className="text-start px-4 py-3 text-xs uppercase tracking-wider font-semibold text-ink-secondary">
                    {isAr ? "البند" : "Item"}
                  </th>
                  <th className="text-end px-4 py-3 text-xs uppercase tracking-wider font-semibold text-ink-secondary">
                    {isAr ? "المبلغ (د.إ)" : "Amount (AED)"}
                  </th>
                  <th className="text-end px-4 py-3 text-xs uppercase tracking-wider font-semibold text-ink-secondary">
                    {isAr ? "ضريبة 5% (د.إ)" : "VAT 5% (AED)"}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border-default">
                  <td className="px-4 py-3">
                    {isAr
                      ? "التوريدات الخاضعة للضريبة (رسوم الطلبات)"
                      : "Standard-rated supplies (application fees)"}
                  </td>
                  <td className="px-4 py-3 text-end font-medium" dir="ltr">
                    {formatAED(quarter.standardRated, lang)}
                  </td>
                  <td className="px-4 py-3 text-end font-medium" dir="ltr">
                    {formatAED(quarter.vatCollected, lang)}
                  </td>
                </tr>
                <tr className="border-b border-border-default">
                  <td className="px-4 py-3 text-ink-secondary">
                    {isAr
                      ? "التوريدات بنسبة صفرية"
                      : "Zero-rated supplies"}
                  </td>
                  <td className="px-4 py-3 text-end" dir="ltr">
                    {formatAED(quarter.zeroRated, lang)}
                  </td>
                  <td className="px-4 py-3 text-end text-ink-muted">—</td>
                </tr>
                <tr className="border-b border-border-default">
                  <td className="px-4 py-3 text-warning-600">
                    {isAr ? "المبالغ المستردة" : "Refunds issued"}
                  </td>
                  <td
                    className="px-4 py-3 text-end text-warning-600"
                    dir="ltr"
                  >
                    ({formatAED(quarter.refundsIssued, lang)})
                  </td>
                  <td
                    className="px-4 py-3 text-end text-warning-600"
                    dir="ltr"
                  >
                    ({formatAED(quarter.vatOnRefunds, lang)})
                  </td>
                </tr>
                <tr className="bg-navy-900 text-ink-inverse">
                  <td className="px-4 py-3 font-bold">
                    {isAr
                      ? "صافي ضريبة القيمة المضافة المستحقة"
                      : "Net VAT payable"}
                  </td>
                  <td className="px-4 py-3 text-end" />
                  <td
                    className="px-4 py-3 text-end font-bold text-gold-400"
                    dir="ltr"
                  >
                    {formatAED(quarter.netVatPayable, lang)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Alert type="info" title={isAr ? "ملاحظة" : "Disclaimer"}>
        <Info size={14} className="inline me-1.5" />
        {isAr
          ? "هذا التصدير لأغراض مرجعية. يرجى تقديم الإقرار عبر بوابة الضرائب الإلكترونية للهيئة الاتحادية للضرائب."
          : "This export is for reference. Submit via the UAE FTA eTax portal."}
      </Alert>
    </div>
  );
};

export default VatReturn;
