import * as React from "react";
import { Link } from "react-router-dom";
import { Lock, ShieldCheck } from "lucide-react";
import { Button, Card, CardContent, Input, Select } from "@/components/adveti";
import { useLang } from "@/hooks/useLang";
import { mockApplicantProfile } from "@/lib/mockApplicant";
import { cn } from "@/lib/utils";

type Channel = "email" | "sms" | "in_app";

interface PrefRow {
  key: string;
  en: string;
  ar: string;
  channels: Partial<Record<Channel, "default-on" | "default-off" | "locked-on" | "n/a">>;
}

const ROWS: PrefRow[] = [
  {
    key: "app_status",
    en: "Application Status Updates",
    ar: "تحديثات حالة الطلب",
    channels: { email: "default-on", sms: "default-on", in_app: "locked-on" },
  },
  {
    key: "payment",
    en: "Payment Receipts",
    ar: "إيصالات الدفع",
    channels: { email: "default-on", sms: "n/a", in_app: "locked-on" },
  },
  {
    key: "rfi",
    en: "RFI / Information Requests",
    ar: "طلبات المعلومات الإضافية",
    channels: { email: "default-on", sms: "default-on", in_app: "locked-on" },
  },
  {
    key: "renewal",
    en: "Renewal Reminders",
    ar: "تذكير التجديد",
    channels: { email: "default-on", sms: "default-on", in_app: "locked-on" },
  },
  {
    key: "system",
    en: "System Announcements",
    ar: "إعلانات النظام",
    channels: { email: "default-on", sms: "n/a", in_app: "locked-on" },
  },
];

const CHANNELS: Array<{ key: Channel; en: string; ar: string }> = [
  { key: "email", en: "Email", ar: "البريد" },
  { key: "sms", en: "SMS", ar: "رسائل SMS" },
  { key: "in_app", en: "In-App", ar: "داخل التطبيق" },
];

const Profile: React.FC = () => {
  const { lang, setLang } = useLang();
  const isAr = lang === "ar";

  const [prefs, setPrefs] = React.useState<Record<string, boolean>>(() => {
    const o: Record<string, boolean> = {};
    ROWS.forEach((r) =>
      CHANNELS.forEach((c) => {
        const cfg = r.channels[c.key];
        if (cfg === "default-on" || cfg === "locked-on") o[`${r.key}-${c.key}`] = true;
        else if (cfg === "default-off") o[`${r.key}-${c.key}`] = false;
      }),
    );
    return o;
  });

  return (
    <div className="space-y-6 max-w-4xl">
      <header>
        <h1 className="text-2xl font-bold text-ink-primary">
          {isAr ? "إعدادات الملف الشخصي" : "Profile settings"}
        </h1>
      </header>

      <Card variant="bordered">
        <CardContent className="pt-6">
          <h2 className="text-sm font-semibold text-ink-primary mb-4 inline-flex items-center gap-2">
            <ShieldCheck size={14} className="text-navy-800" />
            {isAr ? "بيانات الهوية الرقمية" : "UAE Pass identity"}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              [isAr ? "الاسم الكامل" : "Full name", isAr ? mockApplicantProfile.fullNameAr : mockApplicantProfile.fullNameEn],
              [isAr ? "رقم الهوية" : "Emirates ID", mockApplicantProfile.emiratesId],
              [isAr ? "الجنسية" : "Nationality", isAr ? mockApplicantProfile.nationalityAr : mockApplicantProfile.nationality],
              [isAr ? "تاريخ الميلاد" : "Date of birth", mockApplicantProfile.dateOfBirth],
            ].map(([l, v]) => (
              <div key={l}>
                <label className="text-sm font-medium text-ink-primary mb-1.5 flex items-center gap-1.5">
                  {l} <Lock size={11} className="text-ink-muted" />
                </label>
                <div className="h-10 rounded-md bg-surface-100 border border-border-default px-3 flex items-center text-sm text-ink-secondary">
                  {v}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card variant="bordered">
        <CardContent className="pt-6 space-y-4">
          <h2 className="text-sm font-semibold text-ink-primary">
            {isAr ? "بيانات الاتصال" : "Contact details"}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Input label={isAr ? "البريد الإلكتروني" : "Email"} type="email" defaultValue={mockApplicantProfile.email} />
            <Input label={isAr ? "الهاتف" : "Mobile"} type="tel" defaultValue={mockApplicantProfile.mobile} />
            <Select
              label={isAr ? "اللغة المفضلة" : "Language preference"}
              value={lang}
              onChange={(e) => setLang(e.target.value as "en" | "ar")}
              options={[
                { value: "en", label: "English" },
                { value: "ar", label: "العربية" },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      <Card variant="bordered" id="notifications">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
            <div>
              <h2 className="text-sm font-semibold text-ink-primary">
                {isAr ? "تفضيلات الإشعارات" : "Notification preferences"}
              </h2>
              <p className="text-xs text-ink-secondary mt-1">
                {isAr
                  ? "اختر القنوات التي تتلقى عبرها كل نوع من الإشعارات. الإشعارات داخل التطبيق مفعّلة دائماً."
                  : "Choose how you receive each type of notification. In-app alerts are always on."}
              </p>
            </div>
          </div>
          <div className="overflow-x-auto rounded-md ring-1 ring-border-default">
            <table className="w-full text-sm">
              <thead className="bg-surface-50">
                <tr>
                  <th className="text-start py-3 px-4 text-xs uppercase tracking-wider text-ink-muted font-semibold">
                    {isAr ? "نوع الإشعار" : "Notification type"}
                  </th>
                  {CHANNELS.map((c) => (
                    <th
                      key={c.key}
                      className="text-center py-3 px-4 text-xs uppercase tracking-wider text-ink-muted font-semibold w-28"
                    >
                      {isAr ? c.ar : c.en}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r) => (
                  <tr key={r.key} className="border-t border-border-default">
                    <td className="py-3 px-4 text-ink-primary">{isAr ? r.ar : r.en}</td>
                    {CHANNELS.map((c) => {
                      const cfg = r.channels[c.key];
                      const key = `${r.key}-${c.key}`;
                      if (!cfg || cfg === "n/a") {
                        return (
                          <td key={key} className="text-center py-3 px-4 text-ink-muted">
                            —
                          </td>
                        );
                      }
                      const locked = cfg === "locked-on";
                      return (
                        <td key={key} className="text-center py-3 px-4">
                          <label
                            className={cn(
                              "inline-flex items-center justify-center cursor-pointer",
                              locked && "cursor-not-allowed",
                            )}
                            title={locked ? (isAr ? "مفعّل دائماً" : "Always on") : undefined}
                          >
                            <input
                              type="checkbox"
                              checked={prefs[key] ?? false}
                              disabled={locked}
                              onChange={(e) =>
                                setPrefs({ ...prefs, [key]: e.target.checked })
                              }
                              className={cn(
                                "h-4 w-4 accent-navy-800",
                                locked && "opacity-60",
                              )}
                            />
                            {locked && (
                              <Lock
                                size={11}
                                className="ms-1.5 text-ink-muted"
                                aria-label={isAr ? "مقفل" : "locked"}
                              />
                            )}
                          </label>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between gap-3 flex-wrap">
        <Link to="#" className="text-sm text-navy-800 hover:underline">
          {isAr ? "اطلب نسخة من بياناتي →" : "Request my data →"}
        </Link>
        <Button variant="primary">{isAr ? "حفظ التغييرات" : "Save changes"}</Button>
      </div>
    </div>
  );
};

export default Profile;

