import * as React from "react";
import { Lock, Save, Users } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  Modal,
  useToast,
} from "@/components/adveti";
import { useLang } from "@/hooks/useLang";
import { useAuth } from "@/auth/AuthContext";
import {
  adminModules,
  initialPerms,
  roleDefs,
  type PermLevel,
  type PermMatrix,
  type RoleKey,
} from "@/lib/mockAdmin";
import { cn } from "@/lib/utils";

const PERM_LEVELS: PermLevel[] = ["None", "Read", "Write", "Approve", "Delete"];

const permLabel = (l: PermLevel, isAr: boolean) => {
  const map: Record<PermLevel, { en: string; ar: string }> = {
    None: { en: "None", ar: "لا شيء" },
    Read: { en: "Read", ar: "قراءة" },
    Write: { en: "Write", ar: "كتابة" },
    Approve: { en: "Approve", ar: "اعتماد" },
    Delete: { en: "Delete", ar: "حذف" },
  };
  return isAr ? map[l].ar : map[l].en;
};

const Roles: React.FC = () => {
  const { lang } = useLang();
  const { user } = useAuth();
  const { push } = useToast();
  const isAr = lang === "ar";
  const isSuper = user?.role === "super_admin";

  const [matrix, setMatrix] = React.useState<PermMatrix>(initialPerms);
  const [activeRole, setActiveRole] = React.useState<RoleKey>("Assessor");
  const [draft, setDraft] = React.useState<Record<string, PermLevel>>(
    initialPerms.Assessor,
  );
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  React.useEffect(() => {
    setDraft(matrix[activeRole]);
  }, [activeRole, matrix]);

  const role = roleDefs.find((r) => r.key === activeRole)!;
  const isImmutable = role.immutable;
  const canEdit = !isImmutable && (isSuper || activeRole !== "SystemAdmin");
  const dirty = JSON.stringify(draft) !== JSON.stringify(matrix[activeRole]);

  const handleSave = () => {
    setMatrix((m) => ({ ...m, [activeRole]: draft }));
    push({
      title: isAr ? "تم حفظ الصلاحيات" : "Permissions saved",
      description: `${role.en} · ${role.activeUserCount} ${isAr ? "مستخدم نشط" : "active users"}`,
      type: "success",
    });
    setConfirmOpen(false);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-ink-primary">
          {isAr ? "مدير الأدوار والصلاحيات" : "Role & Permission Manager"}
        </h1>
        <p className="text-sm text-ink-secondary mt-1">
          {isAr
            ? "تكوين الوحدات لكل دور · 11 دوراً"
            : "Configure modules per role · 11 roles"}
        </p>
      </header>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        {/* Role list */}
        <Card variant="bordered">
          <CardContent className="pt-5">
            <p className="text-xs uppercase tracking-wider text-ink-muted mb-3">
              {isAr ? "الأدوار" : "Roles"}
            </p>
            <ul className="space-y-1">
              {roleDefs.map((r) => {
                const active = activeRole === r.key;
                return (
                  <li key={r.key}>
                    <button
                      type="button"
                      onClick={() => setActiveRole(r.key)}
                      className={cn(
                        "w-full text-start rounded-md px-3 py-2 text-sm transition-colors flex items-center justify-between gap-2",
                        active
                          ? "bg-navy-900 text-ink-inverse"
                          : "hover:bg-surface-100 text-ink-primary",
                      )}
                    >
                      <span className="truncate">
                        {isAr ? r.ar : r.en}
                      </span>
                      {r.immutable && (
                        <Lock
                          size={12}
                          className={
                            active ? "text-gold-400" : "text-ink-muted"
                          }
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>

        {/* Permission grid */}
        <div className="space-y-4">
          <Card variant="bordered">
            <CardContent className="pt-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-ink-primary">
                    {isAr ? role.ar : role.en}
                  </h2>
                  <p className="text-sm text-ink-secondary mt-0.5">
                    {isAr ? role.descriptionAr : role.description}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="info">
                      <Users size={10} className="me-1" />
                      {role.activeUserCount}{" "}
                      {isAr ? "مستخدم نشط" : "active users"}
                    </Badge>
                    {isImmutable && (
                      <Badge variant="warning">
                        <Lock size={10} className="me-1" />
                        {isAr ? "غير قابل للتحرير" : "Immutable"}
                      </Badge>
                    )}
                    {!canEdit && !isImmutable && (
                      <Badge variant="warning">
                        {isAr
                          ? "يتطلب المسؤول الأعلى"
                          : "Super Admin required"}
                      </Badge>
                    )}
                  </div>
                </div>
                {canEdit && dirty && (
                  <Button
                    variant="primary"
                    iconStart={<Save size={14} />}
                    onClick={() => setConfirmOpen(true)}
                  >
                    {isAr ? "حفظ التغييرات" : "Save changes"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card variant="bordered">
            <CardContent className="pt-5 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border-default">
                  <tr>
                    <th className="text-start font-semibold text-xs uppercase tracking-wider text-ink-secondary py-2">
                      {isAr ? "الوحدة" : "Module"}
                    </th>
                    <th className="text-end font-semibold text-xs uppercase tracking-wider text-ink-secondary py-2">
                      {isAr ? "مستوى الصلاحية" : "Permission level"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {adminModules.map((m) => (
                    <tr
                      key={m.moduleKey}
                      className="border-b border-border-default last:border-0"
                    >
                      <td className="py-3 font-medium">
                        {isAr ? m.ar : m.en}
                      </td>
                      <td className="py-3 text-end">
                        <select
                          disabled={!canEdit}
                          value={draft[m.moduleKey]}
                          onChange={(e) =>
                            setDraft((d) => ({
                              ...d,
                              [m.moduleKey]: e.target.value as PermLevel,
                            }))
                          }
                          className={cn(
                            "rounded-md border border-border-default bg-surface-0 h-9 px-3 text-sm",
                            "focus:outline-none focus:ring-2 focus:ring-navy-800/20 focus:border-navy-800",
                            !canEdit &&
                              "opacity-60 cursor-not-allowed bg-surface-100",
                          )}
                        >
                          {PERM_LEVELS.map((p) => (
                            <option key={p} value={p}>
                              {permLabel(p, isAr)}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={
          isAr
            ? "تأكيد تغيير الصلاحيات"
            : "Confirm permission change"
        }
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
              {isAr ? "إلغاء" : "Cancel"}
            </Button>
            <Button variant="primary" onClick={handleSave}>
              {isAr ? "تأكيد الحفظ" : "Confirm save"}
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink-secondary">
          {isAr
            ? `سيؤثر هذا التغيير على ${role.activeUserCount} مستخدم نشط بدور ${role.ar}. سيُسجّل في سجل التدقيق.`
            : `This change will affect ${role.activeUserCount} active users with the ${role.en} role. The change will be recorded in the audit trail.`}
        </p>
      </Modal>
    </div>
  );
};

export default Roles;
