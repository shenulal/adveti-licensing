import * as React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Alert, Button, Input } from "@/components/adveti";
import { AuthLayout } from "@/shells/AuthLayout";
import { useLang } from "@/hooks/useLang";
import { ArrowLeft, Check, Lock, X as XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Rule {
  id: string;
  test: (pwd: string) => boolean;
  en: string;
  ar: string;
}

const RULES: Rule[] = [
  {
    id: "len",
    test: (p) => p.length >= 12,
    en: "At least 12 characters",
    ar: "12 حرفاً على الأقل",
  },
  {
    id: "upper",
    test: (p) => /[A-Z]/.test(p),
    en: "An uppercase letter",
    ar: "حرف كبير",
  },
  {
    id: "lower",
    test: (p) => /[a-z]/.test(p),
    en: "A lowercase letter",
    ar: "حرف صغير",
  },
  {
    id: "num",
    test: (p) => /\d/.test(p),
    en: "A number",
    ar: "رقم",
  },
  {
    id: "special",
    test: (p) => /[^A-Za-z0-9]/.test(p),
    en: "A special character",
    ar: "رمز خاص",
  },
  {
    id: "history",
    test: (p) => p.length > 0 && !/(password|adveti)/i.test(p),
    en: "Not the same as your last 5 passwords",
    ar: "مختلفة عن آخر 5 كلمات مرور",
  },
];

const strengthOf = (passed: number) => {
  // 4-segment scale: weak / fair / good / strong
  if (passed <= 2) return 1;
  if (passed === 3) return 2;
  if (passed === 4 || passed === 5) return 3;
  return 4;
};

const SetNewPassword: React.FC = () => {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const { token } = useParams();
  const navigate = useNavigate();
  const [pwd, setPwd] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const passedRules = RULES.filter((r) => r.test(pwd));
  const passedCount = passedRules.length;
  const allPassed = passedCount === RULES.length;
  const strength = pwd ? strengthOf(passedCount) : 0;
  const matches = confirm.length > 0 && pwd === confirm;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allPassed) {
      setError(
        isAr
          ? "كلمة المرور لا تستوفي جميع المتطلبات."
          : "Your password does not meet all requirements.",
      );
      return;
    }
    if (!matches) {
      setError(isAr ? "كلمات المرور غير متطابقة." : "Passwords do not match.");
      return;
    }
    setError(null);
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      navigate("/auth/login", { replace: true });
    }, 700);
  };

  return (
    <AuthLayout>
      <Link
        to="/auth/login"
        className="inline-flex items-center gap-1.5 text-sm text-ink-secondary hover:text-navy-800 mb-6"
      >
        <ArrowLeft size={14} className="rtl-flip" />
        {isAr ? "العودة لتسجيل الدخول" : "Back to login"}
      </Link>

      <div className="bg-surface-0 rounded-xl shadow-md p-8">
        <h1 className="text-xl font-bold text-ink-primary">
          {isAr ? "تعيين كلمة مرور جديدة" : "Set a new password"}
        </h1>
        <p className="mt-1 text-sm text-ink-secondary">
          {isAr
            ? "اختر كلمة مرور قوية لحماية حسابك."
            : "Choose a strong password to protect your account."}
          {token && (
            <span className="block text-[11px] text-ink-muted mt-1">
              {isAr ? "رمز التحقق:" : "Token:"} {token}
            </span>
          )}
        </p>

        {error && <Alert type="error" className="mt-4" title={error} />}

        <form onSubmit={submit} className="mt-6 space-y-5" noValidate>
          <div>
            <Input
              label={isAr ? "كلمة المرور الجديدة" : "New password"}
              type="password"
              required
              autoComplete="new-password"
              iconStart={<Lock size={16} />}
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
            />

            {/* Strength meter — always LTR */}
            <div dir="ltr" className="mt-3 grid grid-cols-4 gap-1.5">
              {[1, 2, 3, 4].map((seg) => (
                <span
                  key={seg}
                  className={cn(
                    "h-1.5 rounded-full transition-colors duration-fast",
                    seg <= strength
                      ? strength === 1
                        ? "bg-danger-600"
                        : strength === 2
                        ? "bg-warning-600"
                        : strength === 3
                        ? "bg-info-600"
                        : "bg-navy-800"
                      : "bg-surface-200",
                  )}
                />
              ))}
            </div>
            {pwd && (
              <p className="mt-1.5 text-xs text-ink-secondary">
                {isAr ? "قوة كلمة المرور:" : "Password strength:"}{" "}
                <span className="font-semibold text-ink-primary">
                  {strength === 1
                    ? isAr ? "ضعيفة" : "Weak"
                    : strength === 2
                    ? isAr ? "متوسطة" : "Fair"
                    : strength === 3
                    ? isAr ? "جيدة" : "Good"
                    : isAr ? "قوية" : "Strong"}
                </span>
              </p>
            )}
          </div>

          <Input
            label={isAr ? "تأكيد كلمة المرور" : "Confirm password"}
            type="password"
            required
            autoComplete="new-password"
            iconStart={<Lock size={16} />}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            error={
              confirm && !matches
                ? isAr
                  ? "كلمات المرور غير متطابقة."
                  : "Passwords do not match."
                : undefined
            }
            success={
              matches ? (isAr ? "كلمات المرور متطابقة." : "Passwords match.") : undefined
            }
          />

          <ul className="space-y-1.5 rounded-md bg-surface-50 p-3 ring-1 ring-border-default">
            {RULES.map((r) => {
              const ok = r.test(pwd);
              return (
                <li
                  key={r.id}
                  className="flex items-center gap-2 text-xs"
                >
                  <span
                    className={cn(
                      "h-4 w-4 rounded-full inline-flex items-center justify-center shrink-0",
                      ok
                        ? "bg-success-100 text-success-600"
                        : "bg-surface-200 text-ink-muted",
                    )}
                  >
                    {ok ? <Check size={10} /> : <XIcon size={10} />}
                  </span>
                  <span
                    className={cn(ok ? "text-ink-primary" : "text-ink-secondary")}
                  >
                    {isAr ? r.ar : r.en}
                  </span>
                </li>
              );
            })}
          </ul>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            disabled={!allPassed || !matches}
          >
            {isAr ? "تحديث كلمة المرور" : "Update password"}
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SetNewPassword;