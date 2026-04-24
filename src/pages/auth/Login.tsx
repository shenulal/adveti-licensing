import * as React from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Alert,
  Button,
  Input,
  LanguageToggle,
  UAEPassButton,
} from "@/components/adveti";
import { useLang } from "@/hooks/useLang";
import { Role, useAuth } from "@/auth/AuthContext";
import { GraduationCap, Lock, Mail, ShieldCheck, Globe2, Award, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoginState {
  method: "uaepass" | "email";
  email: string;
  password: string;
  isLoading: boolean;
  error: string | null;
}

const ATTEMPTS_LIMIT = 5;

const Login: React.FC = () => {
  const { lang, setLang } = useLang();
  const isAr = lang === "ar";
  const { setRole } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [state, setState] = React.useState<LoginState>({
    method: "email",
    email: "",
    password: "",
    isLoading: false,
    error: null,
  });
  const [attempts, setAttempts] = React.useState(0);
  const [timeoutNotice, setTimeoutNotice] = React.useState(
    params.get("reason") === "timeout",
  );

  // Auto-dismiss the timeout notice after 8s
  React.useEffect(() => {
    if (!timeoutNotice) return;
    const t = window.setTimeout(() => setTimeoutNotice(false), 8000);
    return () => window.clearTimeout(t);
  }, [timeoutNotice]);

  const onUaePass = () => {
    setState((s) => ({ ...s, method: "uaepass", isLoading: true, error: null }));
    window.setTimeout(() => {
      // Simulated UAE Pass success → go to JIT welcome
      navigate("/auth/welcome", { replace: true });
    }, 900);
  };

  const inferRole = (email: string): Role => {
    const local = email.toLowerCase();
    if (local.startsWith("assessor")) return "assessor";
    if (local.startsWith("senior")) return "senior_assessor";
    if (local.startsWith("finance")) return "finance_officer";
    if (local.startsWith("content")) return "content_editor";
    if (local.startsWith("admin")) return "system_admin";
    if (local.startsWith("super")) return "super_admin";
    if (local.startsWith("audit")) return "auditor";
    if (local.startsWith("appeals")) return "appeals_officer";
    return "applicant";
  };

  const onEmailSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.email || !state.password) return;
    setState((s) => ({ ...s, method: "email", isLoading: true, error: null }));

    window.setTimeout(() => {
      // Mock: passwords containing "fail" trigger the error path
      if (state.password.toLowerCase().includes("fail")) {
        const next = attempts + 1;
        setAttempts(next);
        if (next >= ATTEMPTS_LIMIT) {
          navigate("/auth/lockout", { replace: true });
          return;
        }
        const remaining = ATTEMPTS_LIMIT - next;
        setState((s) => ({
          ...s,
          isLoading: false,
          error: isAr
            ? `بيانات الدخول غير صحيحة. تبقى لديك ${remaining} محاولات.`
            : `Invalid credentials. You have ${remaining} attempts remaining.`,
        }));
        return;
      }

      const role = inferRole(state.email);
      setRole(role);
      setState((s) => ({ ...s, isLoading: false, error: null }));

      // Back-office roles route through MFA
      const isBackOffice = role !== "applicant";
      const redirect = params.get("redirect");
      if (isBackOffice) {
        navigate(
          `/auth/mfa${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`,
          { replace: true },
        );
      } else {
        navigate(redirect ?? "/portal/dashboard", { replace: true });
      }
    }, 700);
  };

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col lg:flex-row">
      {/* ============ Left panel (brand) ============ */}
      <aside className="lg:w-[44%] xl:w-[40%] bg-navy-900 text-ink-inverse relative overflow-hidden flex flex-col">
        <div
          aria-hidden
          className="absolute -end-24 -top-24 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -start-16 bottom-0 h-64 w-64 rounded-full bg-gold-500/5 blur-2xl"
        />
        <div className="relative p-8 lg:p-12 flex-1 flex flex-col">
          <div className="flex items-center gap-3">
            <span className="h-12 w-12 rounded-lg bg-navy-800 inline-flex items-center justify-center ring-2 ring-gold-500/40">
              <GraduationCap size={24} />
            </span>
            <div className="leading-tight">
              <p className="text-base font-bold tracking-wide">
                {isAr ? "أدفيتي" : "ADVETI"}
              </p>
              <p className="text-[11px] text-ink-inverse/60">
                {isAr
                  ? "هيئة الترخيص والتقييم المهني"
                  : "Professional Licensing & Assessment Authority"}
              </p>
            </div>
          </div>

          <div className="mt-12 lg:mt-20 max-w-md">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold-400 font-semibold mb-3">
              <span className="h-px w-8 bg-gold-400" />
              {isAr ? "حكومة أبوظبي" : "Government of Abu Dhabi"}
            </p>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-balance">
              {isAr
                ? "رخصتك المهنية، مستقبلك."
                : "Your professional licence, your future."}
            </h1>
            <p className="mt-3 text-ink-inverse/75 text-pretty">
              {isAr
                ? "منصة موثوقة ومعتمدة لإصدار وإدارة التراخيص المهنية للمعلمين والمدربين في إمارة أبوظبي."
                : "The trusted accreditation platform for educators and trainers across the Emirate of Abu Dhabi."}
            </p>
          </div>

          <ul className="mt-10 space-y-4 max-w-md">
            {[
              {
                icon: <ShieldCheck size={18} />,
                en: "UAE government-grade security",
                ar: "أمان بمعايير حكومة دولة الإمارات",
              },
              {
                icon: <Globe2 size={18} />,
                en: "Bilingual platform — English & Arabic",
                ar: "منصة ثنائية اللغة — الإنجليزية والعربية",
              },
              {
                icon: <Award size={18} />,
                en: "Instant verifiable certificate download",
                ar: "تحميل شهادة فورية قابلة للتحقق",
              },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 h-9 w-9 rounded-md bg-navy-800 text-gold-400 inline-flex items-center justify-center shrink-0">
                  {item.icon}
                </span>
                <span className="text-sm text-ink-inverse/85 pt-1.5">
                  {isAr ? item.ar : item.en}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-10">
            <p className="text-xs text-ink-inverse/50">
              {isAr
                ? "© 2026 دائرة التعليم والمعرفة - أبوظبي"
                : "© 2026 Abu Dhabi Department of Education and Knowledge"}
            </p>
          </div>
        </div>
      </aside>

      {/* ============ Right panel (form) ============ */}
      <section className="flex-1 flex flex-col">
        <div className="flex items-center justify-end p-4 lg:p-6 gap-3">
          <Link
            to="/"
            className="text-xs text-ink-secondary hover:text-navy-800"
          >
            {isAr ? "العودة للرئيسية" : "Back to home"}
          </Link>
          <LanguageToggle value={lang} onChange={setLang} />
        </div>

        <div className="flex-1 flex items-start lg:items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-md">
            {timeoutNotice && (
              <div className="mb-4 flex items-start gap-3 rounded-md bg-info-100 border border-info-600/30 p-3 text-sm">
                <ShieldCheck size={16} className="text-info-600 shrink-0 mt-0.5" />
                <p className="flex-1 text-info-600">
                  {isAr
                    ? "تم تسجيل خروجك تلقائياً بسبب انتهاء الجلسة."
                    : "You were signed out automatically because your session expired."}
                </p>
                <button
                  type="button"
                  onClick={() => setTimeoutNotice(false)}
                  aria-label="Dismiss"
                  className="text-info-600/70 hover:text-info-600"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            <h2 className="text-2xl font-bold text-ink-primary">
              {isAr ? "تسجيل الدخول إلى حسابك" : "Sign in to your account"}
            </h2>
            <p className="mt-1 text-sm text-ink-secondary">
              {isAr
                ? "اختر طريقة الدخول المفضلة للمتابعة."
                : "Choose your preferred sign-in method to continue."}
            </p>

            <div className="mt-6">
              <UAEPassButton
                loading={state.method === "uaepass" && state.isLoading}
                onClick={onUaePass}
                label={
                  isAr
                    ? "الدخول عبر الهوية الرقمية"
                    : "Continue with UAE Pass"
                }
              />
            </div>

            <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wider text-ink-muted">
              <span className="flex-1 h-px bg-border-default" />
              <span>{isAr ? "أو" : "or"}</span>
              <span className="flex-1 h-px bg-border-default" />
            </div>

            {state.error && (
              <Alert type="error" className="mb-4" title={state.error} />
            )}

            <form onSubmit={onEmailSignIn} className="space-y-4" noValidate>
              <Input
                label={isAr ? "البريد الإلكتروني" : "Email address"}
                type="email"
                required
                autoComplete="email"
                iconStart={<Mail size={16} />}
                placeholder="name@adveti.ae"
                value={state.email}
                onChange={(e) =>
                  setState((s) => ({ ...s, email: e.target.value }))
                }
              />
              <div>
                <Input
                  label={isAr ? "كلمة المرور" : "Password"}
                  type="password"
                  required
                  autoComplete="current-password"
                  iconStart={<Lock size={16} />}
                  placeholder="••••••••"
                  value={state.password}
                  onChange={(e) =>
                    setState((s) => ({ ...s, password: e.target.value }))
                  }
                />
                <div className="mt-2 flex justify-end">
                  <Link
                    to="/auth/reset-password"
                    className="text-xs font-medium text-navy-800 hover:underline"
                  >
                    {isAr ? "نسيت كلمة المرور؟" : "Forgot password?"}
                  </Link>
                </div>
              </div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={state.method === "email" && state.isLoading}
              >
                {isAr ? "تسجيل الدخول" : "Sign in"}
              </Button>
            </form>

            <p className="mt-6 text-xs text-ink-secondary leading-relaxed text-center">
              {isAr
                ? "يستخدم موظفو البوابة الإدارية والمقيّمون تسجيل الدخول بالبريد الإلكتروني. يمكن للمتقدمين استخدام أيٍّ من الطريقتين."
                : "Back-office staff and assessors use email login. Applicants may use either method."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;