import * as React from "react";
import { Link } from "react-router-dom";
import { Alert, Button, Input } from "@/components/adveti";
import { AuthLayout } from "@/shells/AuthLayout";
import { useLang } from "@/hooks/useLang";
import { ArrowLeft, Mail, MailCheck } from "lucide-react";

const ResetPassword: React.FC = () => {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [sent, setSent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [resendIn, setResendIn] = React.useState(0);

  React.useEffect(() => {
    if (resendIn <= 0) return;
    const t = window.setInterval(() => setResendIn((v) => Math.max(0, v - 1)), 1000);
    return () => window.clearInterval(t);
  }, [resendIn]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/.+@.+\..+/.test(email)) {
      setError(
        isAr ? "يرجى إدخال بريد إلكتروني صحيح." : "Please enter a valid email address.",
      );
      return;
    }
    setError(null);
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setSent(true);
      setResendIn(60);
    }, 600);
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
        {!sent ? (
          <>
            <h1 className="text-xl font-bold text-ink-primary">
              {isAr ? "إعادة تعيين كلمة المرور" : "Reset your password"}
            </h1>
            <p className="mt-1 text-sm text-ink-secondary">
              {isAr
                ? "أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور."
                : "Enter your email and we'll send you a link to reset your password."}
            </p>
            {error && <Alert type="error" className="mt-4" title={error} />}
            <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
              <Input
                label={isAr ? "البريد الإلكتروني" : "Email address"}
                type="email"
                required
                autoComplete="email"
                iconStart={<Mail size={16} />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@adveti.ae"
              />
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
              >
                {isAr ? "إرسال رابط إعادة التعيين" : "Send reset link"}
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <span className="h-12 w-12 rounded-full bg-success-100 text-success-600 inline-flex items-center justify-center mb-4">
              <MailCheck size={22} />
            </span>
            <h1 className="text-xl font-bold text-ink-primary">
              {isAr ? "تحقق من بريدك الإلكتروني" : "Check your inbox"}
            </h1>
            <p className="mt-2 text-sm text-ink-secondary">
              {isAr ? `أرسلنا رابطاً إلى ` : `We sent a link to `}
              <span className="font-semibold text-ink-primary">{email}</span>.
            </p>
            <p className="mt-1 text-xs text-ink-muted">
              {isAr
                ? "صلاحية الرابط 30 دقيقة. إذا لم يصلك البريد، تحقق من مجلد الرسائل غير المرغوب فيها."
                : "The link is valid for 30 minutes. Check your spam folder if you don't see it."}
            </p>
            <div className="mt-6">
              <Button
                variant="secondary"
                fullWidth
                disabled={resendIn > 0}
                onClick={() => setResendIn(60)}
              >
                {resendIn > 0
                  ? isAr
                    ? `إعادة الإرسال بعد ${resendIn} ث`
                    : `Resend in ${resendIn}s`
                  : isAr
                  ? "إعادة إرسال الرابط"
                  : "Resend link"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;