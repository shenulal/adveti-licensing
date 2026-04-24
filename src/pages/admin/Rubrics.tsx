import * as React from "react";
import { Eye, Lock, Plus, Trash2, Unlock } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  Input,
  Modal,
  useToast,
} from "@/components/adveti";
import { useLang } from "@/hooks/useLang";
import {
  mockRubrics,
  type Rubric,
  type RubricItem,
  type RubricSection,
} from "@/lib/mockAdmin";
import { cn } from "@/lib/utils";

const Rubrics: React.FC = () => {
  const { lang } = useLang();
  const { push } = useToast();
  const isAr = lang === "ar";

  const [rubrics, setRubrics] = React.useState<Rubric[]>(mockRubrics);
  const [activeId, setActiveId] = React.useState<string>(rubrics[0].id);
  const active = rubrics.find((r) => r.id === activeId)!;
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>(
    Object.fromEntries(active.sections.map((s) => [s.id, true])),
  );

  const update = (mutator: (r: Rubric) => Rubric) =>
    setRubrics((rs) => rs.map((r) => (r.id === activeId ? mutator(r) : r)));

  const handlePublish = () => {
    update((r) => ({ ...r, published: true, version: r.version }));
    push({
      title: isAr ? "تم النشر" : "Rubric published",
      description: isAr
        ? "البنود مقفلة. أنشئ نسخة جديدة لإجراء تعديلات."
        : "Items locked. Create a new version to edit further.",
      type: "success",
    });
  };

  const addSection = () => {
    update((r) => ({
      ...r,
      sections: [
        ...r.sections,
        {
          id: `sec-${Math.random().toString(36).slice(2, 8)}`,
          nameEn: "New section",
          nameAr: "قسم جديد",
          items: [],
        },
      ],
    }));
  };

  const removeSection = (sid: string) => {
    update((r) => ({ ...r, sections: r.sections.filter((s) => s.id !== sid) }));
  };

  const renameSection = (sid: string, en: string, ar: string) => {
    update((r) => ({
      ...r,
      sections: r.sections.map((s) =>
        s.id === sid ? { ...s, nameEn: en, nameAr: ar } : s,
      ),
    }));
  };

  const addItem = (sid: string) => {
    update((r) => ({
      ...r,
      sections: r.sections.map((s) =>
        s.id === sid
          ? {
              ...s,
              items: [
                ...s.items,
                {
                  id: `it-${Math.random().toString(36).slice(2, 8)}`,
                  labelEn: "New criterion",
                  labelAr: "معيار جديد",
                  scoring: "PassFail",
                  required: false,
                  guidanceEn: "",
                  guidanceAr: "",
                },
              ],
            }
          : s,
      ),
    }));
  };

  const updateItem = (sid: string, iid: string, mut: (i: RubricItem) => RubricItem) => {
    update((r) => ({
      ...r,
      sections: r.sections.map((s) =>
        s.id === sid
          ? { ...s, items: s.items.map((i) => (i.id === iid ? mut(i) : i)) }
          : s,
      ),
    }));
  };

  const removeItem = (sid: string, iid: string) => {
    update((r) => ({
      ...r,
      sections: r.sections.map((s) =>
        s.id === sid ? { ...s, items: s.items.filter((i) => i.id !== iid) } : s,
      ),
    }));
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-primary">
            {isAr ? "أداة بناء معايير التقييم" : "Rubric Builder"}
          </h1>
          <p className="text-sm text-ink-secondary mt-1">
            {isAr
              ? "تكوين معايير التقييم لكل فئة ترخيص"
              : "Configure assessment rubrics per licence category"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            iconStart={<Eye size={14} />}
            onClick={() => setPreviewOpen(true)}
          >
            {isAr ? "معاينة" : "Preview rubric"}
          </Button>
          <Button
            variant="gold"
            iconStart={active.published ? <Lock size={14} /> : <Unlock size={14} />}
            onClick={handlePublish}
          >
            {active.published
              ? isAr
                ? "منشور"
                : "Published"
              : isAr
                ? "نشر"
                : "Publish"}
          </Button>
        </div>
      </header>

      <div className="grid lg:grid-cols-[260px_1fr] gap-6">
        <Card variant="bordered">
          <CardContent className="pt-5">
            <p className="text-xs uppercase tracking-wider text-ink-muted mb-3">
              {isAr ? "معايير التقييم" : "Rubrics"}
            </p>
            <ul className="space-y-1">
              {rubrics.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveId(r.id);
                      setOpenSections(
                        Object.fromEntries(r.sections.map((s) => [s.id, true])),
                      );
                    }}
                    className={cn(
                      "w-full text-start rounded-md px-3 py-2 text-sm transition-colors",
                      activeId === r.id
                        ? "bg-navy-900 text-ink-inverse"
                        : "hover:bg-surface-100 text-ink-primary",
                    )}
                  >
                    <p className="font-medium truncate">
                      {isAr ? r.nameAr : r.nameEn}
                    </p>
                    <p
                      className={cn(
                        "text-[11px] mt-0.5",
                        activeId === r.id
                          ? "text-ink-inverse/70"
                          : "text-ink-secondary",
                      )}
                    >
                      v{r.version} · {r.category} ·{" "}
                      {r.published
                        ? isAr
                          ? "منشور"
                          : "Published"
                        : isAr
                          ? "مسودة"
                          : "Draft"}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card variant="bordered">
            <CardContent className="pt-5 flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h2 className="text-lg font-bold text-ink-primary">
                  {isAr ? active.nameAr : active.nameEn}
                </h2>
                <div className="flex gap-2 mt-2">
                  <Badge variant="info">
                    {isAr ? "الفئة:" : "Category:"} {active.category}
                  </Badge>
                  <Badge variant={active.published ? "success" : "warning"}>
                    {active.published
                      ? isAr
                        ? `منشور · v${active.version}`
                        : `Published · v${active.version}`
                      : isAr
                        ? `مسودة · v${active.version}`
                        : `Draft · v${active.version}`}
                  </Badge>
                </div>
              </div>
              <Button
                variant="secondary"
                iconStart={<Plus size={14} />}
                onClick={addSection}
                disabled={active.published}
              >
                {isAr ? "إضافة قسم" : "Add section"}
              </Button>
            </CardContent>
          </Card>

          {active.sections.map((section) => (
            <SectionEditor
              key={section.id}
              section={section}
              isAr={isAr}
              published={active.published}
              isOpen={openSections[section.id] ?? true}
              onToggle={() =>
                setOpenSections((s) => ({
                  ...s,
                  [section.id]: !s[section.id],
                }))
              }
              onRename={(en, ar) => renameSection(section.id, en, ar)}
              onDelete={() => removeSection(section.id)}
              onAddItem={() => addItem(section.id)}
              onUpdateItem={(iid, mut) => updateItem(section.id, iid, mut)}
              onRemoveItem={(iid) => removeItem(section.id, iid)}
            />
          ))}
        </div>
      </div>

      <Modal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title={isAr ? "معاينة معايير التقييم" : "Rubric preview"}
        description={
          isAr
            ? "ما يراه المقيّم"
            : "Exactly as the assessor sees it"
        }
        size="xl"
      >
        <div className="space-y-5">
          {active.sections.map((s) => (
            <section key={s.id}>
              <h3 className="text-base font-semibold text-navy-900 mb-2">
                {isAr ? s.nameAr : s.nameEn}
              </h3>
              <ul className="space-y-2">
                {s.items.map((it) => (
                  <li
                    key={it.id}
                    className="rounded-md border border-border-default p-3 text-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">
                          {isAr ? it.labelAr : it.labelEn}
                          {it.required && (
                            <span className="text-danger-600 ms-1">*</span>
                          )}
                        </p>
                        {it.guidanceEn && (
                          <p className="text-xs text-ink-secondary mt-1">
                            {isAr ? it.guidanceAr : it.guidanceEn}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        {(["Pass", "Fail", "N/A"] as const).map((p) => (
                          <span
                            key={p}
                            className="h-7 px-2.5 inline-flex items-center rounded-full bg-surface-100 text-xs"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Modal>
    </div>
  );
};

const SectionEditor: React.FC<{
  section: RubricSection;
  isAr: boolean;
  published: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onRename: (en: string, ar: string) => void;
  onDelete: () => void;
  onAddItem: () => void;
  onUpdateItem: (iid: string, mut: (i: RubricItem) => RubricItem) => void;
  onRemoveItem: (iid: string) => void;
}> = ({
  section,
  isAr,
  published,
  isOpen,
  onToggle,
  onRename,
  onDelete,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
}) => {
  return (
    <Card variant="bordered">
      <CardContent className="pt-5 space-y-4">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={onToggle}
            className="text-ink-muted text-xs"
            aria-label="Toggle section"
          >
            {isOpen ? "▾" : "▸"}
          </button>
          <div className="flex-1 grid gap-2 md:grid-cols-2">
            <Input
              value={section.nameEn}
              onChange={(e) => onRename(e.target.value, section.nameAr)}
              disabled={published}
              placeholder="Section name (EN)"
            />
            <Input
              value={section.nameAr}
              onChange={(e) => onRename(section.nameEn, e.target.value)}
              disabled={published}
              dir="rtl"
              placeholder="اسم القسم"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            disabled={published}
            className="text-danger-600 hover:bg-danger-100/40"
            aria-label="Delete section"
          >
            <Trash2 size={14} />
          </Button>
        </div>

        {isOpen && (
          <>
            <ul className="space-y-3">
              {section.items.map((it) => (
                <li
                  key={it.id}
                  className="rounded-md border border-border-default p-3 space-y-2"
                >
                  <div className="grid gap-2 md:grid-cols-2">
                    <Input
                      value={it.labelEn}
                      onChange={(e) =>
                        onUpdateItem(it.id, (i) => ({
                          ...i,
                          labelEn: e.target.value,
                        }))
                      }
                      disabled={published}
                      placeholder="Item label (EN)"
                    />
                    <Input
                      value={it.labelAr}
                      onChange={(e) =>
                        onUpdateItem(it.id, (i) => ({
                          ...i,
                          labelAr: e.target.value,
                        }))
                      }
                      disabled={published}
                      dir="rtl"
                      placeholder="عنوان البند"
                    />
                  </div>
                  <div className="grid gap-2 md:grid-cols-2">
                    <Input
                      value={it.guidanceEn}
                      onChange={(e) =>
                        onUpdateItem(it.id, (i) => ({
                          ...i,
                          guidanceEn: e.target.value,
                        }))
                      }
                      disabled={published}
                      placeholder="Guidance note (EN)"
                    />
                    <Input
                      value={it.guidanceAr}
                      onChange={(e) =>
                        onUpdateItem(it.id, (i) => ({
                          ...i,
                          guidanceAr: e.target.value,
                        }))
                      }
                      disabled={published}
                      dir="rtl"
                      placeholder="ملاحظة إرشادية"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex gap-2">
                      <select
                        disabled={published}
                        value={it.scoring}
                        onChange={(e) =>
                          onUpdateItem(it.id, (i) => ({
                            ...i,
                            scoring: e.target.value as "PassFail" | "Weighted",
                          }))
                        }
                        className="rounded-md border border-border-default h-9 px-3 text-sm"
                      >
                        <option value="PassFail">
                          {isAr ? "اجتياز/إخفاق/غير منطبق" : "Pass/Fail/N/A"}
                        </option>
                        <option value="Weighted">
                          {isAr ? "نقاط مرجّحة" : "Weighted score"}
                        </option>
                      </select>
                      <label className="inline-flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          disabled={published}
                          checked={it.required}
                          onChange={(e) =>
                            onUpdateItem(it.id, (i) => ({
                              ...i,
                              required: e.target.checked,
                            }))
                          }
                          className="h-4 w-4 rounded"
                        />
                        {isAr ? "مطلوب" : "Required"}
                      </label>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={published}
                      className="text-danger-600 hover:bg-danger-100/40"
                      onClick={() => onRemoveItem(it.id)}
                      aria-label="Delete item"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
            <Button
              variant="ghost"
              size="sm"
              iconStart={<Plus size={14} />}
              onClick={onAddItem}
              disabled={published}
            >
              {isAr ? "إضافة بند" : "Add item"}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default Rubrics;
