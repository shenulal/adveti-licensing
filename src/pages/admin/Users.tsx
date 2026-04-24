import * as React from "react";
import {
  KeyRound,
  Mail,
  Plus,
  RotateCw,
  Search,
  ShieldCheck,
  Trash2,
  UserMinus,
  UserPlus,
} from "lucide-react";
import {
  Avatar,
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
import { useAuth } from "@/auth/AuthContext";
import { formatDate } from "@/lib/format";
import {
  mockUsers,
  type AdminRole,
  type BackOfficeUser,
} from "@/lib/mockAdmin";
import { cn } from "@/lib/utils";

const roleLabels: Record<AdminRole, { en: string; ar: string }> = {
  Assessor: { en: "Assessor", ar: "مقيّم" },
  SeniorAssessor: { en: "Senior Assessor", ar: "كبير المقيّمين" },
  AppealsOfficer: { en: "Appeals Officer", ar: "مسؤول الاستئنافات" },
  FinanceOfficer: { en: "Finance Officer", ar: "مسؤول المالية" },
  ContentEditor: { en: "Content Editor", ar: "محرر المحتوى" },
  SystemAdmin: { en: "System Admin", ar: "مدير النظام" },
  SuperAdmin: { en: "Super Admin", ar: "المسؤول الأعلى" },
  Auditor: { en: "Auditor", ar: "مدقق" },
};

const Users: React.FC = () => {
  const { lang } = useLang();
  const { user } = useAuth();
  const { push } = useToast();
  const isAr = lang === "ar";
  const isSuper = user?.role === "super_admin";

  const [users, setUsers] = React.useState<BackOfficeUser[]>(mockUsers);
  const [roleFilter, setRoleFilter] = React.useState<"All" | AdminRole>("All");
  const [statusFilter, setStatusFilter] = React.useState<
    "All" | "Active" | "Inactive" | "Locked"
  >("All");
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<BackOfficeUser | null>(null);
  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [inviteEmail, setInviteEmail] = React.useState("");
  const [inviteRole, setInviteRole] = React.useState<AdminRole>("Assessor");
  const [deactivateOpen, setDeactivateOpen] = React.useState(false);
  const [deactivateReason, setDeactivateReason] = React.useState("");

  const filtered = React.useMemo(() => {
    return users.filter((u) => {
      if (roleFilter !== "All" && u.role !== roleFilter) return false;
      if (statusFilter !== "All" && u.status !== statusFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        if (
          !u.fullName.toLowerCase().includes(s) &&
          !u.email.toLowerCase().includes(s) &&
          !u.fullNameAr.includes(search)
        )
          return false;
      }
      return true;
    });
  }, [users, roleFilter, statusFilter, search]);

  const statusBadge = (s: BackOfficeUser["status"]) =>
    s === "Active" ? (
      <Badge variant="success">{isAr ? "نشط" : "Active"}</Badge>
    ) : s === "Inactive" ? (
      <Badge variant="neutral">{isAr ? "غير نشط" : "Inactive"}</Badge>
    ) : (
      <Badge variant="danger">{isAr ? "مغلق" : "Locked"}</Badge>
    );

  const handleInvite = () => {
    push({
      title: isAr ? "تم إرسال الدعوة" : "Invite sent",
      description: isAr
        ? `رابط مُوقّع صالح لمدة 72 ساعة أُرسل إلى ${inviteEmail}`
        : `Signed link valid for 72h sent to ${inviteEmail}`,
      type: "success",
    });
    setInviteOpen(false);
    setInviteEmail("");
    setInviteRole("Assessor");
  };

  const handleDeactivate = () => {
    if (!selected || deactivateReason.trim().length < 10) return;
    setUsers((us) =>
      us.map((u) =>
        u.id === selected.id ? { ...u, status: "Inactive" as const } : u,
      ),
    );
    push({
      title: isAr ? "تم تعطيل الحساب" : "Account deactivated",
      description: `${selected.fullName} → Inactive`,
      type: "warning",
    });
    setDeactivateOpen(false);
    setDeactivateReason("");
    setSelected(null);
  };

  const columns: Column<BackOfficeUser>[] = [
    {
      key: "fullName",
      header: isAr ? "الاسم" : "Name",
      render: (u) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={u.fullName} size="sm" />
          <div>
            <p className="font-medium text-sm text-ink-primary">
              {isAr ? u.fullNameAr : u.fullName}
            </p>
            <p className="text-[11px] text-ink-secondary" dir="ltr">
              {u.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: isAr ? "الدور" : "Role",
      render: (u) => (
        <Badge variant="info">
          {isAr ? roleLabels[u.role].ar : roleLabels[u.role].en}
        </Badge>
      ),
    },
    {
      key: "status",
      header: isAr ? "الحالة" : "Status",
      render: (u) => statusBadge(u.status),
    },
    {
      key: "lastLoginAt",
      header: isAr ? "آخر دخول" : "Last login",
      sortable: true,
      render: (u) =>
        u.lastLoginAt ? (
          <span className="text-xs text-ink-secondary">
            {formatDate(u.lastLoginAt, lang)}
          </span>
        ) : (
          <span className="text-xs text-ink-muted">
            {isAr ? "لم يدخل بعد" : "Never"}
          </span>
        ),
    },
    {
      key: "mfaEnabled",
      header: "MFA",
      align: "center",
      render: (u) =>
        u.mfaEnabled ? (
          <ShieldCheck size={16} className="text-success-600 inline" />
        ) : (
          <span className="text-danger-600 text-xs">
            {isAr ? "معطّل" : "Off"}
          </span>
        ),
    },
    {
      key: "_actions",
      header: "",
      align: "end",
      render: (u) => (
        <div className="flex justify-end gap-1.5">
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              setSelected(u);
            }}
          >
            {isAr ? "عرض" : "View"}
          </Button>
          {!u.mfaEnabled && (
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                push({
                  title: isAr ? "تم إرسال الدعوة" : "Invite resent",
                  description: u.email,
                  type: "success",
                });
              }}
            >
              {isAr ? "إعادة الدعوة" : "Resend invite"}
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-primary">
            {isAr ? "إدارة المستخدمين" : "User Management"}
          </h1>
          <p className="text-sm text-ink-secondary mt-1">
            {isAr
              ? "حسابات الموظفين الإداريين والمقيّمين والمدققين"
              : "Back-office staff, assessors and auditors"}
          </p>
        </div>
        <Button
          variant="primary"
          iconStart={<UserPlus size={16} />}
          onClick={() => setInviteOpen(true)}
        >
          {isAr ? "دعوة مستخدم" : "Invite user"}
        </Button>
      </header>

      <Card variant="bordered">
        <CardContent className="pt-5 grid gap-3 md:grid-cols-3">
          <Select
            label={isAr ? "الدور" : "Role"}
            value={roleFilter}
            onChange={(e) =>
              setRoleFilter(e.target.value as "All" | AdminRole)
            }
            options={[
              { value: "All", label: isAr ? "كل الأدوار" : "All roles" },
              ...(Object.keys(roleLabels) as AdminRole[]).map((r) => ({
                value: r,
                label: isAr ? roleLabels[r].ar : roleLabels[r].en,
              })),
            ]}
          />
          <Select
            label={isAr ? "الحالة" : "Status"}
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as typeof statusFilter)
            }
            options={[
              { value: "All", label: isAr ? "كل الحالات" : "All statuses" },
              { value: "Active", label: isAr ? "نشط" : "Active" },
              { value: "Inactive", label: isAr ? "غير نشط" : "Inactive" },
              { value: "Locked", label: isAr ? "مغلق" : "Locked" },
            ]}
          />
          <Input
            label={isAr ? "بحث" : "Search"}
            placeholder={isAr ? "اسم أو بريد إلكتروني" : "Name or email"}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            iconStart={<Search size={16} />}
          />
        </CardContent>
      </Card>

      <Table
        columns={columns}
        data={filtered}
        rowKey={(u) => u.id}
        onRowClick={(u) => setSelected(u)}
      />

      {/* Invite modal */}
      <Modal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title={isAr ? "دعوة مستخدم جديد" : "Invite new user"}
        description={
          isAr
            ? "سيُرسل رابط مُوقّع صالح لمدة 72 ساعة"
            : "A signed link valid for 72 hours will be sent"
        }
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setInviteOpen(false)}>
              {isAr ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              variant="primary"
              disabled={!inviteEmail.includes("@")}
              onClick={handleInvite}
              iconStart={<Mail size={16} />}
            >
              {isAr ? "إرسال الدعوة" : "Send invite"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label={isAr ? "البريد الإلكتروني" : "Email"}
            type="email"
            placeholder="user@adveti.ae"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            required
          />
          <Select
            label={isAr ? "الدور" : "Role"}
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value as AdminRole)}
            required
            options={(
              [
                "Assessor",
                "SeniorAssessor",
                "FinanceOfficer",
                "ContentEditor",
                "SystemAdmin",
                "Auditor",
              ] as AdminRole[]
            ).map((r) => ({
              value: r,
              label: isAr ? roleLabels[r].ar : roleLabels[r].en,
            }))}
          />
          <p className="text-xs text-ink-muted bg-info-100/40 rounded-md p-2.5">
            {isAr
              ? "ينتهي الرابط بعد 72 ساعة. يجب على المستخدم إعداد المصادقة الثنائية عند أول تسجيل دخول."
              : "Link expires in 72h. User must enable MFA on first sign-in."}
          </p>
        </div>
      </Modal>

      {/* Detail panel (slide-in drawer) */}
      {selected && (
        <>
          <div
            className="fixed inset-0 z-40 bg-navy-950/30"
            onClick={() => setSelected(null)}
          />
          <aside className="fixed end-0 top-0 z-50 h-full w-full max-w-md bg-surface-0 shadow-xl overflow-y-auto animate-slide-in-right">
            <div className="p-6 border-b border-border-default flex items-start gap-3">
              <Avatar name={selected.fullName} size="lg" />
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-ink-primary">
                  {isAr ? selected.fullNameAr : selected.fullName}
                </h2>
                <p className="text-xs text-ink-secondary truncate" dir="ltr">
                  {selected.email}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="info">
                    {isAr
                      ? roleLabels[selected.role].ar
                      : roleLabels[selected.role].en}
                  </Badge>
                  {statusBadge(selected.status)}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="text-ink-muted hover:text-ink-primary p-1"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-wider text-ink-muted">
                    {isAr ? "تاريخ الإنشاء" : "Created"}
                  </p>
                  <p className="font-medium">
                    {formatDate(selected.createdAt, lang)}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-ink-muted">
                    {isAr ? "آخر دخول" : "Last login"}
                  </p>
                  <p className="font-medium">
                    {selected.lastLoginAt
                      ? formatDate(selected.lastLoginAt, lang)
                      : isAr
                        ? "لم يدخل بعد"
                        : "Never"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-ink-muted">
                    MFA
                  </p>
                  <p className="font-medium">
                    {selected.mfaEnabled ? (
                      <span className="text-success-600">
                        {isAr ? "مفعّل" : "Enabled"}
                      </span>
                    ) : (
                      <span className="text-danger-600">
                        {isAr ? "معطّل" : "Disabled"}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-ink-muted mb-2">
                  {isAr ? "الجلسات النشطة" : "Active sessions"}
                </p>
                {selected.sessions.length === 0 ? (
                  <p className="text-sm text-ink-muted">
                    {isAr ? "لا توجد جلسات نشطة" : "No active sessions"}
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {selected.sessions.map((s, i) => (
                      <li
                        key={i}
                        className="rounded-md border border-border-default p-2.5 text-xs"
                      >
                        <div className="flex justify-between">
                          <span className="font-mono text-navy-900" dir="ltr">
                            {s.ip}
                          </span>
                          <span className="text-ink-muted">
                            {formatDate(s.lastActive, lang)}
                          </span>
                        </div>
                        <p className="text-ink-secondary mt-1">{s.device}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="space-y-2 pt-3 border-t border-border-default">
                <Button
                  variant="ghost"
                  fullWidth
                  iconStart={<RotateCw size={14} />}
                  onClick={() =>
                    push({
                      title: isAr ? "تم إعادة تعيين MFA" : "MFA reset",
                      description: selected.email,
                      type: "info",
                    })
                  }
                >
                  {isAr ? "إعادة تعيين MFA" : "Reset MFA"}
                </Button>
                <Button
                  variant="ghost"
                  fullWidth
                  iconStart={<UserMinus size={14} />}
                  className="text-danger-600 hover:bg-danger-100/40"
                  onClick={() => setDeactivateOpen(true)}
                >
                  {isAr ? "تعطيل الحساب" : "Deactivate account"}
                </Button>

                {isSuper && (
                  <div className="pt-3 border-t border-border-default space-y-2">
                    <p className="text-xs uppercase tracking-wider text-gold-600 font-semibold">
                      {isAr
                        ? "إجراءات المسؤول الأعلى"
                        : "Super Admin actions"}
                    </p>
                    <Button
                      variant="ghost"
                      fullWidth
                      iconStart={<KeyRound size={14} />}
                      onClick={() =>
                        push({
                          title: isAr
                            ? "إجراء يتطلب تأكيداً"
                            : "Confirmation required",
                          description: isAr
                            ? "تغيير الدور قسراً"
                            : "Force role change",
                          type: "warning",
                        })
                      }
                    >
                      {isAr ? "تغيير الدور قسراً" : "Force role change"}
                    </Button>
                    <Button
                      variant="ghost"
                      fullWidth
                      iconStart={<ShieldCheck size={14} />}
                      onClick={() =>
                        push({
                          title: isAr
                            ? "ترقية للمسؤول الأعلى"
                            : "Promote to Super Admin",
                          description: selected.email,
                          type: "warning",
                        })
                      }
                    >
                      {isAr ? "ترقية لمسؤول أعلى" : "Promote to Super Admin"}
                    </Button>
                    <Button
                      variant="ghost"
                      fullWidth
                      iconStart={<Trash2 size={14} />}
                      className="text-danger-600 hover:bg-danger-100/40"
                      onClick={() =>
                        push({
                          title: isAr
                            ? "حذف الحساب"
                            : "Delete account",
                          description: isAr
                            ? "إجراء لا يمكن التراجع عنه"
                            : "Irreversible action",
                          type: "error",
                        })
                      }
                    >
                      {isAr ? "حذف الحساب" : "Delete account"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </>
      )}

      {/* Deactivate confirmation modal */}
      <Modal
        open={deactivateOpen}
        onClose={() => {
          setDeactivateOpen(false);
          setDeactivateReason("");
        }}
        title={isAr ? "تأكيد تعطيل الحساب" : "Confirm deactivation"}
        size="md"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setDeactivateOpen(false);
                setDeactivateReason("");
              }}
            >
              {isAr ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              variant="danger"
              disabled={deactivateReason.trim().length < 10}
              onClick={handleDeactivate}
            >
              {isAr ? "تعطيل" : "Deactivate"}
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-ink-secondary">
            {isAr
              ? `سيتم تعطيل حساب ${selected?.fullNameAr ?? ""}. لن يتمكن من تسجيل الدخول. قد يُعاد تفعيله لاحقاً.`
              : `${selected?.fullName ?? ""}'s account will be deactivated. They will be unable to sign in. The account can be reactivated later.`}
          </p>
          <div>
            <label className="block text-sm font-medium text-ink-primary mb-1.5">
              {isAr ? "سبب التعطيل" : "Reason"}{" "}
              <span className="text-danger-600">*</span>
            </label>
            <textarea
              rows={3}
              value={deactivateReason}
              onChange={(e) => setDeactivateReason(e.target.value)}
              className={cn(
                "w-full rounded-md border border-border-default p-3 text-sm",
                "focus:outline-none focus:ring-2 focus:ring-navy-800/20 focus:border-navy-800",
              )}
              placeholder={
                isAr
                  ? "السبب المُسجّل في سجل التدقيق"
                  : "Recorded in audit trail"
              }
            />
          </div>
        </div>
      </Modal>

      {filtered.length === 0 && (
        <Card variant="bordered">
          <CardContent className="py-12 text-center text-ink-muted">
            {isAr ? "لا يوجد مستخدمون مطابقون" : "No matching users"}
          </CardContent>
        </Card>
      )}

      {/* Floating add button hidden indicator for accessibility */}
      <span className="sr-only">
        <Plus size={1} />
      </span>
    </div>
  );
};

export default Users;
