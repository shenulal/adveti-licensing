import * as React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, UserCog } from "lucide-react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Modal,
  Select,
  useToast,
} from "@/components/adveti";
import { useLang } from "@/hooks/useLang";
import {
  getApprovalItem,
  mockAssessors,
  reassignmentReasons,
} from "@/lib/mockSenior";

const Reassign: React.FC = () => {
  const { id = "APP-2026-00042" } = useParams();
  const { lang } = useLang();
  const navigate = useNavigate();
  const { push } = useToast();
  const isAr = lang === "ar";
  const ChevronEnd = isAr ? ChevronLeft : ChevronRight;

  const item = getApprovalItem(id);
  const current = mockAssessors.find((a) => a.id === item.assessorId);
  const others = mockAssessors.filter((a) => a.id !== item.assessorId);

  const [newAssesseeId, setNewAssesseeId] = React.useState("");
  const [reason, setReason] = React.useState("");
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const newAssignee = mockAssessors.find((a) => a.id === newAssesseeId);

  const handleConfirm = () => {
    setConfirmOpen(false);
    push({
      title: isAr
        ? `تم نقل الحالة إلى ${newAssignee?.nameAr}`
        : `Case reassigned to ${newAssignee?.nameEn}`,
      type: "success",
    });
    navigate("/senior/queue");
  };

  return (
    <div className="space-y-6 max-w-3xl">
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
          {isAr ? "إعادة تخصيص" : "Reassign"}
        </span>
      </nav>

      <header>
        <h1 className="text-2xl font-bold text-ink-primary flex items-center gap-2">
          <UserCog size={22} className="text-navy-800" />
          {isAr ? "إعادة تخصيص الحالة" : "Reassign Case"}
        </h1>
        <p className="text-sm text-ink-secondary mt-1">
          {item.applicationId} — {isAr ? item.applicantNameAr : item.applicantNameEn}
        </p>
      </header>

      <Card variant="bordered">
        <CardHeader>
          <CardTitle className="text-base">
            {isAr ? "المقيّم الحالي" : "Current Assignee"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {current ? (
            <div className="flex items-center gap-3 p-3 rounded-md bg-surface-50">
              <Avatar name={isAr ? current.nameAr : current.nameEn} />
              <div>
                <p className="font-semibold text-ink-primary">
                  {isAr ? current.nameAr : current.nameEn}
                </p>
                <p className="text-xs text-ink-secondary">{current.email}</p>
              </div>
              <Badge variant="neutral" className="ms-auto">
                {current.activeQueue}{" "}
                {isAr ? "حالات نشطة" : "active cases"}
              </Badge>
            </div>
          ) : (
            <p className="text-sm text-ink-muted">
              {isAr ? "غير مخصص" : "Unassigned"}
            </p>
          )}
        </CardContent>
      </Card>

      <Card variant="bordered">
        <CardHeader>
          <CardTitle className="text-base">
            {isAr ? "إعادة التخصيص إلى" : "Reassign to"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select
            label={isAr ? "اختر مقيّماً" : "Select assessor"}
            required
            value={newAssesseeId}
            onChange={(e) => setNewAssesseeId(e.target.value)}
            placeholder={isAr ? "— اختر —" : "— Select —"}
            options={others.map((a) => ({
              value: a.id,
              label: `${isAr ? a.nameAr : a.nameEn} (${a.activeQueue} ${
                isAr ? "نشط" : "active"
              })`,
            }))}
            helperText={
              isAr
                ? "العدد بين الأقواس هو حجم القائمة الحالية للمقيّم."
                : "The number in parentheses is the assessor's current queue size."
            }
          />

          <Select
            label={isAr ? "سبب إعادة التخصيص" : "Reassignment reason"}
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={isAr ? "اختر سبباً" : "Select a reason"}
            options={reassignmentReasons.map((r) => ({
              value: r.value,
              label: isAr ? r.ar : r.en,
            }))}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={() => navigate(`/senior/applications/${id}/approve`)}
            >
              {isAr ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              disabled={!newAssesseeId || !reason}
              onClick={() => setConfirmOpen(true)}
            >
              {isAr ? "إعادة تخصيص" : "Reassign"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={isAr ? "تأكيد إعادة التخصيص" : "Confirm Reassignment"}
        description={
          isAr
            ? `سيتم نقل ${item.applicationId} إلى ${newAssignee?.nameAr}. سيُسجَّل في سجل التدقيق.`
            : `${item.applicationId} will be moved to ${newAssignee?.nameEn}. This action is recorded in the audit log.`
        }
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
              {isAr ? "إلغاء" : "Cancel"}
            </Button>
            <Button onClick={handleConfirm}>
              {isAr ? "تأكيد" : "Confirm"}
            </Button>
          </>
        }
      />
    </div>
  );
};

export default Reassign;
