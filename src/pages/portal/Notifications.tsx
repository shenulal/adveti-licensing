import * as React from "react";
import { Bell, Check } from "lucide-react";
import { Card, CardContent, Button } from "@/components/adveti";
import { useLang } from "@/hooks/useLang";
import { mockNotifications } from "@/lib/mockApplicant";
import { cn } from "@/lib/utils";

const Notifications: React.FC = () => {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const [items, setItems] = React.useState(mockNotifications);

  const markAll = () => setItems((s) => s.map((n) => ({ ...n, read: true })));

  return (
    <div className="space-y-6 max-w-3xl">
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-ink-primary inline-flex items-center gap-2">
            <Bell size={20} className="text-navy-800" />
            {isAr ? "الإشعارات" : "Notifications"}
          </h1>
          <p className="text-sm text-ink-secondary mt-1">
            {isAr ? "كل التحديثات في مكان واحد" : "All updates in one place"}
          </p>
        </div>
        <Button variant="ghost" iconStart={<Check size={14} />} onClick={markAll}>
          {isAr ? "وسم الكل كمقروء" : "Mark all as read"}
        </Button>
      </header>

      <Card variant="bordered">
        <ul className="divide-y divide-border-default">
          {items.map((n) => (
            <li
              key={n.id}
              className={cn("p-5 flex gap-3", !n.read && "bg-info-100/30")}
            >
              <span
                className={cn(
                  "h-2 w-2 rounded-full mt-2 shrink-0",
                  n.read ? "bg-border-strong" : "bg-info-600",
                )}
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-ink-primary">
                  {isAr ? n.titleAr : n.titleEn}
                </p>
                <p className="text-sm text-ink-secondary mt-1">
                  {isAr ? n.bodyAr : n.bodyEn}
                </p>
                <p className="text-xs text-ink-muted mt-2">
                  {n.timestamp.toLocaleString(isAr ? "ar-AE" : "en-AE")}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default Notifications;
