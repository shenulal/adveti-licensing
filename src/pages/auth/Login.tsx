import * as React from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, Select } from "@/components/adveti";
import { useLang } from "@/hooks/useLang";
import { Role, useAuth } from "@/auth/AuthContext";
import { ShieldCheck } from "lucide-react";

const ROLE_OPTIONS: { value: Role; label: string; route: string }[] = [
  { value: "applicant", label: "Applicant", route: "/portal/dashboard" },
  { value: "assessor", label: "Assessor", route: "/assessor/queue" },
  { value: "senior_assessor", label: "Senior Assessor", route: "/senior/queue" },
  { value: "appeals_officer", label: "Appeals Officer", route: "/assessor/queue" },
  { value: "finance_officer", label: "Finance Officer", route: "/finance/reconciliation" },
  { value: "content_editor", label: "Content Editor", route: "/content/pages" },
  { value: "system_admin", label: "System Admin", route: "/admin/users" },
  { value: "super_admin", label: "Super Admin", route: "/admin/users" },
  { value: "auditor", label: "Auditor", route: "/audit/log" },
];

const Login: React.FC = () => {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const { setRole } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [picked, setPicked] = React.useState<Role>("applicant");

  const onSignIn = () => {
    setRole(picked);
    const redirect = params.get("redirect");
    if (redirect) navigate(redirect, { replace: true });
    else {
      const target =
        ROLE_OPTIONS.find((r) => r.value === picked)?.route ?? "/";
      navigate(target, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md" variant="elevated">
        <CardHeader>
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold-600 font-semibold">
            <ShieldCheck size={14} />
            {isAr ? "تسجيل الدخول الآمن" : "Secure Sign In"}
          </span>
          <CardTitle className="mt-2">
            {isAr ? "تسجيل الدخول إلى أدفيتي" : "Sign in to ADVETI"}
          </CardTitle>
          <CardDescription>
            {isAr
              ? "استخدم الهوية الرقمية أو البريد المؤسسي للدخول إلى لوحة التحكم."
              : "Use UAE Pass or your institutional email to access your dashboard."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="primary" fullWidth size="lg">
            {isAr ? "الدخول عبر الهوية الرقمية UAE Pass" : "Continue with UAE Pass"}
          </Button>
          <div className="flex items-center gap-3 text-xs text-ink-muted">
            <span className="flex-1 h-px bg-border-default" />
            {isAr ? "أو" : "or"}
            <span className="flex-1 h-px bg-border-default" />
          </div>
          <Select
            label={isAr ? "نوع الحساب (تجريبي)" : "Account type (demo)"}
            value={picked}
            onChange={(e) => setPicked(e.target.value as Role)}
            options={ROLE_OPTIONS.map((r) => ({ value: r.value, label: r.label }))}
          />
          <Button variant="gold" fullWidth size="lg" onClick={onSignIn}>
            {isAr ? "متابعة" : "Continue"}
          </Button>
          <div className="flex items-center justify-between text-xs">
            <Link
              to="/auth/reset-password"
              className="text-navy-800 font-medium hover:underline"
            >
              {isAr ? "نسيت كلمة المرور؟" : "Forgot password?"}
            </Link>
            <Link to="/" className="text-ink-secondary hover:text-navy-800">
              {isAr ? "العودة للرئيسية" : "Back to home"}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;