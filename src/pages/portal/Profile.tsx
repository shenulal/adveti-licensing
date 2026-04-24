import * as React from "react";
import { Link } from "react-router-dom";
import { Lock, ShieldCheck } from "lucide-react";
import { Button, Card, CardContent, Input, Select } from "@/components/adveti";
import { useLang } from "@/hooks/useLang";
import { mockApplicantProfile } from "@/lib/mockApplicant";

const CHANNELS = ["email", "sms", "in_app"] as const;
const TOPICS = ["app_updates", "payment", "renewal", "system"] as const;

const Profile: React.FC = () => {
  const { lang, setLang } = useLang();
  const isAr = lang === "ar";

  const [prefs, setPrefs] = React.useState<Record<string, boolean>>(() => {
    const o: Record<string, boolean> = {};
    TOPICS.forEach((t) =>
      CHANNELS.forEach((c) => {
        o[`${t}-${c}`] = c !== "sms";
      }),
    );
    return o;
  });

  const topicLabel = (t: string) =>
    isAr
      ? { app_updates: "تحديثات الطلب", payment: "إيصالات الدفع", renewal: "تذكير التجديد", system: "إشعارات النظام" }[t]
      : { app_updates: "Application updates", payment: "Payment receipts", renewal: "Renewal reminders", system: "System announcements" }[t];

  const channelLabel = (c: string) =>
    isAr ? { email: "بريد", sms: "رسائل", in_app: "داخل التطبيق" }[c] : { email: "Email", sms: "SMS", in_app: "In-app" }[c];

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

      <Card variant="bordered">
        <CardContent className="pt-6">
          <h2 className="text-sm font-semibold text-ink-primary mb-4">
            {isAr ? "تفضيلات الإشعارات" : "Notification preferences"}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-start">
                  <th className="text-start py-2 text-ink-secondary font-medium"></th>
                  {CHANNELS.map((c) => (
                    <th key={c} className="text-center py-2 text-xs uppercase tracking-wider text-ink-muted font-semibold">
                      {channelLabel(c)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TOPICS.map((t) => (
                  <tr key={t} className="border-t border-border-default">
                    <td className="py-3 pe-4 text-ink-primary">{topicLabel(t)}</td>
                    {CHANNELS.map((c) => {
                      const key = `${t}-${c}`;
                      return (
                        <td key={key} className="text-center py-3">
                          <input
                            type="checkbox"
                            checked={prefs[key]}
                            onChange={(e) => setPrefs({ ...prefs, [key]: e.target.checked })}
                            className="h-4 w-4 accent-navy-800 cursor-pointer"
                          />
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
