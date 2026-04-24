import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Inbox, Search, Users } from "lucide-react";
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
import {
  mockApprovalQueue,
  type ApprovalQueueItem,
  type Recommendation,
} from "@/lib/mockSenior";
import { cn } from "@/lib/utils";

const SLA_TOTAL_HOURS = 120;

const slaElapsed = (item: ApprovalQueueItem) => {
  const remainingHrs =
    (item.slaDeadline.getTime() - Date.now()) / (1000 * 60 * 60);
  return Math.max(0, SLA_TOTAL_HOURS - Math.max(0, remainingHrs));
};

const slaLabel = (item: ApprovalQueueItem, isAr: boolean) => {
  const remainingMs = item.slaDeadline.getTime() - Date.now();
  if (remainingMs <= 0) return isAr ? "متأخر" : "OVERDUE";
  const days = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));
  if (days <= 1) return isAr ? "يوم واحد متبقٍ" : "1 day left";
  return isAr ? `${days} أيام متبقية` : `${days} days left`;
};

const slaTone = (item: ApprovalQueueItem): "success" | "warning" | "danger" => {
  const hrs = (item.slaDeadline.getTime() - Date.now()) / 36e5;
  if (hrs < 0) return "danger";
  if (hrs < 24) return "warning";
  return "success";
};

const recBadge = (
  rec: Recommendation,
  isAr: boolean,
): React.ReactNode => {
  const map: Record<
    Recommendation,
    { variant: "success" | "warning" | "danger"; en: string; ar: string }
  > = {
    Pass: { variant: "success", en: "Pass", ar: "اجتياز" },
    Incomplete: {
      variant: "warning",
      en: "Incomplete",
      ar: "ناقص",
    },
    Reject: { variant: "danger", en: "Reject", ar: "رفض" },
  };
  const m = map[rec];
  return <Badge variant={m.variant}>{isAr ? m.ar : m.en}</Badge>;
};

type RecFilter = "All" | Recommendation;
type CategoryFilter = "All" | "Teacher" | "Counsellor" | "Trainer";
type CommitteeFilter = "All" | "Yes" | "No";

const ApprovalQueue: React.FC = () => {
  const { lang } = useLang();
  const navigate = useNavigate();
  const isAr = lang === "ar";

  const [rec, setRec] = React.useState<RecFilter>("All");
  const [category, setCategory] = React.useState<CategoryFilter>("All");
  const [committee, setCommittee] = React.useState<CommitteeFilter>("All");
  const [search, setSearch] = React.useState("");

  const filtered = React.useMemo(() => {
    return mockApprovalQueue.filter((q) => {
      if (rec !== "All" && q.recommendation !== rec) return false;
      if (category !== "All" && q.category !== category) return false;
      if (committee === "Yes" && !q.committeeFlag) return false;
      if (committee === "No" && q.committeeFlag) return false;
      if (search) {
        const s = search.toLowerCase();
        if (
          !q.applicationId.toLowerCase().includes(s) &&
          !q.applicantNameEn.toLowerCase().includes(s) &&
          !q.applicantNameAr.includes(search) &&
          !q.assessorName.toLowerCase().includes(s)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [rec, category, committee, search]);

  const recTabs: { key: RecFilter; en: string; ar: string }[] = [
    { key: "All", en: "All", ar: "الكل" },
    { key: "Pass", en: "Pass", ar: "اجتياز" },
    { key: "Incomplete", en: "Incomplete", ar: "ناقص" },
    { key: "Reject", en: "Reject", ar: "رفض" },
  ];

  const counts = React.useMemo(
    () => ({
      All: mockApprovalQueue.length,
      Pass: mockApprovalQueue.filter((q) => q.recommendation === "Pass").length,
      Incomplete: mockApprovalQueue.filter(
        (q) => q.recommendation === "Incomplete",
      ).length,
      Reject: mockApprovalQueue.filter((q) => q.recommendation === "Reject")
        .length,
    }),
    [],
  );

  const columns: Column<ApprovalQueueItem>[] = [
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
        <div className="font-medium text-ink-primary">
          {isAr ? r.applicantNameAr : r.applicantNameEn}
        </div>
      ),
    },
    {
      key: "category",
      header: isAr ? "الفئة" : "Category",
      sortable: true,
    },
    {
      key: "assessorName",
      header: isAr ? "المقيّم" : "Assessor",
      sortable: true,
      render: (r) => (
        <span className="text-ink-secondary text-sm">{r.assessorName}</span>
      ),
    },
    {
      key: "recommendation",
      header: isAr ? "التوصية" : "Recommendation",
      render: (r) => recBadge(r.recommendation, isAr),
    },
    {
      key: "submittedAt",
      header: isAr ? "تاريخ التقديم" : "Submitted",
      sortable: true,
      render: (r) => (
        <span className="text-ink-secondary text-xs">
          {formatDate(r.submittedAt, lang)}
        </span>
      ),
    },
    {
      key: "slaDeadline",
      header: "SLA",
      render: (r) => (
        <div className="flex items-center gap-2">
          <SLAClock
            elapsedHours={slaElapsed(r)}
            totalHours={SLA_TOTAL_HOURS}
            size={36}
          />
          <Badge variant={slaTone(r)}>{slaLabel(r, isAr)}</Badge>
        </div>
      ),
    },
    {
      key: "committeeFlag",
      header: isAr ? "لجنة" : "Committee",
      align: "center",
      render: (r) =>
        r.committeeFlag ? (
          <Badge variant="gold">
            <Users size={10} className="me-1" />
            {isAr ? "مُصعّد" : "Escalated"}
          </Badge>
        ) : (
          <span className="text-ink-muted text-xs">—</span>
        ),
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
            navigate(`/senior/applications/${r.applicationId}/approve`);
          }}
        >
          {isAr ? "مراجعة وقرار" : "Review & Decide"}
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-ink-primary">
          {isAr ? "قائمة الموافقات" : "Approval Queue"}
        </h1>
        <p className="text-sm text-ink-secondary mt-1">
          {isAr
            ? "قرارات المقيمين بانتظار موافقة كبير المقيمين"
            : "Assessor decisions awaiting senior approval"}
        </p>
      </header>

      <Card variant="bordered">
        <CardContent className="pt-5 space-y-4">
          <div className="flex flex-wrap gap-2">
            {recTabs.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setRec(t.key)}
                className={cn(
                  "h-8 px-3 rounded-full text-xs font-semibold transition-colors inline-flex items-center gap-2",
                  rec === t.key
                    ? "bg-navy-900 text-ink-inverse"
                    : "bg-surface-100 text-ink-secondary hover:bg-surface-200",
                )}
              >
                {isAr ? t.ar : t.en}
                <span
                  className={cn(
                    "inline-flex h-5 min-w-5 px-1 items-center justify-center rounded-full text-[10px]",
                    rec === t.key
                      ? "bg-gold-500 text-navy-900"
                      : "bg-surface-0",
                  )}
                >
                  {counts[t.key]}
                </span>
              </button>
            ))}
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <Select
              label={isAr ? "الفئة" : "Category"}
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as CategoryFilter)
              }
              options={[
                { value: "All", label: isAr ? "كل الفئات" : "All categories" },
                { value: "Teacher", label: isAr ? "معلم" : "Teacher" },
                { value: "Counsellor", label: isAr ? "مرشد" : "Counsellor" },
                { value: "Trainer", label: isAr ? "مدرب" : "Trainer" },
              ]}
            />
            <Select
              label={isAr ? "علامة اللجنة" : "Committee flag"}
              value={committee}
              onChange={(e) =>
                setCommittee(e.target.value as CommitteeFilter)
              }
              options={[
                { value: "All", label: isAr ? "الكل" : "All" },
                { value: "Yes", label: isAr ? "مُصعّد للجنة" : "Escalated only" },
                { value: "No", label: isAr ? "غير مُصعّد" : "Not escalated" },
              ]}
            />
            <Input
              label={isAr ? "بحث" : "Search"}
              placeholder={
                isAr
                  ? "اسم المتقدم أو المقيّم أو رقم الطلب"
                  : "Applicant, assessor or application ID"
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
                ? "لا توجد قرارات بانتظار الموافقة"
                : "No decisions awaiting approval"}
            </h2>
          </CardContent>
        </Card>
      ) : (
        <Table
          columns={columns}
          data={filtered}
          rowKey={(r) => r.applicationId}
          onRowClick={(r) =>
            navigate(`/senior/applications/${r.applicationId}/approve`)
          }
        />
      )}
    </div>
  );
};

export default ApprovalQueue;
