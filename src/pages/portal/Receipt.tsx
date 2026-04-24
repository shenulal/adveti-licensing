import * as React from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, Download, FileText, ChevronRight } from "lucide-react";
import { Button, Card, CardContent } from "@/components/adveti";
import { useLang } from "@/hooks/useLang";
import { formatAED, formatDate } from "@/lib/format";

const Receipt: React.FC = () => {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const { id } = useParams();
  const fee = 1000;
  const vat = Math.round(fee * 0.05);
  const total = fee + vat;
  const receiptNumber = "RCP-2026-00892";
  const paidAt = new Date();

  return (
    <div className="max-w-2xl mx-auto py-6">
      <Card variant="elevated">
        <CardContent className="pt-8 pb-8 text-center">
          <span className="inline-flex h-16 w-16 rounded-full bg-success-600 text-ink-inverse items-center justify-center mb-4">
            <CheckCircle2 size={32} />
          </span>
          <h1 className="text-2xl font-bold text-ink-primary">
            {isAr ? "تم الدفع بنجاح" : "Payment successful"}
          </h1>
          <p className="text-sm text-ink-secondary mt-2">
            {isAr
              ? "تم استلام دفعتك. سنحيل طلبك إلى مقيّم خلال يوم عمل واحد."
              : "Your payment has been received. We will assign your application to an assessor within one business day."}
          </p>

          <dl className="mt-6 text-start text-sm bg-surface-50 rounded-lg p-5 space-y-2 border border-border-default">
            <Row label={isAr ? "رقم الإيصال" : "Receipt no."} value={receiptNumber} mono />
            <Row label={isAr ? "التاريخ" : "Date"} value={formatDate(paidAt, lang)} />
            <Row label={isAr ? "رقم الطلب" : "Application reference"} value={id ?? "—"} mono />
            <Row label={isAr ? "المبلغ" : "Amount"} value={formatAED(fee, lang)} />
            <Row label={isAr ? "VAT" : "VAT"} value={formatAED(vat, lang)} />
            <div className="pt-2 mt-2 border-t border-border-default flex justify-between font-semibold text-ink-primary">
              <span>{isAr ? "الإجمالي" : "Total paid"}</span>
              <span className="text-navy-900">{formatAED(total, lang)}</span>
            </div>
          </dl>

          <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-center">
            <Button variant="secondary" iconStart={<Download size={16} />}>
              {isAr ? "تنزيل فاتورة VAT" : "Download VAT invoice (PDF)"}
            </Button>
            <Link to={`/portal/applications/${id}`}>
              <Button variant="gold" iconEnd={<ChevronRight size={16} className="rtl-flip" />}>
                {isAr ? "متابعة حالة الطلب" : "Continue to application status"}
              </Button>
            </Link>
          </div>

          <p className="text-xs text-ink-muted mt-4 inline-flex items-center gap-1">
            <FileText size={12} />
            {isAr
              ? "تم إرسال نسخة من الإيصال إلى بريدك الإلكتروني"
              : "A copy of this receipt has been sent to your email"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

const Row: React.FC<{ label: string; value: string; mono?: boolean }> = ({ label, value, mono }) => (
  <div className="flex justify-between gap-3">
    <dt className="text-ink-secondary">{label}</dt>
    <dd className={mono ? "font-mono text-ink-primary" : "text-ink-primary"} dir={mono ? "ltr" : undefined}>
      {value}
    </dd>
  </div>
);

export default Receipt;
