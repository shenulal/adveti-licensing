import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, ChevronRight, Clock, FileText, Save, ShieldCheck } from "lucide-react";
import { Button, Card, CardContent, Select } from "@/components/adveti";
import { useLang } from "@/hooks/useLang";
import { formatAED } from "@/lib/format";

interface DocReq {
  en: string;
  ar: string;
  type: "PDF" | "JPG/PNG";
  maxMb: number;
}

const DOC_REQS: DocReq[] = [
  { en: "Emirates ID (front + back)", ar: "الهوية الإماراتية (الأمامية والخلفية)", type: "PDF", maxMb: 5 },
  { en: "Highest degree certificate", ar: "شهادة أعلى مؤهل", type: "PDF", maxMb: 5 },
  { en: "Professional experience letter", ar: "خطاب الخبرة المهنية", type: "PDF", maxMb: 5 },
  { en: "CPD declaration evidence", ar: "ما يُثبت ساعات التطوير المهني", type: "PDF", maxMb: 5 },
  { en: "Professional photograph", ar: "صورة شخصية مهنية", type: "JPG/PNG", maxMb: 2 },
];

const FEES = {
  Teacher: { app: 1000 },
  Counsellor: { app: 800 },
  Trainer: { app: 600 },
};

const Apply: React.FC = () => {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const navigate = useNavigate();
  const [category, setCategory] = React.useState<"Teacher" | "Counsellor" | "Trainer">("Teacher");

  const fee = FEES[category].app;
  const vat = Math.round(fee * 0.05);
  const total = fee + vat;

  const start = () => {
    const id = `APP-2026-${String(Math.floor(Math.random() * 99999)).padStart(5, "0")}`;
    navigate(`/portal/apply/${id}/step/1`);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-gold-600 font-semibold">
          {isAr ? "قبل أن تبدأ" : "Before you begin"}
        </p>
        <h1 className="text-2xl md:text-3xl font-bold text-ink-primary mt-1">
          {isAr ? "هل أنت مستعد للتقديم؟" : "Ready to apply?"}
        </h1>
        <p className="mt-2 text-sm text-ink-secondary max-w-2xl">
          {isAr
            ? "راجع المتطلبات وجدول الرسوم قبل البدء. يمكنك حفظ مسودتك في أي وقت ومتابعتها لاحقاً."
            : "Review the requirements and fee schedule before starting. You can save your draft at any time and continue later."}
        </p>
      </header>

      <Card variant="bordered">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-9 w-9 rounded-md bg-navy-800 text-ink-inverse inline-flex items-center justify-center">
              <FileText size={18} />
            </span>
            <h2 className="text-lg font-semibold text-ink-primary">
              {isAr ? "اختر فئة الترخيص" : "Choose your licence category"}
            </h2>
          </div>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value as typeof category)}
            options={[
              { value: "Teacher", label: isAr ? "معلم" : "Teacher" },
              { value: "Counsellor", label: isAr ? "مرشد" : "Counsellor" },
              { value: "Trainer", label: isAr ? "مدرّب" : "Trainer" },
            ]}
          />
        </CardContent>
      </Card>

      {/* Required documents checklist */}
      <Card variant="government">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-9 w-9 rounded-md bg-gold-100 text-gold-600 inline-flex items-center justify-center">
              <CheckCircle2 size={18} />
            </span>
            <h2 className="text-lg font-semibold text-ink-primary">
              {isAr ? "الوثائق المطلوبة" : "Required documents"}
            </h2>
          </div>
          <ol className="space-y-3">
            {DOC_REQS.map((d, i) => (
              <li
                key={d.en}
                className="flex items-start gap-3 p-3 rounded-md bg-surface-50 border border-border-default"
              >
                <span className="h-7 w-7 rounded-full bg-navy-800 text-ink-inverse inline-flex items-center justify-center text-xs font-bold shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-ink-primary">
                    {isAr ? d.ar : d.en}
                  </p>
                  <p className="text-xs text-ink-secondary mt-0.5">
                    {d.type} ·{" "}
                    {isAr ? `الحد الأقصى ${d.maxMb} ميغابايت` : `max ${d.maxMb} MB`}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Fees */}
      <Card variant="bordered">
        <CardContent className="pt-6">
          <h2 className="text-lg font-semibold text-ink-primary mb-3">
            {isAr ? "ملخص الرسوم" : "Fee summary"}
          </h2>
          <dl className="text-sm divide-y divide-border-default">
            <div className="py-2 flex items-center justify-between">
              <dt className="text-ink-secondary">{isAr ? "رسوم الطلب" : "Application fee"}</dt>
              <dd className="text-ink-primary font-medium">{formatAED(fee, lang)}</dd>
            </div>
            <div className="py-2 flex items-center justify-between">
              <dt className="text-ink-secondary">{isAr ? "ضريبة القيمة المضافة (5٪)" : "VAT (5%)"}</dt>
              <dd className="text-ink-primary font-medium">{formatAED(vat, lang)}</dd>
            </div>
            <div className="py-2 flex items-center justify-between text-base">
              <dt className="font-semibold text-ink-primary">{isAr ? "الإجمالي" : "Total"}</dt>
              <dd className="font-bold text-navy-900">{formatAED(total, lang)}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* SLA reminder */}
      <div className="rounded-md bg-info-100 border border-info-600/20 p-4 flex gap-3 items-start">
        <Clock size={18} className="text-info-600 shrink-0 mt-0.5" />
        <p className="text-sm text-ink-primary">
          {isAr
            ? "تتم مراجعة الطلبات عادة خلال 2–5 أيام عمل بعد التقديم والدفع."
            : "Applications are typically reviewed within 2–5 business days after submission and payment."}
        </p>
      </div>

      <div className="flex flex-wrap gap-3 items-center pt-4">
        <Button
          variant="gold"
          size="lg"
          iconEnd={<ChevronRight size={16} className="rtl-flip" />}
          onClick={start}
        >
          {isAr ? "كل شيء جاهز — بدء الطلب" : "I have everything ready — Start application"}
        </Button>
        <Link to="/portal/dashboard">
          <Button variant="ghost" size="lg" iconStart={<Save size={16} />}>
            {isAr ? "حفظ للاحقاً" : "Save for later"}
          </Button>
        </Link>
        <span className="text-xs text-ink-muted inline-flex items-center gap-1.5">
          <ShieldCheck size={12} className="text-success-600" />
          {isAr ? "بياناتك محمية بمعايير حكومية" : "Your data is protected to government standards"}
        </span>
      </div>
    </div>
  );
};

export default Apply;
