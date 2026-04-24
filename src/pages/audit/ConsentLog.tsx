import * as React from "react";
import { useLang } from "@/hooks/useLang";
import { Badge, Card, Input, Select, Table } from "@/components/adveti";
import type { Column } from "@/components/adveti/Table";
import { Search } from "lucide-react";
import { mockConsents, type ConsentRecord } from "@/lib/mockAudit";

const formatDate = (d: Date, lang: "en" | "ar") =>
  new Intl.DateTimeFormat(lang === "ar" ? "ar-AE-u-nu-arab" : "en-GB", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
    timeZone: "Asia/Dubai",
  }).format(d);

const ConsentLogPage: React.FC = () => {
  const { lang, t } = useLang();
  const [query, setQuery] = React.useState("");
  const [type, setType] = React.useState("");
  const [status, setStatus] = React.useState("");

  const filtered = React.useMemo(() => mockConsents.filter((r) => {
    if (query && !`${r.applicantName} ${r.applicantNameAr}`.toLowerCase().includes(query.toLowerCase())) return false;
    if (type && r.type !== type) return false;
    if (status && r.status !== status) return false;
    return true;
  }), [query, type, status]);

  const columns: Column<ConsentRecord>[] = [
    { key: "applicantName", header: t({ en: "Applicant", ar: "مقدم الطلب" }), sortable: true,
      render: (r) => (
        <div className="text-sm">
          <div className="font-medium text-ink-primary">{lang === "ar" ? r.applicantNameAr : r.applicantName}</div>
        </div>
      ) },
    { key: "emiratesIdMasked", header: t({ en: "Emirates ID", ar: "الهوية الإماراتية" }),
      render: (r) => <span className="text-xs font-mono" dir="ltr">{r.emiratesIdMasked}</span> },
    { key: "type", header: t({ en: "Consent Type", ar: "نوع الموافقة" }), sortable: true,
      render: (r) => <span className="text-sm">{r.type}</span> },
    { key: "version", header: t({ en: "Version", ar: "الإصدار" }), render: (r) => <span className="text-xs font-mono" dir="ltr">v{r.version}</span> },
    { key: "givenAt", header: t({ en: "Given At", ar: "تاريخ المنح" }), sortable: true,
      render: (r) => <span className="text-xs whitespace-nowrap">{formatDate(r.givenAt, lang)}</span> },
    { key: "ipAddress", header: t({ en: "IP", ar: "IP" }), render: (r) => <span className="text-xs font-mono" dir="ltr">{r.ipAddress}</span> },
    { key: "channel", header: t({ en: "Channel", ar: "القناة" }), render: (r) => <span className="text-xs" dir="ltr">{r.channel}</span> },
    { key: "status", header: t({ en: "Status", ar: "الحالة" }),
      render: (r) => r.status === "Active"
        ? <Badge variant="success">{t({ en: "Active", ar: "نشط" })}</Badge>
        : <Badge variant="neutral">{t({ en: "Withdrawn", ar: "مسحوبة" })}</Badge> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-ink-primary">{t({ en: "Consent Log", ar: "سجل الموافقات" })}</h1>
        <p className="text-sm text-ink-secondary mt-1">
          {t({ en: "Read-only register of all consent events captured by the platform.", ar: "سجل للقراءة فقط لجميع أحداث الموافقة المسجلة في المنصة." })}
        </p>
      </header>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input
            label={t({ en: "Applicant", ar: "مقدم الطلب" })}
            placeholder={t({ en: "Search by name", ar: "البحث بالاسم" })}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            startIcon={<Search size={16} />}
          />
          <Select
            label={t({ en: "Consent type", ar: "نوع الموافقة" })}
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder={t({ en: "All types", ar: "كل الأنواع" })}
            options={[
              "Terms & Conditions","Privacy Policy","Cookie — Analytics","Cookie — Preferences","Data Processing Consent","UAE Pass OAuth Scope",
            ].map((v) => ({ value: v, label: v }))}
          />
          <Select
            label={t({ en: "Status", ar: "الحالة" })}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            placeholder={t({ en: "All statuses", ar: "كل الحالات" })}
            options={[
              { value: "Active", label: t({ en: "Active", ar: "نشط" }) },
              { value: "Withdrawn", label: t({ en: "Withdrawn", ar: "مسحوبة" }) },
            ]}
          />
        </div>
      </Card>

      <Card>
        <Table
          columns={columns}
          data={filtered}
          rowKey={(r) => r.id}
          emptyMessage={t({ en: "No consent records match your filters", ar: "لا توجد سجلات تطابق التصفية" })}
        />
      </Card>
    </div>
  );
};

export default ConsentLogPage;
