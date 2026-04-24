import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, LifeBuoy, Search } from "lucide-react";
import { Button, EmptyState, NotFoundIllustration } from "@/components/adveti";
import { useAuth } from "@/auth/AuthContext";
import { getHomeForRole } from "@/auth/roleRoutes";
import { useLang } from "@/hooks/useLang";

const NotFound: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { lang } = useLang();
  const isAr = lang === "ar";
  const homeHref = getHomeForRole(user?.role ?? "guest");

  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("404 — non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <main className="min-h-screen flex flex-col bg-surface-50">
      <header className="bg-surface-0 border-b border-border-default">
        <div className="container h-16 flex items-center">
          <Link
            to="/"
            className="flex items-center gap-3 focus-ring rounded-md"
          >
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
          illustration={<NotFoundIllustration />}
          title={isAr ? "الصفحة غير موجودة" : "Page not found"}
          description={
            isAr
              ? `لم نتمكن من العثور على "${location.pathname}". قد يكون الرابط منتهياً أو منقولاً.`
              : `We couldn't find "${location.pathname}". The link may be expired or moved.`
          }
          action={
            <div className="flex gap-2 flex-wrap justify-center">
              <Link to={homeHref}>
                <Button variant="primary" iconStart={<Home size={14} />}>
                  {isAr ? "اذهب إلى صفحتك الرئيسية" : "Go to your home"}
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="ghost" iconStart={<LifeBuoy size={14} />}>
                  {isAr ? "تواصل مع الدعم" : "Contact support"}
                </Button>
              </Link>
            </div>
          }
        />
      </div>
      <p className="text-center text-xs text-ink-muted py-4">
        <Search size={11} className="inline me-1" />
        <span dir="ltr">{location.pathname}</span>
      </p>
    </main>
  );
};

export default NotFound;
