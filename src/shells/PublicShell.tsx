import * as React from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { GraduationCap, Menu, ShieldCheck, X } from "lucide-react";
import { Button, LanguageToggle } from "@/components/adveti";
import { useLang } from "@/hooks/useLang";
import { CookieConsent } from "./CookieConsent";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", labelEn: "Home", labelAr: "الرئيسية", end: true },
  { to: "/about", labelEn: "About the Licence", labelAr: "عن الترخيص" },
  { to: "/eligibility", labelEn: "Eligibility", labelAr: "الأهلية" },
  { to: "/fees", labelEn: "Fees & Process", labelAr: "الرسوم والإجراءات" },
  { to: "/contact", labelEn: "Contact", labelAr: "تواصل معنا" },
];

const FOOTER_LINKS = [
  { to: "/about", en: "About", ar: "عن الهيئة" },
  { to: "/eligibility", en: "Eligibility", ar: "الأهلية" },
  { to: "/fees", en: "Fees & Process", ar: "الرسوم" },
  { to: "/verify", en: "Verify Licence", ar: "التحقق من الترخيص" },
  { to: "/contact", en: "Contact", ar: "تواصل" },
];

const POLICY_LINKS = [
  { to: "/terms", en: "Terms & Conditions", ar: "الشروط والأحكام" },
  { to: "/privacy", en: "Privacy Policy", ar: "سياسة الخصوصية" },
  { to: "/refund-policy", en: "Refund Policy", ar: "سياسة الاسترداد" },
  {
    to: "/accessibility",
    en: "Accessibility Statement",
    ar: "بيان إمكانية الوصول",
  },
];

export const PublicShell: React.FC = () => {
  const { lang, setLang } = useLang();
  const location = useLocation();
  const [scrolled, setScrolled] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  const isAr = lang === "ar";

  return (
    <div className="min-h-screen flex flex-col bg-surface-50 text-ink-primary">
      <header
        className={cn(
          "sticky top-0 z-40 transition-all duration-normal",
          scrolled
            ? "bg-surface-0/85 backdrop-blur-md border-b border-border-default shadow-sm"
            : "bg-surface-0 border-b border-transparent",
        )}
      >
        <div className="container flex h-16 items-center gap-6">
          <Link to="/" className="flex items-center gap-3 focus-ring rounded-md">
            <span className="h-10 w-10 rounded-md bg-navy-900 inline-flex items-center justify-center text-ink-inverse ring-2 ring-gold-500/40">
              <GraduationCap size={20} />
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-bold tracking-wide text-navy-900">
                {isAr ? "أدفيتي" : "ADVETI"}
              </span>
              <span className="hidden sm:block text-[11px] text-ink-secondary">
                {isAr ? "هيئة الترخيص المهني" : "Professional Licensing Authority"}
              </span>
            </span>
            <span
              aria-hidden
              className="hidden md:inline-flex h-8 w-8 ms-2 items-center justify-center rounded-full bg-gold-100 text-gold-600 ring-1 ring-gold-300"
              title="Regulator seal"
            >
              <ShieldCheck size={16} />
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 ms-4">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-fast focus-ring",
                    isActive
                      ? "text-navy-900 bg-surface-100"
                      : "text-ink-secondary hover:text-navy-900 hover:bg-surface-100/60",
                  )
                }
              >
                {isAr ? item.labelAr : item.labelEn}
              </NavLink>
            ))}
          </nav>

          <div className="flex-1" />

          <div className="hidden md:flex items-center gap-3">
            <LanguageToggle value={lang} onChange={setLang} />
            <Link to="/auth/login">
              <Button variant="gold" size="md">
                {isAr ? "قدّم الآن" : "Apply Now"}
              </Button>
            </Link>
          </div>

          <button
            type="button"
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md text-ink-primary hover:bg-surface-100 focus-ring"
            aria-label="Open menu"
            onClick={() => setDrawerOpen(true)}
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-navy-950/40 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <aside
            className={cn(
              "absolute top-0 bottom-0 w-80 max-w-[85%] bg-surface-0 shadow-xl flex flex-col p-5",
              isAr ? "start-0" : "end-0",
            )}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-bold text-navy-900">
                {isAr ? "أدفيتي" : "ADVETI"}
              </span>
              <button
                type="button"
                className="h-9 w-9 inline-flex items-center justify-center rounded-md hover:bg-surface-100 focus-ring"
                aria-label="Close menu"
                onClick={() => setDrawerOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      "px-3 py-2.5 rounded-md text-sm font-medium text-start",
                      isActive
                        ? "bg-navy-900 text-ink-inverse"
                        : "text-ink-primary hover:bg-surface-100",
                    )
                  }
                >
                  {isAr ? item.labelAr : item.labelEn}
                </NavLink>
              ))}
            </nav>
            <div className="mt-auto pt-6 flex flex-col gap-3">
              <LanguageToggle value={lang} onChange={setLang} />
              <Link to="/auth/login" className="w-full">
                <Button variant="gold" size="md" className="w-full">
                  {isAr ? "قدّم الآن" : "Apply Now"}
                </Button>
              </Link>
            </div>
          </aside>
        </div>
      )}

      <main className="flex-1">
        <div className="container py-10">
          <Outlet />
        </div>
      </main>

      <footer className="bg-navy-950 text-ink-inverse mt-12">
        <div className="container py-12 grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <span className="h-10 w-10 rounded-md bg-navy-800 inline-flex items-center justify-center ring-2 ring-gold-500/40">
                <GraduationCap size={20} />
              </span>
              <div>
                <p className="text-sm font-bold tracking-wide">
                  {isAr ? "أدفيتي" : "ADVETI"}
                </p>
                <p className="text-xs text-ink-inverse/60">
                  {isAr
                    ? "هيئة الترخيص والتقييم المهني"
                    : "Professional Licensing & Assessment Authority"}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm text-ink-inverse/70 max-w-md">
              {isAr
                ? "الجهة الرسمية لاعتماد المعلمين والمدربين في إمارة أبوظبي."
                : "The official accreditation authority for educators and trainers in the Emirate of Abu Dhabi."}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold-400 font-semibold mb-3">
              {isAr ? "روابط سريعة" : "Quick Links"}
            </p>
            <ul className="space-y-2 text-sm">
              {FOOTER_LINKS.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-ink-inverse/80 hover:text-gold-400 focus-ring rounded"
                  >
                    {isAr ? l.ar : l.en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold-400 font-semibold mb-3">
              {isAr ? "السياسات" : "Policies"}
            </p>
            <ul className="space-y-2 text-sm">
              {POLICY_LINKS.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-ink-inverse/80 hover:text-gold-400 focus-ring rounded"
                  >
                    {isAr ? l.ar : l.en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-navy-800">
          <div className="container py-5 flex flex-col sm:flex-row items-center gap-3 justify-between text-xs text-ink-inverse/60">
            <p>
              {isAr
                ? "© 2026 دائرة التعليم والمعرفة - أبوظبي. جميع الحقوق محفوظة."
                : "© 2026 Abu Dhabi Department of Education and Knowledge. All rights reserved."}
            </p>
            <p className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-gold-400" />
              {isAr ? "متوافق مع قانون حماية البيانات الإماراتي" : "PDPL compliant"}
            </p>
          </div>
        </div>
      </footer>

      <CookieConsent />
    </div>
  );
};

export default PublicShell;