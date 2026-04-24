import * as React from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight, ClipboardList, CreditCard, FileCheck, Search, Award, UserPlus } from "lucide-react";
import { Button, Card, CardContent } from "@/components/adveti";
import { useLang } from "@/hooks/useLang";
import { cn } from "@/lib/utils";
import { formatAED } from "@/lib/format";
import PageHero from "@/components/public/PageHero";

interface FeeRow {
  category: "Teacher" | "Counsellor" | "Trainer";
  categoryAr: string;
  applicationFee: number;
  renewalFee: number;
  validityYears: number;
}

const FEES: FeeRow[] = [
  { category: "Teacher", categoryAr: "المعلم", applicationFee: 1000, renewalFee: 800, validityYears: 2 },
  { category: "Counsellor", categoryAr: "المرشد", applicationFee: 800, renewalFee: 640, validityYears: 2 },
  { category: "Trainer", categoryAr: "المدرّب", applicationFee: 600, renewalFee: 480, validityYears: 2 },
];

const VAT_RATE = 0.05;

const STEPS = [
  { icon: <UserPlus size={18} />, en: "Create account / UAE Pass login", ar: "إنشاء حساب / الدخول عبر الهوية الرقمية" },
  { icon: <ClipboardList size={18} />, en: "Complete application & upload documents", ar: "إكمال الطلب ورفع الوثائق" },
  { icon: <CreditCard size={18} />, en: "Pay application fee", ar: "دفع رسوم الطلب" },
  { icon: <Search size={18} />, en: "Assessor review (2–5 business days)", ar: "مراجعة المقيّم (2–5 أيام عمل)" },
  { icon: <Award size={18} />, en: "Receive digital certificate", ar: "استلام الشهادة الرقمية" },
];

const FAQS = [
  {
    qEn: "What payment methods are accepted?",
    qAr: "ما طرق الدفع المقبولة؟",
    aEn: "We accept Visa, Mastercard and bank transfers in AED. All payments are processed through PCI-DSS compliant providers.",
    aAr: "نقبل بطاقات Visa وMastercard والتحويلات البنكية بالدرهم الإماراتي. تتم جميع المعاملات عبر مزودين متوافقين مع معيار PCI-DSS.",
  },
  {
    qEn: "What is the refund policy?",
    qAr: "ما سياسة استرداد المبلغ؟",
    aEn: "Application fees are refundable within 14 days if the application has not yet been assigned to an assessor. Refunds are processed to the original payment method within 7–10 business days.",
    aAr: "تُسترد رسوم الطلب خلال 14 يوماً إذا لم يُحال إلى مقيّم بعد، ويُعاد المبلغ إلى وسيلة الدفع الأصلية خلال 7–10 أيام عمل.",
  },
  {
    qEn: "When should I renew my licence?",
    qAr: "متى يجب تجديد الترخيص؟",
    aEn: "You may renew your licence up to 90 days before its expiry date. We send reminder notifications at 90, 60 and 30 days.",
    aAr: "يمكنك تجديد ترخيصك قبل 90 يوماً من تاريخ انتهائه. نُرسل تذكيرات قبل 90 و60 و30 يوماً من الانتهاء.",
  },
  {
    qEn: "I lost my certificate — what should I do?",
    qAr: "فقدت شهادتي — ما الذي عليّ فعله؟",
    aEn: "All certificates are stored in your portal account and may be re-downloaded at any time. If you cannot access your account, contact support.",
    aAr: "تُحفظ جميع الشهادات في حسابك على المنصة ويمكن إعادة تنزيلها في أي وقت. إذا تعذّر الوصول إلى حسابك، تواصل مع الدعم.",
  },
  {
    qEn: "How do I request a name change?",
    qAr: "كيف أطلب تغيير الاسم؟",
    aEn: "Submit a name-change request through your profile with supporting Emirates ID. A new certificate is issued at no charge after verification.",
    aAr: "قدّم طلب تغيير الاسم من ملفك الشخصي مع إرفاق الهوية الإماراتية. تُصدَر شهادة جديدة دون رسوم بعد التحقق.",
  },
];

const Fees: React.FC = () => {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);

  const computeRow = (r: FeeRow) => {
    const vat = Math.round(r.applicationFee * VAT_RATE);
    const total = r.applicationFee + vat;
    return { vat, total };
  };

  return (
    <div className="space-y-12">
      <PageHero
        eyebrowEn="Fees & Process"
        eyebrowAr="الرسوم والإجراءات"
        titleEn="Transparent fees and a clear process"
        titleAr="رسوم شفافة وإجراءات واضحة"
        subtitleEn="All fees are quoted in AED and include 5% VAT. Each licence is valid for two years."
        subtitleAr="جميع الرسوم بالدرهم الإماراتي وتشمل ضريبة القيمة المضافة 5٪. كل ترخيص ساري لمدة سنتين."
        isAr={isAr}
      />

      {/* Fees table */}
      <section>
        <h2 className="text-xl font-semibold text-ink-primary mb-4">
          {isAr ? "جدول الرسوم" : "Fee schedule"}
        </h2>
        <Card variant="bordered">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-100">
                <tr className="text-start">
                  <th className="px-5 py-3 font-semibold text-ink-primary text-start">
                    {isAr ? "الفئة" : "Category"}
                  </th>
                  <th className="px-5 py-3 font-semibold text-ink-primary text-end">
                    {isAr ? "رسوم الطلب" : "Application fee"}
                  </th>
                  <th className="px-5 py-3 font-semibold text-ink-primary text-end">
                    {isAr ? "ضريبة القيمة المضافة (5٪)" : "VAT (5%)"}
                  </th>
                  <th className="px-5 py-3 font-semibold text-ink-primary text-end">
                    {isAr ? "الإجمالي" : "Total"}
                  </th>
                  <th className="px-5 py-3 font-semibold text-ink-primary text-end">
                    {isAr ? "رسوم التجديد" : "Renewal fee"}
                  </th>
                  <th className="px-5 py-3 font-semibold text-ink-primary text-center">
                    {isAr ? "الصلاحية" : "Validity"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {FEES.map((r) => {
                  const { vat, total } = computeRow(r);
                  return (
                    <tr key={r.category} className="border-t border-border-default hover:bg-surface-50">
                      <td className="px-5 py-4 font-medium text-ink-primary">
                        {isAr ? r.categoryAr : r.category}
                      </td>
                      <td className="px-5 py-4 text-end text-ink-secondary">
                        {formatAED(r.applicationFee, lang)}
                      </td>
                      <td className="px-5 py-4 text-end text-ink-secondary">
                        {formatAED(vat, lang)}
                      </td>
                      <td className="px-5 py-4 text-end font-semibold text-navy-900">
                        {formatAED(total, lang)}
                      </td>
                      <td className="px-5 py-4 text-end text-ink-secondary">
                        {formatAED(r.renewalFee + Math.round(r.renewalFee * VAT_RATE), lang)}
                      </td>
                      <td className="px-5 py-4 text-center text-ink-secondary">
                        {isAr ? `${r.validityYears} سنتان` : `${r.validityYears} years`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
        <p className="mt-3 text-xs text-ink-muted">
          {isAr
            ? "الرسوم قابلة للتعديل وفق إعدادات الإدارة. تشمل جميع المبالغ ضريبة القيمة المضافة بنسبة 5٪."
            : "Fees are configurable by administration. All amounts include 5% VAT."}
        </p>
      </section>

      {/* Process */}
      <section>
        <h2 className="text-xl font-semibold text-ink-primary mb-6">
          {isAr ? "خطوات الإجراء" : "Step-by-step process"}
        </h2>
        <ol className="grid gap-4 md:grid-cols-5 relative">
          {STEPS.map((s, i) => (
            <li key={s.en} className="relative">
              <Card variant="bordered" className="h-full">
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="h-8 w-8 rounded-full bg-navy-800 text-ink-inverse inline-flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </span>
                    <span className="text-gold-600">{s.icon}</span>
                  </div>
                  <p className="text-sm font-medium text-ink-primary leading-snug">
                    {isAr ? s.ar : s.en}
                  </p>
                </CardContent>
              </Card>
              {i < STEPS.length - 1 && (
                <span
                  aria-hidden
                  className="hidden md:block absolute top-1/2 -end-2 -translate-y-1/2 text-border-strong"
                >
                  <ChevronRight size={18} className="rtl-flip" />
                </span>
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-xl font-semibold text-ink-primary mb-4">
          {isAr ? "الأسئلة الشائعة" : "Frequently asked questions"}
        </h2>
        <div className="space-y-2">
          {FAQS.map((f, i) => {
            const open = openFaq === i;
            return (
              <Card key={f.qEn} variant="bordered">
                <button
                  type="button"
                  onClick={() => setOpenFaq(open ? null : i)}
                  className="w-full text-start p-5 flex items-center justify-between gap-4 focus-ring rounded-lg"
                  aria-expanded={open}
                >
                  <span className="font-medium text-ink-primary">
                    {isAr ? f.qAr : f.qEn}
                  </span>
                  <ChevronDown
                    size={18}
                    className={cn(
                      "text-ink-secondary flex-shrink-0 transition-transform duration-fast",
                      open && "rotate-180",
                    )}
                  />
                </button>
                {open && (
                  <div className="px-5 pb-5 text-sm text-ink-secondary leading-relaxed border-t border-border-default pt-4">
                    {isAr ? f.aAr : f.aEn}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-xl bg-navy-900 text-ink-inverse p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div>
          <h3 className="text-lg md:text-xl font-semibold">
            {isAr ? "جاهز لتقديم طلبك؟" : "Ready to apply?"}
          </h3>
          <p className="mt-1 text-sm text-ink-inverse/80">
            {isAr
              ? "ابدأ من خلال الهوية الرقمية أو البريد الإلكتروني."
              : "Start using UAE Pass or your email."}
          </p>
        </div>
        <Link to="/auth/login">
          <Button
            variant="gold"
            size="lg"
            iconEnd={<ChevronRight size={16} className="rtl-flip" />}
          >
            {isAr ? "ابدأ التقديم" : "Start Application"}
          </Button>
        </Link>
      </section>
    </div>
  );
};

export default Fees;
