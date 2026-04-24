import * as React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  Modal,
  Select,
  Textarea,
  useToast,
} from "@/components/adveti";
import { useLang } from "@/hooks/useLang";
import { formatDate } from "@/lib/format";
import { getQueueItem } from "@/lib/mockAssessor";
import { cn } from "@/lib/utils";

type Outcome = "Pass" | "Incomplete" | "Reject";

const DEFICIENCY_TEMPLATES: { id: string; en: string; ar: string }[] = [
  {
    id: "exp-letter",
    en: "Employment letter missing official date and signature",
    ar: "خطاب جهة العمل ينقصه التاريخ الرسمي والتوقيع",
  },
  {
    id: "cpd-evidence",
    en: "CPD evidence does not align with declared hours",
    ar: "إثبات التطوير المهني لا يتوافق مع الساعات المعلنة",
  },
  {
    id: "degree",
    en: "Degree certificate page 2 partially obscured",
    ar: "الصفحة الثانية من شهادة الدرجة العلمية غير واضحة",
  },
];

const DecisionCapture: React.FC = () => {
  const { lang } = useLang();
  const { id } = useParams();
  const navigate = useNavigate();
  const { push } = useToast();
  const isAr = lang === "ar";

  const item = React.useMemo(() => getQueueItem(id ?? ""), [id]);

  const [outcome, setOutcome] = React.useState<Outcome | null>(null);
  const [rationale, setRationale] = React.useState("");
  const [reasonCode, setReasonCode] = React.useState("");
  const [deficiencies, setDeficiencies] = React.useState<string[]>([
    "exp-letter",
  ]);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const toggleDeficiency = (id: string) =>
    setDeficiencies((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
    );

  const valid =
    outcome != null &&
    rationale.trim().length >= 50 &&
    (outcome !== "Reject" || reasonCode.length > 0) &&
    (outcome !== "Incomplete" || deficiencies.length > 0);

  const handleSubmit = () => {
    setConfirmOpen(false);
    setSubmitted(true);
    push({
      type: "success",
      title: isAr ? "تم إرسال القرار" : "Decision submitted",
      description: isAr
        ? "في انتظار موافقة المقيّم الأول."
        : "Awaiting Senior Assessor approval.",
    });
  };

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <Card variant="bordered">
          <CardContent className="pt-10 pb-10 text-center space-y-4">
            <div className="h-16 w-16 mx-auto rounded-full bg-info-100 inline-flex items-center justify-center">
              <CheckCircle2 size={32} className="text-info-600" />
            </div>
            <h1 className="text-xl font-bold text-ink-primary">
              {isAr ? "تم إرسال القرار للمراجعة" : "Decision sent for approval"}
            </h1>
            <p className="text-sm text-ink-secondary max-w-md mx-auto">
              {isAr
                ? "أصبح الطلب الآن في حالة 'بانتظار موافقة المقيّم الأول'. سيتم إخطارك عند اتخاذ القرار النهائي."
                : "The application is now in 'Pending Senior Approval'. You will be notified once the final decision is made."}
            </p>
            <div className="flex justify-center gap-2 pt-2">
              <Button
                variant="ghost"
                onClick={() => navigate("/assessor/queue")}
              >
                {isAr ? "العودة إلى القائمة" : "Back to queue"}
              </Button>
              <Button
                variant="primary"
                onClick={() =>
                  navigate(`/assessor/applications/${item.applicationId}`)
                }
              >
                {isAr ? "عرض التفاصيل" : "View details (read-only)"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Link
        to={`/assessor/applications/${item.applicationId}`}
        className="text-sm text-navy-800 hover:underline inline-flex items-center gap-1"
      >
        <ArrowLeft size={14} className="rtl-flip" />
        {isAr ? "الرجوع إلى المراجعة" : "Back to review"}
      </Link>

      <header>
        <h1 className="text-2xl font-bold text-ink-primary">
          {isAr ? "تسجيل القرار" : "Capture decision"}
        </h1>
        <p className="text-sm text-ink-secondary mt-1">
          {isAr
            ? "اختر النتيجة وقدّم مبرّرات واضحة. سيقوم المقيّم الأول بالمراجعة النهائية."
            : "Select an outcome and provide clear rationale. Final approval rests with the Senior Assessor."}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Sidebar summary */}
        <aside className="lg:col-span-2">
          <Card variant="government">
            <CardContent className="pt-6 space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-ink-muted">
                  {isAr ? "رقم الطلب" : "Application"}
                </p>
                <p
                  className="font-mono text-sm font-semibold text-navy-900"
                  dir="ltr"
                >
                  {item.applicationId}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-ink-muted">
                  {isAr ? "المتقدم" : "Applicant"}
                </p>
                <p className="text-sm font-semibold text-ink-primary">
                  {isAr ? item.applicantNameAr : item.applicantNameEn}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-ink-muted">
                    {isAr ? "الفئة" : "Category"}
                  </p>
                  <p className="font-medium">{item.category}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-muted">
                    {isAr ? "تاريخ الإرسال" : "Submitted"}
                  </p>
                  <p className="font-medium text-xs">
                    {formatDate(item.submittedAt, lang)}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-ink-muted">
                    {isAr ? "الحالة الحالية" : "Current status"}
                  </p>
                  <Badge status={item.status} />
                </div>
              </div>

              <Alert type="info">
                {isAr
                  ? "زر 'الموافقة' و 'تجاوز القرار' متاحان فقط للمقيّم الأول."
                  : "The Approve/Override buttons are visible only to the Senior Assessor."}
              </Alert>
            </CardContent>
          </Card>
        </aside>

        {/* Main form */}
        <section className="lg:col-span-3 space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            <OutcomeCard
              tone="success"
              icon={<CheckCircle2 size={20} />}
              titleEn="Pass"
              titleAr="ناجح"
              descriptionEn="Recommend approval. Certificate will be issued after Senior Assessor approval."
              descriptionAr="التوصية بالموافقة. ستُصدر الشهادة بعد موافقة المقيّم الأول."
              selected={outcome === "Pass"}
              onClick={() => setOutcome("Pass")}
            />
            <OutcomeCard
              tone="warning"
              icon={<AlertTriangle size={20} />}
              titleEn="Incomplete"
              titleAr="غير مكتمل"
              descriptionEn="Documents or CPD hours are insufficient. Applicant will be asked to resubmit."
              descriptionAr="المستندات أو ساعات التطوير المهني غير كافية. سيُطلب من المتقدم إعادة الإرسال."
              selected={outcome === "Incomplete"}
              onClick={() => setOutcome("Incomplete")}
            />
            <OutcomeCard
              tone="danger"
              icon={<XCircle size={20} />}
              titleEn="Reject"
              titleAr="مرفوض"
              descriptionEn="Application does not meet the requirements."
              descriptionAr="الطلب لا يستوفي المتطلبات."
              selected={outcome === "Reject"}
              onClick={() => setOutcome("Reject")}
            />
          </div>

          {outcome === "Incomplete" && (
            <Card variant="bordered">
              <CardContent className="pt-5">
                <h3 className="text-sm font-semibold text-navy-900 mb-3">
                  {isAr ? "أوجه القصور" : "Specific deficiencies"}
                </h3>
                <p className="text-xs text-ink-muted mb-3">
                  {isAr
                    ? "اختر العناصر المستوحاة من العناصر الراسبة في قائمة التقييم."
                    : "Pre-filled from rubric failures — adjust as needed."}
                </p>
                <div className="space-y-2">
                  {DEFICIENCY_TEMPLATES.map((d) => (
                    <label
                      key={d.id}
                      className="flex items-start gap-3 p-3 rounded-md ring-1 ring-border-default hover:bg-surface-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="mt-0.5 h-4 w-4 accent-navy-800"
                        checked={deficiencies.includes(d.id)}
                        onChange={() => toggleDeficiency(d.id)}
                      />
                      <span className="text-sm text-ink-primary">
                        {isAr ? d.ar : d.en}
                      </span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {outcome === "Reject" && (
            <Card variant="bordered">
              <CardContent className="pt-5">
                <Select
                  label={isAr ? "رمز سبب الرفض" : "Reason code"}
                  required
                  value={reasonCode}
                  onChange={(e) => setReasonCode(e.target.value)}
                  options={[
                    {
                      value: "",
                      label: isAr ? "اختر سبباً…" : "Select a reason…",
                    },
                    {
                      value: "ineligible",
                      label: isAr
                        ? "غير مستوفٍ لشروط الأهلية"
                        : "Does not meet eligibility criteria",
                    },
                    {
                      value: "fraudulent",
                      label: isAr
                        ? "وثائق مشكوك في صحتها"
                        : "Fraudulent or unverifiable documents",
                    },
                    {
                      value: "qualifications",
                      label: isAr
                        ? "المؤهلات غير مقبولة"
                        : "Qualifications not recognised",
                    },
                    {
                      value: "experience",
                      label: isAr
                        ? "الخبرة لا تستوفي الحد الأدنى"
                        : "Insufficient experience",
                    },
                  ]}
                />
              </CardContent>
            </Card>
          )}

          <Card variant="bordered">
            <CardContent className="pt-5">
              <Textarea
                label={isAr ? "مبرّرات القرار" : "Decision rationale"}
                required
                rows={6}
                value={rationale}
                onChange={(e) => setRationale(e.target.value)}
                placeholder={
                  isAr
                    ? "اكتب على الأقل 50 حرفاً يوضح أسباب القرار…"
                    : "Provide at least 50 characters explaining the basis of your decision…"
                }
                helperText={
                  isAr
                    ? `${rationale.trim().length} / 50 حرف`
                    : `${rationale.trim().length} / 50 characters`
                }
              />
            </CardContent>
          </Card>

          <div className="flex flex-wrap justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() =>
                navigate(`/assessor/applications/${item.applicationId}`)
              }
            >
              {isAr ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              variant="primary"
              disabled={!valid}
              onClick={() => setConfirmOpen(true)}
            >
              {isAr
                ? "إرسال للموافقة من المقيّم الأول"
                : "Submit for Senior Assessor Approval"}
            </Button>
          </div>
        </section>
      </div>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={isAr ? "تأكيد إرسال القرار" : "Confirm decision submission"}
        description={
          isAr
            ? "بعد الإرسال لن تتمكن من تعديل القرار. سينتقل الطلب إلى قائمة المقيّم الأول."
            : "Once submitted, you cannot edit the decision. The application will move to the Senior Assessor queue."
        }
        footer={
          <div className="flex justify-end gap-2 w-full">
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
              {isAr ? "إلغاء" : "Cancel"}
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {isAr ? "تأكيد الإرسال" : "Confirm submission"}
            </Button>
          </div>
        }
      >
        <dl className="text-sm space-y-2">
          <div className="flex justify-between">
            <dt className="text-ink-secondary">
              {isAr ? "النتيجة" : "Outcome"}
            </dt>
            <dd className="font-semibold">
              {outcome === "Pass"
                ? isAr ? "ناجح" : "Pass"
                : outcome === "Incomplete"
                  ? isAr ? "غير مكتمل" : "Incomplete"
                  : isAr ? "مرفوض" : "Reject"}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-secondary">
              {isAr ? "رقم الطلب" : "Application"}
            </dt>
            <dd className="font-mono" dir="ltr">
              {item.applicationId}
            </dd>
          </div>
        </dl>
      </Modal>
    </div>
  );
};

const OutcomeCard: React.FC<{
  tone: "success" | "warning" | "danger";
  icon: React.ReactNode;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  selected: boolean;
  onClick: () => void;
}> = ({
  tone,
  icon,
  titleEn,
  titleAr,
  descriptionEn,
  descriptionAr,
  selected,
  onClick,
}) => {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const palette =
    tone === "success"
      ? "ring-success-600 bg-success-100/50"
      : tone === "warning"
        ? "ring-warning-600 bg-warning-100/40"
        : "ring-danger-600 bg-danger-100/40";
  const iconColor =
    tone === "success"
      ? "text-success-600"
      : tone === "warning"
        ? "text-warning-600"
        : "text-danger-600";
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "text-start p-4 rounded-lg ring-1 transition-all duration-fast bg-surface-0 hover:shadow-md focus-ring",
        selected
          ? `${palette} ring-2 shadow-md`
          : "ring-border-default hover:ring-navy-800/40",
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={cn("inline-flex", iconColor)}>{icon}</span>
        {selected && (
          <span className="h-5 w-5 rounded-full bg-navy-900 text-ink-inverse inline-flex items-center justify-center">
            <CheckCircle2 size={12} />
          </span>
        )}
      </div>
      <p className="text-base font-bold text-ink-primary">
        {isAr ? titleAr : titleEn}
      </p>
      <p className="text-xs text-ink-secondary mt-1 leading-relaxed">
        {isAr ? descriptionAr : descriptionEn}
      </p>
    </button>
  );
};

export default DecisionCapture;
