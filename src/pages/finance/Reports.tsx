import * as React from "react";
import { Download, Search } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  Input,
  Select,
  Table,
  useToast,
  type Column,
} from "@/components/adveti";
import { useLang } from "@/hooks/useLang";
import { formatAED, formatNumber } from "@/lib/format";
import {
  applicationsByStatus,
  mockReconciliation,
  reportMetrics,
  revenueByCategory,
  revenueByMonth,
  type Category,
  type ReconciliationRow,
} from "@/lib/mockFinance";
import { cn } from "@/lib/utils";

type Period = "Daily" | "Weekly" | "Monthly" | "Quarterly" | "Yearly";

const Reports: React.FC = () => {
  const { lang } = useLang();
  const { push } = useToast();
  const isAr = lang === "ar";

  const [tab, setTab] = React.useState<"summary" | "detailed">("summary");
  const [period, setPeriod] = React.useState<Period>("Monthly");
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState<"All" | Category>("All");

  const filtered = React.useMemo(() => {
    return mockReconciliation.filter((r) => {
      if (category !== "All" && r.category !== category) return false;
      if (search) {
        const s = search.toLowerCase();
        if (
          !r.applicationId.toLowerCase().includes(s) &&
          !r.applicantNameEn.toLowerCase().includes(s) &&
          !r.applicantNameAr.includes(search)
        )
          return false;
      }
      return true;
    });
  }, [category, search]);

  const handleExportXlsx = () => {
    // Mock XLSX export — in V1 this would call backend; for now produce CSV with .xlsx-like header
    const headers = [
      "Application ID",
      "Applicant",
      "Category",
      "Fee (AED)",
      "VAT (AED)",
      "Total (AED)",
      "Date",
    ];
    const rows = filtered.map((r) => [
      r.applicationId,
      r.applicantNameEn,
      r.category,
      r.feeAmount,
      r.vatAmount,
      r.total,
      r.date.toISOString().split("T")[0],
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${c}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `revenue-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    push({
      title: isAr ? "تم التصدير" : "Exported",
      description: isAr ? "تم تنزيل التقرير" : "Report downloaded",
      type: "success",
    });
  };

  const maxBar = Math.max(...revenueByCategory.map((r) => r.revenue));
  const maxLine = Math.max(...revenueByMonth.map((r) => r.value));
  const totalDonut = applicationsByStatus.reduce((s, a) => s + a.count, 0);

  // Build conic-gradient for donut
  const donutSegments = (() => {
    let acc = 0;
    const colorMap: Record<string, string> = {
      success: "hsl(var(--success-600))",
      danger: "hsl(var(--danger-600))",
      warning: "hsl(var(--warning-600))",
    };
    const stops = applicationsByStatus.map((a) => {
      const start = (acc / totalDonut) * 100;
      acc += a.count;
      const end = (acc / totalDonut) * 100;
      return `${colorMap[a.color]} ${start}% ${end}%`;
    });
    return `conic-gradient(${stops.join(", ")})`;
  })();

  const detailColumns: Column<ReconciliationRow>[] = [
    {
      key: "applicationId",
      header: isAr ? "رقم الطلب" : "App. ID",
      render: (r) => (
        <span className="font-mono text-xs" dir="ltr">
          {r.applicationId}
        </span>
      ),
    },
    {
      key: "applicantNameEn",
      header: isAr ? "المتقدم" : "Applicant",
      render: (r) => (isAr ? r.applicantNameAr : r.applicantNameEn),
    },
    {
      key: "category",
      header: isAr ? "الفئة" : "Category",
    },
    {
      key: "feeAmount",
      header: isAr ? "الرسوم" : "Fee",
      align: "end",
      render: (r) => (
        <span dir="ltr">{formatAED(r.feeAmount, lang)}</span>
      ),
    },
    {
      key: "vatAmount",
      header: isAr ? "ضريبة" : "VAT",
      align: "end",
      render: (r) => (
        <span dir="ltr" className="text-ink-secondary text-xs">
          {formatAED(r.vatAmount, lang)}
        </span>
      ),
    },
    {
      key: "total",
      header: isAr ? "الإجمالي" : "Total",
      align: "end",
      render: (r) => (
        <span dir="ltr" className="font-medium">
          {formatAED(r.total, lang)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-primary">
            {isAr ? "تقارير الإيرادات" : "Revenue Reports"}
          </h1>
          <p className="text-sm text-ink-secondary mt-1">
            {isAr
              ? "تحليل الأداء المالي حسب الفترة والفئة"
              : "Financial performance by period and category"}
          </p>
        </div>
        {tab === "detailed" && (
          <Button
            variant="secondary"
            iconStart={<Download size={16} />}
            onClick={handleExportXlsx}
          >
            {isAr ? "تصدير إلى XLSX" : "Export to XLSX"}
          </Button>
        )}
      </header>

      <div className="border-b border-border-default flex gap-6">
        {(
          [
            { k: "summary", en: "Summary", ar: "ملخص" },
            { k: "detailed", en: "Detailed", ar: "تفصيلي" },
          ] as const
        ).map((t) => (
          <button
            key={t.k}
            type="button"
            onClick={() => setTab(t.k)}
            className={cn(
              "h-10 px-1 text-sm font-semibold border-b-2 -mb-[1px] transition-colors",
              tab === t.k
                ? "border-navy-800 text-navy-900"
                : "border-transparent text-ink-secondary hover:text-ink-primary",
            )}
          >
            {isAr ? t.ar : t.en}
          </button>
        ))}
      </div>

      {tab === "summary" ? (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-ink-secondary">
              {isAr ? "الفترة:" : "Period:"}
            </span>
            <div className="flex flex-wrap gap-2">
              {(["Daily", "Weekly", "Monthly", "Quarterly", "Yearly"] as Period[]).map(
                (p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPeriod(p)}
                    className={cn(
                      "h-8 px-3 rounded-full text-xs font-semibold transition-colors",
                      period === p
                        ? "bg-navy-900 text-ink-inverse"
                        : "bg-surface-100 text-ink-secondary hover:bg-surface-200",
                    )}
                  >
                    {isAr
                      ? p === "Daily"
                        ? "يومي"
                        : p === "Weekly"
                          ? "أسبوعي"
                          : p === "Monthly"
                            ? "شهري"
                            : p === "Quarterly"
                              ? "ربع سنوي"
                              : "سنوي"
                      : p}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Key metrics */}
          <div className="grid gap-4 md:grid-cols-4">
            {[
              {
                en: "Total Revenue",
                ar: "إجمالي الإيرادات",
                v: reportMetrics.totalRevenue,
                tone: "navy",
              },
              {
                en: "Average Fee",
                ar: "متوسط الرسوم",
                v: reportMetrics.averageFee,
                tone: "default",
              },
              {
                en: "Refunded",
                ar: "المسترد",
                v: reportMetrics.refundedAmount,
                tone: "warning",
              },
              {
                en: "Net Revenue",
                ar: "صافي الإيرادات",
                v: reportMetrics.netRevenue,
                tone: "success",
              },
            ].map((m) => (
              <Card key={m.en} variant="bordered">
                <CardContent className="pt-5">
                  <p className="text-xs uppercase tracking-wider text-ink-muted">
                    {isAr ? m.ar : m.en}
                  </p>
                  <p
                    className={cn(
                      "mt-2 text-2xl font-bold",
                      m.tone === "navy" && "text-navy-900",
                      m.tone === "warning" && "text-warning-600",
                      m.tone === "success" && "text-success-600",
                      m.tone === "default" && "text-ink-primary",
                    )}
                    dir="ltr"
                  >
                    {formatAED(m.v, lang)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Revenue by category */}
            <Card variant="bordered">
              <CardContent className="pt-5">
                <h2 className="text-base font-semibold text-ink-primary">
                  {isAr ? "الإيرادات حسب الفئة" : "Revenue by category"}
                </h2>
                <div className="mt-5 space-y-4">
                  {revenueByCategory.map((r) => (
                    <div key={r.category}>
                      <div className="flex items-center justify-between text-sm mb-1.5">
                        <span className="font-medium">
                          {isAr
                            ? r.category === "Teacher"
                              ? "معلم"
                              : r.category === "Counsellor"
                                ? "مرشد"
                                : "مدرب"
                            : r.category}
                        </span>
                        <span dir="ltr" className="font-semibold text-navy-900">
                          {formatAED(r.revenue, lang)}
                        </span>
                      </div>
                      <div className="h-3 bg-surface-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-navy-800 rounded-full transition-all"
                          style={{ width: `${(r.revenue / maxBar) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-ink-muted mt-1">
                        {isAr
                          ? `${formatNumber(r.count, lang)} طلب`
                          : `${formatNumber(r.count, lang)} applications`}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Donut chart */}
            <Card variant="bordered">
              <CardContent className="pt-5">
                <h2 className="text-base font-semibold text-ink-primary">
                  {isAr ? "الطلبات حسب الحالة" : "Applications by status"}
                </h2>
                <div className="mt-5 flex flex-col sm:flex-row items-center gap-6">
                  <div
                    className="relative h-40 w-40 rounded-full"
                    style={{ background: donutSegments }}
                  >
                    <div className="absolute inset-6 bg-surface-0 rounded-full flex flex-col items-center justify-center">
                      <span className="text-xl font-bold text-navy-900">
                        {formatNumber(totalDonut, lang)}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-ink-muted">
                        {isAr ? "إجمالي" : "Total"}
                      </span>
                    </div>
                  </div>
                  <ul className="space-y-2 flex-1">
                    {applicationsByStatus.map((a) => {
                      const colorClass =
                        a.color === "success"
                          ? "bg-success-600"
                          : a.color === "danger"
                            ? "bg-danger-600"
                            : "bg-warning-600";
                      const label =
                        a.status === "Approved"
                          ? isAr
                            ? "موافق"
                            : "Approved"
                          : a.status === "Rejected"
                            ? isAr
                              ? "مرفوض"
                              : "Rejected"
                            : isAr
                              ? "قيد المعالجة"
                              : "In progress";
                      return (
                        <li
                          key={a.status}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="flex items-center gap-2">
                            <span
                              className={cn("h-3 w-3 rounded-sm", colorClass)}
                            />
                            {label}
                          </span>
                          <span className="font-medium">
                            {formatNumber(a.count, lang)}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue by month line chart */}
          <Card variant="bordered">
            <CardContent className="pt-5">
              <h2 className="text-base font-semibold text-ink-primary">
                {isAr ? "الإيرادات الشهرية" : "Revenue by month (12 months)"}
              </h2>
              <div className="mt-6 relative h-56">
                <svg
                  viewBox="0 0 600 200"
                  className="w-full h-full overflow-visible"
                  preserveAspectRatio="none"
                >
                  {/* gridlines */}
                  {[0, 1, 2, 3, 4].map((i) => (
                    <line
                      key={i}
                      x1="0"
                      x2="600"
                      y1={40 * i + 10}
                      y2={40 * i + 10}
                      stroke="hsl(var(--border-default))"
                      strokeDasharray="3 3"
                    />
                  ))}
                  {/* line path */}
                  <polyline
                    fill="none"
                    stroke="hsl(var(--gold-500))"
                    strokeWidth="2.5"
                    points={revenueByMonth
                      .map((r, i) => {
                        const x = (i / (revenueByMonth.length - 1)) * 600;
                        const y = 200 - (r.value / maxLine) * 180;
                        return `${x},${y}`;
                      })
                      .join(" ")}
                  />
                  {revenueByMonth.map((r, i) => {
                    const x = (i / (revenueByMonth.length - 1)) * 600;
                    const y = 200 - (r.value / maxLine) * 180;
                    return (
                      <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r={3}
                        fill="hsl(var(--gold-500))"
                      />
                    );
                  })}
                </svg>
              </div>
              <div className="grid grid-cols-12 gap-1 mt-2 text-[10px] text-ink-muted text-center">
                {revenueByMonth.map((m) => (
                  <span key={m.month}>{isAr ? m.monthAr : m.month}</span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-4">
          <Card variant="bordered">
            <CardContent className="pt-5">
              <div className="grid gap-3 md:grid-cols-3">
                <Input
                  label={isAr ? "بحث" : "Search"}
                  placeholder={
                    isAr ? "رقم الطلب أو المتقدم" : "App ID or applicant"
                  }
                  iconStart={<Search size={16} />}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Select
                  label={isAr ? "الفئة" : "Category"}
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as "All" | Category)
                  }
                  options={[
                    { value: "All", label: isAr ? "كل الفئات" : "All" },
                    { value: "Teacher", label: isAr ? "معلم" : "Teacher" },
                    {
                      value: "Counsellor",
                      label: isAr ? "مرشد" : "Counsellor",
                    },
                    { value: "Trainer", label: isAr ? "مدرب" : "Trainer" },
                  ]}
                />
                <div className="flex items-end">
                  <Badge variant="info" className="h-10 px-4">
                    {isAr
                      ? `${formatNumber(filtered.length, lang)} سجل`
                      : `${formatNumber(filtered.length, lang)} records`}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          <Table
            columns={detailColumns}
            data={filtered}
            rowKey={(r) => r.receiptNumber}
          />
        </div>
      )}
    </div>
  );
};

export default Reports;
