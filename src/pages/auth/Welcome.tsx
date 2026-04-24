import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  Input,
  LanguageToggle,
  Select,
} from "@/components/adveti";
import { AuthLayout } from "@/shells/AuthLayout";
import { useLang } from "@/hooks/useLang";
import { useAuth } from "@/auth/AuthContext";
import { CheckCircle2, ShieldCheck, Lock } from "lucide-react";

const Welcome: React.FC = () => {
  const { lang, setLang } = useLang();
  const isAr = lang === "ar";
  const navigate = useNavigate();
  const { setRole } = useAuth();

  const [form, setForm] = React.useState({
    email: "layla.hassan@example.ae",
    mobile: "+971 50 123 4567",
    langPref: lang,
  });
  const [agreed, setAgreed] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  // From "UAE Pass" — read-only
  const verified = {
    nameEn: "Layla Hassan Al Mansoori",
    nameAr: "ليلى حسن المنصوري",
    emiratesId: "784-1990-1234567-1",
    nationality: isAr ? "الإمارات العربية المتحدة" : "United Arab Emirates",
    dob: "1990-06-12",
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      setError(
        isAr
          ? "يجب الموافقة على الشروط وسياسة الخصوصية للمتابعة."
          : "You must agree to the Terms and Privacy Policy to continue.",
      );
      return;
    }
    if (!/.+@.+\..+/.test(form.email)) {
      setError(isAr ? "بريد إلكتروني غير صحيح." : "Invalid email address.");
      return;
    }
    setError(null);
    setLoading(true);
    setLang(form.langPref);
    window.setTimeout(() => {
      setRole("applicant");
      setLoading(false);
      navigate("/portal/dashboard", { replace: true });
    }, 700);
  };

  return (
    <AuthLayout className="max-w-2xl">
      <div className="bg-surface-0 rounded-xl shadow-md overflow-hidden">
        <div className="p-8 border-b border-border-default bg-gradient-to-br from-navy-900 to-navy-800 text-ink-inverse">
          <span className="inline-flex items-center gap-2 text-xs font-semibold rounded-full bg-success-100 text-success-600 px-3 py-1">
            <CheckCircle2 size={12} />
            {isAr ? "تم التحقق بواسطة الهوية الرقمية" : "Verified by UAE Pass"}
          </span>
          <h1 className="mt-3 text-2xl font-bold tracking-tight">
            {isAr ? `مرحباً، ${verified.nameAr}` : `Welcome, ${verified.nameEn}`}
          </h1>
          <p className="mt-1 text-sm text-ink-inverse/80">
            {isAr
              ? "أكمل بضع تفاصيل لإنهاء إنشاء حسابك في أدفيتي."
              : "Complete a few details to finish setting up your ADVETI account."}
          </p>
        </div>

        <form onSubmit={submit} className="p-8 space-y-6" noValidate>
          {error && <Alert type="error" title={error} />}

          {/* Verified read-only fields */}
          <fieldset className="space-y-4">
            <legend className="flex items-center gap-2 text-sm font-semibold text-ink-primary mb-2">
              <Lock size={14} className="text-ink-muted" />
              {isAr ? "بيانات الهوية المؤكدة" : "Verified identity"}
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ReadOnly label={isAr ? "الاسم (إنجليزي)" : "Full name (EN)"} value={verified.nameEn} />
              <ReadOnly label={isAr ? "الاسم (عربي)" : "Full name (AR)"} value={verified.nameAr} />
              <ReadOnly label={isAr ? "رقم الهوية الإماراتية" : "Emirates ID"} value={verified.emiratesId} />
              <ReadOnly label={isAr ? "الجنسية" : "Nationality"} value={verified.nationality} />
              <ReadOnly label={isAr ? "تاريخ الميلاد" : "Date of Birth"} value={verified.dob} />
            </div>
            <p className="flex items-start gap-2 text-xs text-ink-secondary">
              <ShieldCheck size={14} className="text-success-600 shrink-0 mt-0.5" />
              {isAr
                ? "تم التحقق من هويتك بواسطة الهوية الرقمية. لا يمكن تعديل هذه البيانات هنا."
                : "Your identity has been verified by UAE Pass. These details cannot be changed here."}
            </p>
          </fieldset>

          {/* Editable fields */}
          <fieldset className="space-y-4">
            <legend className="text-sm font-semibold text-ink-primary mb-2">
              {isAr ? "تفاصيل التواصل والتفضيلات" : "Contact & preferences"}
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={isAr ? "البريد الإلكتروني المفضل" : "Preferred email"}
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
              <Input
                label={isAr ? "رقم الجوال" : "Mobile number"}
                type="tel"
                required
                value={form.mobile}
                onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value }))}
              />
              <div className="sm:col-span-2">
                <Select
                  label={isAr ? "لغة التواصل" : "Language preference"}
                  value={form.langPref}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, langPref: e.target.value as "en" | "ar" }))
                  }
                  options={[
                    { value: "en", label: "English" },
                    { value: "ar", label: "العربية" },
                  ]}
                />
              </div>
            </div>
          </fieldset>

          <label className="flex items-start gap-3 rounded-md ring-1 ring-border-default p-3 cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span className="text-sm text-ink-secondary leading-relaxed">
              {isAr ? "أوافق على " : "I agree to the "}
              <Link
                to="/terms"
                className="text-navy-800 font-medium hover:underline"
              >
                {isAr ? "الشروط والأحكام" : "Terms & Conditions"}
              </Link>
              {isAr ? " و " : " and "}
              <Link
                to="/privacy"
                className="text-navy-800 font-medium hover:underline"
              >
                {isAr ? "سياسة الخصوصية" : "Privacy Policy"}
              </Link>
              .
            </span>
          </label>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <LanguageToggle value={lang} onChange={setLang} />
            <Button
              type="submit"
              variant="gold"
              size="lg"
              loading={loading}
            >
              {isAr
                ? "إكمال التسجيل والمتابعة"
                : "Complete registration and continue"}
            </Button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

const ReadOnly: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div>
    <p className="text-xs font-medium text-ink-secondary mb-1">{label}</p>
    <p className="h-10 px-3 inline-flex items-center w-full rounded-md bg-surface-50 text-ink-primary text-sm ring-1 ring-border-default">
      {value}
    </p>
  </div>
);

export default Welcome;