import * as React from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  AlertOctagon,
  Award,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  GraduationCap,
  Hash,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Stamp,
  User,
} from "lucide-react";
import { Button, Card, CardContent } from "@/components/adveti";
import { useLang } from "@/hooks/useLang";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";

type Status = "Active" | "Expired" | "Suspended" | "Revoked";

interface VerificationResult {
  token: string;
  holderNameEn: string;
  holderNameAr: string;
  licenceNumber: string;
  category: "Teacher" | "Counsellor" | "Trainer";
  validFrom: Date;
  validTo: Date;
  status: Status;
}

const MOCK: Record<string, VerificationResult> = {
  "LP-2026-00012345": {
    token: "LP-2026-00012345",
    holderNameEn: "Aisha Mohammed Al Hashimi",
    holderNameAr: "عائشة محمد الهاشمي",
    licenceNumber: "LP-2026-00012345",
    category: "Teacher",
    validFrom: new Date("2026-01-15"),
    validTo: new Date("2028-01-14"),
    status: "Active",
  },
  "LP-2025-00009988": {
    token: "LP-2025-00009988",
    holderNameEn: "Khalid Saeed Al Mazrouei",
    holderNameAr: "خالد سعيد المزروعي",
    licenceNumber: "LP-2025-00009988",
    category: "Trainer",
    validFrom: new Date("2023-03-01"),
    validTo: new Date("2025-02-28"),
    status: "Expired",
  },
  "LP-2024-00007777": {
    token: "LP-2024-00007777",
    holderNameEn: "Sara Ibrahim Al Marri",
    holderNameAr: "سارة إبراهيم المري",
    licenceNumber: "LP-2024-00007777",
    category: "Counsellor",
    validFrom: new Date("2024-06-01"),
    validTo: new Date("2026-05-31"),
    status: "Suspended",
  },
};

const STATUS_CFG: Record<
  Status,
  { en: string; ar: string; icon: React.ReactNode; cls: string; ring: string }
> = {
  Active: {
    en: "VALID",
    ar: "ساري",
    icon: <CheckCircle2 size={32} />,
    cls: "bg-success-100 text-success-600",
    ring: "ring-success-600/30",
  },
  Expired: {
    en: "EXPIRED",
    ar: "منتهي",
    icon: <Clock size={32} />,
    cls: "bg-warning-100 text-warning-600",
    ring: "ring-warning-600/30",
  },
  Suspended: {
    en: "SUSPENDED",
    ar: "موقوف",
    icon: <ShieldAlert size={32} />,
    cls: "bg-danger-100 text-danger-600",
    ring: "ring-danger-600/30",
  },
  Revoked: {
    en: "REVOKED",
    ar: "ملغى",
    icon: <ShieldX size={32} />,
    cls: "bg-navy-950 text-ink-inverse",
    ring: "ring-navy-950/30",
  },
};

const CATEGORY_LABELS = {
  Teacher: { en: "Teacher", ar: "معلم" },
  Counsellor: { en: "Counsellor", ar: "مرشد" },
  Trainer: { en: "Trainer", ar: "مدرّب" },
};

const Verify: React.FC = () => {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const [params] = useSearchParams();
  const token = params.get("token") ?? "LP-2026-00012345";
  const result = MOCK[token];

  return (
    <div className="-mt-10 -mx-4 sm:-mx-6 lg:-mx-8 min-h-[80vh] bg-surface-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Seal header */}
        <div className="text-center mb-6">
          <span className="inline-flex h-16 w-16 rounded-full bg-navy-900 text-gold-400 ring-4 ring-gold-500/20 items-center justify-center mb-3">
            <Stamp size={28} />
          </span>
          <p className="text-xs uppercase tracking-[0.25em] text-gold-600 font-semibold">
            {isAr ? "التحقق الرسمي" : "Official Verification"}
          </p>
          <h1 className="text-2xl font-bold text-ink-primary mt-1">
            {isAr ? "التحقق من ترخيص أدفيتي" : "ADVETI Licence Verification"}
          </h1>
        </div>

        {result ? <ValidResult result={result} isAr={isAr} lang={lang} /> : <InvalidResult isAr={isAr} />}

        {/* Footer note */}
        <p className="mt-8 text-xs text-ink-muted text-center max-w-lg mx-auto leading-relaxed">
          {isAr
            ? "هذه الصفحة هي المصدر الرقمي الرسمي الوحيد للتحقق. لا تقبل صور الشهادات الورقية دون مسح رمز QR."
            : "This page is the only authoritative digital verification source. Do not accept photocopies without scanning the QR code."}
        </p>

        <div className="mt-6 text-center">
          <Link
            to="/verify"
            className="inline-flex items-center gap-1 text-sm font-medium text-navy-800 hover:text-navy-900 focus-ring rounded"
          >
            {isAr ? "التحقق من ترخيص آخر" : "Verify another licence"}
            <ChevronRight size={14} className="rtl-flip" />
          </Link>
        </div>
      </div>
    </div>
  );
};

const ValidResult: React.FC<{ result: VerificationResult; isAr: boolean; lang: "en" | "ar" }> = ({
  result,
  isAr,
  lang,
}) => {
  const cfg = STATUS_CFG[result.status];
  return (
    <Card variant="elevated" className="overflow-hidden">
      {/* Status banner */}
      <div className={cn("p-6 flex items-center gap-4 ring-1 ring-inset", cfg.cls, cfg.ring)}>
        {cfg.icon}
        <div>
          <p className="text-xs uppercase tracking-[0.2em] font-semibold opacity-80">
            {isAr ? "الحالة" : "Status"}
          </p>
          <p className="text-2xl font-bold tracking-tight">{isAr ? cfg.ar : cfg.en}</p>
        </div>
      </div>

      <CardContent className="pt-6 space-y-5">
        <Field
          icon={<User size={16} />}
          labelEn="Licence holder"
          labelAr="حامل الترخيص"
          isAr={isAr}
        >
          <p className="text-base font-semibold text-ink-primary">
            {isAr ? result.holderNameAr : result.holderNameEn}
          </p>
          <p className="text-sm text-ink-secondary mt-0.5" dir={isAr ? "ltr" : "rtl"}>
            {isAr ? result.holderNameEn : result.holderNameAr}
          </p>
        </Field>

        <div className="grid sm:grid-cols-2 gap-5">
          <Field
            icon={<Hash size={16} />}
            labelEn="Licence number"
            labelAr="رقم الترخيص"
            isAr={isAr}
          >
            <p className="text-sm font-mono font-semibold text-ink-primary" dir="ltr">
              {result.licenceNumber}
            </p>
          </Field>

          <Field
            icon={<GraduationCap size={16} />}
            labelEn="Category"
            labelAr="الفئة"
            isAr={isAr}
          >
            <p className="text-sm font-semibold text-ink-primary">
              {isAr ? CATEGORY_LABELS[result.category].ar : CATEGORY_LABELS[result.category].en}
            </p>
          </Field>
        </div>

        <Field
          icon={<Calendar size={16} />}
          labelEn="Validity"
          labelAr="الصلاحية"
          isAr={isAr}
        >
          <p className="text-sm text-ink-primary">
            {isAr
              ? `ساري من ${formatDate(result.validFrom, lang)} إلى ${formatDate(result.validTo, lang)}`
              : `Valid from ${formatDate(result.validFrom, lang)} to ${formatDate(result.validTo, lang)}`}
          </p>
        </Field>

        <div className="pt-4 border-t border-border-default flex items-center gap-2 text-xs text-success-600">
          <ShieldCheck size={14} />
          {isAr
            ? "تم التحقق من هذه الشهادة عبر قاعدة بيانات أدفيتي الرسمية"
            : "Verified against the official ADVETI registry"}
        </div>
      </CardContent>
    </Card>
  );
};

const InvalidResult: React.FC<{ isAr: boolean }> = ({ isAr }) => (
  <Card variant="elevated" className="overflow-hidden">
    <div className="p-6 flex items-center gap-4 bg-danger-100 text-danger-600 ring-1 ring-inset ring-danger-600/30">
      <AlertOctagon size={32} />
      <div>
        <p className="text-xs uppercase tracking-[0.2em] font-semibold opacity-80">
          {isAr ? "الحالة" : "Status"}
        </p>
        <p className="text-2xl font-bold tracking-tight">
          {isAr ? "غير صالح" : "INVALID"}
        </p>
      </div>
    </div>
    <CardContent className="pt-6 text-center">
      <p className="text-sm text-ink-primary leading-relaxed max-w-md mx-auto">
        {isAr
          ? "رابط التحقق هذا غير صالح أو منتهي الصلاحية. تواصل مع حامل الترخيص للحصول على شهادة سارية."
          : "This verification link is invalid or has expired. Contact the licence holder for a valid certificate."}
      </p>
      <Link to="/contact" className="block mt-5">
        <Button variant="secondary">
          {isAr ? "تواصل مع الدعم" : "Contact support"}
        </Button>
      </Link>
    </CardContent>
  </Card>
);

const Field: React.FC<{
  icon: React.ReactNode;
  labelEn: string;
  labelAr: string;
  isAr: boolean;
  children: React.ReactNode;
}> = ({ icon, labelEn, labelAr, isAr, children }) => (
  <div className="flex gap-3">
    <span className="h-8 w-8 rounded-md bg-surface-100 text-navy-800 inline-flex items-center justify-center flex-shrink-0">
      {icon}
    </span>
    <div className="flex-1">
      <p className="text-xs uppercase tracking-wider text-ink-muted font-semibold">
        {isAr ? labelAr : labelEn}
      </p>
      <div className="mt-1">{children}</div>
    </div>
  </div>
);

export default Verify;
