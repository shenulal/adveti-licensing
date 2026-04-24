import * as React from "react";
import { Link } from "react-router-dom";
import { Check, ChevronRight, FileText, Image as ImageIcon } from "lucide-react";
import { Button, Card, CardContent } from "@/components/adveti";
import { useLang } from "@/hooks/useLang";
import { cn } from "@/lib/utils";
import PageHero from "@/components/public/PageHero";

type Category = "teacher" | "counsellor" | "trainer";

interface Doc {
  en: string;
  ar: string;
  type: "PDF" | "JPG";
}

interface CategoryData {
  qualEn: string;
  qualAr: string;
  cpdEn: string;
  cpdAr: string;
  docs: Doc[];
  checklist: { en: string; ar: string }[];
}

const COMMON_DOCS: Doc[] = [
  { en: "Emirates ID / Passport", ar: "الهوية الإماراتية / جواز السفر", type: "PDF" },
  { en: "Degree certificate", ar: "شهادة الدرجة العلمية", type: "PDF" },
  { en: "Teaching / professional experience letter", ar: "خطاب الخبرة المهنية", type: "PDF" },
  { en: "CPD declaration evidence", ar: "ما يُثبت ساعات التطوير المهني", type: "PDF" },
  { en: "Professional photograph", ar: "صورة شخصية مهنية", type: "JPG" },
];

const DATA: Record<Category, CategoryData> = {
  teacher: {
    qualEn: "Bachelor's degree in Education or relevant subject + recognised teaching qualification.",
    qualAr: "درجة بكالوريوس في التربية أو تخصص ذي صلة + مؤهل تدريسي معترف به.",
    cpdEn: "20 hours of CPD per year (declared on application).",
    cpdAr: "20 ساعة تطوير مهني سنوياً (تُعلن في نموذج الطلب).",
    docs: COMMON_DOCS,
    checklist: [
      { en: "I hold a recognised bachelor's degree", ar: "أحمل درجة بكالوريوس معترف بها" },
      { en: "I have a teaching qualification", ar: "أحمل مؤهلاً تدريسياً" },
      { en: "I have at least 1 year of teaching experience", ar: "لديّ خبرة تدريسية لا تقل عن سنة" },
      { en: "I can declare 20 CPD hours", ar: "أستطيع إثبات 20 ساعة تطوير مهني" },
      { en: "I have valid Emirates ID / passport", ar: "أملك هوية إماراتية / جواز سفر سارٍ" },
    ],
  },
  counsellor: {
    qualEn: "Bachelor's or Master's in Counselling, Psychology or related field + counselling certification.",
    qualAr: "درجة بكالوريوس أو ماجستير في الإرشاد أو علم النفس أو مجال ذي صلة + شهادة إرشاد.",
    cpdEn: "25 hours of CPD per year, including supervised practice.",
    cpdAr: "25 ساعة تطوير مهني سنوياً تشمل ممارسة تحت الإشراف.",
    docs: COMMON_DOCS,
    checklist: [
      { en: "I hold a degree in counselling, psychology or related field", ar: "أحمل درجة في الإرشاد أو علم النفس أو مجال ذي صلة" },
      { en: "I have a counselling certification", ar: "لديّ شهادة في الإرشاد" },
      { en: "I have at least 2 years of counselling experience", ar: "لديّ خبرة لا تقل عن سنتين في الإرشاد" },
      { en: "I can declare 25 CPD hours", ar: "أستطيع إثبات 25 ساعة تطوير مهني" },
      { en: "I have valid Emirates ID / passport", ar: "أملك هوية إماراتية / جواز سفر سارٍ" },
    ],
  },
  trainer: {
    qualEn: "Recognised vocational or technical qualification + Train-the-Trainer certification.",
    qualAr: "مؤهل مهني أو فني معترف به + شهادة تدريب المدربين.",
    cpdEn: "15 hours of CPD per year (declared on application).",
    cpdAr: "15 ساعة تطوير مهني سنوياً (تُعلن في نموذج الطلب).",
    docs: COMMON_DOCS,
    checklist: [
      { en: "I hold a recognised technical / vocational qualification", ar: "أحمل مؤهلاً فنياً أو مهنياً معترفاً به" },
      { en: "I have Train-the-Trainer certification", ar: "أحمل شهادة تدريب المدربين" },
      { en: "I have at least 2 years of training experience", ar: "لديّ خبرة لا تقل عن سنتين في التدريب" },
      { en: "I can declare 15 CPD hours", ar: "أستطيع إثبات 15 ساعة تطوير مهني" },
      { en: "I have valid Emirates ID / passport", ar: "أملك هوية إماراتية / جواز سفر سارٍ" },
    ],
  },
};

const CATEGORY_LABELS: Record<Category, { en: string; ar: string }> = {
  teacher: { en: "Teacher", ar: "المعلم" },
  counsellor: { en: "Counsellor", ar: "المرشد" },
  trainer: { en: "Trainer", ar: "المدرّب" },
};

const Eligibility: React.FC = () => {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const [active, setActive] = React.useState<Category>("teacher");
  const [checked, setChecked] = React.useState<Record<string, boolean>>({});

  const data = DATA[active];
  const checkedCount = data.checklist.filter((_, i) => checked[`${active}-${i}`]).length;
  const allChecked = checkedCount === data.checklist.length;

  const toggle = (i: number) => {
    const key = `${active}-${i}`;
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-10">
      <PageHero
        eyebrowEn="Eligibility"
        eyebrowAr="الأهلية"
        titleEn="Eligibility & document requirements"
        titleAr="الأهلية ومتطلبات الوثائق"
        subtitleEn="Choose your licence category to see qualifications, CPD hours, required documents and a self-check tool."
        subtitleAr="اختر فئة الترخيص لعرض المؤهلات وساعات التطوير المهني والوثائق المطلوبة وأداة التحقق الذاتي."
        isAr={isAr}
      />

      {/* Tabs */}
      <div className="border-b border-border-default">
        <div role="tablist" className="flex gap-1 overflow-x-auto">
          {(Object.keys(DATA) as Category[]).map((c) => {
            const isActive = active === c;
            return (
              <button
                key={c}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(c)}
                className={cn(
                  "px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors focus-ring rounded-t-md",
                  isActive
                    ? "border-navy-800 text-navy-900"
                    : "border-transparent text-ink-secondary hover:text-navy-800",
                )}
              >
                {isAr ? CATEGORY_LABELS[c].ar : CATEGORY_LABELS[c].en}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left: requirements + docs */}
        <div className="lg:col-span-2 space-y-6">
          <Card variant="government">
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold text-ink-primary">
                {isAr ? "متطلبات المؤهلات" : "Qualification requirements"}
              </h2>
              <p className="mt-2 text-sm text-ink-secondary">
                {isAr ? data.qualAr : data.qualEn}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-100 text-gold-600 text-xs font-semibold">
                {isAr ? "التطوير المهني المستمر:" : "CPD:"}
                <span className="font-normal">{isAr ? data.cpdAr : data.cpdEn}</span>
              </div>
            </CardContent>
          </Card>

          <Card variant="bordered">
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold text-ink-primary mb-4">
                {isAr ? "الوثائق المطلوبة" : "Required documents"}
              </h2>
              <ul className="divide-y divide-border-default">
                {data.docs.map((d) => (
                  <li
                    key={d.en}
                    className="py-3 flex items-center gap-3 justify-between"
                  >
                    <span className="flex items-center gap-3 text-sm text-ink-primary">
                      {d.type === "PDF" ? (
                        <FileText size={16} className="text-navy-800" />
                      ) : (
                        <ImageIcon size={16} className="text-navy-800" />
                      )}
                      {isAr ? d.ar : d.en}
                    </span>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-bold tracking-wider",
                        d.type === "PDF"
                          ? "bg-danger-100 text-danger-600"
                          : "bg-info-100 text-info-600",
                      )}
                    >
                      {d.type}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Right: checklist */}
        <div className="space-y-6">
          <Card variant="elevated">
            <CardContent className="pt-6">
              <h2 className="text-base font-semibold text-ink-primary">
                {isAr ? "تحقق من أهليتك" : "Check your eligibility"}
              </h2>
              <p className="mt-1 text-xs text-ink-secondary">
                {isAr
                  ? `${checkedCount} من ${data.checklist.length} مكتمل`
                  : `${checkedCount} of ${data.checklist.length} complete`}
              </p>
              <div className="mt-3 h-1.5 w-full bg-surface-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-navy-800 transition-all duration-normal"
                  style={{ width: `${(checkedCount / data.checklist.length) * 100}%` }}
                />
              </div>

              <ul className="mt-5 space-y-2">
                {data.checklist.map((item, i) => {
                  const key = `${active}-${i}`;
                  const isChecked = !!checked[key];
                  return (
                    <li key={key}>
                      <label className="flex items-start gap-3 p-2 rounded-md hover:bg-surface-100 cursor-pointer">
                        <span
                          className={cn(
                            "mt-0.5 h-5 w-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors",
                            isChecked
                              ? "bg-navy-800 border-navy-800"
                              : "bg-surface-0 border-border-strong",
                          )}
                        >
                          {isChecked && <Check size={14} className="text-ink-inverse" />}
                        </span>
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={isChecked}
                          onChange={() => toggle(i)}
                        />
                        <span className="text-sm text-ink-primary">
                          {isAr ? item.ar : item.en}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>

          {allChecked && (
            <div className="rounded-xl bg-gradient-to-br from-navy-900 to-navy-700 text-ink-inverse p-6 shadow-lg">
              <p className="text-sm text-gold-400 font-semibold tracking-wide mb-1">
                {isAr ? "أنت مؤهل!" : "You're ready"}
              </p>
              <h3 className="text-lg font-semibold">
                {isAr ? "هل تستوفي المتطلبات؟ قدّم الآن." : "Meet the requirements? Apply now."}
              </h3>
              <Link to="/auth/login" className="block mt-4">
                <Button
                  variant="gold"
                  fullWidth
                  iconEnd={<ChevronRight size={16} className="rtl-flip" />}
                >
                  {isAr ? "ابدأ التقديم" : "Start Application"}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Eligibility;
