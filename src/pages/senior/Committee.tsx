import * as React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Trash2, Users, Vote as VoteIcon } from "lucide-react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Select,
  useToast,
} from "@/components/adveti";
import { Textarea } from "@/components/ui/textarea";
import { useLang } from "@/hooks/useLang";
import { useAuth } from "@/auth/AuthContext";
import {
  getApprovalItem,
  mockAssessors,
  mockCommittee,
  type CommitteeMember,
  type Vote,
} from "@/lib/mockSenior";
import { cn } from "@/lib/utils";

const voteLabel = (
  v: Vote,
  isAr: boolean,
): { text: string; tone: "success" | "warning" | "danger" | "neutral" } => {
  if (v === "Pass")
    return { text: isAr ? "اجتياز" : "Pass", tone: "success" };
  if (v === "Incomplete")
    return { text: isAr ? "ناقص" : "Incomplete", tone: "warning" };
  if (v === "Reject") return { text: isAr ? "رفض" : "Reject", tone: "danger" };
  return { text: isAr ? "بانتظار التصويت" : "Pending vote", tone: "neutral" };
};

const Committee: React.FC = () => {
  const { id = "APP-2026-00042" } = useParams();
  const { lang } = useLang();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { push } = useToast();
  const isAr = lang === "ar";
  const ChevronEnd = isAr ? ChevronLeft : ChevronRight;

  const item = getApprovalItem(id);
  const isChair =
    user?.role === "senior_assessor" || user?.role === "super_admin";

  const [members, setMembers] = React.useState<CommitteeMember[]>(mockCommittee);
  const [chairOverride, setChairOverride] = React.useState<Vote>(null);
  const [chairReason, setChairReason] = React.useState("");
  const [minutes, setMinutes] = React.useState("");
  const [addingId, setAddingId] = React.useState("");

  const tally = React.useMemo(() => {
    return {
      Pass: members.filter((m) => m.vote === "Pass").length,
      Incomplete: members.filter((m) => m.vote === "Incomplete").length,
      Reject: members.filter((m) => m.vote === "Reject").length,
      Pending: members.filter((m) => m.vote === null).length,
    };
  }, [members]);

  const allVoted = tally.Pending === 0 && members.length > 0;

  const majority: Vote = React.useMemo(() => {
    if (!allVoted) return null;
    const arr: { v: Vote; c: number }[] = [
      { v: "Pass", c: tally.Pass },
      { v: "Incomplete", c: tally.Incomplete },
      { v: "Reject", c: tally.Reject },
    ];
    arr.sort((a, b) => b.c - a.c);
    return arr[0].c > 0 ? arr[0].v : null;
  }, [allVoted, tally]);

  const updateVote = (memberId: string, vote: Vote, rationale?: string) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId
          ? {
              ...m,
              vote,
              rationale: rationale ?? m.rationale,
            }
          : m,
      ),
    );
  };

  const removeMember = (memberId: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
  };

  const addMember = () => {
    if (!addingId) return;
    const a = mockAssessors.find((x) => x.id === addingId);
    if (!a || members.some((m) => m.id === a.id)) return;
    setMembers((prev) => [
      ...prev,
      { id: a.id, nameEn: a.nameEn, nameAr: a.nameAr, vote: null, rationale: "" },
    ]);
    setAddingId("");
  };

  const finalize = () => {
    push({
      title: isAr
        ? "تم إنهاء قرار اللجنة"
        : "Committee decision finalised",
      type: "success",
    });
    navigate("/senior/queue");
  };

  const availableToAdd = mockAssessors.filter(
    (a) => !members.some((m) => m.id === a.id),
  );

  return (
    <div className="space-y-6">
      <nav
        className="flex items-center gap-2 text-sm text-ink-muted"
        aria-label="Breadcrumb"
      >
        <Link to="/senior/queue" className="hover:text-ink-primary">
          {isAr ? "قائمة الموافقات" : "Approval Queue"}
        </Link>
        <ChevronEnd size={14} />
        <Link
          to={`/senior/applications/${id}/approve`}
          className="hover:text-ink-primary"
        >
          {item.applicationId}
        </Link>
        <ChevronEnd size={14} />
        <span className="text-ink-primary font-medium">
          {isAr ? "مراجعة اللجنة" : "Committee Review"}
        </span>
      </nav>

      <header>
        <h1 className="text-2xl font-bold text-ink-primary flex items-center gap-2">
          <Users size={22} className="text-navy-800" />
          {isAr ? "وضع مراجعة اللجنة" : "Committee Review Mode"}
        </h1>
        <p className="text-sm text-ink-secondary mt-1">
          {isAr
            ? `حالة ${item.applicationId} — ${item.applicantNameAr}`
            : `Case ${item.applicationId} — ${item.applicantNameEn}`}
        </p>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Panel members */}
          <Card variant="bordered">
            <CardHeader>
              <CardTitle className="text-base">
                {isAr ? "أعضاء اللجنة" : "Panel Members"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {members.map((m) => {
                const vl = voteLabel(m.vote, isAr);
                return (
                  <div
                    key={m.id}
                    className="rounded-lg border border-border-default p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={isAr ? m.nameAr : m.nameEn} size="md" />
                        <div>
                          <p className="text-sm font-semibold text-ink-primary">
                            {isAr ? m.nameAr : m.nameEn}
                          </p>
                          <Badge variant={vl.tone === "neutral" ? "neutral" : vl.tone}>
                            {vl.text}
                          </Badge>
                        </div>
                      </div>
                      {isChair && (
                        <button
                          type="button"
                          onClick={() => removeMember(m.id)}
                          className="h-8 w-8 inline-flex items-center justify-center rounded-md text-ink-muted hover:text-danger-600 hover:bg-danger-100/40 focus-ring"
                          aria-label="Remove member"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(["Pass", "Incomplete", "Reject"] as const).map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => updateVote(m.id, v)}
                          className={cn(
                            "h-8 px-3 rounded-full text-xs font-semibold border transition-colors",
                            m.vote === v
                              ? v === "Pass"
                                ? "bg-success-600 text-ink-inverse border-success-600"
                                : v === "Incomplete"
                                ? "bg-warning-600 text-ink-inverse border-warning-600"
                                : "bg-danger-600 text-ink-inverse border-danger-600"
                              : "bg-surface-0 text-ink-secondary border-border-default hover:bg-surface-100",
                          )}
                        >
                          {voteLabel(v, isAr).text}
                        </button>
                      ))}
                    </div>
                    <Textarea
                      value={m.rationale}
                      onChange={(e) =>
                        updateVote(m.id, m.vote, e.target.value)
                      }
                      rows={2}
                      placeholder={
                        isAr
                          ? "مبررات التصويت (مطلوبة)…"
                          : "Vote rationale (required)…"
                      }
                    />
                  </div>
                );
              })}

              {isChair && availableToAdd.length > 0 && (
                <div className="flex items-end gap-3 pt-3 border-t border-border-default">
                  <div className="flex-1">
                    <Select
                      label={isAr ? "إضافة عضو" : "Add panel member"}
                      value={addingId}
                      onChange={(e) => setAddingId(e.target.value)}
                      placeholder={isAr ? "اختر مقيّماً" : "Select assessor"}
                      options={availableToAdd.map((a) => ({
                        value: a.id,
                        label: isAr ? a.nameAr : a.nameEn,
                      }))}
                    />
                  </div>
                  <Button onClick={addMember} disabled={!addingId}>
                    {isAr ? "إضافة" : "Add"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Committee minutes */}
          <Card variant="bordered">
            <CardHeader>
              <CardTitle className="text-base">
                {isAr ? "محضر اللجنة" : "Committee Minutes"}
              </CardTitle>
              <p className="text-xs text-ink-muted">
                {isAr
                  ? "يُحفظ المحضر في سجل التدقيق."
                  : "Minutes are saved to the audit trail."}
              </p>
            </CardHeader>
            <CardContent>
              <Textarea
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                rows={6}
                placeholder={
                  isAr
                    ? "ملاحظات الاجتماع، النقاط الرئيسية، التحفظات…"
                    : "Meeting notes, key points, dissenting opinions…"
                }
              />
            </CardContent>
          </Card>
        </div>

        {/* Tally + chair decision */}
        <div className="space-y-4">
          <Card variant="government">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <VoteIcon size={16} className="text-navy-700" />
                {isAr ? "نتائج التصويت" : "Vote Tally"}
              </CardTitle>
              <p className="text-xs text-ink-muted">
                {allVoted
                  ? isAr ? "اكتمل التصويت" : "All votes recorded"
                  : isAr
                  ? `${tally.Pending} عضو لم يصوّت بعد`
                  : `${tally.Pending} member(s) pending`}
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {(
                [
                  { v: "Pass", count: tally.Pass, tone: "success" },
                  { v: "Incomplete", count: tally.Incomplete, tone: "warning" },
                  { v: "Reject", count: tally.Reject, tone: "danger" },
                ] as const
              ).map((row) => (
                <div key={row.v} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ink-secondary">
                      {voteLabel(row.v, isAr).text}
                    </span>
                    <span className="font-semibold text-ink-primary">
                      {row.count}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-100 overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        row.tone === "success" && "bg-success-600",
                        row.tone === "warning" && "bg-warning-600",
                        row.tone === "danger" && "bg-danger-600",
                      )}
                      style={{
                        width: `${
                          members.length
                            ? (row.count / members.length) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {isChair && (
            <Card variant="bordered">
              <CardHeader>
                <CardTitle className="text-base">
                  {isAr ? "قرار رئيس اللجنة" : "Chair's Final Decision"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Select
                  label={
                    isAr
                      ? "اعتماد الأغلبية أو تعديل"
                      : "Adopt majority or override"
                  }
                  value={chairOverride ?? ""}
                  onChange={(e) =>
                    setChairOverride((e.target.value || null) as Vote)
                  }
                  options={[
                    {
                      value: "",
                      label:
                        majority && allVoted
                          ? isAr
                            ? `اعتماد الأغلبية (${voteLabel(majority, isAr).text})`
                            : `Adopt majority (${voteLabel(majority, isAr).text})`
                          : isAr
                          ? "اعتماد الأغلبية"
                          : "Adopt majority",
                    },
                    { value: "Pass", label: voteLabel("Pass", isAr).text },
                    {
                      value: "Incomplete",
                      label: voteLabel("Incomplete", isAr).text,
                    },
                    { value: "Reject", label: voteLabel("Reject", isAr).text },
                  ]}
                />
                {chairOverride && (
                  <Textarea
                    rows={3}
                    value={chairReason}
                    onChange={(e) => setChairReason(e.target.value)}
                    placeholder={
                      isAr
                        ? "سبب التعديل على رأي الأغلبية…"
                        : "Reason for overriding the majority…"
                    }
                  />
                )}
                <Button
                  variant="gold"
                  fullWidth
                  disabled={
                    !allVoted ||
                    minutes.trim().length < 20 ||
                    (chairOverride && chairReason.trim().length < 20)
                  }
                  onClick={finalize}
                >
                  {isAr ? "إنهاء قرار اللجنة" : "Finalise Committee Decision"}
                </Button>
                {!allVoted && (
                  <p className="text-xs text-warning-600">
                    {isAr
                      ? "لا يمكن الإنهاء حتى يصوّت جميع الأعضاء."
                      : "Cannot finalise until every member has voted."}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Committee;
