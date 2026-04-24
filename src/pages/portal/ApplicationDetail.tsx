import * as React from "react";
import { Link, useParams } from "react-router-dom";
import {
  Award,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  RefreshCcw,
  Upload,
  Mail,
  AlertOctagon,
} from "lucide-react";
import { Alert, Badge, Button, Card, CardContent, Textarea } from "@/components/adveti";
import { useLang } from "@/hooks/useLang";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";
import { getApplicationById } from "@/lib/mockApplicant";

const ApplicationDetail: React.FC = () => {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const { id } = useParams();
  const app = getApplicationById(id ?? "");

  const stages = [
    { key: "submitted", en: "Application Submitted", ar: "تم تقديم الطلب", done: true, ts: app.submittedAt },
    { key: "payment", en: "Payment Received", ar: "تم استلام الدفع", done: true, ts: app.submittedAt },
    {
      key: "review",
      en: "Under Review",
      ar: "قيد المراجعة",
      done: app.status === "Approved" || app.status === "Rejected" || app.status === "Incomplete",
      active: app.status === "UnderReview" || app.status === "PendingApplicant",
      ts: null,
    },
    {
      key: "decision",
      en: "Decision",
      ar: "القرار",
      done: app.status === "Approved" || app.status === "Rejected",
      ts: null,
    },
    {
      key: "certificate",
      en: "Certificate Issued",
      ar: "إصدار الشهادة",
      done: app.status === "Approved",
      ts: null,
    },
  ];

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-wider text-ink-muted font-semibold">
            {isAr ? "تفاصيل الطلب" : "Application detail"}
          </p>
          <h1 className="text-2xl font-bold text-ink-primary mt-1 font-mono" dir="ltr">
            {app.id}
          </h1>
        </div>
        <Badge status={app.status} />
      </header>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Timeline */}
        <Card variant="bordered" className="lg:col-span-2">
          <CardContent className="pt-6">
            <h2 className="text-sm font-semibold text-ink-primary mb-5">
              {isAr ? "تتبع الحالة" : "Status timeline"}
            </h2>
            <ol className="space-y-5">
              {stages.map((s, i) => (
                <li key={s.key} className="relative flex gap-3">
                  <div className="flex flex-col items-center">
                    <span
                      className={cn(
                        "h-8 w-8 rounded-full inline-flex items-center justify-center text-xs font-bold shrink-0 relative",
                        s.done && "bg-gold-500 text-navy-950",
                        s.active && "bg-navy-800 text-ink-inverse",
                        !s.done && !s.active && "bg-surface-100 text-ink-muted border border-border-default",
                      )}
                    >
                      {s.done ? <CheckCircle2 size={14} /> : i + 1}
                      {s.active && (
                        <span className="absolute inset-0 rounded-full bg-navy-800 animate-ping opacity-30" />
                      )}
                    </span>
                    {i < stages.length - 1 && (
                      <span className={cn("flex-1 w-px my-1 min-h-8", s.done ? "bg-gold-500" : "bg-border-default")} />
                    )}
                  </div>
                  <div className="pb-2">
                    <p className={cn("text-sm font-medium", (s.done || s.active) ? "text-ink-primary" : "text-ink-muted")}>
                      {isAr ? s.ar : s.en}
                    </p>
                    <p className="text-xs text-ink-secondary mt-0.5">
                      {s.ts ? formatDate(s.ts, lang) : isAr ? "بانتظار" : "Pending"}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* Right panel — state-aware */}
        <div className="lg:col-span-3 space-y-4">
          <StatePanel app={app} isAr={isAr} lang={lang} />
        </div>
      </div>
    </div>
  );
};

const StatePanel: React.FC<{ app: ReturnType<typeof getApplicationById>; isAr: boolean; lang: "en" | "ar" }> = ({
  app,
  isAr,
  lang,
}) => {
  if (app.status === "PendingApplicant") {
    return (
      <>
        <Alert type="warning" title={isAr ? "طلب معلومات إضافية" : "Additional information requested"}>
          {app.rfiMessage}
          {app.rfiDeadline && (
            <p className="mt-2 inline-flex items-center gap-1 text-xs">
              <Clock size={12} />
              {isAr ? "الرد قبل " : "Respond by "}
              {formatDate(app.rfiDeadline, lang)}
            </p>
          )}
        </Alert>
        <Card variant="bordered">
          <CardContent className="pt-6 space-y-4">
            <Textarea
              label={isAr ? "ردّك" : "Your response"}
              rows={4}
              placeholder={isAr ? "اكتب توضيحك هنا…" : "Type your clarification…"}
            />
            <Link to={`/portal/applications/${app.id}/documents`}>
              <Button variant="secondary" iconStart={<Upload size={14} />}>
                {isAr ? "رفع وثائق إضافية" : "Upload additional documents"}
              </Button>
            </Link>
            <div>
              <Button variant="primary">
                {isAr ? "إرسال الرد" : "Submit response"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </>
    );
  }
  if (app.status === "Approved") {
    return (
      <>
        <Alert type="success" title={isAr ? "تمت الموافقة" : "Application approved"}>
          {isAr ? "ترخيصك جاهز للتنزيل." : "Your licence is ready to download."}
        </Alert>
        <Card variant="government">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <Award size={22} className="text-gold-600" />
              <h3 className="text-lg font-semibold text-ink-primary">
                {isAr ? "بطاقة الترخيص" : "Licence certificate"}
              </h3>
            </div>
            <dl className="text-sm space-y-2">
              <Row label={isAr ? "رقم الترخيص" : "Licence number"} value={app.certificateNumber ?? "—"} mono />
              <Row label={isAr ? "الفئة" : "Category"} value={app.licenceCategory} />
              <Row
                label={isAr ? "صلاحية حتى" : "Valid to"}
                value={app.validTo ? formatDate(app.validTo, lang) : "—"}
              />
            </dl>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button variant="gold" iconStart={<Download size={16} />}>
                {isAr ? "تنزيل الشهادة (PDF)" : "Download certificate (PDF)"}
              </Button>
              <Button variant="ghost" iconStart={<FileText size={16} />}>
                {isAr ? "تنزيل فاتورة VAT" : "Download VAT invoice"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </>
    );
  }
  if (app.status === "Incomplete") {
    return (
      <>
        <Alert type="warning" title={isAr ? "الطلب غير مكتمل" : "Application incomplete"}>
          {isAr ? "يرجى رفع الوثائق المفقودة." : "Please upload the missing documents."}
        </Alert>
        <Card variant="bordered">
          <CardContent className="pt-6">
            <Button variant="ghost" iconStart={<Download size={14} />} className="mb-4">
              {isAr ? "تنزيل خطاب القرار" : "Download decision letter"}
            </Button>
            <Link to={`/portal/applications/${app.id}/documents`}>
              <Button variant="primary" iconStart={<Upload size={14} />}>
                {isAr ? "رفع الوثائق" : "Upload documents"}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </>
    );
  }
  if (app.status === "Rejected") {
    return (
      <>
        <Alert type="error" title={isAr ? "تم رفض الطلب" : "Application rejected"}>
          {isAr ? "اطلع على خطاب القرار للمزيد من التفاصيل." : "See the decision letter for details."}
        </Alert>
        <Card variant="bordered">
          <CardContent className="pt-6 space-y-3">
            <Button variant="primary" iconStart={<Download size={14} />}>
              {isAr ? "تنزيل خطاب القرار" : "Download decision letter"}
            </Button>
            <p className="text-xs text-ink-secondary inline-flex items-center gap-1">
              <Mail size={12} />
              {isAr
                ? "للاستئناف، تواصل مع appeals@adveti.ae"
                : "For appeals, contact appeals@adveti.ae"}
            </p>
          </CardContent>
        </Card>
      </>
    );
  }
  if (app.status === "Expired") {
    return (
      <Card variant="bordered" className="border-warning-600/30 bg-warning-100/30">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertOctagon size={20} className="text-warning-600 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-ink-primary">
                {isAr ? "انتهت صلاحية الترخيص" : "Your licence has expired"}
              </p>
              <p className="text-xs text-ink-secondary mt-1">
                {isAr ? "ابدأ التجديد للحفاظ على ترخيصك." : "Start renewal to remain licensed."}
              </p>
              <Link to={`/portal/applications/${app.id}/renew`} className="inline-block mt-3">
                <Button variant="gold" iconStart={<RefreshCcw size={14} />}>
                  {isAr ? "بدء التجديد" : "Start renewal"}
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Alert type="info" title={isAr ? "طلبك قيد المعالجة" : "Your application is being processed"}>
      {isAr
        ? "ستصلك إشعارات عند تحديث الحالة."
        : "You'll receive notifications as the status updates."}
    </Alert>
  );
};

const Row: React.FC<{ label: string; value: string; mono?: boolean }> = ({ label, value, mono }) => (
  <div className="flex justify-between">
    <dt className="text-ink-secondary">{label}</dt>
    <dd className={mono ? "font-mono text-ink-primary" : "text-ink-primary font-medium"} dir={mono ? "ltr" : undefined}>
      {value}
    </dd>
  </div>
);

export default ApplicationDetail;
