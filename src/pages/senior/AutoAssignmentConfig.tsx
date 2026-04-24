import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Settings2 } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/adveti";
import { useLang } from "@/hooks/useLang";
import { useAuth } from "@/auth/AuthContext";
import { isAdminRole } from "@/auth/roleRoutes";
import { mockAssessors } from "@/lib/mockSenior";
import { cn } from "@/lib/utils";

const AutoAssignmentConfig: React.FC = () => {
  const { lang } = useLang();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAr = lang === "ar";
  const canEditRules = isAdminRole(user?.role ?? "guest");

  const maxLoad = Math.max(...mockAssessors.map((a) => a.activeQueue));
  const method = "Load-Balanced";

  const methodLabel = {
    "Round Robin": { en: "Round Robin", ar: "تناوب" },
    "Load-Balanced": { en: "Load-Balanced", ar: "موازنة الحمل" },
    "Category-Matched": { en: "Category-Matched", ar: "مطابقة الفئة" },
  } as const;

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-ink-primary flex items-center gap-2">
            <Settings2 size={22} className="text-navy-800" />
            {isAr ? "قواعد التخصيص التلقائي" : "Auto-Assignment Rules"}
          </h1>
          <p className="text-sm text-ink-secondary mt-1 inline-flex items-center gap-2">
            <Lock size={12} />
            {isAr
              ? "عرض للقراءة فقط — التحرير يقتصر على مدير النظام."
              : "Read-only view — editing restricted to System Admin."}
          </p>
        </div>
        {canEditRules && (
          <Button
            variant="secondary"
            onClick={() => navigate("/admin/config")}
          >
            {isAr ? "تحرير القواعد" : "Edit assignment rules"}
          </Button>
        )}
      </header>

      <div className="grid lg:grid-cols-3 gap-4">
        {(["Round Robin", "Load-Balanced", "Category-Matched"] as const).map(
          (m) => {
            const active = m === method;
            return (
              <Card
                key={m}
                variant={active ? "government" : "bordered"}
                className={cn(active && "ring-2 ring-navy-800")}
              >
                <CardContent className="pt-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-ink-primary">
                      {isAr ? methodLabel[m].ar : methodLabel[m].en}
                    </p>
                    {active && (
                      <Badge variant="success">
                        {isAr ? "مفعّل" : "Active"}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-ink-secondary leading-relaxed">
                    {m === "Round Robin" &&
                      (isAr
                        ? "يوزّع كل طلب جديد على المقيّم التالي بالترتيب."
                        : "Distributes each new application to the next assessor in turn.")}
                    {m === "Load-Balanced" &&
                      (isAr
                        ? "يخصص الطلبات للمقيّم الأقل عبئاً ضمن نفس الفئة."
                        : "Routes applications to the assessor with the lightest queue in the matching category.")}
                    {m === "Category-Matched" &&
                      (isAr
                        ? "يطابق الطلبات مع المقيّمين المتخصصين فقط."
                        : "Matches applications strictly to assessors qualified for that category.")}
                  </p>
                </CardContent>
              </Card>
            );
          },
        )}
      </div>

      <Card variant="bordered">
        <CardHeader>
          <CardTitle className="text-base">
            {isAr ? "حمل المقيّمين الحالي" : "Current Assessor Loads"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockAssessors.map((a) => {
              const pct = (a.activeQueue / Math.max(maxLoad, 1)) * 100;
              return (
                <div key={a.id} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-medium text-ink-primary">
                        {isAr ? a.nameAr : a.nameEn}
                      </span>
                      <span className="text-ink-muted text-xs ms-2">
                        ({a.categories.join(", ")})
                      </span>
                    </div>
                    <span className="font-semibold text-ink-primary">
                      {a.activeQueue}
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-surface-100 overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        a.activeQueue > 9
                          ? "bg-danger-600"
                          : a.activeQueue > 6
                          ? "bg-warning-600"
                          : "bg-navy-800",
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutoAssignmentConfig;
