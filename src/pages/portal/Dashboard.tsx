import * as React from "react";
import { Link } from "react-router-dom";
import {
  Award,
  Bell,
  ChevronRight,
  Download,
  FileEdit,
  FileText,
  FileWarning,
  Plus,
  RefreshCcw,
  Sparkles,
  Upload,
} from "lucide-react";
import { Badge, Button, Card, CardContent } from "@/components/adveti";
import { useLang } from "@/hooks/useLang";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";
import {
  type ApplicationSummary,
  mockApplicantProfile,
  mockApplications,
  mockNotifications,
} from "@/lib/mockApplicant";

const Dashboard: React.FC = () => {
  const { lang } = useLang();
  const isAr = lang === "ar";

  const active = mockApplications[0]; // UnderReview
  const pending = mockApplications.find((a) => a.status === "PendingApplicant");
  const approved = mockApplications.find((a) => a.status === "Approved");

  const stats = [
    {
      icon: <FileText size={18} />,
      value: 1,
      labelEn: "Active Application",
      labelAr: "طلب نشط",
    },
    {
      icon: <FileEdit size={18} />,
      value: 2,
      labelEn: "Past Applications",
      labelAr: "طلبات سابقة",
    },
    {
      icon: <Award size={18} />,
      value: 1,
      labelEn: "Certificate Available",
      labelAr: "شهادة متوفرة",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <section className="rounded-xl bg-gradient-to-br from-navy-900 to-navy-700 text-ink-inverse p-6 md:p-8 relative overflow-hidden">
        <div
          aria-hidden
          className="absolute -end-16 -top-16 h-48 w-48 rounded-full bg-gold-500/15 blur-3xl"
        />
        <div className="relative flex items-start justify-between gap-6 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold-400 font-semibold mb-2">
              {isAr ? "مرحباً" : "Welcome back"}
            </p>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {isAr ? mockApplicantProfile.fullNameAr : mockApplicantProfile.fullNameEn}
            </h1>
            <p className="mt-1 text-sm text-ink-inverse/70">
              {isAr
                ? "تابع طلباتك وحمّل شهاداتك من مكان واحد."
                : "Track your applications and download certificates in one place."}
            </p>
          </div>
          <Link to="/portal/apply">
            <Button variant="gold" iconStart={<Plus size={16} />}>
              {isAr ? "بدء طلب جديد" : "Start New Application"}
            </Button>
          </Link>
        </div>
      </section>

      {/* Two-column main */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* LEFT: Active application card (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <ActiveApplicationCard app={active} isAr={isAr} lang={lang} />

          {pending && (
            <PendingActionCard app={pending} isAr={isAr} />
          )}

          {approved && (
            <RecentCertificateCard app={approved} isAr={isAr} lang={lang} />
          )}
        </div>

        {/* RIGHT: stats + notifications */}
        <div className="space-y-6">
          <Card variant="bordered">
            <CardContent className="pt-6">
              <h2 className="text-sm font-semibold text-ink-primary mb-4">
                {isAr ? "نظرة عامة" : "At a glance"}
              </h2>
              <ul className="space-y-3">
                {stats.map((s) => (
                  <li key={s.labelEn} className="flex items-center gap-3">
                    <span className="h-9 w-9 rounded-md bg-surface-100 text-navy-800 inline-flex items-center justify-center">
                      {s.icon}
                    </span>
                    <div className="flex-1">
                      <p className="text-xs text-ink-secondary">
                        {isAr ? s.labelAr : s.labelEn}
                      </p>
                      <p className="text-lg font-bold text-ink-primary leading-none mt-0.5">
                        {s.value}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card variant="bordered">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-ink-primary inline-flex items-center gap-2">
                  <Bell size={14} className="text-navy-800" />
                  {isAr ? "آخر الإشعارات" : "Latest notifications"}
                </h2>
                <Link
                  to="/portal/notifications"
                  className="text-xs text-navy-800 hover:underline focus-ring rounded"
                >
                  {isAr ? "عرض الكل" : "View all"}
                </Link>
              </div>
              <ul className="divide-y divide-border-default -mx-1">
                {mockNotifications.slice(0, 3).map((n) => (
                  <li key={n.id} className="px-1 py-3">
                    <div className="flex gap-2 items-start">
                      <span
                        className="h-2 w-2 rounded-full bg-navy-800 mt-1.5 shrink-0"
                        aria-label="unread"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink-primary line-clamp-1">
                          {isAr ? n.titleAr : n.titleEn}
                        </p>
                        <p className="text-xs text-ink-secondary line-clamp-2 mt-0.5">
                          {isAr ? n.bodyAr : n.bodyEn}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// Active application card with status-aware CTA
// =====================================================

const ActiveApplicationCard: React.FC<{
  app: ApplicationSummary;
  isAr: boolean;
  lang: "en" | "ar";
}> = ({ app, isAr, lang }) => {
  const slaPct =
    1 - Math.max(0, Math.min(1, app.slaDeadlineHours / app.slaTotalHours));
  const daysLeft = Math.ceil(app.slaDeadlineHours / 24);

  return (
    <Card variant="government">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-wider text-ink-muted font-semibold">
              {isAr ? "طلب نشط" : "Active application"}
            </p>
            <p
              className="mt-1 text-lg font-mono font-semibold text-ink-primary"
              dir="ltr"
            >
              {app.id}
            </p>
            <p className="mt-1 text-sm text-ink-secondary">
              {isAr ? "ترخيص" : "Licence"}:{" "}
              <span className="text-ink-primary font-medium">
                {isAr
                  ? app.licenceCategory === "Teacher"
                    ? "معلم"
                    : app.licenceCategory === "Counsellor"
                    ? "مرشد"
                    : "مدرّب"
                  : app.licenceCategory}
              </span>
            </p>
          </div>
          <Badge status={app.status}>
            {isAr ? "قيد المراجعة" : "Under Review"}
          </Badge>
        </div>

        {/* SLA */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-ink-secondary font-medium">
              {isAr
                ? `المراجعة خلال ${daysLeft} أيام عمل`
                : `Review due in ${daysLeft} business days`}
            </span>
            <span className="text-ink-muted">
              {Math.round(slaPct * 100)}%
            </span>
          </div>
          <div className="h-2 w-full bg-surface-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-navy-800 transition-all duration-normal"
              style={{ width: `${slaPct * 100}%` }}
            />
          </div>
          {app.submittedAt && (
            <p className="text-xs text-ink-muted mt-2">
              {isAr ? "تم التقديم في " : "Submitted on "}
              {formatDate(app.submittedAt, lang)}
            </p>
          )}
        </div>

        <div className="mt-6 flex items-center gap-3 flex-wrap">
          <ContextualCTA app={app} isAr={isAr} />
          <Link
            to={`/portal/applications/${app.id}`}
            className="text-sm font-medium text-navy-800 hover:underline inline-flex items-center gap-1"
          >
            {isAr ? "عرض الطلب" : "View application"}
            <ChevronRight size={14} className="rtl-flip" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

const ContextualCTA: React.FC<{ app: ApplicationSummary; isAr: boolean }> = ({
  app,
  isAr,
}) => {
  switch (app.status) {
    case "Draft":
      return (
        <Link to={`/portal/apply/${app.id}/step/1`}>
          <Button variant="gold" iconStart={<FileEdit size={16} />}>
            {isAr ? "متابعة الطلب" : "Continue application"}
          </Button>
        </Link>
      );
    case "PendingApplicant":
      return (
        <Link to={`/portal/applications/${app.id}`}>
          <Button
            variant="secondary"
            className="border-danger-600 text-danger-600 hover:bg-danger-100/40 relative"
            iconStart={<FileWarning size={16} />}
          >
            <span className="relative">
              {isAr ? "الرد على طلب المعلومات" : "Respond to RFI"}
              <span className="absolute -top-1 -end-3 h-2 w-2 rounded-full bg-danger-600 animate-ping" />
              <span className="absolute -top-1 -end-3 h-2 w-2 rounded-full bg-danger-600" />
            </span>
          </Button>
        </Link>
      );
    case "Approved":
      return (
        <Link to={`/portal/certificate/${app.id}`}>
          <Button
            variant="primary"
            className="bg-success-600 hover:brightness-110"
            iconStart={<Download size={16} />}
          >
            {isAr ? "تنزيل الشهادة" : "Download certificate"}
          </Button>
        </Link>
      );
    case "Incomplete":
      return (
        <Link to={`/portal/applications/${app.id}/documents`}>
          <Button
            variant="primary"
            className="bg-warning-600 hover:brightness-110"
            iconStart={<Upload size={16} />}
          >
            {isAr ? "رفع الوثائق الناقصة" : "Upload missing documents"}
          </Button>
        </Link>
      );
    case "Rejected":
      return (
        <Link to={`/portal/applications/${app.id}`}>
          <Button variant="ghost">
            {isAr ? "عرض خطاب القرار" : "View decision letter"}
          </Button>
        </Link>
      );
    case "Expired":
      return (
        <Link to={`/portal/applications/${app.id}/renew`}>
          <Button variant="gold" iconStart={<RefreshCcw size={16} />}>
            {isAr ? "بدء التجديد" : "Start renewal"}
          </Button>
        </Link>
      );
    case "Submitted":
    case "UnderReview":
    default:
      return (
        <span className="text-sm text-ink-secondary inline-flex items-center gap-2">
          <Sparkles size={14} className="text-gold-600" />
          {isAr
            ? "لا حاجة لاتخاذ إجراء — طلبك قيد المعالجة."
            : "No action needed — your application is being processed."}
        </span>
      );
  }
};

const PendingActionCard: React.FC<{ app: ApplicationSummary; isAr: boolean }> = ({
  app,
  isAr,
}) => (
  <Card variant="bordered" className="border-danger-600/30 bg-danger-100/30">
    <CardContent className="pt-6">
      <div className="flex items-start gap-3">
        <span className="h-9 w-9 rounded-md bg-danger-600 text-ink-inverse inline-flex items-center justify-center shrink-0">
          <FileWarning size={18} />
        </span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-ink-primary">
            {isAr
              ? "طلب معلومات إضافية"
              : "Request for information"}
          </p>
          <p className="text-xs text-ink-secondary mt-0.5">
            <span className="font-mono" dir="ltr">{app.id}</span> ·{" "}
            {isAr ? app.licenceCategory === "Counsellor" ? "مرشد" : app.licenceCategory : app.licenceCategory}
          </p>
          <p className="text-sm text-ink-primary mt-3 line-clamp-2">
            {app.rfiMessage}
          </p>
          <Link to={`/portal/applications/${app.id}`} className="inline-block mt-3">
            <Button variant="primary" size="sm">
              {isAr ? "الرد الآن" : "Respond now"}
            </Button>
          </Link>
        </div>
      </div>
    </CardContent>
  </Card>
);

const RecentCertificateCard: React.FC<{
  app: ApplicationSummary;
  isAr: boolean;
  lang: "en" | "ar";
}> = ({ app, isAr, lang }) => (
  <Card variant="bordered" className="border-success-600/30 bg-success-100/30">
    <CardContent className="pt-6 flex items-center gap-4 flex-wrap">
      <span className="h-12 w-12 rounded-md bg-success-600 text-ink-inverse inline-flex items-center justify-center shrink-0">
        <Award size={20} />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-ink-primary">
          {isAr ? "شهادة متاحة للتنزيل" : "Certificate ready to download"}
        </p>
        <p className="text-xs text-ink-secondary mt-0.5" dir="ltr">
          {app.certificateNumber} ·{" "}
          {isAr ? "صلاحية حتى" : "valid to"}{" "}
          {app.validTo && formatDate(app.validTo, lang)}
        </p>
      </div>
      <Link to={`/portal/certificate/${app.id}`}>
        <Button variant="secondary" iconStart={<Download size={16} />}>
          {isAr ? "تنزيل" : "Download"}
        </Button>
      </Link>
    </CardContent>
  </Card>
);

export default Dashboard;
