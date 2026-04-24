import * as React from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronRight, RefreshCcw } from "lucide-react";
import { Alert, Button, Card, CardContent, Input, Textarea } from "@/components/adveti";
import { useLang } from "@/hooks/useLang";
import { formatAED } from "@/lib/format";
import { getApplicationById } from "@/lib/mockApplicant";

const Renew: React.FC = () => {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const { id } = useParams();
  const app = getApplicationById(id ?? "");
  const renewalFee = 800;
  const vat = Math.round(renewalFee * 0.05);
  const total = renewalFee + vat;

  return (
    <div className="space-y-6 max-w-3xl">
      <header>
        <p className="text-xs uppercase tracking-wider text-gold-600 font-semibold">
          {isAr ? "تجديد الترخيص" : "Licence renewal"}
        </p>
        <h1 className="text-2xl font-bold text-ink-primary mt-1">
          {isAr ? "تجديد ترخيص " : "Renew "}
          <span className="font-mono" dir="ltr">{app.id}</span>
        </h1>
      </header>

      <Alert type="info" title={isAr ? "تم تعبئة معظم الحقول مسبقاً" : "Most fields pre-populated"}>
        {isAr
          ? "نحتاج فقط إلى تحديث إقرار التطوير المهني والوثائق المنتهية."
          : "We only need updated CPD declaration and expired documents."}
      </Alert>

      <Card variant="bordered">
        <CardContent className="pt-6 space-y-4">
          <h2 className="text-sm font-semibold text-ink-primary">
            {isAr ? "إقرار التطوير المهني (الفترة الجديدة)" : "CPD declaration (new period)"}
          </h2>
          <Input
            type="number"
            label={isAr ? "إجمالي الساعات" : "Total CPD hours"}
            required
            min="0"
            max="999"
          />
          <Textarea
            label={isAr ? "الأنشطة" : "Activities"}
            rows={3}
            placeholder={isAr ? "صف الأنشطة…" : "Describe activities…"}
          />
        </CardContent>
      </Card>

      <Card variant="government">
        <CardContent className="pt-6">
          <h2 className="text-sm font-semibold text-ink-primary mb-3">
            {isAr ? "رسوم التجديد" : "Renewal fee"}
          </h2>
          <dl className="text-sm divide-y divide-border-default">
            <div className="py-2 flex justify-between">
              <dt className="text-ink-secondary">{isAr ? "رسوم التجديد" : "Renewal fee"}</dt>
              <dd className="font-medium">{formatAED(renewalFee, lang)}</dd>
            </div>
            <div className="py-2 flex justify-between">
              <dt className="text-ink-secondary">VAT (5%)</dt>
              <dd className="font-medium">{formatAED(vat, lang)}</dd>
            </div>
            <div className="py-2 flex justify-between text-base">
              <dt className="font-semibold">{isAr ? "الإجمالي" : "Total"}</dt>
              <dd className="font-bold text-navy-900">{formatAED(total, lang)}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Link to={`/portal/applications/${app.id}`}>
          <Button variant="ghost">{isAr ? "إلغاء" : "Cancel"}</Button>
        </Link>
        <Link to={`/portal/applications/${app.id}/payment`}>
          <Button variant="gold" iconStart={<RefreshCcw size={14} />} iconEnd={<ChevronRight size={14} className="rtl-flip" />}>
            {isAr ? "متابعة الدفع" : "Continue to payment"}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Renew;
