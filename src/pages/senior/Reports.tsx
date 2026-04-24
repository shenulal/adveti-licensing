import * as React from "react";
import { BarChart3, Clock, TrendingUp } from "lucide-react";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  type Column,
} from "@/components/adveti";
import { useLang } from "@/hooks/useLang";
import { mockAssessors, type AssessorProfile } from "@/lib/mockSenior";
import { cn } from "@/lib/utils";

const Reports: React.FC = () => {
  const { lang } = useLang();
  const isAr = lang === "ar";

  const totalReviewedThisWeek = mockAssessors.reduce(
    (s, a) => s + a.reviewedThisWeek,
    0,
  );
  const totalReviewedLastWeek = mockAssessors.reduce(
    (s, a) => s + a.reviewedLastWeek,
    0,
  );
  const trendPct = Math.round(
    ((totalReviewedThisWeek - totalReviewedLastWeek) /
      Math.max(totalReviewedLastWeek, 1)) *
      100,
  );

  const avgReviewHours = Math.round(
    mockAssessors.reduce((s, a) => s + a.avgReviewHours, 0) /
      mockAssessors.length,
  );

  // Donut: aggregate ratios across assessors
  const totalReviews = mockAssessors.reduce(
    (s, a) => s + a.reviewedThisWeek,
    0,
  );
  const passCount = Math.round(
    mockAssessors.reduce(
      (s, a) => s + a.reviewedThisWeek * a.passRate,
      0,
    ),
  );
  const incompleteCount = Math.round(totalReviews * 0.18);
  const rejectCount = totalReviews - passCount - incompleteCount;

  const donut = [
    {
      label: isAr ? "اجتياز" : "Pass",
      value: passCount,
      color: "hsl(var(--success-600))",
    },
    {
      label: isAr ? "ناقص" : "Incomplete",
      value: incompleteCount,
      color: "hsl(var(--warning-600))",
    },
    {
      label: isAr ? "رفض" : "Reject",
      value: rejectCount,
      color: "hsl(var(--danger-600))",
    },
  ];
  const donutTotal = donut.reduce((s, d) => s + d.value, 0);

  // Build conic-gradient string
  let acc = 0;
  const gradientStops = donut
    .map((d) => {
      const start = (acc / donutTotal) * 100;
      acc += d.value;
      const end = (acc / donutTotal) * 100;
      return `${d.color} ${start}% ${end}%`;
    })
    .join(", ");

  // Simple sparkline data: last 6 weeks (mock)
  const trend = [9, 11, 10, 13, totalReviewedLastWeek, totalReviewedThisWeek];
  const trendMax = Math.max(...trend);

  const breachColumns: Column<AssessorProfile>[] = [
    {
      key: "nameEn",
      header: isAr ? "المقيّم" : "Assessor",
      render: (a) => (
        <span className="font-medium text-ink-primary">
          {isAr ? a.nameAr : a.nameEn}
        </span>
      ),
    },
    {
      key: "categories",
      header: isAr ? "الفئات" : "Categories",
      render: (a) => (
        <span className="text-xs text-ink-secondary">
          {a.categories.join(", ")}
        </span>
      ),
    },
    {
      key: "avgReviewHours",
      header: isAr ? "متوسط ساعات المراجعة" : "Avg review (hrs)",
      align: "end",
      sortable: true,
    },
    {
      key: "slaBreaches",
      header: isAr ? "خروقات SLA" : "SLA breaches",
      align: "end",
      sortable: true,
      render: (a) => (
        <Badge
          variant={
            a.slaBreaches === 0
              ? "success"
              : a.slaBreaches < 3
              ? "warning"
              : "danger"
          }
        >
          {a.slaBreaches}
        </Badge>
      ),
    },
    {
      key: "reviewedThisWeek",
      header: isAr ? "هذا الأسبوع" : "This week",
      align: "end",
      sortable: true,
    },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-ink-primary flex items-center gap-2">
          <BarChart3 size={22} className="text-navy-800" />
          {isAr ? "أداء المقيّمين" : "Assessor Performance"}
        </h1>
        <p className="text-sm text-ink-secondary mt-1">
          {isAr
            ? "ملخص الشهر الحالي عبر فريق المقيّمين."
            : "Current month summary across the assessor team."}
        </p>
      </header>

      {/* Summary stat cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card variant="bordered">
          <CardContent className="pt-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-muted">
                  {isAr ? "متوسط زمن المراجعة" : "Avg review time"}
                </p>
                <p className="text-3xl font-bold text-navy-900 mt-1">
                  {avgReviewHours}
                  <span className="text-base font-normal text-ink-muted ms-1">
                    {isAr ? "ساعة" : "hrs"}
                  </span>
                </p>
              </div>
              <Clock size={20} className="text-navy-700" />
            </div>
            <p className="text-xs text-ink-secondary mt-2">
              {isAr ? "هذا الشهر" : "This month"}
            </p>
          </CardContent>
        </Card>

        <Card variant="bordered">
          <CardContent className="pt-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-muted">
                  {isAr ? "المراجعات هذا الأسبوع" : "Reviewed this week"}
                </p>
                <p className="text-3xl font-bold text-navy-900 mt-1">
                  {totalReviewedThisWeek}
                </p>
              </div>
              <TrendingUp size={20} className="text-success-600" />
            </div>
            <p
              className={cn(
                "text-xs mt-2 flex items-center gap-1",
                trendPct >= 0 ? "text-success-600" : "text-danger-600",
              )}
            >
              {trendPct >= 0 ? "▲" : "▼"} {Math.abs(trendPct)}%{" "}
              {isAr ? "مقابل الأسبوع الماضي" : "vs last week"}
            </p>
          </CardContent>
        </Card>

        <Card variant="bordered">
          <CardContent className="pt-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-muted">
                  {isAr ? "إجمالي خروقات SLA" : "Total SLA breaches"}
                </p>
                <p className="text-3xl font-bold text-danger-600 mt-1">
                  {mockAssessors.reduce((s, a) => s + a.slaBreaches, 0)}
                </p>
              </div>
              <Badge variant="danger">{isAr ? "تحذير" : "Watch"}</Badge>
            </div>
            <p className="text-xs text-ink-secondary mt-2">
              {isAr ? "الشهر الحالي" : "Current month"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        {/* Donut */}
        <Card variant="bordered" className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">
              {isAr
                ? "نسبة الاجتياز / الناقص / الرفض"
                : "Pass / Incomplete / Reject Ratio"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div
                className="h-36 w-36 rounded-full relative shrink-0"
                style={{
                  background: `conic-gradient(${gradientStops})`,
                }}
                role="img"
                aria-label="Decision ratio donut chart"
              >
                <div className="absolute inset-3 rounded-full bg-surface-0 flex flex-col items-center justify-center">
                  <p className="text-xl font-bold text-navy-900">
                    {donutTotal}
                  </p>
                  <p className="text-[10px] text-ink-muted">
                    {isAr ? "مراجعات" : "reviews"}
                  </p>
                </div>
              </div>
              <ul className="space-y-2 text-sm flex-1">
                {donut.map((d) => (
                  <li key={d.label} className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-sm"
                      style={{ backgroundColor: d.color }}
                    />
                    <span className="text-ink-secondary">{d.label}</span>
                    <span className="ms-auto font-semibold text-ink-primary">
                      {d.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Trend line (sparkline-ish) */}
        <Card variant="bordered" className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base">
              {isAr ? "اتجاه المراجعات الأسبوعي" : "Weekly Review Trend"}
            </CardTitle>
            <p className="text-xs text-ink-muted">
              {isAr ? "آخر 6 أسابيع" : "Last 6 weeks"}
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3 h-40">
              {trend.map((v, i) => {
                const isLast = i === trend.length - 1;
                const pct = (v / trendMax) * 100;
                return (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-2"
                  >
                    <div className="w-full flex-1 flex items-end">
                      <div
                        className={cn(
                          "w-full rounded-t-md transition-all",
                          isLast ? "bg-gold-500" : "bg-navy-800",
                        )}
                        style={{ height: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-ink-muted">
                      {isAr ? `${i + 1}أ` : `W${i + 1}`}
                    </span>
                    <span className="text-xs font-semibold text-ink-primary">
                      {v}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Breach table */}
      <Card variant="bordered">
        <CardHeader>
          <CardTitle className="text-base">
            {isAr
              ? "خروقات SLA حسب المقيّم"
              : "SLA Breaches by Assessor"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table
            columns={breachColumns}
            data={mockAssessors}
            rowKey={(a) => a.id}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
