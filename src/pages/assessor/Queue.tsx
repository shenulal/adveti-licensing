import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Inbox, Search } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  Input,
  SLAClock,
  Select,
  Table,
  type Column,
} from "@/components/adveti";
import { useLang } from "@/hooks/useLang";
import { formatDate } from "@/lib/format";
import { mockQueue, type QueueItem, type SlaStatus } from "@/lib/mockAssessor";
import { cn } from "@/lib/utils";

type StatusFilter = "All" | "Submitted" | "UnderReview" | "PendingApplicant";
type CategoryFilter = "All" | "Teacher" | "Counsellor" | "Trainer";
type SlaFilter = "All" | "DueToday" | "Overdue" | "OnTrack";
type AssignedFilter = "Mine" | "All";

const SLA_TOTAL_HOURS = 120; // 5 business days

const slaElapsed = (item: QueueItem) => {
  const total = SLA_TOTAL_HOURS;
  const remainingMs = item.slaDeadline.getTime() - Date.now();
  const remainingHrs = remainingMs / (1000 * 60 * 60);
  return Math.max(0, total - Math.max(0, remainingHrs));
};

const slaLabel = (item: QueueItem, isAr: boolean) => {
  const remainingMs = item.slaDeadline.getTime() - Date.now();
  if (remainingMs <= 0) return isAr ? "متأخر" : "OVERDUE";
  const days = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));
  if (days <= 1) return isAr ? "يوم واحد متبقٍ" : "1 day left";
  return isAr ? `${days} أيام متبقية` : `${days} days left`;
};

const slaTone = (s: SlaStatus): "success" | "warning" | "danger" => {
  if (s === "Overdue") return "danger";
  if (s === "Amber") return "warning";
  return "success";
};

const AssessorQueue: React.FC = () => {
  const { lang } = useLang();
  const navigate = useNavigate();
  const isAr = lang === "ar";

  const [status, setStatus] = React.useState<StatusFilter>("All");
  const [category, setCategory] = React.useState<CategoryFilter>("All");
  const [sla, setSla] = React.useState<SlaFilter>("All");
  const [search, setSearch] = React.useState("");
  const [assigned, setAssigned] = React.useState<AssignedFilter>("Mine");

  const filtered = React.useMemo(() => {
    return mockQueue.filter((q) => {
      if (assigned === "Mine" && !q.assignedToMe) return false;
      if (status !== "All" && q.status !== status) return false;
      if (category !== "All" && q.category !== category) return false;
      if (sla === "Overdue" && q.slaStatus !== "Overdue") return false;
      if (sla === "OnTrack" && q.slaStatus !== "OnTrack") return false;
      if (sla === "DueToday") {
        const hrs = (q.slaDeadline.getTime() - Date.now()) / 36e5;
        if (hrs < 0 || hrs > 24) return false;
      }
      if (search) {
        const s = search.toLowerCase();
        if (
          !q.applicationId.toLowerCase().includes(s) &&
          !q.applicantNameEn.toLowerCase().includes(s) &&
          !q.applicantNameAr.includes(search)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [assigned, status, category, sla, search]);

  const counts = React.useMemo(() => {
    const base = mockQueue.filter((q) => assigned === "All" || q.assignedToMe);
    return {
      All: base.length,
      Submitted: base.filter((q) => q.status === "Submitted").length,
      UnderReview: base.filter((q) => q.status === "UnderReview").length,
      PendingApplicant: base.filter((q) => q.status === "PendingApplicant").length,
    };
  }, [assigned]);

  const statusTabs: { key: StatusFilter; en: string; ar: string }[] = [
    { key: "All", en: "All", ar: "الكل" },
    { key: "Submitted", en: "Submitted", ar: "مُرسل" },
    { key: "UnderReview", en: "Under Review", ar: "قيد المراجعة" },
    { key: "PendingApplicant", en: "Pending Applicant", ar: "بانتظار المتقدم" },
  ];

  const columns: Column<QueueItem>[] = [
    {
      key: "applicationId",
      header: isAr ? "رقم الطلب" : "App. ID",
      sortable: true,
      render: (r) => (
        <span className="font-mono text-xs text-navy-900" dir="ltr">
          {r.applicationId}
        </span>
      ),
    },
    {
      key: "applicantNameEn",
      header: isAr ? "اسم المتقدم" : "Applicant",
      sortable: true,
      render: (r) => (
        <div className="leading-tight">
          <div className="font-medium text-ink-primary">
            {isAr ? r.applicantNameAr : r.applicantNameEn}
          </div>
          <div className="text-xs text-ink-muted font-mono" dir="ltr">
            {r.emiratesIdMasked}
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: isAr ? "الفئة" : "Category",
      sortable: true,
      render: (r) => {
        const map = {
          Teacher: { en: "Teacher", ar: "معلم" },
          Counsellor: { en: "Counsellor", ar: "مرشد" },
          Trainer: { en: "Trainer", ar: "مدرب" },
        };
        return (
          <span className="text-ink-secondary">
            {isAr ? map[r.category].ar : map[r.category].en}
          </span>
        );
      },
    },
    {
      key: "submittedAt",
      header: isAr ? "تاريخ الإرسال" : "Submitted",
      sortable: true,
      render: (r) => (
        <span className="text-ink-secondary text-xs">
          {formatDate(r.submittedAt, lang)}
        </span>
      ),
    },
    {
      key: "slaStatus",
      header: isAr ? "حالة SLA" : "SLA Status",
      render: (r) => (
        <div className="flex items-center gap-3">
          <SLAClock
            elapsedHours={slaElapsed(r)}
            totalHours={SLA_TOTAL_HOURS}
            size={44}
          />
          <Badge variant={slaTone(r.slaStatus)}>
            {slaLabel(r, isAr)}
          </Badge>
        </div>
      ),
    },
    {
      key: "status",
      header: isAr ? "الحالة" : "Status",
      render: (r) => <Badge status={r.status} />,
    },
    {
      key: "_action",
      header: "",
      align: "end",
      render: (r) => (
        <Button
          size="sm"
          variant="primary"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/assessor/applications/${r.applicationId}`);
          }}
        >
          {isAr ? "مراجعة" : "Review"}
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink-primary">
            {isAr ? "قائمة المراجعة" : "Review Queue"}
          </h1>
          <p className="text-sm text-ink-secondary mt-1">
            {isAr
              ? "الطلبات المخصصة لك وفي انتظار المراجعة"
              : "Applications assigned to you, ordered by SLA priority"}
          </p>
        </div>
        <div className="inline-flex rounded-lg ring-1 ring-border-default bg-surface-0 p-1 text-xs">
          {(["Mine", "All"] as AssignedFilter[]).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setAssigned(opt)}
              className={cn(
                "px-3 h-7 rounded-md font-medium transition-colors",
                assigned === opt
                  ? "bg-navy-900 text-ink-inverse"
                  : "text-ink-secondary hover:text-ink-primary",
              )}
            >
              {opt === "Mine"
                ? isAr ? "المخصصة لي" : "Assigned to me"
                : isAr ? "الكل" : "All assessors"}
            </button>
          ))}
        </div>
      </header>

      <Card variant="bordered">
        <CardContent className="pt-5 space-y-4">
          {/* Status pill tabs */}
          <div className="flex flex-wrap gap-2">
            {statusTabs.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setStatus(t.key)}
                className={cn(
                  "h-8 px-3 rounded-full text-xs font-semibold transition-colors inline-flex items-center gap-2",
                  status === t.key
                    ? "bg-navy-900 text-ink-inverse"
                    : "bg-surface-100 text-ink-secondary hover:bg-surface-200",
                )}
              >
                {isAr ? t.ar : t.en}
                <span
                  className={cn(
                    "inline-flex h-5 min-w-5 px-1 items-center justify-center rounded-full text-[10px]",
                    status === t.key ? "bg-gold-500 text-navy-900" : "bg-surface-0",
                  )}
                >
                  {counts[t.key]}
                </span>
              </button>
            ))}
          </div>

          {/* Filters row */}
          <div className="grid gap-3 md:grid-cols-3">
            <Select
              label={isAr ? "الفئة" : "Category"}
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryFilter)}
            >
              <option value="All">{isAr ? "كل الفئات" : "All categories"}</option>
              <option value="Teacher">{isAr ? "معلم" : "Teacher"}</option>
              <option value="Counsellor">{isAr ? "مرشد" : "Counsellor"}</option>
              <option value="Trainer">{isAr ? "مدرب" : "Trainer"}</option>
            </Select>
            <Select
              label="SLA"
              value={sla}
              onChange={(e) => setSla(e.target.value as SlaFilter)}
            >
              <option value="All">{isAr ? "الكل" : "All"}</option>
              <option value="DueToday">{isAr ? "مستحق اليوم" : "Due today"}</option>
              <option value="Overdue">{isAr ? "متأخر" : "Overdue"}</option>
              <option value="OnTrack">{isAr ? "في الموعد" : "On track"}</option>
            </Select>
            <Input
              label={isAr ? "بحث" : "Search"}
              placeholder={
                isAr
                  ? "اسم المتقدم أو رقم الطلب"
                  : "Applicant name or application ID"
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              iconStart={<Search size={16} />}
            />
          </div>
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
                ? "لا توجد طلبات في قائمتك حالياً"
                : "No applications in your queue right now"}
            </h2>
            <p className="text-sm text-ink-secondary max-w-sm">
              {isAr
                ? "ستظهر الطلبات الجديدة هنا فور تخصيصها لك."
                : "New applications will appear here as soon as they are assigned to you."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Table
          columns={columns}
          data={filtered}
          rowKey={(r) => r.applicationId}
          onRowClick={(r) =>
            navigate(`/assessor/applications/${r.applicationId}`)
          }
        />
      )}
    </div>
  );
};

export default AssessorQueue;
