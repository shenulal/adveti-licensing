import * as React from "react";
import { Link, NavLink, Outlet, useLocation, useParams } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  ChevronRight,
  FileText,
  GraduationCap,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { Avatar, Badge, LanguageToggle, NotificationBell } from "@/components/adveti";
import { useLang } from "@/hooks/useLang";
import { useAuth } from "@/auth/AuthContext";
import { SessionTimeoutModal } from "@/auth/SessionTimeoutModal";
import { cn } from "@/lib/utils";

const TABS = [
  { to: "/portal/dashboard", en: "Dashboard", ar: "لوحة التحكم" },
  { to: "/portal/applications", en: "My Applications", ar: "طلباتي" },
  { to: "/portal/apply", en: "Start Application", ar: "بدء طلب جديد" },
  { to: "/portal/notifications", en: "Notifications", ar: "الإشعارات" },
];

const Crumbs: React.FC = () => {
  const { lang } = useLang();
  const { pathname } = useLocation();
  const params = useParams();

  const segments = pathname.split("/").filter(Boolean);
  if (segments.length <= 1) return null;

  const labelMap: Record<string, { en: string; ar: string }> = {
    portal: { en: "Home", ar: "الرئيسية" },
    dashboard: { en: "Dashboard", ar: "لوحة التحكم" },
    apply: { en: "Apply", ar: "تقديم" },
    applications: { en: "My Applications", ar: "طلباتي" },
    documents: { en: "Documents", ar: "الوثائق" },
    payment: { en: "Payment", ar: "الدفع" },
    receipt: { en: "Receipt", ar: "الإيصال" },
    certificate: { en: "Certificate", ar: "الشهادة" },
    profile: { en: "Profile", ar: "الملف الشخصي" },
    notifications: { en: "Notifications", ar: "الإشعارات" },
    step: { en: "Step", ar: "الخطوة" },
  };

  const items = segments.map((seg, idx) => {
    const to = "/" + segments.slice(0, idx + 1).join("/");
    const known = labelMap[seg];
    let label: string;
    if (known) label = lang === "ar" ? known.ar : known.en;
    else if (params.id && seg === params.id) label = `#${seg}`;
    else if (params.n && seg === params.n) label = `${lang === "ar" ? "خطوة" : "Step"} ${seg}`;
    else label = seg;
    return { to, label };
  });

  return (
    <nav
      aria-label="Breadcrumb"
      className="text-xs text-ink-secondary flex items-center flex-wrap gap-1"
    >
      {items.map((it, idx) => {
        const last = idx === items.length - 1;
        return (
          <React.Fragment key={it.to}>
            {last ? (
              <span className="text-ink-primary font-medium">{it.label}</span>
            ) : (
              <Link to={it.to} className="hover:text-navy-800 focus-ring rounded">
                {it.label}
              </Link>
            )}
            {!last && (
              <ChevronRight size={12} className="text-ink-muted rtl-flip" />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export const PortalShell: React.FC = () => {
  const { lang, setLang } = useLang();
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const isAr = lang === "ar";

  return (
    <div className="min-h-screen flex flex-col bg-surface-50 text-ink-primary">
      <header className="bg-surface-0 border-b border-border-default sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-surface-0/95">
        <div className="container flex h-16 items-center gap-4">
          <Link
            to="/portal/dashboard"
            className="flex items-center gap-3 focus-ring rounded-md"
          >
            <span className="h-10 w-10 rounded-md bg-navy-900 inline-flex items-center justify-center text-ink-inverse ring-2 ring-gold-500/40">
              <GraduationCap size={20} />
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-bold tracking-wide text-navy-900">
                {isAr ? "أدفيتي" : "ADVETI"}
              </span>
              <span className="hidden sm:block text-[11px] text-ink-secondary">
                {isAr ? "بوابة المتقدم" : "Applicant Portal"}
              </span>
            </span>
          </Link>

          <div className="flex-1" />

          <LanguageToggle value={lang} onChange={setLang} />

          <NotificationBell viewAllHref="/portal/notifications" />

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-2 p-1 ps-2 rounded-md hover:bg-surface-100 focus-ring"
            >
              <Avatar name={user?.name ?? "Applicant"} size="md" />
              <span className="hidden md:flex flex-col items-start leading-tight">
                <span className="text-sm font-semibold text-ink-primary">
                  {user?.name}
                </span>
                <span className="text-[11px] text-ink-secondary">
                  {user?.email}
                </span>
              </span>
              <ChevronDown size={14} className="text-ink-muted hidden md:inline" />
            </button>
            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute end-0 mt-2 w-60 bg-surface-0 rounded-lg shadow-lg ring-1 ring-border-default py-2 z-40">
                  <Link
                    to="/portal/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-surface-100"
                  >
                    <User size={16} className="text-ink-secondary" />
                    {isAr ? "إعدادات الملف الشخصي" : "Profile Settings"}
                  </Link>
                  <Link
                    to="/portal/applications"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-surface-100"
                  >
                    <FileText size={16} className="text-ink-secondary" />
                    {isAr ? "طلباتي" : "My Applications"}
                  </Link>
                  <div className="my-1 border-t border-border-default" />
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      signOut();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-danger-600 hover:bg-danger-100/40 text-start"
                  >
                    <LogOut size={16} />
                    {isAr ? "تسجيل الخروج" : "Sign Out"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="bg-surface-0 border-b border-border-default">
        <div className="container flex items-center gap-1 overflow-x-auto">
          {TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                cn(
                  "py-3 px-4 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors",
                  isActive
                    ? "border-gold-500 text-navy-900"
                    : "border-transparent text-ink-secondary hover:text-navy-900",
                )
              }
            >
              {isAr ? tab.ar : tab.en}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="container py-3">
        <Crumbs />
      </div>

      <main className="flex-1">
        <div className="container pb-10">
          <Outlet />
        </div>
      </main>
      <SessionTimeoutModal />
    </div>
  );
};

export default PortalShell;