import * as React from "react";
import { Link } from "react-router-dom";
import { Bell, Check, Inbox } from "lucide-react";
import { Button, Card } from "@/components/adveti";
import { CATEGORY_STYLES } from "@/components/adveti/NotificationBell";
import { useLang } from "@/hooks/useLang";
import { cn } from "@/lib/utils";
import {
  formatRelativeTime,
  groupNotificationsByDate,
  mockNotificationsV2,
  Notification,
  NotificationCategory,
} from "@/lib/mockNotifications";

type FilterTab = "all" | "unread" | NotificationCategory;

const TABS: Array<{ key: FilterTab; en: string; ar: string }> = [
  { key: "all", en: "All", ar: "الكل" },
  { key: "unread", en: "Unread", ar: "غير مقروءة" },
  { key: "Application", en: "Application", ar: "الطلبات" },
  { key: "Payment", en: "Payment", ar: "الدفع" },
  { key: "Renewal", en: "Renewal", ar: "التجديد" },
  { key: "System", en: "System", ar: "النظام" },
];

const Notifications: React.FC = () => {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const [items, setItems] = React.useState<Notification[]>(mockNotificationsV2);
  const [tab, setTab] = React.useState<FilterTab>("all");

  const filtered = React.useMemo(() => {
    if (tab === "all") return items;
    if (tab === "unread") return items.filter((n) => !n.isRead);
    return items.filter((n) => n.category === tab);
  }, [items, tab]);

  const grouped = React.useMemo(
    () => groupNotificationsByDate(filtered, isAr),
    [filtered, isAr],
  );

  const unreadCount = items.filter((n) => !n.isRead).length;

  const markAll = () => setItems((s) => s.map((n) => ({ ...n, isRead: true })));
  const markRead = (id: string) =>
    setItems((s) => s.map((n) => (n.id === id ? { ...n, isRead: true } : n)));

  const tabCount = (key: FilterTab) => {
    if (key === "all") return items.length;
    if (key === "unread") return unreadCount;
    return items.filter((n) => n.category === key).length;
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-ink-primary inline-flex items-center gap-2">
            <Bell size={20} className="text-navy-800" />
            {isAr ? "الإشعارات" : "Notifications"}
          </h1>
          <p className="text-sm text-ink-secondary mt-1">
            {isAr
              ? "كل تحديثات حسابك في مكان واحد"
              : "All updates about your account, in one place"}
          </p>
        </div>
        <Button
          variant="ghost"
          iconStart={<Check size={14} />}
          onClick={markAll}
          disabled={unreadCount === 0}
        >
          {isAr ? "وسم الكل كمقروء" : "Mark all as read"}
        </Button>
      </header>

      <Card variant="bordered">
        <div className="border-b border-border-default px-2 pt-2 flex items-center gap-1 overflow-x-auto">
          {TABS.map((t) => {
            const active = tab === t.key;
            const count = tabCount(t.key);
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={cn(
                  "py-2.5 px-4 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors inline-flex items-center gap-2 focus-ring rounded-t",
                  active
                    ? "border-gold-500 text-navy-900"
                    : "border-transparent text-ink-secondary hover:text-navy-900",
                )}
              >
                {isAr ? t.ar : t.en}
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded-full font-semibold",
                    active
                      ? "bg-navy-900 text-ink-inverse"
                      : "bg-surface-100 text-ink-secondary",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <div className="h-16 w-16 mx-auto rounded-full bg-success-100 text-success-600 inline-flex items-center justify-center mb-3">
              <Inbox size={28} />
            </div>
            <p className="text-base font-semibold text-ink-primary">
              {isAr ? "وصلت إلى نهاية القائمة!" : "You're all caught up!"}
            </p>
            <p className="text-sm text-ink-secondary mt-1">
              {isAr
                ? "لا توجد إشعارات جديدة في هذه الفئة."
                : "No new notifications in this category."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border-default">
            {grouped.map((group) => (
              <section key={group.key}>
                <h2 className="px-5 pt-4 pb-2 text-xs uppercase tracking-wider text-ink-muted font-semibold">
                  {group.label}
                </h2>
                <ul>
                  {group.items.map((n) => {
                    const style = CATEGORY_STYLES[n.category];
                    return (
                      <li key={n.id}>
                        <Link
                          to={n.href}
                          onClick={() => markRead(n.id)}
                          className={cn(
                            "flex gap-4 px-5 py-4 border-s-4 hover:bg-surface-50 focus-ring transition-colors",
                            style.border,
                            !n.isRead && "bg-surface-50/70",
                          )}
                        >
                          <span
                            className={cn(
                              "h-9 w-9 rounded-md inline-flex items-center justify-center shrink-0",
                              style.iconBg,
                              style.iconText,
                            )}
                            aria-hidden
                          >
                            {style.icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3">
                              <p
                                className={cn(
                                  "text-sm text-ink-primary",
                                  !n.isRead ? "font-semibold" : "font-medium",
                                )}
                              >
                                {isAr ? n.titleAr : n.title}
                              </p>
                              <span className="text-xs text-ink-muted shrink-0 whitespace-nowrap">
                                {formatRelativeTime(n.createdAt, isAr)}
                              </span>
                            </div>
                            <p className="text-sm text-ink-secondary mt-1">
                              {isAr ? n.bodyAr : n.body}
                            </p>
                            <p className="text-[11px] text-ink-muted mt-2 inline-flex items-center gap-2">
                              <span
                                className={cn(
                                  "px-1.5 py-0.5 rounded",
                                  style.iconBg,
                                  style.iconText,
                                )}
                              >
                                {n.category}
                              </span>
                              {!n.isRead && (
                                <span className="text-info-600 font-medium">
                                  • {isAr ? "جديد" : "New"}
                                </span>
                              )}
                            </p>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Notifications;
