import * as React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  FileText,
  Image as ImageIcon,
  MessageSquare,
  Send,
  ShieldAlert,
  User,
} from "lucide-react";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  Input,
  Modal,
  SLAClock,
  Select,
  Textarea,
  useToast,
} from "@/components/adveti";
import { useLang } from "@/hooks/useLang";
import { formatDate } from "@/lib/format";
import {
  getQueueItem,
  mockDocuments,
  mockRfiThread,
  teacherRubric,
  type AssessorDocument,
  type RubricItem,
  type RubricSection,
} from "@/lib/mockAssessor";
import { cn } from "@/lib/utils";

const SLA_TOTAL_HOURS = 120;

type Tab = "details" | "documents" | "rubric" | "rfi";
type RubricVerdict = "Pass" | "Fail" | "NA";
type DocVerdict = "Accept" | "Revise";

const docTypeLabel = (
  type: AssessorDocument["type"],
  isAr: boolean,
): string => {
  const map: Record<AssessorDocument["type"], { en: string; ar: string }> = {
    EmiratesId: { en: "Emirates ID", ar: "الهوية الإماراتية" },
    Degree: { en: "Degree certificate", ar: "شهادة الدرجة العلمية" },
    Experience: { en: "Experience letter", ar: "خطاب الخبرة" },
    CPDEvidence: { en: "CPD evidence", ar: "إثبات التطوير المهني" },
    Photo: { en: "Photograph", ar: "صورة شخصية" },
    Other: { en: "Other", ar: "أخرى" },
  };
  return isAr ? map[type].ar : map[type].en;
};

const ApplicationReview: React.FC = () => {
  const { lang } = useLang();
  const navigate = useNavigate();
  const { id } = useParams();
  const { push } = useToast();
  const isAr = lang === "ar";

  const item = React.useMemo(() => getQueueItem(id ?? ""), [id]);

  const [tab, setTab] = React.useState<Tab>("documents");
  const [previewDoc, setPreviewDoc] = React.useState<AssessorDocument | null>(
    null,
  );
  const [coiOpen, setCoiOpen] = React.useState(false);
  const [coiFlagged, setCoiFlagged] = React.useState(false);

  const [docNotes, setDocNotes] = React.useState<
    Record<string, { verdict: DocVerdict; note: string }>
  >({});

  const setDocNote = (docId: string, patch: Partial<{ verdict: DocVerdict; note: string }>) =>
    setDocNotes((s) => ({
      ...s,
      [docId]: { verdict: "Accept", note: "", ...s[docId], ...patch },
    }));

  const [rubricState, setRubricState] = React.useState<
    Record<string, { verdict: RubricVerdict | null; note: string }>
  >({});

  const setRubric = (
    rid: string,
    patch: Partial<{ verdict: RubricVerdict | null; note: string }>,
  ) =>
    setRubricState((s) => ({
      ...s,
      [rid]: { verdict: null, note: "", ...s[rid], ...patch },
    }));

  React.useEffect(() => {
    const t = window.setInterval(() => {
      if (Object.keys(rubricState).length > 0) {
        push({
          type: "info",
          title: isAr ? "تم حفظ التقييم" : "Rubric progress saved",
        });
      }
    }, 60_000);
    return () => clearInterval(t);
  }, [rubricState, push, isAr]);

  const slaElapsed = Math.max(
    0,
    SLA_TOTAL_HOURS -
      Math.max(0, (item.slaDeadline.getTime() - Date.now()) / 36e5),
  );

  const handleCoiConfirm = () => {
    setCoiFlagged(true);
    setCoiOpen(false);
    push({
      type: "warning",
      title: isAr ? "تم تسجيل تضارب المصالح" : "Conflict of interest flagged",
      description: isAr
        ? "سيتم إعادة تعيين القضية لمقيّم آخر."
        : "This case will be reassigned to another assessor.",
    });
  };

  return (
    <div className="space-y-4">
      <Link
        to="/assessor/queue"
        className="text-sm text-navy-800 hover:underline inline-flex items-center gap-1"
      >
        <ArrowLeft size={14} className="rtl-flip" />
        {isAr ? "الرجوع إلى القائمة" : "Back to queue"}
      </Link>

      {coiFlagged && (
        <Alert
          type="warning"
          title={isAr ? "وضع القراءة فقط" : "Read-only mode"}
        >
          {isAr
            ? "تم الإبلاغ عن تضارب مصالح. لا يمكنك إجراء أي تغييرات على هذه القضية."
            : "You have flagged a conflict of interest on this case. No further actions are permitted from your account."}
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-5">
        <aside className="lg:col-span-2 space-y-4">
          <Card variant="government">
            <CardContent className="pt-6 space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-ink-muted">
                  {isAr ? "رقم الطلب" : "Application"}
                </p>
                <p
                  className="font-mono text-base font-semibold text-navy-900"
                  dir="ltr"
                >
                  {item.applicationId}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-ink-muted">
                  {isAr ? "اسم المتقدم" : "Applicant"}
                </p>
                <p className="text-base font-semibold text-ink-primary">
                  {isAr ? item.applicantNameAr : item.applicantNameEn}
                </p>
                <p
                  className="text-xs text-ink-secondary font-mono"
                  dir="ltr"
                >
                  {item.emiratesIdMasked}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-ink-muted">
                    {isAr ? "الفئة" : "Category"}
                  </p>
                  <p className="font-medium text-ink-primary">
                    {item.category}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-ink-muted">
                    {isAr ? "تاريخ الإرسال" : "Submitted"}
                  </p>
                  <p className="font-medium text-ink-primary">
                    {formatDate(item.submittedAt, lang)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-ink-muted">
                    {isAr ? "الحالة" : "Status"}
                  </p>
                  <Badge status={item.status} />
                </div>
                <div>
                  <p className="text-xs text-ink-muted">
                    {isAr ? "الموعد النهائي" : "SLA deadline"}
                  </p>
                  <p className="font-medium text-ink-primary text-xs">
                    {formatDate(item.slaDeadline, lang)}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-border-default flex justify-center">
                <SLAClock
                  elapsedHours={slaElapsed}
                  totalHours={SLA_TOTAL_HOURS}
                  size={120}
                  label={isAr ? "الوقت المتبقي" : "Time remaining"}
                />
              </div>
            </CardContent>
          </Card>

          <Card variant="bordered">
            <CardContent className="pt-5">
              <h2 className="text-sm font-semibold text-ink-primary mb-3 flex items-center gap-2">
                <FileText size={14} />
                {isAr ? "المستندات المرفوعة" : "Uploaded documents"}
              </h2>
              <ul className="divide-y divide-border-default text-sm">
                {mockDocuments.map((doc) => (
                  <li
                    key={doc.id}
                    className="py-2 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-ink-primary truncate">
                        {docTypeLabel(doc.type, isAr)}
                      </p>
                      <p className="text-xs text-ink-muted truncate font-mono">
                        {doc.fileName}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setTab("documents");
                        setPreviewDoc(doc);
                      }}
                      className="inline-flex items-center gap-1 text-xs text-navy-800 hover:underline focus-ring rounded px-1"
                    >
                      <Eye size={12} />
                      {isAr ? "معاينة" : "Preview"}
                    </button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Button
            variant="secondary"
            fullWidth
            iconStart={<ShieldAlert size={16} />}
            onClick={() => setCoiOpen(true)}
            disabled={coiFlagged}
            className="border-danger-600 text-danger-600 hover:bg-danger-100/40"
          >
            {isAr ? "الإبلاغ عن تضارب مصالح" : "Flag conflict of interest"}
          </Button>
        </aside>

        <section className="lg:col-span-3 space-y-4">
          <div className="bg-surface-0 border border-border-default rounded-lg p-1 flex gap-1 overflow-x-auto">
            <TabButton
              active={tab === "details"}
              onClick={() => setTab("details")}
              icon={<User size={14} />}
              label={isAr ? "بيانات المتقدم" : "Applicant Details"}
            />
            <TabButton
              active={tab === "documents"}
              onClick={() => setTab("documents")}
              icon={<FileText size={14} />}
              label={isAr ? "المستندات" : "Documents"}
            />
            <TabButton
              active={tab === "rubric"}
              onClick={() => setTab("rubric")}
              icon={<CheckCircle2 size={14} />}
              label={isAr ? "قائمة التقييم" : "Rubric"}
            />
            <TabButton
              active={tab === "rfi"}
              onClick={() => setTab("rfi")}
              icon={<MessageSquare size={14} />}
              label={isAr ? "طلب معلومات" : "RFI"}
            />
          </div>

          {tab === "details" && <DetailsTab isAr={isAr} />}
          {tab === "documents" && (
            <DocumentsTab
              isAr={isAr}
              previewDoc={previewDoc}
              setPreviewDoc={setPreviewDoc}
              docNotes={docNotes}
              setDocNote={setDocNote}
              disabled={coiFlagged}
            />
          )}
          {tab === "rubric" && (
            <RubricTab
              isAr={isAr}
              rubricState={rubricState}
              setRubric={setRubric}
              disabled={coiFlagged}
              onProceedToDecision={() =>
                navigate(`/assessor/applications/${item.applicationId}/decision`)
              }
            />
          )}
          {tab === "rfi" && (
            <RfiTab isAr={isAr} appId={item.applicationId} disabled={coiFlagged} />
          )}
        </section>
      </div>

      <Modal
        open={coiOpen}
        onClose={() => setCoiOpen(false)}
        title={isAr ? "تأكيد تضارب المصالح" : "Confirm conflict of interest"}
        description={
          isAr
            ? "سيتم إعادة تعيين هذه القضية لمقيّم آخر، ولن تتمكن من الوصول إليها بعد ذلك."
            : "This case will be reassigned to another assessor and you will lose access to it."
        }
        footer={
          <div className="flex justify-end gap-2 w-full">
            <Button variant="ghost" onClick={() => setCoiOpen(false)}>
              {isAr ? "إلغاء" : "Cancel"}
            </Button>
            <Button variant="danger" onClick={handleCoiConfirm}>
              {isAr ? "تأكيد الإبلاغ" : "Confirm flag"}
            </Button>
          </div>
        }
      >
        <p className="text-sm text-ink-secondary">
          {isAr
            ? "يجب الإبلاغ عن أي علاقة شخصية أو مهنية مع المتقدم تؤثر على حياديتك."
            : "You must flag any personal or professional relationship with the applicant that could affect your impartiality."}
        </p>
      </Modal>
    </div>
  );
};

const TabButton: React.FC<{
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}> = ({ active, onClick, icon, label }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "h-9 px-3 rounded-md text-xs font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap",
      active
        ? "bg-navy-900 text-ink-inverse"
        : "text-ink-secondary hover:bg-surface-100",
    )}
  >
    {icon}
    {label}
  </button>
);

const DetailsTab: React.FC<{ isAr: boolean }> = ({ isAr }) => (
  <Card variant="bordered">
    <CardContent className="pt-6 space-y-6">
      <Section title={isAr ? "المعلومات الشخصية" : "Personal Information"}>
        <Field label={isAr ? "الاسم الكامل" : "Full name"} value="Layla Hassan Al Marri" />
        <Field label={isAr ? "الاسم بالعربية" : "Name (Arabic)"} value="ليلى حسن المري" />
        <Field label={isAr ? "الجنسية" : "Nationality"} value={isAr ? "الإمارات" : "United Arab Emirates"} />
        <Field label={isAr ? "تاريخ الميلاد" : "Date of birth"} value="12 Apr 1990" />
        <Field label={isAr ? "البريد" : "Email"} value="layla.hassan@example.ae" mono />
        <Field label={isAr ? "الجوال" : "Mobile"} value="+971 50 123 4567" mono />
      </Section>
      <Section title={isAr ? "المؤهلات" : "Qualifications"}>
        <Field label={isAr ? "أعلى شهادة" : "Highest degree"} value={isAr ? "ماجستير" : "Master's degree"} />
        <Field label={isAr ? "التخصص" : "Field of study"} value={isAr ? "تربية" : "Education"} />
        <Field label={isAr ? "الجامعة" : "University"} value="American University of Beirut" />
        <Field label={isAr ? "السنة" : "Year"} value="2015" />
      </Section>
      <Section title={isAr ? "الخبرة العملية" : "Employment"}>
        <Field label={isAr ? "جهة العمل" : "Current employer"} value="Abu Dhabi Education Council" />
        <Field label={isAr ? "المسمى" : "Job title"} value={isAr ? "معلم أول" : "Lead Teacher"} />
        <Field label={isAr ? "سنوات الخبرة" : "Years of experience"} value="9" />
      </Section>
      <Section title={isAr ? "إقرار التطوير المهني" : "CPD Declaration"}>
        <Field label={isAr ? "إجمالي الساعات" : "Total CPD hours"} value="42" />
        <Field
          label={isAr ? "الوصف" : "Activity description"}
          value={
            isAr
              ? "ورش عمل في تكنولوجيا التعليم والتقييم التكويني خلال 2024-2025."
              : "Workshops in EdTech and formative assessment conducted in 2024–2025."
          }
        />
      </Section>
    </CardContent>
  </Card>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div>
    <h3 className="text-sm font-semibold text-navy-900 mb-3 pb-2 border-b border-border-default">
      {title}
    </h3>
    <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2 text-sm">{children}</dl>
  </div>
);

const Field: React.FC<{ label: string; value: string; mono?: boolean }> = ({
  label,
  value,
  mono,
}) => (
  <div>
    <dt className="text-xs text-ink-muted">{label}</dt>
    <dd
      className={cn(
        "text-ink-primary font-medium",
        mono && "font-mono text-xs",
      )}
      dir={mono ? "ltr" : undefined}
    >
      {value}
    </dd>
  </div>
);

const DocumentsTab: React.FC<{
  isAr: boolean;
  previewDoc: AssessorDocument | null;
  setPreviewDoc: (d: AssessorDocument | null) => void;
  docNotes: Record<string, { verdict: DocVerdict; note: string }>;
  setDocNote: (
    docId: string,
    patch: Partial<{ verdict: DocVerdict; note: string }>,
  ) => void;
  disabled: boolean;
}> = ({ isAr, previewDoc, setPreviewDoc, docNotes, setDocNote, disabled }) => {
  const active = previewDoc ?? mockDocuments[0];
  return (
    <div className="space-y-4">
      <Card variant="bordered">
        <CardContent className="pt-5">
          <div className="flex flex-wrap gap-2">
            {mockDocuments.map((doc) => {
              const isActive = active.id === doc.id;
              return (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => setPreviewDoc(doc)}
                  className={cn(
                    "h-9 px-3 rounded-md text-xs font-medium inline-flex items-center gap-2 ring-1 transition-colors",
                    isActive
                      ? "bg-navy-900 text-ink-inverse ring-navy-900"
                      : "bg-surface-0 text-ink-secondary ring-border-default hover:bg-surface-100",
                  )}
                >
                  <FileText size={12} />
                  {docTypeLabel(doc.type, isAr)}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card variant="bordered">
        <CardContent className="pt-5 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-ink-primary">
                {docTypeLabel(active.type, isAr)}
              </p>
              <p className="text-xs text-ink-muted font-mono" dir="ltr">
                {active.fileName} · {(active.sizeKb / 1024).toFixed(2)} MB
              </p>
            </div>
            <Badge variant="success">
              <CheckCircle2 size={10} />
              {isAr ? "نظيف" : "Clean"}
            </Badge>
          </div>

          <div className="aspect-[4/3] rounded-md bg-surface-100 border border-border-default flex flex-col items-center justify-center text-ink-muted text-sm gap-2">
            {active.type === "Photo" ? (
              <ImageIcon size={48} />
            ) : (
              <FileText size={48} />
            )}
            <p>
              {isAr
                ? "معاينة المستند داخل المتصفح"
                : "Inline document preview"}
            </p>
            <p className="text-xs font-mono" dir="ltr">{active.fileName}</p>
          </div>

          <div className="space-y-3 pt-3 border-t border-border-default">
            <p className="text-xs font-semibold text-navy-900 uppercase tracking-wider">
              {isAr ? "تقييم المقيّم" : "Assessor verdict"}
            </p>
            <div className="flex gap-2">
              {(["Accept", "Revise"] as DocVerdict[]).map((v) => {
                const checked = (docNotes[active.id]?.verdict ?? "Accept") === v;
                return (
                  <button
                    key={v}
                    type="button"
                    disabled={disabled}
                    onClick={() => setDocNote(active.id, { verdict: v })}
                    className={cn(
                      "h-9 px-3 rounded-full text-xs font-semibold inline-flex items-center gap-2 ring-1 transition-colors",
                      checked
                        ? v === "Accept"
                          ? "bg-success-100 text-success-600 ring-success-600"
                          : "bg-warning-100 text-warning-600 ring-warning-600"
                        : "bg-surface-0 text-ink-secondary ring-border-default hover:bg-surface-100",
                      disabled && "opacity-50 cursor-not-allowed",
                    )}
                  >
                    {v === "Accept"
                      ? isAr ? "قبول" : "Accept"
                      : isAr ? "طلب تعديل" : "Request revision"}
                  </button>
                );
              })}
            </div>
            <Textarea
              label={isAr ? "ملاحظات (اختياري)" : "Notes (optional)"}
              placeholder={
                isAr
                  ? "أضف ملاحظات حول هذا المستند…"
                  : "Add notes about this document…"
              }
              value={docNotes[active.id]?.note ?? ""}
              onChange={(e) =>
                setDocNote(active.id, { note: e.target.value })
              }
              disabled={disabled}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const RubricTab: React.FC<{
  isAr: boolean;
  rubricState: Record<string, { verdict: RubricVerdict | null; note: string }>;
  setRubric: (
    rid: string,
    patch: Partial<{ verdict: RubricVerdict | null; note: string }>,
  ) => void;
  disabled: boolean;
  onProceedToDecision: () => void;
}> = ({ isAr, rubricState, setRubric, disabled, onProceedToDecision }) => {
  const { push } = useToast();
  const total = teacherRubric.length;
  const assessed = teacherRubric.filter(
    (r) => rubricState[r.id]?.verdict != null,
  ).length;
  const failed = teacherRubric.filter(
    (r) => rubricState[r.id]?.verdict === "Fail",
  ).length;

  const sections = teacherRubric.reduce<Record<RubricSection, RubricItem[]>>(
    (acc, item) => {
      (acc[item.section] ||= []).push(item);
      return acc;
    },
    {} as Record<RubricSection, RubricItem[]>,
  );

  const sectionLabels: Record<RubricSection, { en: string; ar: string }> = {
    Qualifications: { en: "Qualifications", ar: "المؤهلات" },
    Experience: { en: "Experience", ar: "الخبرة" },
    "CPD Declaration": { en: "CPD Declaration", ar: "إقرار التطوير المهني" },
    Documents: { en: "Documents", ar: "المستندات" },
    Declarations: { en: "Declarations", ar: "الإقرارات" },
  };

  const eligible = assessed === total && failed === 0;

  return (
    <div className="space-y-4">
      <Card variant="bordered">
        <CardContent className="pt-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-2xl font-bold text-navy-900">
                {assessed}/{total}
              </p>
              <p className="text-xs text-ink-muted">
                {isAr ? "العناصر المُقيَّمة" : "items assessed"}
              </p>
            </div>
            <div className="h-10 w-px bg-border-default" />
            <div>
              <p className="text-2xl font-bold text-danger-600">{failed}</p>
              <p className="text-xs text-ink-muted">
                {isAr ? "عناصر راسبة" : "failed items"}
              </p>
            </div>
          </div>
          <Badge variant={eligible ? "success" : assessed === total ? "warning" : "neutral"}>
            {eligible
              ? isAr ? "مؤهَّل للموافقة" : "Eligible for Pass"
              : assessed === total
                ? isAr ? "يستوجب القرار" : "Decision required"
                : isAr ? "قيد التقييم" : "Assessment in progress"}
          </Badge>
        </CardContent>
      </Card>

      {Object.entries(sections).map(([sec, items]) => (
        <Card key={sec} variant="bordered">
          <CardContent className="pt-5">
            <h3 className="text-sm font-semibold text-navy-900 mb-4 pb-2 border-b border-border-default">
              {sectionLabels[sec as RubricSection][isAr ? "ar" : "en"]}
            </h3>
            <div className="space-y-3">
              {items.map((it) => {
                const state = rubricState[it.id];
                const failedItem = state?.verdict === "Fail";
                return (
                  <div
                    key={it.id}
                    className="rounded-md ring-1 ring-border-default p-3"
                  >
                    <p className="text-sm text-ink-primary">
                      {isAr ? it.labelAr : it.labelEn}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {(["Pass", "Fail", "NA"] as RubricVerdict[]).map((v) => {
                        const checked = state?.verdict === v;
                        return (
                          <button
                            key={v}
                            type="button"
                            disabled={disabled}
                            onClick={() => setRubric(it.id, { verdict: v })}
                            className={cn(
                              "h-7 px-3 rounded-full text-xs font-semibold inline-flex items-center gap-1 ring-1 transition-colors",
                              checked
                                ? v === "Pass"
                                  ? "bg-success-100 text-success-600 ring-success-600"
                                  : v === "Fail"
                                    ? "bg-danger-100 text-danger-600 ring-danger-600"
                                    : "bg-surface-200 text-ink-secondary ring-ink-secondary"
                                : "bg-surface-0 text-ink-secondary ring-border-default hover:bg-surface-100",
                              disabled && "opacity-50 cursor-not-allowed",
                            )}
                          >
                            {v === "NA"
                              ? isAr ? "لا ينطبق" : "N/A"
                              : v === "Pass"
                                ? isAr ? "ناجح" : "Pass"
                                : isAr ? "راسب" : "Fail"}
                          </button>
                        );
                      })}
                    </div>
                    {failedItem && (
                      <Textarea
                        className="mt-3"
                        placeholder={
                          isAr
                            ? "سبب الرسوب (مطلوب)"
                            : "Reason for failure (required)"
                        }
                        value={state?.note ?? ""}
                        onChange={(e) => setRubric(it.id, { note: e.target.value })}
                        disabled={disabled}
                        required
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex flex-wrap justify-between gap-3">
        <Button
          variant="ghost"
          disabled={disabled}
          onClick={() =>
            push({
              type: "success",
              title: isAr ? "تم حفظ التقييم" : "Rubric saved",
            })
          }
        >
          {isAr ? "حفظ التقدم" : "Save progress"}
        </Button>
        <Button
          variant="primary"
          disabled={disabled || assessed < total}
          onClick={onProceedToDecision}
        >
          {isAr ? "المتابعة إلى القرار" : "Proceed to decision"}
        </Button>
      </div>
    </div>
  );
};

const RfiTab: React.FC<{ isAr: boolean; appId: string; disabled: boolean }> = ({
  isAr,
  appId,
  disabled,
}) => {
  const { push } = useToast();
  const [subject, setSubject] = React.useState(
    `Additional information required — ${appId}`,
  );
  const [body, setBody] = React.useState("");
  const minDate = React.useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  }, []);
  const [deadline, setDeadline] = React.useState(minDate);
  const [language, setLanguage] = React.useState<"en" | "ar" | "both">("both");
  const [docs, setDocs] = React.useState<string[]>([]);

  const docOptions = [
    { v: "EmiratesId", en: "Emirates ID", ar: "الهوية الإماراتية" },
    { v: "Degree", en: "Degree certificate", ar: "شهادة الدرجة العلمية" },
    { v: "Experience", en: "Experience letter", ar: "خطاب الخبرة" },
    { v: "CPDEvidence", en: "CPD evidence", ar: "إثبات التطوير المهني" },
  ];

  const toggleDoc = (v: string) =>
    setDocs((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v]));

  const send = () => {
    push({
      type: "success",
      title: isAr ? "تم إرسال الطلب" : "Request sent",
      description: isAr
        ? "تم إخطار المتقدم وتحويل الطلب إلى حالة 'بانتظار المتقدم'."
        : "Applicant notified. Application moved to PendingApplicant.",
    });
    setBody("");
  };

  return (
    <div className="space-y-4">
      <Card variant="bordered">
        <CardContent className="pt-5">
          <h3 className="text-sm font-semibold text-navy-900 mb-3 flex items-center gap-2">
            <MessageSquare size={14} />
            {isAr ? "سجل الرسائل" : "Conversation history"}
          </h3>
          <div className="space-y-3">
            {mockRfiThread.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "max-w-[85%] rounded-lg p-3 ring-1",
                  m.from === "assessor"
                    ? "ms-auto bg-navy-900 text-ink-inverse ring-navy-900"
                    : "bg-surface-100 text-ink-primary ring-border-default",
                )}
              >
                <div className="flex items-center justify-between gap-3 mb-1">
                  <span className="text-xs font-semibold opacity-90">
                    {m.authorName}
                  </span>
                  <span className="text-[10px] opacity-70">
                    {formatDate(m.sentAt, isAr ? "ar" : "en")}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-line">
                  {isAr ? m.bodyAr : m.bodyEn}
                </p>
                {m.attachments && (
                  <ul className="mt-2 space-y-1">
                    {m.attachments.map((a) => (
                      <li
                        key={a}
                        className="text-xs font-mono inline-flex items-center gap-1 opacity-90"
                        dir="ltr"
                      >
                        <FileText size={10} />
                        {a}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card variant="bordered">
        <CardContent className="pt-5 space-y-4">
          <h3 className="text-sm font-semibold text-navy-900">
            {isAr ? "إرسال طلب جديد" : "Send new request"}
          </h3>

          <Input
            label={isAr ? "الموضوع" : "Subject"}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={disabled}
          />

          <Textarea
            label={isAr ? "الرسالة" : "Message body"}
            placeholder={
              isAr
                ? "اكتب طلبك هنا…"
                : "Describe what additional information is needed…"
            }
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={5}
            disabled={disabled}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              type="date"
              label={isAr ? "الموعد النهائي" : "Response deadline"}
              min={minDate}
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              disabled={disabled}
              helperText={
                isAr
                  ? "بحد أدنى 5 أيام عمل من اليوم"
                  : "Minimum 5 business days from today"
              }
            />
            <Select
              label={isAr ? "لغة الرسالة" : "Send in language"}
              value={language}
              onChange={(e) => setLanguage(e.target.value as "en" | "ar" | "both")}
              disabled={disabled}
              options={[
                { value: "en", label: isAr ? "الإنجليزية فقط" : "English only" },
                { value: "ar", label: isAr ? "العربية فقط" : "Arabic only" },
                { value: "both", label: isAr ? "كلتا اللغتين" : "Both languages" },
              ]}
            />
          </div>

          <div>
            <p className="text-xs font-medium text-ink-primary mb-2">
              {isAr ? "أنواع المستندات المطلوبة" : "Required document types"}
            </p>
            <div className="flex flex-wrap gap-2">
              {docOptions.map((o) => {
                const checked = docs.includes(o.v);
                return (
                  <button
                    key={o.v}
                    type="button"
                    disabled={disabled}
                    onClick={() => toggleDoc(o.v)}
                    className={cn(
                      "h-8 px-3 rounded-full text-xs font-medium inline-flex items-center gap-2 ring-1 transition-colors",
                      checked
                        ? "bg-navy-900 text-ink-inverse ring-navy-900"
                        : "bg-surface-0 text-ink-secondary ring-border-default hover:bg-surface-100",
                    )}
                  >
                    {checked ? <CheckCircle2 size={12} /> : null}
                    {isAr ? o.ar : o.en}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              variant="primary"
              iconStart={<Send size={14} />}
              onClick={send}
              disabled={disabled || body.trim().length < 10}
            >
              {isAr ? "إرسال الطلب" : "Send request"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationReview;
