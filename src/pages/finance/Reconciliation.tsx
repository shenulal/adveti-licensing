import * as React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FileEdit,
  FileMinus,
  MoreHorizontal,
  Search,
  Wallet,
  XCircle,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  Input,
  Modal,
  Select,
  Table,
  useToast,
  type Column,
} from "@/components/adveti";
import { useLang } from "@/hooks/useLang";
import { formatAED, formatDate, formatNumber } from "@/lib/format";
import {
  mockReconciliation,
  reconciliationTotals,
  type MatchStatus,
  type ReconciliationRow,
} from "@/lib/mockFinance";
import { cn } from "@/lib/utils";

type DateFilter = "today" | "week" | "month" | "custom";
type StatusFilter = "All" | MatchStatus;
type CategoryFilter = "All" | "Teacher" | "Counsellor" | "Trainer";

const matchBadge = (m: MatchStatus, isAr: boolean) => {
  if (m === "Matched")
    return (
      <Badge variant="success">
        <CheckCircle2 size={10} className="me-1" />
        {isAr ? "مطابق" : "Matched"}
      </Badge>
    );
  if (m === "Variance")
    return (
      <Badge variant="warning">
        <AlertTriangle size={10} className="me-1" />
        {isAr ? "اختلاف" : "Variance"}
      </Badge>
    );
  return (
    <Badge variant="danger">
      <XCircle size={10} className="me-1" />
      {isAr ? "غير مطابق" : "Unmatched"}
    </Badge>
  );
};

const Reconciliation: React.FC = () => {
  const { lang } = useLang();
  const { push } = useToast();
  const isAr = lang === "ar";

  const [dateFilter, setDateFilter] = React.useState<DateFilter>("month");
  const [status, setStatus] = React.useState<StatusFilter>("All");
  const [category, setCategory] = React.useState<CategoryFilter>("All");
  const [search, setSearch] = React.useState("");
  const [actionRow, setActionRow] = React.useState<ReconciliationRow | null>(
    null,
  );
  const [reissueOpen, setReissueOpen] = React.useState(false);
  const [creditOpen, setCreditOpen] = React.useState(false);
  const [reason, setReason] = React.useState("");
  const [creditAmount, setCreditAmount] = React.useState("");

  const filtered = React.useMemo(() => {
    return mockReconciliation.filter((r) => {
      if (status !== "All" && r.matchStatus !== status) return false;
      if (category !== "All" && r.category !== category) return false;
      if (search) {
        const s = search.toLowerCase();
        if (
          !r.applicationId.toLowerCase().includes(s) &&
          !r.receiptNumber.toLowerCase().includes(s) &&
          !r.applicantNameEn.toLowerCase().includes(s) &&
          !r.applicantNameAr.includes(search)
        )
          return false;
      }
      return true;
    });
  }, [status, category, search]);

  const handleExport = () => {
    const headers = [
      "Date",
      "Receipt No",
      "Application ID",
      "Applicant",
      "Category",
      "Fee",
      "VAT",
      "Total",
      "Gateway Ref",
      "Match Status",
      "Variance",
    ];
    const rows = filtered.map((r) => [
      r.date.toISOString().split("T")[0],
      r.receiptNumber,
      r.applicationId,
      r.applicantNameEn,
      r.category,
      r.feeAmount,
      r.vatAmount,
      r.total,
      r.gatewayReference,
      r.matchStatus,
      r.varianceAmount ?? 0,
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${c}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reconciliation-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    push({
      title: isAr ? "تم التصدير" : "Exported",
      description: isAr
        ? "تم تنزيل ملف المطابقة بصيغة CSV"
        : "Reconciliation file downloaded as CSV",
      type: "success",
    });
  };

  const summary = reconciliationTotals;

  const columns: Column<ReconciliationRow>[] = [
    {
      key: "date",
      header: isAr ? "التاريخ" : "Date",
      sortable: true,
      render: (r) => (
        <span className="text-xs text-ink-secondary">
          {formatDate(r.date, lang)}
        </span>
      ),
    },
    {
      key: "receiptNumber",
      header: isAr ? "رقم الإيصال" : "Receipt No.",
      render: (r) => (
        <span className="font-mono text-xs text-navy-900" dir="ltr">
          {r.receiptNumber}
        </span>
      ),
    },
    {
      key: "applicationId",
      header: isAr ? "رقم الطلب" : "App. ID",
      render: (r) => (
        <span className="font-mono text-xs text-navy-900" dir="ltr">
          {r.applicationId}
        </span>
      ),
    },
    {
      key: "applicantNameEn",
      header: isAr ? "المتقدم" : "Applicant",
      render: (r) => (
        <span className="text-sm">
          {isAr ? r.applicantNameAr : r.applicantNameEn}
        </span>
      ),
    },
    {
      key: "category",
      header: isAr ? "الفئة" : "Category",
      render: (r) =>
        isAr
          ? r.category === "Teacher"
            ? "معلم"
            : r.category === "Counsellor"
              ? "مرشد"
              : "مدرب"
          : r.category,
    },
    {
      key: "feeAmount",
      header: isAr ? "المبلغ" : "Amount",
      align: "end",
      render: (r) => (
        <span className="font-medium" dir="ltr">
          {formatAED(r.feeAmount, lang)}
        </span>
      ),
    },
    {
      key: "vatAmount",
      header: isAr ? "ضريبة القيمة المضافة" : "VAT",
      align: "end",
      render: (r) => (
        <span className="text-xs text-ink-secondary" dir="ltr">
          {formatAED(r.vatAmount, lang)}
        </span>
      ),
    },
    {
      key: "matchStatus",
      header: isAr ? "الحالة" : "Match",
      render: (r) => matchBadge(r.matchStatus, isAr),
    },
    {
      key: "gatewayReference",
      header: isAr ? "مرجع البوابة" : "Gateway Ref",
      render: (r) => (
        <span className="font-mono text-[10px] text-ink-muted" dir="ltr">
          {r.gatewayReference}
        </span>
      ),
    },
    {
      key: "_action",
      header: "",
      align: "end",
      render: (r) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setActionRow(actionRow?.receiptNumber === r.receiptNumber ? null : r);
          }}
          className="p-1.5 rounded-md hover:bg-surface-100 focus-ring"
          aria-label="Row actions"
        >
          <MoreHorizontal size={16} className="text-ink-muted" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-primary">
            {isAr ? "لوحة المطابقة المالية" : "Reconciliation Dashboard"}
          </h1>
          <p className="text-sm text-ink-secondary mt-1">
            {isAr
              ? "مطابقة المبالغ المُحصّلة مع تسويات بوابة الدفع"
              : "Match collected payments with gateway settlements"}
          </p>
        </div>
        <Button
          variant="secondary"
          iconStart={<Download size={16} />}
          onClick={handleExport}
        >
          {isAr ? "تصدير ملف المطابقة" : "Export reconciliation file"}
        </Button>
      </header>

      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card variant="bordered">
          <CardContent className="pt-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-ink-muted">
                  {isAr ? "إجمالي المُحصّل" : "Total collected"}
                </p>
                <p
                  className="mt-2 text-2xl font-bold text-ink-primary"
                  dir="ltr"
                >
                  {formatAED(summary.collectedTotal, lang)}
                </p>
                <p className="mt-1 text-xs text-ink-secondary">
                  {isAr
                    ? `${formatNumber(summary.collectedCount, lang)} طلب`
                    : `${formatNumber(summary.collectedCount, lang)} applications`}
                </p>
              </div>
              <span className="h-10 w-10 rounded-md bg-navy-900 inline-flex items-center justify-center text-ink-inverse">
                <Wallet size={18} />
              </span>
            </div>
          </CardContent>
        </Card>
        <Card variant="bordered">
          <CardContent className="pt-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-ink-muted">
                  {isAr ? "تسوية البوابة" : "Gateway settled"}
                </p>
                <p
                  className="mt-2 text-2xl font-bold text-ink-primary"
                  dir="ltr"
                >
                  {formatAED(summary.gatewaySettled, lang)}
                </p>
                <p className="mt-1 text-xs text-ink-secondary">
                  {isAr ? "مطابق مع المُحصّل" : "Matched against collected"}
                </p>
              </div>
              <span className="h-10 w-10 rounded-md bg-success-100 text-success-600 inline-flex items-center justify-center">
                <CheckCircle2 size={18} />
              </span>
            </div>
          </CardContent>
        </Card>
        <Card variant="bordered">
          <CardContent className="pt-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-ink-muted">
                  {isAr ? "الفرق" : "Variance"}
                </p>
                <p
                  className="mt-2 text-2xl font-bold text-ink-primary"
                  dir="ltr"
                >
                  {formatAED(summary.variance, lang)}
                </p>
                <Badge variant="warning" className="mt-2">
                  {isAr ? "تتطلب المراجعة" : "Review required"}
                </Badge>
              </div>
              <span className="h-10 w-10 rounded-md bg-warning-100 text-warning-600 inline-flex items-center justify-center">
                <AlertTriangle size={18} />
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card variant="bordered">
        <CardContent className="pt-5 space-y-4">
          <div className="flex flex-wrap gap-2">
            {(
              [
                { k: "today", en: "Today", ar: "اليوم" },
                { k: "week", en: "This week", ar: "هذا الأسبوع" },
                { k: "month", en: "This month", ar: "هذا الشهر" },
                { k: "custom", en: "Custom range", ar: "فترة مخصّصة" },
              ] as { k: DateFilter; en: string; ar: string }[]
            ).map((t) => (
              <button
                key={t.k}
                type="button"
                onClick={() => setDateFilter(t.k)}
                className={cn(
                  "h-8 px-3 rounded-full text-xs font-semibold transition-colors",
                  dateFilter === t.k
                    ? "bg-navy-900 text-ink-inverse"
                    : "bg-surface-100 text-ink-secondary hover:bg-surface-200",
                )}
              >
                {isAr ? t.ar : t.en}
              </button>
            ))}
          </div>

          {dateFilter === "custom" && (
            <div className="grid gap-3 md:grid-cols-2">
              <Input
                label={isAr ? "من تاريخ" : "From date"}
                type="date"
              />
              <Input
                label={isAr ? "إلى تاريخ" : "To date"}
                type="date"
              />
            </div>
          )}

          <div className="grid gap-3 md:grid-cols-3">
            <Select
              label={isAr ? "حالة المطابقة" : "Match status"}
              value={status}
              onChange={(e) => setStatus(e.target.value as StatusFilter)}
              options={[
                { value: "All", label: isAr ? "الكل" : "All" },
                {
                  value: "Matched",
                  label: isAr ? "مطابق" : "Matched",
                },
                {
                  value: "Variance",
                  label: isAr ? "اختلاف" : "Variance",
                },
                {
                  value: "Unmatched",
                  label: isAr ? "غير مطابق" : "Unmatched",
                },
              ]}
            />
            <Select
              label={isAr ? "الفئة" : "Category"}
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryFilter)}
              options={[
                { value: "All", label: isAr ? "كل الفئات" : "All categories" },
                { value: "Teacher", label: isAr ? "معلم" : "Teacher" },
                { value: "Counsellor", label: isAr ? "مرشد" : "Counsellor" },
                { value: "Trainer", label: isAr ? "مدرب" : "Trainer" },
              ]}
            />
            <Input
              label={isAr ? "بحث" : "Search"}
              placeholder={
                isAr
                  ? "رقم الإيصال أو الطلب أو المتقدم"
                  : "Receipt, application ID or applicant"
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              iconStart={<Search size={16} />}
            />
          </div>
        </CardContent>
      </Card>

      <Table
        columns={columns}
        data={filtered}
        rowKey={(r) => r.receiptNumber}
      />

      {/* Action menu popover */}
      {actionRow && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setActionRow(null)}
          />
          <Card
            variant="elevated"
            className="fixed end-10 bottom-10 z-40 w-72 animate-scale-in"
          >
            <CardContent className="pt-4 space-y-2">
              <p className="text-xs text-ink-muted">
                {isAr ? "إجراءات على" : "Actions for"}{" "}
                <span className="font-mono text-ink-primary" dir="ltr">
                  {actionRow.receiptNumber}
                </span>
              </p>
              <button
                type="button"
                onClick={() => {
                  setReissueOpen(true);
                }}
                className="w-full text-start flex items-center gap-2 px-3 py-2 rounded-md hover:bg-surface-100 text-sm"
              >
                <FileEdit size={16} className="text-ink-secondary" />
                {isAr ? "إعادة إصدار الفاتورة" : "Re-issue invoice"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setCreditOpen(true);
                }}
                className="w-full text-start flex items-center gap-2 px-3 py-2 rounded-md hover:bg-surface-100 text-sm"
              >
                <FileMinus size={16} className="text-ink-secondary" />
                {isAr ? "إصدار إشعار دائن" : "Issue credit note"}
              </button>
            </CardContent>
          </Card>
        </>
      )}

      {/* Re-issue invoice modal */}
      <Modal
        open={reissueOpen}
        onClose={() => {
          setReissueOpen(false);
          setActionRow(null);
          setReason("");
        }}
        title={isAr ? "إعادة إصدار فاتورة ضريبية" : "Re-issue VAT invoice"}
        description={
          isAr
            ? "سيتم إنشاء فاتورة جديدة مع الحفاظ على الفاتورة الأصلية للتدقيق"
            : "A new invoice will be generated; the original is preserved for audit."
        }
        size="lg"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setReissueOpen(false);
                setActionRow(null);
                setReason("");
              }}
            >
              {isAr ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              variant="primary"
              disabled={reason.trim().length < 10}
              onClick={() => {
                push({
                  title: isAr ? "تم إعادة الإصدار" : "Invoice re-issued",
                  description: isAr
                    ? "تم إنشاء فاتورة جديدة وحفظ السجل في سجل التدقيق"
                    : "New invoice created and audit trail entry recorded.",
                  type: "success",
                });
                setReissueOpen(false);
                setActionRow(null);
                setReason("");
              }}
            >
              {isAr ? "إعادة الإصدار" : "Re-issue invoice"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm bg-surface-50 rounded-md p-3">
            <div>
              <p className="text-xs text-ink-muted">
                {isAr ? "رقم الفاتورة الأصلية" : "Original invoice"}
              </p>
              <p className="font-mono text-navy-900" dir="ltr">
                {actionRow?.receiptNumber}
              </p>
            </div>
            <div>
              <p className="text-xs text-ink-muted">
                {isAr ? "المبلغ" : "Amount"}
              </p>
              <p className="font-semibold" dir="ltr">
                {actionRow ? formatAED(actionRow.total, lang) : ""}
              </p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-primary mb-1.5">
              {isAr ? "سبب إعادة الإصدار" : "Reason for re-issue"}{" "}
              <span className="text-danger-600">*</span>
            </label>
            <textarea
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={
                isAr
                  ? "اشرح سبب إعادة إصدار الفاتورة (سيُسجّل في سجل التدقيق)"
                  : "Explain the correction (recorded in audit trail)"
              }
              className="w-full rounded-md border border-border-default p-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-800/20 focus:border-navy-800"
            />
          </div>
        </div>
      </Modal>

      {/* Credit note modal */}
      <Modal
        open={creditOpen}
        onClose={() => {
          setCreditOpen(false);
          setActionRow(null);
          setReason("");
          setCreditAmount("");
        }}
        title={isAr ? "إصدار إشعار دائن" : "Issue credit note"}
        description={
          isAr
            ? "سيتم إنشاء إشعار دائن مرتبط بالفاتورة الأصلية"
            : "A credit note linked to the original invoice will be created."
        }
        size="lg"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setCreditOpen(false);
                setActionRow(null);
                setReason("");
                setCreditAmount("");
              }}
            >
              {isAr ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              variant="primary"
              disabled={
                !creditAmount ||
                Number(creditAmount) <= 0 ||
                reason.trim().length < 10
              }
              onClick={() => {
                push({
                  title: isAr ? "تم إصدار الإشعار" : "Credit note issued",
                  description: isAr
                    ? "تم إنشاء إشعار دائن وربطه بالفاتورة الأصلية"
                    : "Credit note created and linked to original invoice.",
                  type: "success",
                });
                setCreditOpen(false);
                setActionRow(null);
                setReason("");
                setCreditAmount("");
              }}
            >
              {isAr ? "إصدار الإشعار" : "Issue credit note"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="bg-surface-50 rounded-md p-3 text-sm">
            <p className="text-xs text-ink-muted">
              {isAr ? "الفاتورة الأصلية" : "Original invoice"}
            </p>
            <p className="font-mono text-navy-900" dir="ltr">
              {actionRow?.receiptNumber} ·{" "}
              {actionRow ? formatAED(actionRow.total, lang) : ""}
            </p>
          </div>
          <Input
            label={isAr ? "مبلغ الإشعار الدائن (د.إ)" : "Credit amount (AED)"}
            type="number"
            value={creditAmount}
            onChange={(e) => setCreditAmount(e.target.value)}
            required
          />
          <div>
            <label className="block text-sm font-medium text-ink-primary mb-1.5">
              {isAr ? "السبب" : "Reason"}{" "}
              <span className="text-danger-600">*</span>
            </label>
            <textarea
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={
                isAr
                  ? "سبب إصدار الإشعار الدائن"
                  : "Reason for the credit note"
              }
              className="w-full rounded-md border border-border-default p-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-800/20 focus:border-navy-800"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Reconciliation;
