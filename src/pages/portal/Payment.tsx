import * as React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AlertCircle, CreditCard, Lock, ShieldCheck } from "lucide-react";
import { Alert, Button, Card, CardContent, Input } from "@/components/adveti";
import { useLang } from "@/hooks/useLang";
import { formatAED } from "@/lib/format";

const Payment: React.FC = () => {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [failures, setFailures] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);

  const fee = 1000;
  const vat = Math.round(fee * 0.05);
  const total = fee + vat;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setLoading(false);
      // simulate failure first 2 attempts
      if (failures < 1) {
        setFailures((f) => f + 1);
        setError(
          isAr
            ? "فشلت عملية الدفع — رمز 51: رصيد غير كافٍ"
            : "Payment unsuccessful — code 51: insufficient funds",
        );
      } else {
        navigate(`/portal/applications/${id}/payment/receipt`);
      }
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-ink-primary">
          {isAr ? "إتمام الدفع" : "Complete payment"}
        </h1>
        <p className="text-sm text-ink-secondary mt-1">
          {isAr ? "للطلب " : "For application "}
          <span className="font-mono" dir="ltr">{id}</span>
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Order summary */}
        <div className="lg:col-span-2">
          <Card variant="government">
            <CardContent className="pt-6">
              <h2 className="text-sm font-semibold text-ink-primary mb-4">
                {isAr ? "ملخص الطلب" : "Order summary"}
              </h2>
              <dl className="text-sm divide-y divide-border-default">
                <Row labelEn="Application" labelAr="الطلب" valueEn={id ?? "—"} valueAr={id ?? "—"} mono isAr={isAr} />
                <Row labelEn="Category" labelAr="الفئة" valueEn="Teacher" valueAr="معلم" isAr={isAr} />
                <Row labelEn="Application fee" labelAr="رسوم الطلب" valueEn={formatAED(fee, lang)} valueAr={formatAED(fee, lang)} isAr={isAr} />
                <Row labelEn="VAT (5%)" labelAr="ضريبة القيمة المضافة (5٪)" valueEn={formatAED(vat, lang)} valueAr={formatAED(vat, lang)} isAr={isAr} />
              </dl>
              <div className="mt-3 pt-3 border-t-2 border-navy-800 flex justify-between items-center">
                <span className="text-sm font-bold text-ink-primary">
                  {isAr ? "الإجمالي" : "Total"}
                </span>
                <span className="text-xl font-bold text-navy-900">
                  {formatAED(total, lang)}
                </span>
              </div>
              <Link
                to="/refund-policy"
                className="text-xs text-navy-800 hover:underline mt-4 inline-block"
              >
                {isAr ? "اطلع على سياسة الاسترداد" : "View refund policy"}
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Payment iframe placeholder */}
        <div className="lg:col-span-3">
          <Card variant="bordered">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4 text-xs text-ink-muted">
                <Lock size={12} />
                {isAr
                  ? "بوابة دفع آمنة عبر شريك إماراتي مرخّص"
                  : "Secured by a UAE-licensed acquirer (Magnati / Network International)"}
              </div>

              {error && (
                <Alert type="error" title={isAr ? "فشل الدفع" : "Payment failed"} className="mb-4">
                  {error}
                </Alert>
              )}

              {failures >= 3 && (
                <Alert type="warning" title={isAr ? "تم حفظ طلبك كمسودة" : "Application saved as Draft"} className="mb-4">
                  {isAr
                    ? "تجاوزت عدد المحاولات. يمكنك العودة من لوحة التحكم لاحقاً."
                    : "Too many attempts. You can return to payment from your dashboard."}
                </Alert>
              )}

              <form onSubmit={handlePay} className="space-y-4">
                <Input
                  label={isAr ? "رقم البطاقة" : "Card number"}
                  placeholder="4242 4242 4242 4242"
                  iconStart={<CreditCard size={16} />}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input label={isAr ? "تاريخ الانتهاء" : "Expiry"} placeholder="MM/YY" required />
                  <Input label="CVC" placeholder="123" required />
                </div>
                <Input
                  label={isAr ? "الاسم على البطاقة" : "Name on card"}
                  placeholder="LAYLA H AL MARRI"
                  required
                />

                <Button
                  type="submit"
                  variant="gold"
                  size="lg"
                  fullWidth
                  loading={loading}
                  disabled={failures >= 3}
                >
                  {isAr
                    ? `ادفع ${formatAED(total, lang)} بأمان`
                    : `Pay ${formatAED(total, lang)} securely`}
                </Button>

                {error && (
                  <div className="flex justify-between text-xs">
                    <button type="button" className="text-navy-800 hover:underline">
                      {isAr ? "استخدم بطاقة أخرى" : "Use a different card"}
                    </button>
                    <Link to="/contact" className="text-navy-800 hover:underline">
                      {isAr ? "تواصل مع الدعم" : "Contact support"}
                    </Link>
                  </div>
                )}
              </form>

              <p className="text-xs text-ink-muted mt-4 inline-flex items-center gap-1">
                <ShieldCheck size={12} className="text-success-600" />
                {isAr ? "متوافق مع PCI-DSS" : "PCI-DSS compliant"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const Row: React.FC<{
  labelEn: string;
  labelAr: string;
  valueEn: string;
  valueAr: string;
  isAr: boolean;
  mono?: boolean;
}> = ({ labelEn, labelAr, valueEn, valueAr, isAr, mono }) => (
  <div className="py-2 flex justify-between gap-3">
    <dt className="text-ink-secondary">{isAr ? labelAr : labelEn}</dt>
    <dd className={mono ? "font-mono text-ink-primary" : "text-ink-primary font-medium"} dir={mono ? "ltr" : undefined}>
      {isAr ? valueAr : valueEn}
    </dd>
  </div>
);

export default Payment;
