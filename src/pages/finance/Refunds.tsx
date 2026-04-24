import * as React from "react";
import { CheckCircle2, Inbox, Search, ShieldCheck, XCircle } from "lucide-react";
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
import { formatAED, formatDate } from "@/lib/format";
import {
  mockRefunds,
  refundReasonCodes,
  type RefundRequest,
  type RefundStatus,
} from "@/lib/mockFinance";
import { cn } from "@/lib/utils";

const statusBadge = (s: RefundStatus, isAr: boolean) => {
  const map: Record<
    RefundStatus,
    { v: "neutral" | "info" | "success" | "warning" | "danger" | "gold"; en: string; ar: string }
  > = {
    PendingFinance: {
      v: "warning",
      en: "Pending Finance Review",
      ar: "بانتظار مراجعة المالية",
    },
    FinanceApproved: {
      v: "info",
      en: "Awaiting Final Approval",
      ar: "بانتظار الموافقة النهائية",
    },
    FullyApproved: {
      v: "success",
      en: "Fully Approved",
      ar: "تمت الموافقة بالكامل",
    },
    Rejected: { v: "danger", en: "Rejected", ar: "مرفوض" },
    Processed: { v: "success", en: "Processed", ar: "تمت المعالجة" },
  };
  const m = map[s];
  return <Badge variant={m.v}>{isAr ? m.ar : m.en}</Badge>;
};

type StatusFilter = "All" | RefundStatus;

const Refunds: React.FC = () => {
  const { lang } = useLang();
  const { push } = useToast();
  const isAr = lang === "ar";

  const [rows, setRows] = React.useState<RefundRequest[]>(mockRefunds);
  const [status, setStatus] = React.useState<StatusFilter>("All");
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<RefundRequest | null>(null);
  const [notes, setNotes] = React.useState("");
  const [reasonCode, setReasonCode] = React.useState("");
  const [actionMode, setActionMode] = React.useState<
    "view" | "approve" | "reject"
  >("view");

  const filtered = React.useMemo(() => {
    return rows.filter((r) => {
      if (status !== "All" && r.status !== status) return false;
      if (search) {
        const s = search.toLowerCase();
        if (
          !r.applicationId.toLowerCase().includes(s) &&
          !r.id.toLowerCase().includes(s) &&
          !r.applicantNameEn.toLowerCase().includes(s) &&
          !r.applicantNameAr.includes(search)
        )
          return false;
      }
      return true;
    });
  }, [rows, status, search]);

  const counts = React.useMemo(
    () => ({
      All: rows.length,
      Pending: rows.filter((r) => r.status === "PendingFinance").length,
      Awaiting: rows.filter((r) => r.status === "FinanceApproved").length,
      Done: rows.filter((r) => r.status === "FullyApproved" || r.status === "Processed")
        .length,
    }),
    [rows],
  );

  const closeModal = () => {
    setSelected(null);
    setNotes("");
    setReasonCode("");
    setActionMode("view");
  };

  const handleApprove = () => {
    if (!selected || notes.trim().length < 10) return;
    setRows((rs) =>
      rs.map((r) =>
        r.id === selected.id
          ? {
              ...r,
              status: "FinanceApproved" as RefundStatus,
              financeOfficerNotes: notes,
              audit: [
                ...r.audit,
                { at: new Date(), by: "Finance Officer", action: "Approved (first stage)" },
              ],
            }
          : r,
      ),
    );
    push({
      title: isAr ? "تمت الموافقة" : "Refund approved",
      description: isAr
        ? "تم إرساله إلى المسؤول الأعلى للموافقة النهائية"
        : "Forwarded to Super Admin for final approval.",
      type: "success",
    });
    closeModal();
  };

  const handleReject = () => {
    if (!selected || notes.trim().length < 10 || !reasonCode) return;
    setRows((rs) =>
      rs.map((r) =>
        r.id === selected.id
          ? {
              ...r,
              status: "Rejected" as RefundStatus,
              financeOfficerNotes: `[${reasonCode}] ${notes}`,
              audit: [
                ...r.audit,
                {
                  at: new Date(),
                  by: "Finance Officer",
                  action: `Rejected — ${reasonCode}`,
                },
              ],
            }
          : r,
      ),
    );
    push({
      title: isAr ? "تم الرفض" : "Refund rejected",
      description: isAr
        ? "تم إخطار مقدم الطلب"
        : "Applicant has been notified.",
      type: "warning",
    });
    closeModal();
  };

  const columns: Column<RefundRequest>[] = [
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
        <span className="text-sm font-medium">
          {isAr ? r.applicantNameAr : r.applicantNameEn}
        </span>
      ),
    },
    {
      key: "refundAmount",
      header: isAr ? "مبلغ الاسترداد" : "Refund amount",
      align: "end",
      render: (r) => (
        <span className="font-medium" dir="ltr">
          {formatAED(r.refundAmount, lang)}
        </span>
      ),
    },
    {
      key: "reason",
      header: isAr ? "السبب" : "Reason",
      render: (r) => (
        <span className="text-xs text-ink-secondary line-clamp-2 max-w-[280px]">
          {isAr ? r.reasonAr : r.reason}
        </span>
      ),
    },
    {
      key: "requestedAt",
      header: isAr ? "تاريخ الطلب" : "Requested",
      sortable: true,
      render: (r) => (
        <span className="text-xs text-ink-secondary">
          {formatDate(r.requestedAt, lang)}
        </span>
      ),
    },
    {
      key: "status",
      header: isAr ? "الحالة" : "Status",
      render: (r) => statusBadge(r.status, isAr),
    },
    {
      key: "_action",
      header: "",
      align: "end",
      render: (r) => (
        <div className="flex justify-end gap-1.5">
          {r.status === "PendingFinance" ? (
            <>
              <Button
                size="sm"
                variant="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected(r);
                  setActionMode("approve");
                }}
                iconStart={<CheckCircle2 size={14} />}
              >
                {isAr ? "موافقة" : "Approve"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected(r);
                  setActionMode("reject");
                }}
                className="text-danger-600 hover:bg-danger-100/40"
                iconStart={<XCircle size={14} />}
              >
                {isAr ? "رفض" : "Reject"}
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                setSelected(r);
                setActionMode("view");
              }}
            >
              {isAr ? "عرض" : "View"}
            </Button>
          )}
        </div>
      ),
    },
  ];

  const tabs: { k: StatusFilter; en: string; ar: string; count: number }[] = [
    { k: "All", en: "All", ar: "الكل", count: counts.All },
    {
      k: "PendingFinance",
      en: "Pending Finance",
      ar: "بانتظار المالية",
      count: counts.Pending,
    },
    {
      k: "FinanceApproved",
      en: "Awaiting Final",
      ar: "بانتظار النهائية",
      count: counts.Awaiting,
    },
    {
      k: "FullyApproved",
      en: "Approved / Processed",
      ar: "موافق / مُعالج",
      count: counts.Done,
    },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-primary">
            {isAr ? "قائمة طلبات الاسترداد" : "Refund Approval Queue"}
          </h1>
          <p className="text-sm text-ink-secondary mt-1">
            {isAr
              ? "موافقة من مرحلتين — يبدأها مسؤول المالية ويعتمدها المسؤول الأعلى"
              : "Dual-approval gate — initiated by Finance Officer, finalised by Super Admin"}
          </p>
        </div>
        <Badge variant="info">
          <ShieldCheck size={12} className="me-1" />
          {isAr ? "أنت: مسؤول المالية" : "You: Finance Officer"}
        </Badge>
      </header>

      <Card variant="bordered">
        <CardContent className="pt-5 space-y-4">
          <div className="flex flex-wrap gap-2">
            {tabs.map((t) => (
              <button
                key={t.k}
                type="button"
                onClick={() => setStatus(t.k)}
                className={cn(
                  "h-8 px-3 rounded-full text-xs font-semibold transition-colors inline-flex items-center gap-2",
                  status === t.k
                    ? "bg-navy-900 text-ink-inverse"
                    : "bg-surface-100 text-ink-secondary hover:bg-surface-200",
                )}
              >
                {isAr ? t.ar : t.en}
                <span
                  className={cn(
                    "inline-flex h-5 min-w-5 px-1 items-center justify-center rounded-full text-[10px]",
                    status === t.k
                      ? "bg-gold-500 text-navy-900"
                      : "bg-surface-0",
                  )}
                >
                  {t.count}
                </span>
              </button>
            ))}
          </div>
          <Input
            placeholder={
              isAr
                ? "بحث برقم الطلب أو المتقدم"
                : "Search by application ID or applicant"
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            iconStart={<Search size={16} />}
          />
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <Card variant="bordered">
          <CardContent className="py-16 flex flex-col items-center text-center gap-3">
            <div className="h-16 w-16 rounded-full bg-surface-100 inline-flex items-center justify-center">
              <Inbox size={28} className="text-ink-muted" />
            </div>
            <h2 className="text-lg font-semibold text-ink-primary">
              {isAr
                ? "لا توجد طلبات استرداد"
                : "No refund requests in this view"}
            </h2>
          </CardContent>
        </Card>
      ) : (
        <Table
          columns={columns}
          data={filtered}
          rowKey={(r) => r.id}
          onRowClick={(r) => {
            setSelected(r);
            setActionMode("view");
          }}
        />
      )}

      <Modal
        open={!!selected}
        onClose={closeModal}
        title={
          actionMode === "approve"
            ? isAr
              ? "اعتماد الاسترداد (المرحلة الأولى)"
              : "Approve refund (first stage)"
            : actionMode === "reject"
              ? isAr
                ? "رفض طلب الاسترداد"
                : "Reject refund request"
              : isAr
                ? "تفاصيل طلب الاسترداد"
                : "Refund request details"
        }
        description={selected?.id}
        size="xl"
        footer={
          actionMode === "approve" ? (
            <>
              <Button variant="ghost" onClick={closeModal}>
                {isAr ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                variant="primary"
                disabled={notes.trim().length < 10}
                onClick={handleApprove}
              >
                {isAr ? "اعتماد وإحالة" : "Approve & forward"}
              </Button>
            </>
          ) : actionMode === "reject" ? (
            <>
              <Button variant="ghost" onClick={closeModal}>
                {isAr ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                variant="danger"
                disabled={notes.trim().length < 10 || !reasonCode}
                onClick={handleReject}
              >
                {isAr ? "تأكيد الرفض" : "Confirm rejection"}
              </Button>
            </>
          ) : (
            <Button variant="secondary" onClick={closeModal}>
              {isAr ? "إغلاق" : "Close"}
            </Button>
          )
        }
      >
        {selected && (
          <div className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-surface-50 rounded-md p-3 space-y-2">
                <p className="text-xs uppercase tracking-wider text-ink-muted">
                  {isAr ? "تفاصيل الدفع الأصلي" : "Original payment"}
                </p>
                <div className="flex justify-between text-sm">
                  <span className="text-ink-secondary">
                    {isAr ? "المبلغ الأصلي" : "Original amount"}
                  </span>
                  <span className="font-medium" dir="ltr">
                    {formatAED(selected.originalAmount, lang)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ink-secondary">
                    {isAr ? "حالة الطلب وقت الاسترداد" : "Status at request"}
                  </span>
                  <span className="font-medium">
                    {selected.applicationStatusAtRequest}
                  </span>
                </div>
              </div>
              <div className="bg-info-100/40 rounded-md p-3 space-y-2">
                <p className="text-xs uppercase tracking-wider text-ink-muted">
                  {isAr ? "حساب الاسترداد" : "Refund calculation"}
                </p>
                <div className="flex justify-between text-sm">
                  <span className="text-ink-secondary">
                    {isAr ? "مبلغ الاسترداد" : "Refund amount"}
                  </span>
                  <span className="font-bold text-success-600" dir="ltr">
                    {formatAED(selected.refundAmount, lang)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ink-secondary">
                    {isAr ? "تعديل ضريبة القيمة المضافة" : "VAT adjustment"}
                  </span>
                  <span className="font-medium" dir="ltr">
                    {formatAED(selected.vatAdjustment, lang)}
                  </span>
                </div>
                <p className="text-[11px] text-ink-muted pt-1 border-t border-info-600/20">
                  {isAr
                    ? "سيتم تعديل ضريبة القيمة المضافة في إقرار الربع التالي"
                    : "VAT will be adjusted in next quarter's return."}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-ink-muted mb-1.5">
                {isAr ? "سبب طلب المتقدم" : "Applicant's request reason"}
              </p>
              <p className="text-sm text-ink-primary bg-surface-50 rounded-md p-3">
                {isAr ? selected.reasonAr : selected.reason}
              </p>
            </div>

            {(actionMode === "approve" || actionMode === "reject") && (
              <>
                {actionMode === "reject" && (
                  <Select
                    label={isAr ? "رمز سبب الرفض" : "Rejection reason code"}
                    value={reasonCode}
                    onChange={(e) => setReasonCode(e.target.value)}
                    required
                    placeholder={isAr ? "اختر سبباً" : "Select reason"}
                    options={refundReasonCodes.map((c) => ({
                      value: c.code,
                      label: isAr ? c.ar : c.en,
                    }))}
                  />
                )}
                <div>
                  <label className="block text-sm font-medium text-ink-primary mb-1.5">
                    {isAr
                      ? "ملاحظات مسؤول المالية"
                      : "Finance Officer notes"}{" "}
                    <span className="text-danger-600">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={
                      isAr
                        ? "اشرح المنطق وراء قرارك (سيُسجّل في سجل التدقيق)"
                        : "Explain your decision (recorded in audit trail)"
                    }
                    className="w-full rounded-md border border-border-default p-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-800/20 focus:border-navy-800"
                  />
                  <p className="text-xs text-ink-muted mt-1">
                    {notes.trim().length}/10{" "}
                    {isAr ? "حروف كحد أدنى" : "characters minimum"}
                  </p>
                </div>
              </>
            )}

            {actionMode === "view" && selected.financeOfficerNotes && (
              <div>
                <p className="text-xs uppercase tracking-wider text-ink-muted mb-1.5">
                  {isAr ? "ملاحظات المالية" : "Finance notes"}
                </p>
                <p className="text-sm bg-surface-50 rounded-md p-3">
                  {selected.financeOfficerNotes}
                </p>
              </div>
            )}
            {actionMode === "view" && selected.superAdminNotes && (
              <div>
                <p className="text-xs uppercase tracking-wider text-ink-muted mb-1.5">
                  {isAr ? "ملاحظات المسؤول الأعلى" : "Super Admin notes"}
                </p>
                <p className="text-sm bg-surface-50 rounded-md p-3">
                  {selected.superAdminNotes}
                </p>
              </div>
            )}

            <div>
              <p className="text-xs uppercase tracking-wider text-ink-muted mb-2">
                {isAr ? "سجل التدقيق" : "Audit trail"}
              </p>
              <ol className="relative ms-4 border-s border-border-default space-y-3">
                {selected.audit.map((a, i) => (
                  <li key={i} className="ps-4 relative">
                    <span className="absolute -start-[5px] top-1.5 h-2 w-2 rounded-full bg-navy-800" />
                    <p className="text-sm font-medium text-ink-primary">
                      {a.action}
                    </p>
                    <p className="text-xs text-ink-secondary">
                      {a.by} · {formatDate(a.at, lang)}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Refunds;
