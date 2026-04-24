import * as React from "react";
import { useLang } from "@/hooks/useLang";
import { Badge, Card, Input, Select, Table, Button } from "@/components/adveti";
import type { Column } from "@/components/adveti/Table";
import { Search, Download, Lock } from "lucide-react";
import { mockDsrs, type DsrRequest, type DsrStatus } from "@/lib/mockAdmin";

const formatDate = (d: Date, lang: "en" | "ar") =>
  new Intl.DateTimeFormat(lang === "ar" ? "ar-AE-u-nu-arab" : "en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  }).format(d);

const statusVariant = (s: DsrStatus): "info" | "warning" | "success" | "danger" => {
  switch (s) {
    case "Received": return "info";
    case "InProgress": return "warning";
    case "Completed": return "success";
    case "Rejected": return "danger";
  }
};

const DsrRegisterPage: React.FC = () => {
  const { lang, t } = useLang();
  const [query, setQuery] = React.useState("");
  const [type, setType] = React.useState("");
  const [status, setStatus] = React.useState("");

  const filtered = React.useMemo(() => mockDsrs.filter((r) => {
    if (query && !`${r.id} ${r.applicantName} ${r.applicantNameAr}`.toLowerCase().includes(query.toLowerCase())) return false;
    if (type && r.type !== type) return false;
    if (status && r.status !== status) return false;
    return true;
  }), [query, type, status]);

  const handleExport = () => {
    const headers = ["Request ID", "Applicant", "Emirates ID", "Type", "Requested", "Deadline", "Status", "Assigned To"];
    const rows = filtered.map((r) => [
      r.id, r.applicantName, r.emiratesIdMasked, r.type,
      r.requestedAt.toISOString(), r.deadlineAt.toISOString(), r.status, r.assignedTo ?? "",
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `dsr-register-${new Date().toISOString().slice(0,10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const columns: Column<DsrRequest>[] = [
    { key: "id", header: t({ en: "Request ID", ar: "معرّف الطلب" }), sortable: true,
      render: (r) => <span className="text-xs font-mono" dir="ltr">{r.id}</span> },
    { key: "applicantName", header: t({ en: "Applicant", ar: "مقدم الطلب" }), sortable: true,
      render: (r) => (
        <div className="text-sm">
          <div className="font-medium text-ink-primary">{lang === "ar" ? r.applicantNameAr : r.applicantName}</div>
          <div className="text-xs text-ink-secondary font-mono" dir="ltr">{r.emiratesIdMasked}</div>
        </div>
      ) },
    { key: "type", header: t({ en: "Type", ar: "النوع" }), render: (r) => <span className="text-sm">{r.type}</span> },
    { key: "requestedAt", header: t({ en: "Requested", ar: "تاريخ الطلب" }), sortable: true,
      render: (r) => <span className="text-xs">{formatDate(r.requestedAt, lang)}</span> },
    { key: "status", header: t({ en: "Status", ar: "الحالة" }),
      render: (r) => <Badge variant={statusVariant(r.status)}>{r.status}</Badge> },
    { key: "deadlineAt", header: t({ en: "Days Remaining", ar: "الأيام المتبقية" }),
      render: (r) => {
        const days = Math.ceil((r.deadlineAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        if (r.status === "Completed" || r.status === "Rejected") {
          return <span className="text-xs text-ink-muted">—</span>;
        }
        const cls = days < 5 ? "text-danger-600 font-semibold" : days < 10 ? "text-warning-600 font-medium" : "text-ink-primary";
        return <span className={`text-sm ${cls}`}>{days} {t({ en: "days", ar: "يومًا" })}</span>;
      } },
    { key: "assignedTo", header: t({ en: "Assigned To", ar: "المعيَّن إليه" }),
      render: (r) => <span className="text-xs">{r.assignedTo ?? "—"}</span> },
    { key: "view", header: "",
      render: () => <Lock size={14} className="text-ink-muted" aria-label="Read-only" /> },
  ];

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-ink-primary">{t({ en: "DSR Register", ar: "سجل طلبات أصحاب البيانات" })}</h1>
          <p className="text-sm text-ink-secondary mt-1">
            {t({ en: "Read-only PDPL Data Subject Request register. Filter and export only.", ar: "سجل للقراءة فقط لطلبات أصحاب البيانات وفق قانون PDPL. التصفية والتصدير فقط." })}
          </p>
        </div>
        <Button variant="ghost" iconStart={<Download size={16} />} onClick={handleExport}>
          {t({ en: "Export CSV", ar: "تصدير CSV" })}
        </Button>
      </header>

      <div className="rounded-lg bg-info-100 border border-info-600/20 px-4 py-3 text-sm text-info-600 flex items-center gap-2">
        <Lock size={14} />
        {t({ en: "Auditor view: status changes, anonymisation, and assignment controls are disabled.", ar: "عرض المدقق: تعديلات الحالة وإخفاء الهوية وضوابط الإسناد معطّلة." })}
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input
            label={t({ en: "Search", ar: "بحث" })}
            placeholder={t({ en: "ID or applicant", ar: "المعرّف أو الاسم" })}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            iconStart={<Search size={16} />}
          />
          <Select
            label={t({ en: "Type", ar: "النوع" })}
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder={t({ en: "All types", ar: "كل الأنواع" })}
            options={["Access","Rectification","Erasure","Portability"].map((v) => ({ value: v, label: v }))}
          />
          <Select
            label={t({ en: "Status", ar: "الحالة" })}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            placeholder={t({ en: "All statuses", ar: "كل الحالات" })}
            options={["Received","InProgress","Completed","Rejected"].map((v) => ({ value: v, label: v }))}
          />
        </div>
      </Card>

      <Card>
        <Table
          columns={columns}
          data={filtered}
          rowKey={(r) => r.id}
          emptyMessage={t({ en: "No DSR requests match your filters", ar: "لا توجد طلبات تطابق التصفية" })}
        />
      </Card>
    </div>
  );
};

export default DsrRegisterPage;
