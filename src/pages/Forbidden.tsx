import * as React from "react";
import { Link } from "react-router-dom";
import { Home, LogIn } from "lucide-react";
import { Button, EmptyState, ForbiddenIllustration } from "@/components/adveti";
import { useAuth, roleLabel } from "@/auth/AuthContext";
import { useLang } from "@/hooks/useLang";

const Forbidden: React.FC = () => {
  const { user } = useAuth();
  const { lang } = useLang();
  const isAr = lang === "ar";
  const role = user?.role ?? "guest";

  return (
    <main className="min-h-screen flex flex-col bg-surface-50">
      <header className="bg-surface-0 border-b border-border-default">
        <div className="container h-16 flex items-center">
          <Link to="/" className="flex items-center gap-3 focus-ring rounded-md">
            <span className="h-9 w-9 rounded-md bg-navy-900 text-ink-inverse inline-flex items-center justify-center text-xs font-bold ring-2 ring-gold-500/40">
              AD
            </span>
            <span className="font-bold text-navy-900 tracking-wide">
              {isAr ? "أدفيتي" : "ADVETI"}
            </span>
          </Link>
        </div>
      </header>
      <div className="flex-1 flex items-center justify-center p-6">
        <EmptyState
          illustration={<ForbiddenIllustration />}
          title={isAr ? "ليس لديك صلاحية الوصول" : "You don't have permission to access this page"}
          description={
            <>
              {isAr
                ? "هذه الصفحة محجوزة لأدوار محددة. يمكنك العودة إلى صفحتك الرئيسية أو تبديل الحساب."
                : "This page is reserved for specific roles. You can return to your home page or sign in with a different account."}
              <span className="block mt-2 text-xs text-ink-muted">
                {isAr ? "دورك الحالي:" : "Your current role:"}{" "}
                <span className="font-semibold text-ink-primary">
                  {roleLabel(role)}
                </span>
              </span>
            </>
          }
          action={
            <div className="flex gap-2 flex-wrap justify-center">
              <Link to="/">
                <Button variant="primary" iconStart={<Home size={14} />}>
                  {isAr ? "العودة إلى الرئيسية" : "Back to home"}
                </Button>
              </Link>
              <Link to="/auth/login">
                <Button variant="ghost" iconStart={<LogIn size={14} />}>
                  {isAr ? "تبديل الحساب" : "Switch account"}
                </Button>
              </Link>
            </div>
          }
        />
      </div>
    </main>
  );
};

export default Forbidden;
