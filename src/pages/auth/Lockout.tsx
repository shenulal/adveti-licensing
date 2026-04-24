import * as React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/adveti";
import { AuthLayout } from "@/shells/AuthLayout";
import { useLang } from "@/hooks/useLang";
import { AlertTriangle, Mail } from "lucide-react";

const LOCKOUT_MINUTES = 30;

const Lockout: React.FC = () => {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const [secondsLeft, setSecondsLeft] = React.useState(LOCKOUT_MINUTES * 60);

  React.useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = window.setInterval(
      () => setSecondsLeft((s) => Math.max(0, s - 1)),
      1000,
    );
    return () => window.clearInterval(t);
  }, [secondsLeft]);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const pct = (secondsLeft / (LOCKOUT_MINUTES * 60)) * 100;

  return (
    <AuthLayout>
      <div className="bg-surface-0 rounded-xl shadow-md p-8 text-center">
        <span className="h-14 w-14 rounded-full bg-warning-100 text-warning-600 inline-flex items-center justify-center mb-4">
          <AlertTriangle size={26} />
        </span>
        <h1 className="text-2xl font-bold text-ink-primary">
          {isAr ? "تم قفل حسابك" : "Your account has been locked"}
        </h1>
        <p className="mt-2 text-sm text-ink-secondary">
          {isAr
            ? "عدد محاولات الدخول الفاشلة تجاوز الحد المسموح. تم قفل حسابك لمدة 30 دقيقة، أو تواصل مع المسؤول."
            : "Too many failed sign-in attempts. Your account is locked for 30 minutes, or contact the administrator."}
        </p>

        {/* Countdown */}
        <div className="mt-6 rounded-lg bg-surface-50 p-4 ring-1 ring-border-default">
          <p className="text-xs uppercase tracking-wider text-ink-secondary mb-2">
            {isAr ? "الوقت المتبقي" : "Time remaining"}
          </p>
          <p
            dir="ltr"
            className="text-4xl font-bold tabular-nums text-navy-900"
          >
            {mm}:{ss}
          </p>
          <div
            dir="ltr"
            className="mt-3 h-1.5 rounded-full bg-surface-200 overflow-hidden"
          >
            <div
              className="h-full bg-warning-600 transition-[width] duration-1000 ease-linear"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <a
          href="mailto:support@adveti.ae"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-navy-800 hover:underline"
        >
          <Mail size={14} />
          {isAr
            ? "تواصل مع الدعم: support@adveti.ae"
            : "Contact support: support@adveti.ae"}
        </a>

        <div className="mt-6">
          <Link to="/">
            <Button variant="ghost" fullWidth>
              {isAr ? "العودة للرئيسية" : "Back to home"}
            </Button>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Lockout;