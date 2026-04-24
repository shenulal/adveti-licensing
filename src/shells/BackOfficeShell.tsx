import * as React from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Activity,
  Bell,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  ClipboardCheck,
  Cog,
  CreditCard,
  Database,
  FileText,
  GraduationCap,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Plug,
  ScrollText,
  Settings,
  ShieldCheck,
  Users,
  FileSearch,
  Megaphone,
  Image as ImageIcon,
} from "lucide-react";
import {
  Avatar,
  Badge,
  LanguageToggle,
  SidebarNavItem,
} from "@/components/adveti";
import { useLang } from "@/hooks/useLang";
import { Role, roleLabel, useAuth } from "@/auth/AuthContext";
import { SessionTimeoutModal } from "@/auth/SessionTimeoutModal";
import { cn } from "@/lib/utils";

interface NavItem {
  to: string;
  en: string;
  ar: string;
  icon: React.ReactNode;
  roles: Role[];
  badge?: React.ReactNode;
}

const ALL: NavItem[] = [
  {
    to: "/assessor/queue",
    en: "Dashboard",
    ar: "لوحة التحكم",
    icon: <LayoutDashboard size={18} />,
    roles: [
      "assessor",
      "senior_assessor",
      "appeals_officer",
      "finance_officer",
      "content_editor",
      "system_admin",
      "super_admin",
      "auditor",
    ],
  },
  {
    to: "/assessor/queue",
    en: "Applications",
    ar: "الطلبات",
    icon: <FileText size={18} />,
    roles: ["assessor", "senior_assessor", "appeals_officer"],
    badge: <Badge variant="gold">12</Badge>,
  },
  {
    to: "/admin/users",
    en: "Users & Roles",
    ar: "المستخدمون والأدوار",
    icon: <Users size={18} />,
    roles: ["system_admin", "super_admin"],
  },
  {
    to: "/finance/reconciliation",
    en: "Finance",
    ar: "المالية",
    icon: <CreditCard size={18} />,
    roles: ["finance_officer", "system_admin", "super_admin"],
  },
  {
    to: "/content/pages",
    en: "Content",
    ar: "المحتوى",
    icon: <ImageIcon size={18} />,
    roles: ["content_editor", "system_admin", "super_admin"],
  },
  {
    to: "/content/templates",
    en: "Notifications",
    ar: "الإشعارات",
    icon: <Megaphone size={18} />,
    roles: ["content_editor", "system_admin", "super_admin"],
  },
  {
    to: "/reports/operational",
    en: "Reports",
    ar: "التقارير",
    icon: <Activity size={18} />,
    roles: [
      "senior_assessor",
      "finance_officer",
      "system_admin",
      "super_admin",
      "auditor",
    ],
  },
  {
    to: "/audit/log",
    en: "Audit Log",
    ar: "سجل التدقيق",
    icon: <ScrollText size={18} />,
    roles: ["system_admin", "super_admin", "auditor"],
  },
  {
    to: "/admin/config",
    en: "Configuration",
    ar: "الإعدادات",
    icon: <Cog size={18} />,
    roles: ["system_admin", "super_admin"],
  },
  {
    to: "/admin/api",
    en: "API & Integrations",
    ar: "واجهات البرمجة",
    icon: <Plug size={18} />,
    roles: ["system_admin", "super_admin"],
  },
];

const dashboardForRole = (role: Role): string => {
  switch (role) {
    case "assessor":
      return "/assessor/queue";
    case "senior_assessor":
      return "/senior/queue";
    case "appeals_officer":
      return "/assessor/queue";
    case "finance_officer":
      return "/finance/reconciliation";
    case "content_editor":
      return "/content/pages";
    case "system_admin":
    case "super_admin":
      return "/admin/users";
    case "auditor":
      return "/audit/log";
    default:
      return "/";
  }
};

export const BackOfficeShell: React.FC = () => {
  const { lang, setLang } = useLang();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const isAr = lang === "ar";

  const role = user?.role ?? "guest";
  const items = ALL.filter((i) => i.roles.includes(role));
  const dash = dashboardForRole(role);

  return (
    <div className="min-h-screen flex flex-col bg-surface-50 text-ink-primary">
      <header className="bg-surface-0 border-b border-border-default sticky top-0 z-40">
        <div className="px-4 sm:px-6 flex h-16 items-center gap-4">
          <Link
            to={dash}
            className="flex items-center gap-3 focus-ring rounded-md"
          >
            <span className="h-10 w-10 rounded-md bg-navy-900 inline-flex items-center justify-center text-ink-inverse ring-2 ring-gold-500/40">
              <GraduationCap size={20} />
            </span>
            <span className="leading-tight hidden sm:block">
              <span className="block text-sm font-bold tracking-wide text-navy-900">
                {isAr ? "أدفيتي" : "ADVETI"}
              </span>
              <span className="text-[11px] text-ink-secondary">
                {isAr ? "البوابة الإدارية" : "Back-Office"}
              </span>
            </span>
          </Link>

          <div className="flex-1" />

          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 h-8 rounded-full bg-navy-900 text-ink-inverse text-xs font-semibold">
            <ShieldCheck size={12} className="text-gold-400" />
            {roleLabel(role)}
          </span>

          <LanguageToggle value={lang} onChange={setLang} />

          <button
            type="button"
            className="relative h-10 w-10 inline-flex items-center justify-center rounded-md hover:bg-surface-100 focus-ring"
            aria-label="Notifications"
          >
            <Bell size={18} className="text-ink-secondary" />
            <span className="absolute top-1.5 end-1.5 h-2 w-2 rounded-full bg-danger-600" />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-2 p-1 ps-2 rounded-md hover:bg-surface-100 focus-ring"
            >
              <Avatar name={user?.name ?? "User"} size="md" />
              <ChevronDown size={14} className="text-ink-muted" />
            </button>
            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute end-0 mt-2 w-60 bg-surface-0 rounded-lg shadow-lg ring-1 ring-border-default py-2 z-40">
                  <div className="px-4 py-2 border-b border-border-default">
                    <p className="text-sm font-semibold text-ink-primary">
                      {user?.name}
                    </p>
                    <p className="text-xs text-ink-secondary truncate">
                      {user?.email}
                    </p>
                  </div>
                  <Link
                    to="/portal/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-surface-100"
                  >
                    <Settings size={16} className="text-ink-secondary" />
                    {isAr ? "الملف الشخصي" : "Profile"}
                  </Link>
                  <Link
                    to="/admin/security"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-surface-100"
                  >
                    <KeyRound size={16} className="text-ink-secondary" />
                    {isAr ? "إعدادات MFA" : "MFA Settings"}
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

      <div className="flex flex-1 min-h-0">
        <aside
          className={cn(
            "bg-navy-900 text-ink-inverse flex flex-col transition-all duration-normal sticky top-16 self-start h-[calc(100vh-4rem)]",
            collapsed ? "w-16" : "w-64",
          )}
        >
          <nav className="flex-1 overflow-y-auto p-2 flex flex-col gap-1 text-start">
            {items.map((item) => {
              const active =
                location.pathname === item.to ||
                location.pathname.startsWith(item.to + "/");
              if (collapsed) {
                return (
                  <Link
                    key={`${item.to}-${item.en}`}
                    to={item.to}
                    title={isAr ? item.ar : item.en}
                    className={cn(
                      "h-10 w-12 mx-auto inline-flex items-center justify-center rounded-md focus-ring",
                      active
                        ? "bg-navy-800 text-gold-400"
                        : "text-ink-inverse/70 hover:bg-navy-800/60 hover:text-ink-inverse",
                    )}
                  >
                    {item.icon}
                  </Link>
                );
              }
              return (
                <SidebarNavItem
                  key={`${item.to}-${item.en}`}
                  asButton
                  active={active}
                  icon={item.icon}
                  label={isAr ? item.ar : item.en}
                  badge={item.badge}
                  onSelect={() => {
                    window.location.href = item.to;
                  }}
                />
              );
            })}
          </nav>
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="m-2 h-9 inline-flex items-center justify-center gap-2 rounded-md bg-navy-800/60 hover:bg-navy-800 text-ink-inverse/80 hover:text-ink-inverse text-xs font-medium focus-ring"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronsRight size={16} className="rtl-flip" />
            ) : (
              <>
                <ChevronsLeft size={16} className="rtl-flip" />
                <span>{isAr ? "طي القائمة" : "Collapse"}</span>
              </>
            )}
          </button>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
      <SessionTimeoutModal />
    </div>
  );
};

export default BackOfficeShell;