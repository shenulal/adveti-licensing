import * as React from "react";
import { Button, Modal } from "@/components/adveti";
import { useLang } from "@/hooks/useLang";
import { Cookie } from "lucide-react";

const STORAGE_KEY = "adveti.cookie-consent";

interface Prefs {
  necessary: true;
  analytics: boolean;
  preferences: boolean;
}

export const CookieConsent: React.FC = () => {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const [visible, setVisible] = React.useState(false);
  const [manageOpen, setManageOpen] = React.useState(false);
  const [prefs, setPrefs] = React.useState<Prefs>({
    necessary: true,
    analytics: true,
    preferences: true,
  });

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const persist = (p: Prefs) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    } catch {
      /* ignore */
    }
    setVisible(false);
    setManageOpen(false);
  };

  if (!visible) return null;

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 p-4 sm:p-6">
        <div className="mx-auto max-w-4xl rounded-xl bg-surface-0 shadow-xl ring-1 ring-border-default p-5 sm:p-6 animate-in slide-in-from-bottom duration-normal">
          <div className="flex flex-col sm:flex-row gap-4">
            <span className="h-10 w-10 rounded-md bg-gold-100 text-gold-600 inline-flex items-center justify-center shrink-0">
              <Cookie size={20} />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink-primary">
                {isAr ? "إعدادات ملفات الارتباط" : "Cookie preferences"}
              </p>
              <p className="mt-1 text-sm text-ink-secondary">
                {isAr
                  ? "نستخدم ملفات الارتباط لتحسين تجربتك وفقاً لأحكام قانون حماية البيانات الشخصية في دولة الإمارات. يمكنك قبول الكل أو تخصيص تفضيلاتك."
                  : "We use cookies to improve your experience in line with the UAE Personal Data Protection Law (PDPL). Accept all or manage your preferences."}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setManageOpen(true)}
                >
                  {isAr ? "إدارة التفضيلات" : "Manage Preferences"}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() =>
                    persist({ necessary: true, analytics: true, preferences: true })
                  }
                >
                  {isAr ? "قبول الكل" : "Accept All"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={manageOpen}
        onClose={() => setManageOpen(false)}
        title={isAr ? "إدارة ملفات الارتباط" : "Manage cookie preferences"}
        footer={
          <>
            <Button variant="ghost" onClick={() => setManageOpen(false)}>
              {isAr ? "إلغاء" : "Cancel"}
            </Button>
            <Button variant="primary" onClick={() => persist(prefs)}>
              {isAr ? "حفظ التفضيلات" : "Save Preferences"}
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-sm">
          {[
            {
              key: "necessary" as const,
              en: "Strictly Necessary",
              ar: "ضرورية",
              descEn: "Required for the service to function. Cannot be disabled.",
              descAr: "لازمة لعمل الخدمة ولا يمكن تعطيلها.",
              locked: true,
            },
            {
              key: "analytics" as const,
              en: "Analytics",
              ar: "تحليلات",
              descEn: "Helps us understand how visitors use the platform.",
              descAr: "تساعدنا في فهم استخدام المنصة.",
              locked: false,
            },
            {
              key: "preferences" as const,
              en: "Preferences",
              ar: "التفضيلات",
              descEn: "Remembers language and personalisation choices.",
              descAr: "لتذكر اللغة وخيارات التخصيص.",
              locked: false,
            },
          ].map((row) => (
            <label
              key={row.key}
              className="flex items-start gap-3 p-3 rounded-md ring-1 ring-border-default"
            >
              <input
                type="checkbox"
                className="mt-1 h-4 w-4"
                checked={row.locked ? true : prefs[row.key] as boolean}
                disabled={row.locked}
                onChange={(e) =>
                  setPrefs((p) => ({ ...p, [row.key]: e.target.checked }))
                }
              />
              <div>
                <p className="font-semibold text-ink-primary">
                  {isAr ? row.ar : row.en}
                </p>
                <p className="text-ink-secondary mt-0.5">
                  {isAr ? row.descAr : row.descEn}
                </p>
              </div>
            </label>
          ))}
        </div>
      </Modal>
    </>
  );
};