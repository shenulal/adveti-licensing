import * as React from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Alert,
  Button,
  OtpInput,
} from "@/components/adveti";
import { AuthLayout } from "@/shells/AuthLayout";
import { useLang } from "@/hooks/useLang";
import { useAuth } from "@/auth/AuthContext";
import { ArrowLeft, ShieldCheck, Smartphone, KeyRound } from "lucide-react";

type Method = "totp" | "sms";
type Status = "default" | "loading" | "error" | "expired";

const Mfa: React.FC = () => {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { user } = useAuth();

  const [method, setMethod] = React.useState<Method>("totp");
  const [code, setCode] = React.useState("");
  const [status, setStatus] = React.useState<Status>("default");
  const [resendIn, setResendIn] = React.useState(60);

  // Resend countdown for SMS
  React.useEffect(() => {
    if (method !== "sms") return;
    if (resendIn <= 0) return;
    const t = window.setInterval(() => setResendIn((v) => Math.max(0, v - 1)), 1000);
    return () => window.clearInterval(t);
  }, [method, resendIn]);

  // Reset countdown when switching to SMS
  React.useEffect(() => {
    if (method === "sms") setResendIn(60);
  }, [method]);

  const verify = (value?: string) => {
    const v = value ?? code;
    if (v.length !== 6) return;
    setStatus("loading");
    window.setTimeout(() => {
      // Mock: code "000000" expired, "111111" wrong, anything else passes
      if (v === "000000") {
        setStatus("expired");
        return;
      }
      if (v === "111111") {
        setStatus("error");
        return;
      }
      const redirect = params.get("redirect");
      const fallback =
        user?.role === "applicant" ? "/portal/dashboard" : "/assessor/queue";
      navigate(redirect ?? fallback, { replace: true });
    }, 600);
  };

  const switchMethod = () => {
    setMethod((m) => (m === "totp" ? "sms" : "totp"));
    setCode("");
    setStatus("default");
  };

  const errorMsg =
    status === "error"
      ? isAr
        ? "الرمز غير صحيح. حاول مرة أخرى."
        : "Incorrect code. Try again."
      : status === "expired"
      ? isAr
        ? "انتهت صلاحية الرمز — اطلب رمزاً جديداً."
        : "Code expired — request a new one."
      : null;

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
        <div className="flex items-center gap-3 mb-4">
          <span className="h-10 w-10 rounded-md bg-navy-900 text-gold-400 inline-flex items-center justify-center">
            <ShieldCheck size={20} />
          </span>
          <div>
            <h1 className="text-xl font-bold text-ink-primary">
              {isAr ? "التحقق بخطوتين" : "Two-factor authentication"}
            </h1>
            <p className="text-sm text-ink-secondary">
              {method === "totp"
                ? isAr
                  ? "أدخل الرمز المكوّن من 6 أرقام من تطبيق المصادقة."
                  : "Enter the 6-digit code from your authenticator app."
                : isAr
                ? "أُرسل الرمز إلى الرقم +971 50-XXXX-X234."
                : "We sent a code to +971 50-XXXX-X234."}
            </p>
          </div>
        </div>

        {errorMsg && (
          <Alert type="error" className="mb-4" title={errorMsg} />
        )}

        <div className="my-6">
          <OtpInput
            value={code}
            onChange={(v) => {
              setCode(v);
              if (status !== "loading") setStatus("default");
            }}
            onComplete={(v) => verify(v)}
            disabled={status === "loading"}
            error={status === "error" || status === "expired"}
            autoFocus
          />
        </div>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          loading={status === "loading"}
          disabled={code.length !== 6}
          onClick={() => verify()}
        >
          {isAr ? "تحقق" : "Verify"}
        </Button>

        <div className="mt-6 flex items-center justify-between text-sm">
          {method === "sms" ? (
            <button
              type="button"
              disabled={resendIn > 0}
              onClick={() => setResendIn(60)}
              className="text-navy-800 font-medium hover:underline disabled:text-ink-muted disabled:no-underline disabled:cursor-not-allowed"
            >
              {resendIn > 0
                ? isAr
                  ? `إعادة الإرسال بعد ${resendIn} ث`
                  : `Resend code in ${resendIn}s`
                : isAr
                ? "إعادة إرسال الرمز"
                : "Resend code"}
            </button>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={switchMethod}
            className="inline-flex items-center gap-1.5 text-navy-800 font-medium hover:underline"
          >
            {method === "totp" ? <Smartphone size={14} /> : <KeyRound size={14} />}
            {method === "totp"
              ? isAr
                ? "استخدم الرسائل النصية"
                : "Use SMS instead"
              : isAr
              ? "استخدم تطبيق المصادقة"
              : "Use authenticator app"}
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Mfa;