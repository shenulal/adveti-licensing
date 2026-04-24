import * as React from "react";
import { Plus, Save } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  Input,
  Select,
  useToast,
} from "@/components/adveti";
import { useLang } from "@/hooks/useLang";
import { useAuth } from "@/auth/AuthContext";
import {
  docTypes,
  mockCategories,
  mockRubrics,
  type LicenceCategory,
} from "@/lib/mockAdmin";
import { cn } from "@/lib/utils";

const Categories: React.FC = () => {
  const { lang } = useLang();
  const { user } = useAuth();
  const { push } = useToast();
  const isAr = lang === "ar";
  const isSuper = user?.role === "super_admin";

  const [cats, setCats] = React.useState<LicenceCategory[]>(mockCategories);
  const [activeKey, setActiveKey] = React.useState<string>(cats[0].key);
  const cat = cats.find((c) => c.key === activeKey)!;
  const [draft, setDraft] = React.useState<LicenceCategory>(cat);

  React.useEffect(() => setDraft(cat), [cat]);

  const dirty = JSON.stringify(draft) !== JSON.stringify(cat);

  const handleSave = () => {
    setCats((cs) => cs.map((c) => (c.key === draft.key ? draft : c)));
    push({
      title: isAr ? "تم حفظ الفئة" : "Category saved",
      description: isAr ? draft.nameAr : draft.nameEn,
      type: "success",
    });
  };

  const toggleDoc = (key: string) => {
    setDraft((d) => ({
      ...d,
      requiredDocuments: d.requiredDocuments.includes(key)
        ? d.requiredDocuments.filter((x) => x !== key)
        : [...d.requiredDocuments, key],
    }));
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-primary">
            {isAr ? "تكوين فئات الترخيص" : "Licence Category Configuration"}
          </h1>
          <p className="text-sm text-ink-secondary mt-1">
            {isAr
              ? "الرسوم والصلاحية والمستندات المطلوبة لكل فئة"
              : "Fees, validity and required documents per category"}
          </p>
        </div>
        {isSuper && (
          <Button
            variant="primary"
            iconStart={<Plus size={16} />}
            onClick={() =>
              push({
                title: isAr ? "إضافة فئة" : "Add category",
                description: isAr
                  ? "متاح للمسؤول الأعلى فقط"
                  : "Super Admin only",
                type: "info",
              })
            }
          >
            {isAr ? "إضافة فئة" : "Add category"}
          </Button>
        )}
      </header>

      <div className="grid lg:grid-cols-[240px_1fr] gap-6">
        <Card variant="bordered">
          <CardContent className="pt-5">
            <p className="text-xs uppercase tracking-wider text-ink-muted mb-3">
              {isAr ? "الفئات" : "Categories"}
            </p>
            <ul className="space-y-1">
              {cats.map((c) => (
                <li key={c.key}>
                  <button
                    type="button"
                    onClick={() => setActiveKey(c.key)}
                    className={cn(
                      "w-full text-start rounded-md px-3 py-2 text-sm transition-colors",
                      activeKey === c.key
                        ? "bg-navy-900 text-ink-inverse"
                        : "hover:bg-surface-100 text-ink-primary",
                    )}
                  >
                    {isAr ? c.nameAr : c.nameEn}
                  </button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card variant="bordered">
            <CardContent className="pt-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <h2 className="text-lg font-bold text-ink-primary">
                    {isAr ? draft.nameAr : draft.nameEn}
                  </h2>
                  <Badge
                    variant={draft.active ? "success" : "neutral"}
                    className="mt-1"
                  >
                    {draft.active
                      ? isAr
                        ? "نشط"
                        : "Active"
                      : isAr
                        ? "غير نشط"
                        : "Inactive"}
                  </Badge>
                </div>
                <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draft.active}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, active: e.target.checked }))
                    }
                    className="h-4 w-4 rounded"
                  />
                  {isAr ? "تفعيل الفئة" : "Active"}
                </label>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <Input
                  label={isAr ? "الاسم (إنجليزي)" : "Name (EN)"}
                  value={draft.nameEn}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, nameEn: e.target.value }))
                  }
                />
                <Input
                  label={isAr ? "الاسم (عربي)" : "Name (AR)"}
                  value={draft.nameAr}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, nameAr: e.target.value }))
                  }
                  dir="rtl"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-ink-primary mb-1.5">
                    {isAr ? "الوصف (إنجليزي)" : "Description (EN)"}
                  </label>
                  <textarea
                    rows={3}
                    value={draft.descriptionEn}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        descriptionEn: e.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-border-default p-3 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-primary mb-1.5">
                    {isAr ? "الوصف (عربي)" : "Description (AR)"}
                  </label>
                  <textarea
                    rows={3}
                    dir="rtl"
                    value={draft.descriptionAr}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        descriptionAr: e.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-border-default p-3 text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="bordered">
            <CardContent className="pt-5 grid gap-4 md:grid-cols-2">
              <Input
                label={isAr ? "رسوم الطلب (د.إ)" : "Application fee (AED)"}
                type="number"
                value={draft.applicationFee}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    applicationFee: Number(e.target.value),
                  }))
                }
                helperText={isAr ? "غير شامل ضريبة القيمة المضافة" : "Excl. VAT"}
              />
              <Input
                label={isAr ? "رسوم التجديد (د.إ)" : "Renewal fee (AED)"}
                type="number"
                value={draft.renewalFee}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    renewalFee: Number(e.target.value),
                  }))
                }
              />
              <div>
                <p className="block text-sm font-medium text-ink-primary mb-2">
                  {isAr ? "فترة الصلاحية" : "Validity period"}
                </p>
                <div className="flex gap-2">
                  {[1, 2, 3].map((y) => (
                    <button
                      key={y}
                      type="button"
                      onClick={() =>
                        setDraft((d) => ({
                          ...d,
                          validityYears: y as 1 | 2 | 3,
                        }))
                      }
                      className={cn(
                        "h-9 px-4 rounded-md text-sm font-medium transition-colors",
                        draft.validityYears === y
                          ? "bg-navy-900 text-ink-inverse"
                          : "bg-surface-100 text-ink-secondary hover:bg-surface-200",
                      )}
                    >
                      {y} {isAr ? (y === 1 ? "سنة" : "سنوات") : y === 1 ? "year" : "years"}
                    </button>
                  ))}
                </div>
              </div>
              <Input
                label={
                  isAr
                    ? "فترة السماح بعد الانتهاء (يوم)"
                    : "Grace period after expiry (days)"
                }
                type="number"
                value={draft.graceDays}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    graceDays: Number(e.target.value),
                  }))
                }
              />
              <Input
                label={
                  isAr
                    ? "الحد الأدنى لساعات التطوير المهني"
                    : "CPD hours threshold (min)"
                }
                type="number"
                value={draft.cpdHoursThreshold}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    cpdHoursThreshold: Number(e.target.value),
                  }))
                }
              />
              <Select
                label={isAr ? "معايير التقييم المعتمدة" : "Assigned rubric"}
                value={draft.rubricId}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, rubricId: e.target.value }))
                }
                options={mockRubrics.map((r) => ({
                  value: r.id,
                  label: `${isAr ? r.nameAr : r.nameEn} v${r.version}`,
                }))}
              />
            </CardContent>
          </Card>

          <Card variant="bordered">
            <CardContent className="pt-5">
              <p className="text-sm font-semibold text-ink-primary mb-3">
                {isAr ? "المستندات المطلوبة" : "Required documents"}
              </p>
              <div className="grid sm:grid-cols-2 gap-2">
                {docTypes.map((doc) => {
                  const checked = draft.requiredDocuments.includes(doc.key);
                  return (
                    <label
                      key={doc.key}
                      className={cn(
                        "flex items-center gap-2 rounded-md border p-2.5 cursor-pointer transition-colors",
                        checked
                          ? "border-navy-800 bg-navy-800/5"
                          : "border-border-default hover:bg-surface-50",
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleDoc(doc.key)}
                        className="h-4 w-4 rounded"
                      />
                      <span className="text-sm">
                        {isAr ? doc.ar : doc.en}
                      </span>
                    </label>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              variant="primary"
              iconStart={<Save size={16} />}
              disabled={!dirty}
              onClick={handleSave}
            >
              {isAr ? "حفظ" : "Save"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
