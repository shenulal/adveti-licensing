import * as React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  ShieldCheck,
  Users,
  XCircle,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Modal,
  SLAClock,
  Select,
  useToast,
} from "@/components/adveti";
import { Textarea } from "@/components/ui/textarea";
import { useLang } from "@/hooks/useLang";
import { useAuth } from "@/auth/AuthContext";
import { formatDate } from "@/lib/format";
import {
  getApprovalItem,
  overrideReasonCodes,
  type Recommendation,
} from "@/lib/mockSenior";
import { mockDocuments } from "@/lib/mockAssessor";
import { cn } from "@/lib/utils";

const SLA_TOTAL_HOURS = 120;

type Outcome = "Approve" | "OverrideIncomplete" | "OverrideReject" | "Escalate";

const recBadge = (rec: Recommendation, isAr: boolean) => {
  const map: Record<
    Recommendation,
    { variant: "success" | "warning" | "danger"; en: string; ar: string }
  > = {
    Pass: { variant: "success", en: "Pass", ar: "اجتياز" },
    Incomplete: { variant: "warning", en: "Incomplete", ar: "ناقص" },
    Reject: { variant: "danger", en: "Reject", ar: "رفض" },
  };
  const m = map[rec];
  return <Badge variant={m.variant}>{isAr ? m.ar : m.en}</Badge>;
};

const ApproveOverride: React.FC = () => {
  const { id = "APP-2026-00042" } = useParams();
  const { lang } = useLang();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isAr = lang === "ar";

  const item = getApprovalItem(id);
  const canDecide =
    user?.role === "senior_assessor" || user?.role === "super_admin";

  const [outcome, setOutcome] = React.useState<Outcome | null>(null);
  const [reasonCode, setReasonCode] = React.useState("");
  const [reason, setReason] = React.useState("");
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [rubricOpen, setRubricOpen] = React.useState(false);
  const ChevronEnd = isAr ? ChevronLeft : ChevronRight;

  const remainingHrs =
    (item.slaDeadline.getTime() - Date.now()) / (1000 * 60 * 60);
  const elapsed = Math.max(0, SLA_TOTAL_HOURS - Math.max(0, remainingHrs));

  const submitDisabled =
    !outcome ||
    (outcome !== "Approve" && reason.trim().length < 100) ||
    ((outcome === "OverrideIncomplete" || outcome === "OverrideReject") &&
      !reasonCode);

  const handleSubmit = () => {
    if (outcome === "Approve") {
      setConfirmOpen(true);
      return;
    }
    finalize();
  };

  const finalize = () => {
    setConfirmOpen(false);
    const labels: Record<Outcome, { en: string; ar: string }> = {
      Approve: {
        en: "Approved — certificate generation triggered",
        ar: "تمت الموافقة — بدأ إصدار الشهادة",
      },
      OverrideIncomplete: {
        en: "Override recorded — applicant will be notified",
        ar: "تم تسجيل التعديل — سيتم إبلاغ المتقدم",
      },
      OverrideReject: {
        en: "Override recorded — application rejected",
        ar: "تم تسجيل التعديل — رُفض الطلب",
      },
      Escalate: {
        en: "Case escalated to committee review",
        ar: "تم تصعيد الحالة لمراجعة اللجنة",
      },
    };
    if (outcome) {
      toast({
        title: isAr ? labels[outcome].ar : labels[outcome].en,
        variant: outcome === "OverrideReject" ? "danger" : "success",
      });
    }
    if (outcome === "Escalate") {
      navigate(`/senior/applications/${id}/committee`);
    } else {
      navigate("/senior/queue");
    }
  };

  const cards: {
    key: Outcome;
    en: string;
    ar: string;
    descEn: string;
    descAr: string;
    icon: React.ReactNode;
    cls: string;
    activeCls: string;
  }[] = [
    {
      key: "Approve",
      en: "Approve",
      ar: "موافقة",
      descEn:
        "Issue certificate. Triggers certificate generation and applicant notification.",
      descAr:
        "إصدار الشهادة. يبدأ توليد الشهادة وإشعار المتقدم.",
      icon: <CheckCircle2 size={22} />,
      cls: "border-success-600/30 hover:border-success-600",
      activeCls: "border-success-600 bg-success-100/40 ring-2 ring-success-600",
    },
    {
      key: "OverrideIncomplete",
      en: "Override → Incomplete",
      ar: "تعديل → ناقص",
      descEn:
        "Overriding assessor's recommendation. Provide a written reason and code.",
      descAr:
        "تعديل توصية المقيّم. يجب تقديم سبب وكود مكتوبَين.",
      icon: <AlertTriangle size={22} />,
      cls: "border-warning-600/30 hover:border-warning-600",
      activeCls: "border-warning-600 bg-warning-100/40 ring-2 ring-warning-600",
    },
    {
      key: "OverrideReject",
      en: "Override → Reject",
      ar: "تعديل → رفض",
      descEn:
        "Overriding assessor's recommendation. Provide a written reason and code.",
      descAr:
        "تعديل توصية المقيّم. يجب تقديم سبب وكود مكتوبَين.",
      icon: <XCircle size={22} />,
      cls: "border-danger-600/30 hover:border-danger-600",
      activeCls: "border-danger-600 bg-danger-100/40 ring-2 ring-danger-600",
    },
    {
      key: "Escalate",
      en: "Escalate to Committee",
      ar: "تصعيد للجنة",
      descEn:
        "Refer this case to committee review. Add panel members on the next screen.",
      descAr:
        "إحالة هذه الحالة لمراجعة اللجنة. أضف أعضاء اللجنة في الشاشة التالية.",
      icon: <Users size={22} />,
      cls: "border-navy-700/30 hover:border-navy-700",
      activeCls: "border-navy-800 bg-navy-900/5 ring-2 ring-navy-800",
    },
  ];

  return (
    <div className="space-y-6">
      <nav
        className="flex items-center gap-2 text-sm text-ink-muted"
        aria-label="Breadcrumb"
      >
        <Link to="/senior/queue" className="hover:text-ink-primary">
          {isAr ? "قائمة الموافقات" : "Approval Queue"}
        </Link>
        <ChevronEnd size={14} />
        <span className="text-ink-primary font-medium">
          {item.applicationId}
        </span>
      </nav>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* ─── LEFT 40% ─── */}
        <div className="lg:col-span-2 space-y-4">
          <Card variant="government">
            <CardHeader>
              <CardTitle className="text-base">
                {isAr ? r("Application", "الطلب") : "Application"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-ink-muted text-xs uppercase tracking-wide">
                  {isAr ? "اسم المتقدم" : "Applicant"}
                </p>
                <p className="font-semibold text-ink-primary">
                  {isAr ? item.applicantNameAr : item.applicantNameEn}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-ink-muted text-xs uppercase tracking-wide">
                    {isAr ? "الفئة" : "Category"}
                  </p>
                  <p className="text-ink-primary">{item.category}</p>
                </div>
                <div>
                  <p className="text-ink-muted text-xs uppercase tracking-wide">
                    {isAr ? "تاريخ التقديم" : "Submitted"}
                  </p>
                  <p className="text-ink-primary">
                    {formatDate(item.submittedAt, lang)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2 border-t border-border-default">
                <SLAClock
                  elapsedHours={elapsed}
                  totalHours={SLA_TOTAL_HOURS}
                  size={56}
                />
                <div>
                  <p className="text-xs text-ink-muted">SLA</p>
                  <p className="text-sm font-medium text-ink-primary">
                    {Math.max(0, Math.ceil(remainingHrs / 24))}{" "}
                    {isAr ? "يوم متبقٍ" : "days remaining"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assessor's decision */}
          <Card variant="bordered">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck size={16} className="text-navy-700" />
                {isAr ? "قرار المقيّم" : "Assessor's Decision"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-ink-secondary">
                  {item.assessorName}
                </span>
                {recBadge(item.recommendation, isAr)}
              </div>
              <div className="rounded-md bg-surface-50 p-3 leading-relaxed text-ink-primary whitespace-pre-line">
                {isAr ? item.rationaleAr : item.rationale}
              </div>
            </CardContent>
          </Card>

          {/* Rubric summary */}
          <Card variant="bordered">
            <CardHeader>
              <CardTitle className="text-base">
                {isAr ? "ملخص معايير التقييم" : "Rubric Summary"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-md bg-success-100 py-2">
                  <p className="text-2xl font-bold text-success-600">
                    {item.rubricSummary.pass}
                  </p>
                  <p className="text-xs text-success-600">
                    {isAr ? "اجتياز" : "Pass"}
                  </p>
                </div>
                <div className="rounded-md bg-danger-100 py-2">
                  <p className="text-2xl font-bold text-danger-600">
                    {item.rubricSummary.fail}
                  </p>
                  <p className="text-xs text-danger-600">
                    {isAr ? "إخفاق" : "Fail"}
                  </p>
                </div>
                <div className="rounded-md bg-surface-100 py-2">
                  <p className="text-2xl font-bold text-ink-secondary">
                    {item.rubricSummary.na}
                  </p>
                  <p className="text-xs text-ink-secondary">
                    {isAr ? "لا ينطبق" : "N/A"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRubricOpen((o) => !o)}
                className="text-xs text-navy-700 font-medium hover:underline focus-ring rounded"
              >
                {rubricOpen
                  ? isAr ? "إخفاء التفاصيل" : "Hide details"
                  : isAr ? "عرض التفاصيل الكاملة" : "Expand full rubric"}
              </button>
              {rubricOpen && (
                <div className="text-xs text-ink-secondary border-t border-border-default pt-2 leading-relaxed">
                  {isAr
                    ? "اعرض جميع البنود الـ12 في علامة تبويب المراجعة."
                    : "Open the Review tab for the assessor to see all 12 rubric items with notes."}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Documents notes */}
          <Card variant="bordered">
            <CardHeader>
              <CardTitle className="text-base">
                {isAr ? "ملاحظات المقيّم على المستندات" : "Assessor notes per document"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {mockDocuments.slice(0, 3).map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-start gap-2 p-2 rounded-md bg-surface-50"
                >
                  <FileText size={14} className="text-ink-muted mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-mono text-ink-primary truncate">
                      {doc.fileName}
                    </p>
                    <p className="text-xs text-ink-secondary mt-0.5">
                      {isAr ? "مقبول" : "Accepted"} · {isAr ? "لا ملاحظات" : "no notes"}
                    </p>
                  </div>
                  <Badge variant="success">{isAr ? "نظيف" : "Clean"}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* ─── RIGHT 60% ─── */}
        <div className="lg:col-span-3 space-y-6">
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>
                {isAr ? "قرار كبير المقيمين" : "Senior Assessor Decision"}
              </CardTitle>
              {!canDecide && (
                <p className="text-xs text-warning-600">
                  {isAr
                    ? "العرض للقراءة فقط. الموافقة والتعديل محصوران بكبير المقيمين."
                    : "Read-only view. Approve / Override actions are restricted to Senior Assessor."}
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                {cards.map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    disabled={!canDecide}
                    onClick={() => setOutcome(c.key)}
                    className={cn(
                      "text-start p-4 rounded-lg border-2 transition-all focus-ring",
                      c.cls,
                      outcome === c.key && c.activeCls,
                      !canDecide &&
                        "opacity-50 cursor-not-allowed pointer-events-none",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={cn(
                          "shrink-0",
                          c.key === "Approve" && "text-success-600",
                          c.key === "OverrideIncomplete" && "text-warning-600",
                          c.key === "OverrideReject" && "text-danger-600",
                          c.key === "Escalate" && "text-navy-800",
                        )}
                      >
                        {c.icon}
                      </span>
                      <div>
                        <p className="font-semibold text-ink-primary text-sm">
                          {isAr ? c.ar : c.en}
                        </p>
                        <p className="text-xs text-ink-secondary mt-1 leading-relaxed">
                          {isAr ? c.descAr : c.descEn}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {outcome &&
                (outcome === "OverrideIncomplete" ||
                  outcome === "OverrideReject") && (
                  <div className="space-y-3 border-t border-border-default pt-4">
                    <Select
                      label={
                        isAr ? "كود سبب التعديل" : "Override reason code"
                      }
                      required
                      value={reasonCode}
                      onChange={(e) => setReasonCode(e.target.value)}
                      placeholder={isAr ? "اختر سبباً" : "Select a reason"}
                      options={overrideReasonCodes.map((c) => ({
                        value: c.value,
                        label: isAr ? c.ar : c.en,
                      }))}
                    />
                    <div>
                      <label className="block text-sm font-medium text-ink-primary mb-1">
                        {isAr ? "مبررات التعديل" : "Override rationale"}{" "}
                        <span className="text-danger-600">*</span>
                      </label>
                      <Textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        rows={5}
                        placeholder={
                          isAr
                            ? "اكتب 100 حرف على الأقل تشرح فيه قرارك…"
                            : "Write at least 100 characters explaining your decision…"
                        }
                      />
                      <p
                        className={cn(
                          "text-xs mt-1",
                          reason.length < 100
                            ? "text-ink-muted"
                            : "text-success-600",
                        )}
                      >
                        {reason.length}/100{" "}
                        {isAr ? "حرف" : "characters"}
                      </p>
                    </div>
                  </div>
                )}

              {outcome === "Escalate" && (
                <div className="space-y-3 border-t border-border-default pt-4">
                  <div>
                    <label className="block text-sm font-medium text-ink-primary mb-1">
                      {isAr ? "ملاحظات الإحالة" : "Escalation notes"}{" "}
                      <span className="text-danger-600">*</span>
                    </label>
                    <Textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={4}
                      placeholder={
                        isAr
                          ? "اشرح سبب الإحالة للجنة (100 حرف على الأقل)…"
                          : "Explain why this case requires committee review (min 100 characters)…"
                      }
                    />
                    <p className="text-xs text-ink-muted mt-1">
                      {isAr
                        ? "ستتمكن من إضافة أعضاء اللجنة في الشاشة التالية."
                        : "You'll add committee members on the next screen."}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-default">
                <Button
                  variant="ghost"
                  onClick={() => navigate("/senior/queue")}
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </Button>
                {canDecide && (
                  <Button
                    variant={outcome === "Approve" ? "gold" : "primary"}
                    disabled={submitDisabled}
                    onClick={handleSubmit}
                  >
                    {outcome === "Approve"
                      ? isAr ? "موافقة وإصدار الشهادة" : "Approve & Issue Certificate"
                      : outcome === "Escalate"
                      ? isAr ? "تصعيد للجنة" : "Escalate to Committee"
                      : isAr ? "تسجيل التعديل" : "Record Override"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              variant="secondary"
              onClick={() => navigate(`/senior/applications/${id}/reassign`)}
            >
              {isAr ? "إعادة تخصيص هذه الحالة" : "Reassign this case"}
            </Button>
          </div>
        </div>
      </div>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={isAr ? "تأكيد الموافقة" : "Confirm Approval"}
        description={
          isAr
            ? `سيتم إصدار شهادة رقمية موقّعة لـ ${item.applicantNameAr}. هل تؤكد المتابعة؟`
            : `This will generate a signed digital certificate for ${item.applicantNameEn}. Confirm?`
        }
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setConfirmOpen(false)}
            >
              {isAr ? "إلغاء" : "Cancel"}
            </Button>
            <Button variant="gold" onClick={finalize}>
              {isAr ? "تأكيد وإصدار" : "Confirm & Issue"}
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink-secondary">
          {isAr
            ? "سيتم إبلاغ المتقدم تلقائياً عبر البريد الإلكتروني والرسائل النصية."
            : "The applicant will be notified by email and SMS automatically."}
        </p>
      </Modal>
    </div>
  );
};

// helper to satisfy literal jsx fragment in EN/AR
const r = (en: string, _ar: string) => en;

export default ApproveOverride;
