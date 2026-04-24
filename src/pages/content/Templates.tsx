import * as React from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Mail,
  Megaphone,
  MessageSquare,
  RefreshCw,
  Search,
  Send,
  Smartphone,
  Tag,
  XCircle,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  Input,
  Select,
} from "@/components/adveti";
import { useLang } from "@/hooks/useLang";
import { cn } from "@/lib/utils";
import {
  Channel,
  DeliveryLogEntry,
  DeliveryStatus,
  mockDeliveryLog,
  mockTemplates,
  NotificationTemplate,
} from "@/lib/mockNotifications";

// Sample data for merge tag substitution.
const SAMPLE_DATA: Record<string, string> = {
  "{{applicantName}}": "Layla Hassan Al Marri",
  "{{applicationId}}": "APP-2026-00042",
  "{{licenceCategory}}": "Teacher",
  "{{receiptNumber}}": "RCP-2026-00892",
  "{{amount}}": "1,050",
  "{{paymentDate}}": "24 Apr 2026",
  "{{rfiMessage}}": "Please re-upload page 2 of your Master's certificate.",
  "{{rfiDeadline}}": "30 Apr 2026",
  "{{licenceNumber}}": "LP-2026-00009945",
  "{{validFrom}}": "01 May 2026",
  "{{validTo}}": "30 Apr 2028",
  "{{expiryDate}}": "14 Sep 2027",
  "{{daysToExpiry}}": "60",
};
const SAMPLE_DATA_AR: Record<string, string> = {
  "{{applicantName}}": "ليلى حسن المري",
  "{{applicationId}}": "APP-2026-00042",
  "{{licenceCategory}}": "معلم",
  "{{receiptNumber}}": "RCP-2026-00892",
  "{{amount}}": "1٬050",
  "{{paymentDate}}": "24 أبريل 2026",
  "{{rfiMessage}}": "يُرجى إعادة رفع الصفحة 2 من شهادة الماجستير.",
  "{{rfiDeadline}}": "30 أبريل 2026",
  "{{licenceNumber}}": "LP-2026-00009945",
  "{{validFrom}}": "01 مايو 2026",
  "{{validTo}}": "30 أبريل 2028",
  "{{expiryDate}}": "14 سبتمبر 2027",
  "{{daysToExpiry}}": "60",
};

const substitute = (text: string, data: Record<string, string>): string => {
  let out = text;
  Object.entries(data).forEach(([k, v]) => {
    out = out.split(k).join(v);
  });
  return out;
};

// ===== Status badges + helpers =====

const STATUS_BADGE: Record<
  DeliveryStatus,
  { variant: "success" | "info" | "warning" | "danger" | "neutral"; en: string; ar: string }
> = {
  Delivered: { variant: "success", en: "Delivered", ar: "تم التسليم" },
  Opened: { variant: "info", en: "Opened", ar: "تم الفتح" },
  Queued: { variant: "warning", en: "Queued", ar: "في الانتظار" },
  Failed: { variant: "danger", en: "Failed", ar: "فشل" },
  Bounced: { variant: "danger", en: "Bounced", ar: "مرتد" },
};

const CHANNEL_LABEL: Record<Channel, { en: string; ar: string; icon: React.ReactNode }> = {
  Email: { en: "Email", ar: "بريد", icon: <Mail size={12} /> },
  SMS: { en: "SMS", ar: "SMS", icon: <MessageSquare size={12} /> },
  InApp: { en: "In-App", ar: "داخل التطبيق", icon: <Megaphone size={12} /> },
};

// SMS character analysis
const analyseSms = (text: string) => {
  const isUnicode = /[^\u0000-\u007F]/.test(text);
  const perSegment = isUnicode ? 70 : 160;
  const len = text.length;
  const segments = Math.max(1, Math.ceil(len / perSegment));
  return { isUnicode, perSegment, len, segments };
};

// ===== Email preview frame =====

interface EmailPreviewProps {
  subject: string;
  body: string;
  rtl: boolean;
}

const EmailPreview: React.FC<EmailPreviewProps> = ({ subject, body, rtl }) => (
  <div className="rounded-md border border-border-default overflow-hidden bg-surface-0 shadow-sm">
    <div className="bg-surface-100 px-4 py-2.5 border-b border-border-default flex items-center gap-2">
      <span className="h-2.5 w-2.5 rounded-full bg-danger-600/60" />
      <span className="h-2.5 w-2.5 rounded-full bg-warning-600/60" />
      <span className="h-2.5 w-2.5 rounded-full bg-success-600/60" />
      <span className="ms-2 text-[11px] text-ink-muted font-mono">
        mail.adveti.ae
      </span>
    </div>
    <div className="p-4 border-b border-border-default flex items-start gap-3">
      <div className="h-9 w-9 rounded-md bg-navy-900 text-ink-inverse inline-flex items-center justify-center text-xs font-bold ring-2 ring-gold-500/40">
        AD
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-ink-muted">
          {rtl ? "من: أدفيتي <noreply@adveti.ae>" : "From: ADVETI <noreply@adveti.ae>"}
        </p>
        <p
          dir={rtl ? "rtl" : "ltr"}
          className={cn(
            "text-sm font-semibold text-ink-primary mt-0.5",
            rtl && "font-cairo text-right",
          )}
        >
          {subject}
        </p>
      </div>
    </div>
    <div
      dir={rtl ? "rtl" : "ltr"}
      className={cn(
        "p-5 text-sm text-ink-primary whitespace-pre-line leading-relaxed bg-surface-0 min-h-[180px]",
        rtl ? "text-right font-cairo" : "text-left",
      )}
      style={rtl ? { fontFamily: "'Cairo', sans-serif" } : undefined}
    >
      {body}
    </div>
    <div
      dir={rtl ? "rtl" : "ltr"}
      className={cn(
        "px-5 py-3 bg-surface-50 border-t border-border-default text-[11px] text-ink-muted",
        rtl && "text-right",
      )}
    >
      {rtl
        ? "هيئة أبوظبي للتعليم والتدريب التقني والمهني — أبوظبي، الإمارات | إلغاء الاشتراك"
        : "ADVETI — Abu Dhabi, UAE | Unsubscribe"}
    </div>
  </div>
);

// ===== SMS preview (phone frame) =====

interface SmsPreviewProps {
  text: string;
  rtl: boolean;
}

const SmsPreview: React.FC<SmsPreviewProps> = ({ text, rtl }) => {
  const { isUnicode, perSegment, len, segments } = analyseSms(text);
  const { lang } = useLang();
  const isAr = lang === "ar";
  return (
    <div className="flex flex-col items-center">
      <div className="w-[260px] rounded-[2rem] border-[10px] border-navy-900 bg-navy-900 shadow-xl">
        <div className="rounded-[1.4rem] bg-surface-50 overflow-hidden">
          <div className="h-6 bg-navy-900 flex items-center justify-center">
            <span className="h-1 w-12 rounded-full bg-surface-50/40" />
          </div>
          <div className="px-3 py-4 min-h-[220px] flex flex-col gap-2">
            <p className="text-[10px] text-ink-muted text-center">ADVETI</p>
            <div
              dir={rtl ? "rtl" : "ltr"}
              className={cn(
                "max-w-[85%] bg-surface-0 ring-1 ring-border-default rounded-2xl rounded-tl-sm px-3 py-2 text-[12px] text-ink-primary shadow-sm",
                rtl
                  ? "self-end rounded-tr-sm rounded-tl-2xl text-right"
                  : "self-start",
              )}
              style={rtl ? { fontFamily: "'Cairo', sans-serif" } : undefined}
            >
              {text}
            </div>
            <p className="text-[9px] text-ink-muted text-center mt-auto">
              {new Date().toLocaleTimeString(isAr ? "ar-AE" : "en-AE", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-3 text-center text-[11px] text-ink-secondary space-y-0.5">
        <p>
          <span className="font-semibold text-ink-primary">{len}</span>{" "}
          {isAr ? "حرف" : "chars"} · {segments}{" "}
          {isAr ? "جزء SMS" : segments === 1 ? "segment" : "segments"}
        </p>
        <p className="text-ink-muted">
          {isUnicode ? (
            <>
              {isAr ? "ترميز يونيكود" : "Unicode encoding"} ({perSegment}{" "}
              {isAr ? "حرف/جزء" : "chars/segment"})
            </>
          ) : (
            <>
              {isAr ? "ترميز GSM-7" : "GSM-7 encoding"} ({perSegment}{" "}
              {isAr ? "حرف/جزء" : "chars/segment"})
            </>
          )}
        </p>
      </div>
    </div>
  );
};

// ===== Delivery Log tab =====

const STATUS_ICON: Record<DeliveryStatus, React.ReactNode> = {
  Delivered: <CheckCircle2 size={12} />,
  Opened: <CheckCircle2 size={12} />,
  Queued: <Clock size={12} />,
  Failed: <XCircle size={12} />,
  Bounced: <AlertCircle size={12} />,
};

const DeliveryLog: React.FC<{ templateId: string }> = ({ templateId }) => {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [channelFilter, setChannelFilter] = React.useState<string>("all");
  const [recipient, setRecipient] = React.useState("");
  const [rows, setRows] = React.useState<DeliveryLogEntry[]>(
    mockDeliveryLog.filter((d) => d.templateId === templateId),
  );

  React.useEffect(() => {
    setRows(mockDeliveryLog.filter((d) => d.templateId === templateId));
  }, [templateId]);

  const filtered = rows.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (channelFilter !== "all" && r.channel !== channelFilter) return false;
    if (recipient && !r.recipient.toLowerCase().includes(recipient.toLowerCase()))
      return false;
    return true;
  });

  const retry = (id: string) =>
    setRows((s) =>
      s.map((r) =>
        r.id === id
          ? { ...r, status: "Delivered" as DeliveryStatus, attempts: r.attempts + 1, error: undefined }
          : r,
      ),
    );

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-4 gap-3">
        <Input
          label={isAr ? "بحث المستلم" : "Recipient search"}
          placeholder={isAr ? "البريد أو الهاتف" : "Email or phone"}
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          iconStart={<Search size={14} />}
        />
        <Select
          label={isAr ? "الحالة" : "Status"}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: "all", label: isAr ? "كل الحالات" : "All statuses" },
            ...Object.keys(STATUS_BADGE).map((s) => ({
              value: s,
              label: isAr
                ? STATUS_BADGE[s as DeliveryStatus].ar
                : STATUS_BADGE[s as DeliveryStatus].en,
            })),
          ]}
        />
        <Select
          label={isAr ? "القناة" : "Channel"}
          value={channelFilter}
          onChange={(e) => setChannelFilter(e.target.value)}
          options={[
            { value: "all", label: isAr ? "كل القنوات" : "All channels" },
            { value: "Email", label: isAr ? "بريد" : "Email" },
            { value: "SMS", label: "SMS" },
            { value: "InApp", label: isAr ? "داخل التطبيق" : "In-App" },
          ]}
        />
        <Input
          label={isAr ? "النطاق الزمني" : "Date range"}
          type="date"
          defaultValue="2026-04-01"
        />
      </div>

      <div className="overflow-x-auto rounded-md ring-1 ring-border-default">
        <table className="w-full text-sm">
          <thead className="bg-surface-50">
            <tr>
              <th className="text-start px-4 py-3 text-xs uppercase tracking-wider text-ink-muted font-semibold">
                {isAr ? "وقت الإرسال" : "Sent at"}
              </th>
              <th className="text-start px-4 py-3 text-xs uppercase tracking-wider text-ink-muted font-semibold">
                {isAr ? "المستلم" : "Recipient"}
              </th>
              <th className="text-start px-4 py-3 text-xs uppercase tracking-wider text-ink-muted font-semibold">
                {isAr ? "القناة" : "Channel"}
              </th>
              <th className="text-start px-4 py-3 text-xs uppercase tracking-wider text-ink-muted font-semibold">
                {isAr ? "الحالة" : "Status"}
              </th>
              <th className="text-center px-4 py-3 text-xs uppercase tracking-wider text-ink-muted font-semibold">
                {isAr ? "محاولات" : "Attempts"}
              </th>
              <th className="text-start px-4 py-3 text-xs uppercase tracking-wider text-ink-muted font-semibold">
                {isAr ? "الخطأ" : "Error"}
              </th>
              <th className="text-end px-4 py-3 text-xs uppercase tracking-wider text-ink-muted font-semibold">
                {isAr ? "إجراء" : "Action"}
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-ink-secondary">
                  {isAr ? "لا توجد نتائج" : "No matching deliveries"}
                </td>
              </tr>
            ) : (
              filtered.map((r) => {
                const sb = STATUS_BADGE[r.status];
                return (
                  <tr key={r.id} className="border-t border-border-default hover:bg-surface-50">
                    <td className="px-4 py-3 text-ink-secondary whitespace-nowrap">
                      {r.sentAt.toLocaleString(isAr ? "ar-AE" : "en-AE", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td
                      className="px-4 py-3 text-ink-primary font-mono text-xs"
                      dir="ltr"
                    >
                      {r.recipient}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-xs text-ink-secondary">
                        {CHANNEL_LABEL[r.channel].icon}
                        {isAr ? CHANNEL_LABEL[r.channel].ar : CHANNEL_LABEL[r.channel].en}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={sb.variant}>
                        <span className="inline-flex items-center gap-1">
                          {STATUS_ICON[r.status]}
                          {isAr ? sb.ar : sb.en}
                        </span>
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center text-ink-secondary">
                      {r.attempts}
                    </td>
                    <td className="px-4 py-3 text-xs text-danger-600">
                      {r.error ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-end">
                      {(r.status === "Failed" || r.status === "Bounced") && (
                        <Button
                          size="sm"
                          variant="ghost"
                          iconStart={<RefreshCw size={12} />}
                          onClick={() => retry(r.id)}
                        >
                          {isAr ? "إعادة الإرسال" : "Retry"}
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ===== Main page =====

const Templates: React.FC = () => {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const [activeId, setActiveId] = React.useState(mockTemplates[0].id);
  const [tab, setTab] = React.useState<"editor" | "log">("editor");

  const active: NotificationTemplate =
    mockTemplates.find((t) => t.id === activeId) ?? mockTemplates[0];

  const subjectEn = substitute(active.subjectEn, SAMPLE_DATA);
  const subjectAr = substitute(active.subjectAr, SAMPLE_DATA_AR);
  const bodyEn = substitute(active.bodyEn, SAMPLE_DATA);
  const bodyAr = substitute(active.bodyAr, SAMPLE_DATA_AR);
  const smsEn = substitute(active.smsEn, SAMPLE_DATA);
  const smsAr = substitute(active.smsAr, SAMPLE_DATA_AR);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-ink-primary inline-flex items-center gap-2">
          <Megaphone size={20} className="text-navy-800" />
          {isAr ? "قوالب الإشعارات" : "Notification Templates"}
        </h1>
        <p className="text-sm text-ink-secondary mt-1">
          {isAr
            ? "حرّر قوالب البريد الإلكتروني، ورسائل SMS، والإشعارات داخل التطبيق — ثنائية اللغة."
            : "Edit bilingual email, SMS, and in-app templates with live preview."}
        </p>
      </header>

      <div className="grid lg:grid-cols-[260px_1fr] gap-6">
        {/* Template list */}
        <Card variant="bordered" className="self-start">
          <CardContent className="pt-4 pb-2 px-2">
            <ul className="space-y-1">
              {mockTemplates.map((t) => {
                const isActive = t.id === activeId;
                return (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveId(t.id);
                        setTab("editor");
                      }}
                      className={cn(
                        "w-full text-start px-3 py-2.5 rounded-md focus-ring transition-colors",
                        isActive
                          ? "bg-navy-900 text-ink-inverse"
                          : "hover:bg-surface-100 text-ink-primary",
                      )}
                    >
                      <p className="text-sm font-medium">
                        {isAr ? t.nameAr : t.nameEn}
                      </p>
                      <p
                        className={cn(
                          "text-[10px] mt-0.5 font-mono",
                          isActive ? "text-gold-300" : "text-ink-muted",
                        )}
                        dir="ltr"
                      >
                        {t.code}
                      </p>
                    </button>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>

        {/* Detail panel */}
        <div className="space-y-4 min-w-0">
          <Card variant="bordered">
            <div className="border-b border-border-default px-4 pt-3 flex items-center gap-1">
              {[
                { key: "editor" as const, en: "Editor & Preview", ar: "المحرّر والمعاينة" },
                { key: "log" as const, en: "Delivery Log", ar: "سجل التسليم" },
              ].map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className={cn(
                    "py-2.5 px-4 text-sm font-medium border-b-2 -mb-px focus-ring rounded-t",
                    tab === t.key
                      ? "border-gold-500 text-navy-900"
                      : "border-transparent text-ink-secondary hover:text-navy-900",
                  )}
                >
                  {isAr ? t.ar : t.en}
                </button>
              ))}
              <div className="flex-1" />
              <div className="pb-2 flex items-center gap-2">
                {active.channels.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-surface-100 text-ink-secondary font-semibold"
                  >
                    {CHANNEL_LABEL[c].icon}
                    {isAr ? CHANNEL_LABEL[c].ar : CHANNEL_LABEL[c].en}
                  </span>
                ))}
              </div>
            </div>

            <CardContent className="pt-5 space-y-5">
              {tab === "editor" ? (
                <>
                  {/* Merge tag chips */}
                  <div>
                    <p className="text-xs uppercase tracking-wider font-semibold text-ink-muted mb-2 inline-flex items-center gap-1">
                      <Tag size={11} />
                      {isAr ? "علامات الدمج" : "Merge tags"}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {active.mergeTags.map((tag) => (
                        <code
                          key={tag}
                          className="px-2 py-0.5 text-[11px] rounded bg-info-100 text-info-600 font-mono"
                          dir="ltr"
                        >
                          {tag}
                        </code>
                      ))}
                    </div>
                  </div>

                  {/* Email preview EN/AR */}
                  {active.channels.includes("Email") && (
                    <section>
                      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                        <h3 className="text-sm font-semibold text-ink-primary inline-flex items-center gap-2">
                          <Mail size={14} className="text-navy-800" />
                          {isAr ? "معاينة البريد الإلكتروني" : "Email preview"}
                        </h3>
                        <p className="text-[11px] text-ink-muted">
                          {isAr
                            ? "العلامات مستبدلة ببيانات تجريبية"
                            : "Merge tags substituted with sample data"}
                        </p>
                      </div>
                      <div className="grid lg:grid-cols-2 gap-4">
                        <div>
                          <p className="text-[11px] uppercase tracking-wider text-ink-muted font-semibold mb-1.5">
                            English (LTR)
                          </p>
                          <EmailPreview subject={subjectEn} body={bodyEn} rtl={false} />
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-wider text-ink-muted font-semibold mb-1.5">
                            العربية (RTL)
                          </p>
                          <EmailPreview subject={subjectAr} body={bodyAr} rtl={true} />
                        </div>
                      </div>
                    </section>
                  )}

                  {/* SMS preview */}
                  {active.channels.includes("SMS") && (
                    <section>
                      <h3 className="text-sm font-semibold text-ink-primary inline-flex items-center gap-2 mb-3">
                        <Smartphone size={14} className="text-navy-800" />
                        {isAr ? "معاينة الرسالة القصيرة" : "SMS preview"}
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-6 justify-items-center bg-surface-50 rounded-md py-6">
                        <div>
                          <p className="text-[11px] uppercase tracking-wider text-ink-muted font-semibold mb-3 text-center">
                            English · GSM-7
                          </p>
                          <SmsPreview text={smsEn} rtl={false} />
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-wider text-ink-muted font-semibold mb-3 text-center">
                            العربية · Unicode
                          </p>
                          <SmsPreview text={smsAr} rtl={true} />
                        </div>
                      </div>
                    </section>
                  )}

                  <footer className="flex items-center justify-between gap-3 pt-3 border-t border-border-default flex-wrap">
                    <p className="text-[11px] text-ink-muted">
                      {isAr ? "آخر تحديث:" : "Last updated:"}{" "}
                      {active.updatedAt.toLocaleDateString(isAr ? "ar-AE" : "en-AE", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" iconStart={<Send size={14} />}>
                        {isAr ? "اختبار الإرسال" : "Send test"}
                      </Button>
                      <Button variant="primary">
                        {isAr ? "حفظ القالب" : "Save template"}
                      </Button>
                    </div>
                  </footer>
                </>
              ) : (
                <DeliveryLog templateId={active.id} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Templates;
