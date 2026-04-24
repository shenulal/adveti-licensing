import * as React from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, ChevronRight, FileText } from "lucide-react";
import {
  BilingualPDFPreview,
  Button,
  Card,
  CardContent,
  Ltr,
} from "@/components/adveti";
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

  const bodyEn = (
    <div className="space-y-3">
      <p className="text-[11px] uppercase tracking-[0.2em] text-gold-600 font-semibold">
        Tax Invoice · VAT
      </p>
      <p>
        ADVETI hereby acknowledges receipt of the following payment for
        application <strong>{id ?? "—"}</strong>.
      </p>
      <table className="w-full text-[11px] border-t border-b border-border-default my-2">
        <tbody>
          <tr className="border-b border-border-default">
            <td className="py-1.5">Application fee</td>
            <td className="py-1.5 text-end font-mono">{formatAED(fee, "en")}</td>
          </tr>
          <tr className="border-b border-border-default">
            <td className="py-1.5">VAT (5%)</td>
            <td className="py-1.5 text-end font-mono">{formatAED(vat, "en")}</td>
          </tr>
          <tr>
            <td className="py-1.5 font-semibold">Total</td>
            <td className="py-1.5 text-end font-mono font-semibold text-navy-900">
              {formatAED(total, "en")}
            </td>
          </tr>
        </tbody>
      </table>
      <p className="text-[10px] text-ink-secondary">
        TRN: 100123456700003 · Paid on {formatDate(paidAt, "en")}
      </p>
    </div>
  );

  const bodyAr = (
    <div className="space-y-3">
      <p className="text-[11px] uppercase tracking-[0.15em] text-gold-600 font-semibold">
        فاتورة ضريبية · ضريبة القيمة المضافة
      </p>
      <p>
        تقرّ أدفيتي باستلام الدفعة التالية مقابل الطلب رقم{" "}
        <strong>{id ?? "—"}</strong>.
      </p>
      <table className="w-full text-[11px] border-t border-b border-border-default my-2">
        <tbody>
          <tr className="border-b border-border-default">
            <td className="py-1.5">رسوم الطلب</td>
            <td className="py-1.5 text-end font-mono" dir="ltr">
              {formatAED(fee, "ar")}
            </td>
          </tr>
          <tr className="border-b border-border-default">
            <td className="py-1.5">ضريبة القيمة المضافة (5%)</td>
            <td className="py-1.5 text-end font-mono" dir="ltr">
              {formatAED(vat, "ar")}
            </td>
          </tr>
          <tr>
            <td className="py-1.5 font-semibold">الإجمالي</td>
            <td className="py-1.5 text-end font-mono font-semibold text-navy-900" dir="ltr">
              {formatAED(total, "ar")}
            </td>
          </tr>
        </tbody>
      </table>
      <p className="text-[10px] text-ink-secondary">
        الرقم الضريبي: 100123456700003 · مدفوعة في {formatDate(paidAt, "ar")}
      </p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      <Card variant="elevated">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-start gap-4">
            <span className="inline-flex h-12 w-12 rounded-full bg-success-600 text-ink-inverse items-center justify-center shrink-0">
              <CheckCircle2 size={26} />
            </span>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-ink-primary">
                {isAr ? "تم الدفع بنجاح" : "Payment successful"}
              </h1>
              <p className="text-sm text-ink-secondary mt-1">
                {isAr
                  ? "تم استلام دفعتك. سنحيل طلبك إلى مقيّم خلال يوم عمل واحد."
                  : "Your payment has been received. We will assign your application to an assessor within one business day."}
              </p>
              <div className="flex flex-wrap gap-2 mt-3 text-xs text-ink-secondary">
                <span>
                  {isAr ? "رقم الإيصال: " : "Receipt no.: "}
                  <Ltr className="font-mono text-ink-primary">{receiptNumber}</Ltr>
                </span>
                <span aria-hidden>·</span>
                <span>
                  {isAr ? "رقم الطلب: " : "Application: "}
                  <Ltr className="font-mono text-ink-primary">{id ?? "—"}</Ltr>
                </span>
              </div>
            </div>
            <Link to={`/portal/applications/${id}`}>
              <Button variant="gold" iconEnd={<ChevronRight size={16} className="rtl-flip" />}>
                {isAr ? "متابعة الحالة" : "Continue"}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <BilingualPDFPreview
        titleEn="VAT Tax Invoice"
        titleAr="فاتورة ضريبة القيمة المضافة"
        referenceNumber={receiptNumber}
        bodyEn={bodyEn}
        bodyAr={bodyAr}
        filename={`adveti-vat-invoice-${receiptNumber}.pdf`}
      />

      <p className="text-xs text-ink-muted text-center inline-flex items-center gap-1 justify-center w-full">
        <FileText size={12} aria-hidden />
        {isAr
          ? "تم إرسال نسخة من الفاتورة إلى بريدك الإلكتروني"
          : "A copy of this invoice has been sent to your email"}
      </p>
    </div>
  );
};

export default Receipt;
