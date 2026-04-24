import * as React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Lock,
  Plus,
  ShieldCheck,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  Input,
  Modal,
  Select,
  Stepper,
  Textarea,
  UAEPassButton,
  useToast,
} from "@/components/adveti";
import { useLang } from "@/hooks/useLang";
import { cn } from "@/lib/utils";
import { formatAED } from "@/lib/format";
import { mockApplicantProfile } from "@/lib/mockApplicant";

// =====================================================
// Wizard state
// =====================================================

interface Qualification {
  degree: string;
  field: string;
  university: string;
  country: string;
  year: string;
}

interface WizardData {
  // step 1
  email: string;
  mobile: string;
  address: string;
  photo: File | null;
  // step 2
  qualifications: Qualification[];
  // step 3
  employer: string;
  jobTitle: string;
  yearsExperience: string;
  institutionType: string;
  letterRef: string;
  // step 4
  cpdHours: string;
  cpdDescription: string;
  cpdEvidence: File | null;
  // step 5
  agreeTruthful: boolean;
  agreeTerms: boolean;
  agreePrivacy: boolean;
  uaePassSigned: boolean;
}

const initialData: WizardData = {
  email: mockApplicantProfile.email,
  mobile: mockApplicantProfile.mobile,
  address: "",
  photo: null,
  qualifications: [
    { degree: "Bachelor", field: "", university: "", country: "AE", year: "" },
  ],
  employer: "",
  jobTitle: "",
  yearsExperience: "",
  institutionType: "",
  letterRef: "",
  cpdHours: "",
  cpdDescription: "",
  cpdEvidence: null,
  agreeTruthful: false,
  agreeTerms: false,
  agreePrivacy: false,
  uaePassSigned: false,
};

// =====================================================
// Wizard shell
// =====================================================

const ApplyWizard: React.FC = () => {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const navigate = useNavigate();
  const { id, n } = useParams();
  const step = Math.max(1, Math.min(6, parseInt(n ?? "1", 10)));
  const stepIdx = step - 1;

  const [data, setData] = React.useState<WizardData>(initialData);
  const update = <K extends keyof WizardData>(key: K, val: WizardData[K]) =>
    setData((d) => ({ ...d, [key]: val }));

  const { push } = useToast();

  // auto-save every 30s
  React.useEffect(() => {
    const interval = window.setInterval(() => {
      push({
        type: "info",
        title: isAr ? "تم حفظ المسودة" : "Draft saved",
        duration: 2000,
      });
    }, 30000);
    return () => window.clearInterval(interval);
  }, [push, isAr]);

  const steps = [
    { en: "Personal", ar: "البيانات الشخصية" },
    { en: "Qualifications", ar: "المؤهلات" },
    { en: "Employment", ar: "العمل" },
    { en: "CPD Declaration", ar: "إقرار التطوير" },
    { en: "Declarations", ar: "الإقرارات" },
    { en: "Review & Submit", ar: "المراجعة والتقديم" },
  ];

  const goTo = (s: number) => navigate(`/portal/apply/${id}/step/${s}`);

  const next = () => (step < 6 ? goTo(step + 1) : null);
  const prev = () => (step > 1 ? goTo(step - 1) : null);

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-gold-600 font-semibold">
          {isAr ? "طلب جديد" : "New application"}
          {" · "}
          <span className="font-mono text-ink-secondary" dir="ltr">{id}</span>
        </p>
        <h1 className="text-2xl font-bold text-ink-primary mt-1">
          {isAr ? steps[stepIdx].ar : steps[stepIdx].en}
        </h1>
      </header>

      <Card variant="bordered">
        <CardContent className="pt-6 pb-2 overflow-x-auto">
          <Stepper
            steps={steps.map((s) => ({ label: isAr ? s.ar : s.en }))}
            currentStep={stepIdx}
            orientation="horizontal"
          />
        </CardContent>
      </Card>

      <div>
        {step === 1 && <Step1 data={data} update={update} isAr={isAr} />}
        {step === 2 && <Step2 data={data} update={update} isAr={isAr} />}
        {step === 3 && <Step3 data={data} update={update} isAr={isAr} />}
        {step === 4 && <Step4 data={data} update={update} isAr={isAr} id={id!} />}
        {step === 5 && <Step5 data={data} update={update} isAr={isAr} />}
        {step === 6 && <Step6 data={data} isAr={isAr} lang={lang} id={id!} />}
      </div>

      <div className="flex items-center justify-between gap-3 pt-4 border-t border-border-default">
        <Button
          variant="ghost"
          onClick={prev}
          disabled={step === 1}
          iconStart={<ChevronLeft size={16} className="rtl-flip" />}
        >
          {isAr ? "السابق" : "Back"}
        </Button>
        <p className="text-xs text-ink-muted hidden sm:block">
          {isAr ? "تُحفظ التغييرات تلقائياً كل 30 ثانية" : "Changes auto-save every 30 seconds"}
        </p>
        {step < 6 ? (
          <Button
            variant="primary"
            onClick={next}
            iconEnd={<ChevronRight size={16} className="rtl-flip" />}
          >
            {isAr ? "التالي" : "Continue"}
          </Button>
        ) : (
          <SubmitButton
            id={id!}
            isAr={isAr}
            data={data}
          />
        )}
      </div>
    </div>
  );
};

// =====================================================
// Step 1 — Personal Information
// =====================================================

const Step1: React.FC<{
  data: WizardData;
  update: <K extends keyof WizardData>(k: K, v: WizardData[K]) => void;
  isAr: boolean;
}> = ({ data, update, isAr }) => {
  const fileRef = React.useRef<HTMLInputElement>(null);
  const photoUrl = data.photo ? URL.createObjectURL(data.photo) : null;

  return (
    <Card variant="bordered">
      <CardContent className="pt-6 space-y-5">
        <Alert
          type="info"
          title={isAr ? "بيانات موثّقة من الهوية الرقمية" : "Verified by UAE Pass"}
        >
          {isAr
            ? "الحقول المعلَّمة بقفل تم التحقق منها عبر الهوية الرقمية ولا يمكن تعديلها هنا."
            : "Fields marked with a lock are verified via UAE Pass and cannot be edited here."}
        </Alert>

        <div className="grid gap-4 md:grid-cols-2">
          <ReadOnlyField
            label={isAr ? "الاسم الكامل (عربي)" : "Full name (Arabic)"}
            value={mockApplicantProfile.fullNameAr}
            dir="rtl"
          />
          <ReadOnlyField
            label={isAr ? "الاسم الكامل (إنجليزي)" : "Full name (English)"}
            value={mockApplicantProfile.fullNameEn}
            dir="ltr"
          />
          <ReadOnlyField
            label={isAr ? "رقم الهوية" : "Emirates ID"}
            value={mockApplicantProfile.emiratesId}
            dir="ltr"
          />
          <ReadOnlyField
            label={isAr ? "الجنسية" : "Nationality"}
            value={isAr ? mockApplicantProfile.nationalityAr : mockApplicantProfile.nationality}
          />
          <ReadOnlyField
            label={isAr ? "تاريخ الميلاد" : "Date of birth"}
            value={mockApplicantProfile.dateOfBirth}
            dir="ltr"
          />
        </div>

        <div className="border-t border-border-default pt-5">
          <h3 className="text-sm font-semibold text-ink-primary mb-4">
            {isAr ? "بيانات قابلة للتعديل" : "Editable contact details"}
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label={isAr ? "البريد الإلكتروني" : "Preferred email"}
              type="email"
              required
              value={data.email}
              onChange={(e) => update("email", e.target.value)}
            />
            <Input
              label={isAr ? "الهاتف المتحرك" : "Mobile number"}
              type="tel"
              required
              value={data.mobile}
              onChange={(e) => update("mobile", e.target.value)}
              helperText={isAr ? "بصيغة 971+ XX-XXXX-XXX" : "Format: +971 XX-XXXX-XXX"}
            />
          </div>
          <div className="mt-4">
            <Textarea
              label={isAr ? "العنوان البريدي" : "Mailing address"}
              required
              rows={2}
              value={data.address}
              onChange={(e) => update("address", e.target.value)}
              placeholder={isAr ? "العنوان الكامل" : "Full mailing address"}
            />
          </div>

          {/* Photo upload */}
          <div className="mt-5">
            <p className="text-sm font-medium text-ink-primary mb-2">
              {isAr ? "صورة شخصية مهنية" : "Professional photograph"}
              <span className="text-danger-600 ms-1">*</span>
            </p>
            <div className="flex items-center gap-4">
              <div className="h-24 w-24 rounded-md bg-surface-100 border border-border-default flex items-center justify-center overflow-hidden">
                {photoUrl ? (
                  <img src={photoUrl} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <Camera size={20} className="text-ink-muted" />
                )}
              </div>
              <div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  hidden
                  onChange={(e) => update("photo", e.target.files?.[0] ?? null)}
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => fileRef.current?.click()}
                  iconStart={<Upload size={14} />}
                >
                  {data.photo ? (isAr ? "تغيير الصورة" : "Change photo") : isAr ? "رفع صورة" : "Upload photo"}
                </Button>
                <p className="text-xs text-ink-muted mt-1.5">
                  {isAr ? "JPG/PNG، حتى 2 ميغابايت" : "JPG/PNG, max 2MB"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// =====================================================
// Step 2 — Qualifications
// =====================================================

const Step2: React.FC<{
  data: WizardData;
  update: <K extends keyof WizardData>(k: K, v: WizardData[K]) => void;
  isAr: boolean;
}> = ({ data, update, isAr }) => {
  const setQual = (i: number, key: keyof Qualification, val: string) => {
    update(
      "qualifications",
      data.qualifications.map((q, j) => (i === j ? { ...q, [key]: val } : q)),
    );
  };
  const addQual = () => {
    if (data.qualifications.length >= 3) return;
    update("qualifications", [
      ...data.qualifications,
      { degree: "Bachelor", field: "", university: "", country: "AE", year: "" },
    ]);
  };
  const removeQual = (i: number) => {
    update(
      "qualifications",
      data.qualifications.filter((_, j) => j !== i),
    );
  };

  const years = Array.from({ length: 50 }, (_, i) => {
    const y = new Date().getFullYear() - i;
    return { value: String(y), label: String(y) };
  });

  return (
    <div className="space-y-4">
      {data.qualifications.map((q, i) => (
        <Card key={i} variant="bordered">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-ink-primary">
                {isAr ? `المؤهل ${i + 1}` : `Qualification ${i + 1}`}
              </h3>
              {i > 0 && (
                <button
                  onClick={() => removeQual(i)}
                  className="text-danger-600 hover:bg-danger-100 p-1.5 rounded focus-ring"
                  aria-label="Remove"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Select
                label={isAr ? "أعلى درجة علمية" : "Highest degree"}
                required
                value={q.degree}
                onChange={(e) => setQual(i, "degree", e.target.value)}
                options={[
                  { value: "Bachelor", label: isAr ? "بكالوريوس" : "Bachelor's" },
                  { value: "Master", label: isAr ? "ماجستير" : "Master's" },
                  { value: "Doctorate", label: isAr ? "دكتوراه" : "Doctorate" },
                  { value: "Other", label: isAr ? "أخرى" : "Other" },
                ]}
              />
              <Input
                label={isAr ? "التخصص" : "Field of study"}
                required
                value={q.field}
                onChange={(e) => setQual(i, "field", e.target.value)}
              />
              <Input
                label={isAr ? "الجامعة" : "University name"}
                required
                value={q.university}
                onChange={(e) => setQual(i, "university", e.target.value)}
              />
              <Select
                label={isAr ? "بلد الدراسة" : "Country of study"}
                required
                value={q.country}
                onChange={(e) => setQual(i, "country", e.target.value)}
                options={[
                  { value: "AE", label: isAr ? "الإمارات" : "United Arab Emirates" },
                  { value: "SA", label: isAr ? "السعودية" : "Saudi Arabia" },
                  { value: "EG", label: isAr ? "مصر" : "Egypt" },
                  { value: "JO", label: isAr ? "الأردن" : "Jordan" },
                  { value: "GB", label: isAr ? "المملكة المتحدة" : "United Kingdom" },
                  { value: "US", label: isAr ? "الولايات المتحدة" : "United States" },
                  { value: "OTHER", label: isAr ? "أخرى" : "Other" },
                ]}
              />
              <Select
                label={isAr ? "سنة التخرج" : "Year of graduation"}
                required
                value={q.year}
                onChange={(e) => setQual(i, "year", e.target.value)}
                placeholder={isAr ? "اختر السنة" : "Select year"}
                options={years}
              />
            </div>
          </CardContent>
        </Card>
      ))}
      {data.qualifications.length < 3 && (
        <button
          onClick={addQual}
          className="w-full p-4 rounded-md border-2 border-dashed border-border-default text-sm text-navy-800 font-medium hover:bg-surface-100 focus-ring inline-flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          {isAr ? "إضافة مؤهل آخر" : "Add another qualification"}
        </button>
      )}
    </div>
  );
};

// =====================================================
// Step 3 — Employment
// =====================================================

const Step3: React.FC<{
  data: WizardData;
  update: <K extends keyof WizardData>(k: K, v: WizardData[K]) => void;
  isAr: boolean;
}> = ({ data, update, isAr }) => (
  <Card variant="bordered">
    <CardContent className="pt-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label={isAr ? "اسم جهة العمل الحالية" : "Current employer"}
          required
          value={data.employer}
          onChange={(e) => update("employer", e.target.value)}
        />
        <Input
          label={isAr ? "المسمى الوظيفي" : "Job title"}
          required
          value={data.jobTitle}
          onChange={(e) => update("jobTitle", e.target.value)}
        />
        <Input
          label={isAr ? "سنوات الخبرة" : "Years of experience"}
          type="number"
          min="0"
          max="60"
          required
          value={data.yearsExperience}
          onChange={(e) => update("yearsExperience", e.target.value)}
        />
        <Select
          label={isAr ? "نوع المؤسسة" : "Current institution type"}
          required
          value={data.institutionType}
          onChange={(e) => update("institutionType", e.target.value)}
          placeholder={isAr ? "اختر نوع المؤسسة" : "Select institution type"}
          options={[
            { value: "gov", label: isAr ? "مدرسة حكومية" : "Government School" },
            { value: "private", label: isAr ? "مدرسة خاصة" : "Private School" },
            { value: "uni", label: isAr ? "جامعة" : "University" },
            { value: "training", label: isAr ? "مركز تدريب" : "Training Centre" },
            { value: "other", label: isAr ? "أخرى" : "Other" },
          ]}
        />
        <Input
          label={isAr ? "رقم خطاب الخبرة (اختياري)" : "Employment letter reference (optional)"}
          value={data.letterRef}
          onChange={(e) => update("letterRef", e.target.value)}
        />
      </div>
    </CardContent>
  </Card>
);

// =====================================================
// Step 4 — CPD declaration
// =====================================================

const Step4: React.FC<{
  data: WizardData;
  update: <K extends keyof WizardData>(k: K, v: WizardData[K]) => void;
  isAr: boolean;
  id: string;
}> = ({ data, update, isAr, id }) => {
  const fileRef = React.useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-4">
      <Alert
        type="info"
        title={isAr ? "إقرار التطوير المهني المستمر" : "Continuing Professional Development"}
      >
        {isAr
          ? "صرّح بساعات التطوير المهني التي أكملتها خلال آخر سنتين. سيتم التحقق منها أثناء المراجعة."
          : "Declare CPD hours completed in the past 2 years. These will be verified by the assessor during review."}
      </Alert>

      <Card variant="bordered">
        <CardContent className="pt-6 space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label={isAr ? "إجمالي ساعات التطوير المهني" : "Total CPD hours"}
              type="number"
              min="0"
              max="999"
              required
              value={data.cpdHours}
              onChange={(e) => update("cpdHours", e.target.value)}
              helperText={isAr ? "الحد الأقصى 999 ساعة" : "Max 999 hours"}
            />
          </div>
          <Textarea
            label={isAr ? "وصف أنشطة التطوير المهني" : "CPD activity description"}
            required
            rows={4}
            maxLength={500}
            value={data.cpdDescription}
            onChange={(e) => update("cpdDescription", e.target.value)}
            placeholder={
              isAr
                ? "صف الدورات والورش والشهادات…"
                : "Describe courses, workshops, certifications…"
            }
            helperText={`${data.cpdDescription.length}/500`}
          />

          <div>
            <p className="text-sm font-medium text-ink-primary mb-2">
              {isAr ? "ملف داعم" : "Supporting evidence"}
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <input
                ref={fileRef}
                type="file"
                accept="application/pdf,image/*"
                hidden
                onChange={(e) => update("cpdEvidence", e.target.files?.[0] ?? null)}
              />
              <Button
                variant="secondary"
                size="sm"
                iconStart={<Upload size={14} />}
                onClick={() => fileRef.current?.click()}
              >
                {data.cpdEvidence
                  ? isAr
                    ? "تغيير الملف"
                    : "Change file"
                  : isAr
                  ? "رفع ملف"
                  : "Upload file"}
              </Button>
              {data.cpdEvidence && (
                <span className="text-xs text-ink-secondary inline-flex items-center gap-1">
                  <FileText size={14} />
                  {data.cpdEvidence.name}
                </span>
              )}
              <Link
                to={`/portal/applications/${id}/documents`}
                className="text-xs text-navy-800 hover:underline"
              >
                {isAr ? "إدارة جميع الوثائق →" : "Manage all documents →"}
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// =====================================================
// Step 5 — Declarations
// =====================================================

const Step5: React.FC<{
  data: WizardData;
  update: <K extends keyof WizardData>(k: K, v: WizardData[K]) => void;
  isAr: boolean;
}> = ({ data, update, isAr }) => {
  const [signing, setSigning] = React.useState(false);
  const allChecked = data.agreeTruthful && data.agreeTerms && data.agreePrivacy;

  return (
    <div className="space-y-5">
      <Card variant="bordered">
        <CardContent className="pt-6">
          <h3 className="text-sm font-semibold text-ink-primary mb-3 inline-flex items-center gap-2">
            <Lock size={14} className="text-navy-800" />
            {isAr ? "الشروط والأحكام" : "Terms & Conditions"}
            <Badge variant="neutral">v2026.01</Badge>
          </h3>
          <div className="h-56 overflow-y-auto rounded-md border border-border-default p-4 bg-surface-50 text-sm text-ink-secondary leading-relaxed space-y-3">
            <p>
              <strong>1. Acceptance.</strong> By submitting this application, you agree to be bound by the ADVETI Professional Licence Terms.
            </p>
            <p>
              <strong>2. Accuracy.</strong> You confirm all information provided is true, accurate, and complete.
            </p>
            <p>
              <strong>3. Fees.</strong> All fees are non-refundable once an assessor has been assigned.
            </p>
            <p>
              <strong>4. Conduct.</strong> Licensees agree to abide by the ADVETI Code of Professional Conduct.
            </p>
            <p>
              <strong>5. Suspension.</strong> ADVETI reserves the right to suspend or revoke licences in cases of misconduct or false information.
            </p>
            <p dir="rtl" className="border-t border-border-default pt-3">
              <strong>1. القبول.</strong> بتقديم هذا الطلب، توافق على الالتزام بشروط الترخيص المهني لأدفيتي.
              <br />
              <strong>2. الدقة.</strong> تؤكد أن جميع المعلومات صحيحة ودقيقة وكاملة.
              <br />
              <strong>3. الرسوم.</strong> الرسوم غير قابلة للاسترداد بعد إحالة الطلب إلى مقيّم.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card variant="bordered">
        <CardContent className="pt-6 space-y-3">
          <CheckRow
            checked={data.agreeTruthful}
            onChange={(v) => update("agreeTruthful", v)}
            label={
              isAr
                ? "أقرّ بأن المعلومات المقدّمة صحيحة ودقيقة"
                : "I confirm the information provided is true and accurate"
            }
          />
          <CheckRow
            checked={data.agreeTerms}
            onChange={(v) => update("agreeTerms", v)}
            label={isAr ? "أوافق على الشروط والأحكام" : "I accept the Terms & Conditions"}
          />
          <CheckRow
            checked={data.agreePrivacy}
            onChange={(v) => update("agreePrivacy", v)}
            label={
              isAr
                ? "أوافق على سياسة الخصوصية ومعالجة بياناتي"
                : "I accept the Privacy Policy and consent to data processing"
            }
          />
        </CardContent>
      </Card>

      <Card variant="bordered">
        <CardContent className="pt-6">
          <h3 className="text-sm font-semibold text-ink-primary mb-2 inline-flex items-center gap-2">
            <ShieldCheck size={14} className="text-navy-800" />
            {isAr ? "التوقيع الإلكتروني" : "Digital signature"}
          </h3>
          <p className="text-xs text-ink-secondary mb-4">
            {isAr
              ? "وقّع طلبك إلكترونياً عبر الهوية الرقمية لتوثيق إقراراتك."
              : "Sign your application electronically with UAE Pass to authenticate your declarations."}
          </p>
          {data.uaePassSigned ? (
            <Alert type="success" title={isAr ? "تم التوقيع" : "Signed with UAE Pass"}>
              {isAr
                ? `تم توقيع الطلب في ${new Date().toLocaleString("ar-AE")}`
                : `Signed on ${new Date().toLocaleString("en-AE")}`}
            </Alert>
          ) : (
            <UAEPassButton
              type="button"
              disabled={!allChecked}
              onClick={() => setSigning(true)}
            >
              {isAr ? "وقّع عبر الهوية الرقمية" : "Sign with UAE Pass"}
            </UAEPassButton>
          )}
        </CardContent>
      </Card>

      <Modal
        open={signing}
        onClose={() => setSigning(false)}
        title={isAr ? "التوقيع عبر الهوية الرقمية" : "UAE Pass Signing"}
        description={
          isAr
            ? "افتح تطبيق الهوية الرقمية لتوثيق التوقيع."
            : "Open the UAE Pass app to authenticate your signature."
        }
        footer={
          <>
            <Button variant="ghost" onClick={() => setSigning(false)}>
              {isAr ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                update("uaePassSigned", true);
                setSigning(false);
              }}
            >
              {isAr ? "محاكاة التأكيد" : "Simulate confirm"}
            </Button>
          </>
        }
      >
        <div className="text-center py-6">
          <div className="h-16 w-16 mx-auto rounded-full bg-[#004B8D] text-ink-inverse flex items-center justify-center mb-3">
            <ShieldCheck size={28} />
          </div>
          <p className="text-sm text-ink-primary font-medium">
            {isAr ? "بانتظار التأكيد…" : "Waiting for confirmation…"}
          </p>
          <p className="text-xs text-ink-muted mt-2">
            +971 ** *** {mockApplicantProfile.mobile.slice(-4)}
          </p>
        </div>
      </Modal>
    </div>
  );
};

const CheckRow: React.FC<{
  checked: boolean;
  onChange: (v: boolean) => void;
  label: React.ReactNode;
}> = ({ checked, onChange, label }) => (
  <label className="flex items-start gap-3 p-2 rounded-md hover:bg-surface-100 cursor-pointer">
    <span
      className={cn(
        "mt-0.5 h-5 w-5 rounded border flex items-center justify-center shrink-0",
        checked ? "bg-navy-800 border-navy-800" : "bg-surface-0 border-border-strong",
      )}
    >
      {checked && <CheckCircle2 size={14} className="text-ink-inverse" />}
    </span>
    <input
      type="checkbox"
      className="sr-only"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
    <span className="text-sm text-ink-primary">{label}</span>
  </label>
);

// =====================================================
// Step 6 — Review
// =====================================================

const Step6: React.FC<{
  data: WizardData;
  isAr: boolean;
  lang: "en" | "ar";
  id: string;
}> = ({ data, isAr, lang, id }) => {
  const fee = 1000;
  const vat = Math.round(fee * 0.05);
  const total = fee + vat;

  const docs = [
    { en: "Emirates ID", ar: "الهوية الإماراتية", uploaded: true },
    { en: "Degree certificate", ar: "شهادة الدرجة", uploaded: true },
    { en: "Experience letter", ar: "خطاب الخبرة", uploaded: true },
    { en: "CPD evidence", ar: "إثبات التطوير المهني", uploaded: !!data.cpdEvidence },
    { en: "Professional photograph", ar: "صورة شخصية", uploaded: !!data.photo },
  ];
  const missing = docs.filter((d) => !d.uploaded);

  return (
    <div className="space-y-5">
      {missing.length > 0 && (
        <Alert
          type="warning"
          title={isAr ? "وثائق ناقصة" : "Documents missing"}
        >
          {isAr
            ? "يجب رفع جميع الوثائق المطلوبة قبل التقديم."
            : "All required documents must be uploaded before submission."}
        </Alert>
      )}

      <ReviewSection title={isAr ? "البيانات الشخصية" : "Personal information"} editLink={`/portal/apply/${id}/step/1`} isAr={isAr}>
        <Field labelEn="Name" labelAr="الاسم" valueEn={mockApplicantProfile.fullNameEn} valueAr={mockApplicantProfile.fullNameAr} isAr={isAr} />
        <Field labelEn="Emirates ID" labelAr="رقم الهوية" valueEn={mockApplicantProfile.emiratesId} valueAr={mockApplicantProfile.emiratesId} isAr={isAr} />
        <Field labelEn="Email" labelAr="البريد" valueEn={data.email} valueAr={data.email} isAr={isAr} />
        <Field labelEn="Mobile" labelAr="الهاتف" valueEn={data.mobile} valueAr={data.mobile} isAr={isAr} />
      </ReviewSection>

      <ReviewSection title={isAr ? "المؤهلات" : "Qualifications"} editLink={`/portal/apply/${id}/step/2`} isAr={isAr}>
        {data.qualifications.map((q, i) => (
          <Field
            key={i}
            labelEn={`Qualification ${i + 1}`}
            labelAr={`المؤهل ${i + 1}`}
            valueEn={`${q.degree} in ${q.field || "—"} · ${q.university || "—"} (${q.year || "—"})`}
            valueAr={`${q.degree} في ${q.field || "—"} · ${q.university || "—"} (${q.year || "—"})`}
            isAr={isAr}
          />
        ))}
      </ReviewSection>

      <ReviewSection title={isAr ? "العمل" : "Employment"} editLink={`/portal/apply/${id}/step/3`} isAr={isAr}>
        <Field labelEn="Employer" labelAr="جهة العمل" valueEn={data.employer || "—"} valueAr={data.employer || "—"} isAr={isAr} />
        <Field labelEn="Job title" labelAr="المسمى" valueEn={data.jobTitle || "—"} valueAr={data.jobTitle || "—"} isAr={isAr} />
        <Field labelEn="Years of experience" labelAr="سنوات الخبرة" valueEn={data.yearsExperience || "—"} valueAr={data.yearsExperience || "—"} isAr={isAr} />
      </ReviewSection>

      <ReviewSection title={isAr ? "إقرار التطوير المهني" : "CPD declaration"} editLink={`/portal/apply/${id}/step/4`} isAr={isAr}>
        <Field labelEn="Total hours" labelAr="إجمالي الساعات" valueEn={data.cpdHours || "—"} valueAr={data.cpdHours || "—"} isAr={isAr} />
        <Field labelEn="Description" labelAr="الوصف" valueEn={data.cpdDescription || "—"} valueAr={data.cpdDescription || "—"} isAr={isAr} />
      </ReviewSection>

      <Card variant="bordered">
        <CardContent className="pt-6">
          <h3 className="text-sm font-semibold text-ink-primary mb-3">
            {isAr ? "حالة الوثائق" : "Document checklist"}
          </h3>
          <ul className="text-sm divide-y divide-border-default">
            {docs.map((d) => (
              <li key={d.en} className="py-2 flex items-center justify-between">
                <span className="text-ink-primary">{isAr ? d.ar : d.en}</span>
                {d.uploaded ? (
                  <span className="inline-flex items-center gap-1 text-success-600">
                    <CheckCircle2 size={14} />
                    {isAr ? "تم الرفع" : "Uploaded"}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-danger-600">
                    <X size={14} />
                    {isAr ? "ناقص" : "Missing"}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card variant="government">
        <CardContent className="pt-6">
          <h3 className="text-sm font-semibold text-ink-primary mb-3">
            {isAr ? "ملخص الرسوم" : "Fee summary"}
          </h3>
          <dl className="text-sm divide-y divide-border-default">
            <div className="py-2 flex justify-between">
              <dt className="text-ink-secondary">{isAr ? "رسوم الطلب" : "Application fee"}</dt>
              <dd className="font-medium">{formatAED(fee, lang)}</dd>
            </div>
            <div className="py-2 flex justify-between">
              <dt className="text-ink-secondary">{isAr ? "VAT (5٪)" : "VAT (5%)"}</dt>
              <dd className="font-medium">{formatAED(vat, lang)}</dd>
            </div>
            <div className="py-2 flex justify-between text-base">
              <dt className="font-semibold">{isAr ? "الإجمالي" : "Total"}</dt>
              <dd className="font-bold text-navy-900">{formatAED(total, lang)}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
};

const ReviewSection: React.FC<{
  title: string;
  editLink: string;
  isAr: boolean;
  children: React.ReactNode;
}> = ({ title, editLink, isAr, children }) => (
  <Card variant="bordered">
    <CardContent className="pt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-ink-primary">{title}</h3>
        <Link to={editLink} className="text-xs text-navy-800 hover:underline">
          {isAr ? "تعديل" : "Edit"}
        </Link>
      </div>
      <dl className="text-sm grid sm:grid-cols-2 gap-x-6 gap-y-3">{children}</dl>
    </CardContent>
  </Card>
);

const Field: React.FC<{
  labelEn: string;
  labelAr: string;
  valueEn: string;
  valueAr: string;
  isAr: boolean;
}> = ({ labelEn, labelAr, valueEn, valueAr, isAr }) => (
  <div>
    <dt className="text-xs text-ink-muted uppercase tracking-wider">
      {isAr ? labelAr : labelEn}
    </dt>
    <dd className="text-ink-primary mt-0.5">{isAr ? valueAr : valueEn}</dd>
  </div>
);

const ReadOnlyField: React.FC<{ label: string; value: string; dir?: "ltr" | "rtl" }> = ({
  label,
  value,
  dir,
}) => (
  <div>
    <label className="text-sm font-medium text-ink-primary mb-1.5 flex items-center gap-1.5">
      {label}
      <Lock size={11} className="text-ink-muted" aria-label="Locked" />
    </label>
    <div
      className="h-10 rounded-md bg-surface-100 border border-border-default px-3 flex items-center text-sm text-ink-secondary"
      dir={dir}
    >
      {value}
    </div>
  </div>
);

// =====================================================
// Submit confirmation
// =====================================================

const SubmitButton: React.FC<{ id: string; isAr: boolean; data: WizardData }> = ({
  id,
  isAr,
  data,
}) => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const canSubmit =
    data.agreeTruthful && data.agreeTerms && data.agreePrivacy && data.uaePassSigned;

  return (
    <>
      <Button
        variant="gold"
        size="lg"
        disabled={!canSubmit}
        onClick={() => setOpen(true)}
      >
        {isAr ? "تقديم الطلب" : "Submit application"}
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={isAr ? "تأكيد التقديم" : "Confirm submission"}
        description={
          isAr
            ? "بمجرد التقديم لا يمكن تعديل الطلب. ستُحال إلى الدفع."
            : "Once submitted, the application cannot be edited. You will be routed to payment."
        }
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              {isAr ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              variant="gold"
              onClick={() => navigate(`/portal/applications/${id}/payment`)}
            >
              {isAr ? "تأكيد ومتابعة الدفع" : "Confirm & continue to payment"}
            </Button>
          </>
        }
      >
        <Alert type="warning" title={isAr ? "إجراء نهائي" : "Final action"}>
          {isAr
            ? "تأكد من صحة المعلومات قبل التقديم."
            : "Please confirm all information is correct before submitting."}
        </Alert>
        {!canSubmit && (
          <p className="mt-3 text-xs text-danger-600 inline-flex items-center gap-1">
            <AlertTriangle size={12} />
            {isAr ? "لم تكتمل جميع الإقرارات." : "All declarations and signing are required."}
          </p>
        )}
      </Modal>
    </>
  );
};

export default ApplyWizard;
