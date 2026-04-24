import * as React from "react";
import { useLang } from "@/hooks/useLang";
import { Badge, Button, Card, Input, Select, Table } from "@/components/adveti";
import type { Column } from "@/components/adveti/Table";
import { Search, Download, ChevronDown, ChevronRight, Eye } from "lucide-react";
import { mockAuditLog, type AuditLogEntry } from "@/lib/mockAudit";

const PAGE_SIZE = 50;

const formatGst = (d: Date, lang: "en" | "ar") => {
  const opts: Intl.DateTimeFormatOptions = {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false, timeZone: "Asia/Dubai",
  };
  const locale = lang === "ar" ? "ar-AE-u-nu-arab" : "en-GB";
  const formatted = new Intl.DateTimeFormat(locale, opts).format(d);
  const tz = lang === "ar" ? "بتوقيت الخليج" : "GST";
  return `${formatted} ${tz}`;
};

const SECURITY_ACTIONS = new Set(["Login", "Logout", "MFA", "PasswordChange", "RoleChange"]);
const APPROVAL_ACTIONS = new Set(["Approved", "Rejected"]);

const rowTone = (entry: AuditLogEntry) => {
  if (SECURITY_ACTIONS.has(entry.action)) return "bg-danger-50/40 hover:bg-danger-50";
  if (APPROVAL_ACTIONS.has(entry.action)) return "bg-gold-50/40 hover:bg-gold-100/50";
  return "hover:bg-surface-100";
};

const DiffView: React.FC<{ before: unknown; after: unknown }> = ({ before, after }) => (
  <div className="grid grid-cols-2 gap-3 text-xs" dir="ltr">
    <div>
      <div className="font-semibold text-ink-secondary mb-1">Before</div>
      <pre className="bg-surface-100 p-2 rounded font-mono text-ink-primary overflow-x-auto whitespace-pre-wrap break-all">
        {before ? JSON.stringify(before, null, 2) : "—"}
      </pre>
    </div>
    <div>
      <div className="font-semibold text-ink-secondary mb-1">After</div>
      <pre className="bg-surface-100 p-2 rounded font-mono text-ink-primary overflow-x-auto whitespace-pre-wrap break-all">
        {after ? JSON.stringify(after, null, 2) : "—"}
      </pre>
    </div>
  </div>
);

const PRESETS: { id: string; en: string; ar: string; days: number }[] = [
  { id: "today", en: "Today", ar: "اليوم", days: 1 },
  { id: "7d", en: "Last 7 days", ar: "آخر 7 أيام", days: 7 },
  { id: "30d", en: "Last 30 days", ar: "آخر 30 يومًا", days: 30 },
  { id: "qtr", en: "This quarter", ar: "هذا الربع", days: 90 },
];

const AuditLogPage: React.FC = () => {
  const { lang, t } = useLang();
  const [actorQuery, setActorQuery] = React.useState("");
  const [entityType, setEntityType] = React.useState("");
  const [actionType, setActionType] = React.useState("");
  const [ip, setIp] = React.useState("");
  const [preset, setPreset] = React.useState<string>("30d");
  const [page, setPage] = React.useState(1);
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const filtered = React.useMemo(() => {
    const days = PRESETS.find((p) => p.id === preset)?.days ?? 30;
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    return mockAuditLog.filter((e) => {
      if (e.timestamp.getTime() < cutoff) return false;
      if (actorQuery && !`${e.actorName} ${e.actorEmail}`.toLowerCase().includes(actorQuery.toLowerCase())) return false;
      if (entityType && e.entityType !== entityType) return false;
      if (actionType && e.action !== actionType) return false;
      if (ip && !e.ipAddress.includes(ip)) return false;
      return true;
    });
  }, [actorQuery, entityType, actionType, ip, preset]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  React.useEffect(() => { setPage(1); }, [actorQuery, entityType, actionType, ip, preset]);

  const handleExport = () => {
    const headers = ["Timestamp (GST)", "Actor", "Role", "Action", "Entity", "Entity ID", "IP (masked)"];
    const rows = filtered.map((r) => [
      formatGst(r.timestamp, "en"),
      r.actorName,
      r.actorRole,
      r.action,
      r.entityType,
      r.entityId,
      r.ipAddress.replace(/\.\d+$/, ".***"),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const columns: Column<AuditLogEntry>[] = [
    {
      key: "expand", header: "",
      width: "40px",
      render: (r) => (
        <button onClick={(e) => { e.stopPropagation(); toggle(r.id); }} className="text-ink-secondary hover:text-ink-primary p-1">
          {expanded.has(r.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
      ),
    },
    { key: "timestamp", header: t({ en: "Timestamp", ar: "الوقت" }), sortable: true, render: (r) => <span className="text-xs whitespace-nowrap">{formatGst(r.timestamp, lang)}</span> },
    { key: "actorName", header: t({ en: "Actor", ar: "المستخدم" }), sortable: true, render: (r) => (
      <div className="text-sm">
        <div className="font-medium text-ink-primary">{r.actorName}</div>
        <div className="text-xs text-ink-secondary" dir="ltr">{r.actorEmail}</div>
      </div>
    ) },
    { key: "actorRole", header: t({ en: "Role", ar: "الدور" }), render: (r) => <span className="text-xs font-mono" dir="ltr">{r.actorRole}</span> },
    { key: "action", header: t({ en: "Action", ar: "الإجراء" }), sortable: true, render: (r) => {
      const variant = SECURITY_ACTIONS.has(r.action) ? "danger" : APPROVAL_ACTIONS.has(r.action) ? "gold" : "info";
      return <Badge variant={variant}>{r.action}</Badge>;
    } },
    { key: "entityType", header: t({ en: "Entity", ar: "الكيان" }), render: (r) => <span className="text-xs" dir="ltr">{r.entityType}</span> },
    { key: "entityId", header: t({ en: "Entity ID", ar: "معرّف الكيان" }), render: (r) => <span className="text-xs font-mono text-ink-secondary" dir="ltr">{r.entityId}</span> },
    { key: "ipAddress", header: t({ en: "IP", ar: "عنوان IP" }), render: (r) => <span className="text-xs font-mono" dir="ltr">{r.ipAddress.replace(/\.\d+$/, ".***")}</span> },
  ];

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-ink-primary">{t({ en: "Audit Log", ar: "سجل التدقيق" })}</h1>
          <p className="text-sm text-ink-secondary mt-1">
            {t({ en: "Read-only search across all system events. Timestamps in UAE timezone (GST, UTC+4).", ar: "بحث للقراءة فقط في جميع أحداث النظام. الأوقات بتوقيت الإمارات (GST، توقيت غرينتش +4)." })}
          </p>
        </div>
        <Button variant="ghost" iconStart={<Download size={16} />} onClick={handleExport}>
          {t({ en: "Export to CSV", ar: "تصدير CSV" })}
        </Button>
      </header>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <Input
            label={t({ en: "Actor", ar: "المستخدم" })}
            placeholder={t({ en: "Name or email", ar: "الاسم أو البريد" })}
            value={actorQuery}
            onChange={(e) => setActorQuery(e.target.value)}
            iconStart={<Search size={16} />}
          />
          <Select
            label={t({ en: "Entity type", ar: "نوع الكيان" })}
            value={entityType}
            onChange={(e) => setEntityType(e.target.value)}
            placeholder={t({ en: "All entities", ar: "كل الكيانات" })}
            options={["Application", "User", "Payment", "Certificate", "Content", "Config", "System"].map((v) => ({ value: v, label: v }))}
          />
          <Select
            label={t({ en: "Action type", ar: "نوع الإجراء" })}
            value={actionType}
            onChange={(e) => setActionType(e.target.value)}
            placeholder={t({ en: "All actions", ar: "كل الإجراءات" })}
            options={["Created","Updated","Deleted","Approved","Rejected","Submitted","Exported","Login","Logout","MFA","PasswordChange","RoleChange"].map((v) => ({ value: v, label: v }))}
          />
          <Select
            label={t({ en: "Date range", ar: "نطاق التاريخ" })}
            value={preset}
            onChange={(e) => setPreset(e.target.value)}
            options={PRESETS.map((p) => ({ value: p.id, label: lang === "ar" ? p.ar : p.en }))}
          />
          <Input
            label={t({ en: "IP address", ar: "عنوان IP" })}
            placeholder="10.42.x.x"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
          />
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-default">
                {columns.map((c, i) => (
                  <th key={i} className="text-start px-3 py-2 text-xs font-semibold text-ink-secondary uppercase tracking-wide">
                    {c.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 && (
                <tr><td colSpan={columns.length} className="text-center py-12 text-ink-secondary">
                  {t({ en: "No audit entries match your filters", ar: "لا توجد إدخالات تطابق التصفية" })}
                </td></tr>
              )}
              {pageRows.map((row) => (
                <React.Fragment key={row.id}>
                  <tr className={`border-b border-border-default transition-colors ${rowTone(row)}`}>
                    {columns.map((c, i) => (
                      <td key={i} className="px-3 py-2 align-top">
                        {c.render ? c.render(row) : String((row as any)[c.key] ?? "")}
                      </td>
                    ))}
                  </tr>
                  {expanded.has(row.id) && (
                    <tr className="bg-surface-50">
                      <td colSpan={columns.length} className="px-3 py-3">
                        <div className="text-xs uppercase tracking-wide text-ink-secondary mb-2 flex items-center gap-2">
                          <Eye size={14} /> {t({ en: "Change diff", ar: "مقارنة التغيير" })}
                          <span className="font-mono text-ink-muted ms-auto" dir="ltr">session: {row.sessionId}</span>
                        </div>
                        <DiffView before={row.before} after={row.after} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-default text-sm">
          <div className="text-ink-secondary">
            {t({ en: `Showing ${pageRows.length} of ${filtered.length} entries`, ar: `عرض ${pageRows.length} من ${filtered.length} إدخالًا` })}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              {t({ en: "Previous", ar: "السابق" })}
            </Button>
            <span className="text-ink-secondary px-2">{page} / {totalPages}</span>
            <Button variant="ghost" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              {t({ en: "Next", ar: "التالي" })}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AuditLogPage;
