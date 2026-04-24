import * as React from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  Bell,
  Check,
  CreditCard,
  FileText,
  RefreshCw,
  Settings as SettingsIcon,
} from "lucide-react";
import { useLang } from "@/hooks/useLang";
import { cn } from "@/lib/utils";
import {
  formatRelativeTime,
  mockNotificationsV2,
  Notification,
  NotificationCategory,
} from "@/lib/mockNotifications";

interface CategoryStyle {
  border: string;
  iconBg: string;
  iconText: string;
  icon: React.ReactNode;
}

const CATEGORY_STYLES: Record<NotificationCategory, CategoryStyle> = {
  Application: {
    border: "border-s-navy-800",
    iconBg: "bg-navy-800/10",
    iconText: "text-navy-800",
    icon: <FileText size={14} />,
  },
  Payment: {
    border: "border-s-gold-500",
    iconBg: "bg-gold-100",
    iconText: "text-gold-600",
    icon: <CreditCard size={14} />,
  },
  System: {
    border: "border-s-info-600",
    iconBg: "bg-info-100",
    iconText: "text-info-600",
    icon: <SettingsIcon size={14} />,
  },
  Renewal: {
    border: "border-s-warning-600",
    iconBg: "bg-warning-100",
    iconText: "text-warning-600",
    icon: <RefreshCw size={14} />,
  },
  Compliance: {
    border: "border-s-danger-600",
    iconBg: "bg-danger-100",
    iconText: "text-danger-600",
    icon: <AlertTriangle size={14} />,
  },
};

export interface NotificationBellProps {
  viewAllHref?: string;
  align?: "start" | "end";
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  viewAllHref = "/portal/notifications",
  align = "end",
}) => {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState<Notification[]>(mockNotificationsV2);
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const unreadCount = items.filter((n) => !n.isRead).length;
  const badgeText = unreadCount > 99 ? "99+" : String(unreadCount);

  const markAllRead = () =>
    setItems((s) => s.map((n) => ({ ...n, isRead: true })));

  const markRead = (id: string) =>
    setItems((s) => s.map((n) => (n.id === id ? { ...n, isRead: true } : n)));

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative h-10 w-10 inline-flex items-center justify-center rounded-md hover:bg-surface-100 focus-ring"
        aria-label={isAr ? "الإشعارات" : "Notifications"}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Bell size={18} className="text-ink-secondary" />
        {unreadCount > 0 && (
          <span
            className={cn(
              "absolute top-1 end-1 h-4 min-w-[16px] px-1 rounded-full bg-danger-600 text-ink-inverse text-[10px] font-bold inline-flex items-center justify-center ring-2 ring-surface-0",
            )}
            aria-label={`${unreadCount} unread`}
          >
            {badgeText}
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={isAr ? "الإشعارات" : "Notifications"}
          className={cn(
            "absolute mt-2 w-[380px] max-w-[calc(100vw-2rem)] bg-surface-0 rounded-lg shadow-xl ring-1 ring-border-default z-50 flex flex-col overflow-hidden animate-scale-in",
            align === "end" ? "end-0" : "start-0",
          )}
          style={{ maxHeight: 480 }}
        >
          <header className="px-4 py-3 border-b border-border-default flex items-center justify-between gap-3 bg-surface-50">
            <div>
              <p className="text-sm font-semibold text-ink-primary">
                {isAr ? "الإشعارات" : "Notifications"}
              </p>
              <p className="text-[11px] text-ink-secondary">
                {unreadCount === 0
                  ? isAr
                    ? "لا توجد إشعارات غير مقروءة"
                    : "No unread notifications"
                  : isAr
                    ? `${unreadCount} غير مقروءة`
                    : `${unreadCount} unread`}
              </p>
            </div>
            <button
              type="button"
              onClick={markAllRead}
              disabled={unreadCount === 0}
              className="text-xs font-medium text-navy-800 hover:underline disabled:opacity-40 disabled:no-underline focus-ring rounded px-1"
            >
              {isAr ? "وسم الكل كمقروء" : "Mark all as read"}
            </button>
          </header>

          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="p-8 text-center text-sm text-ink-secondary">
                {isAr ? "لا توجد إشعارات" : "No notifications yet"}
              </div>
            ) : (
              <ul className="divide-y divide-border-default">
                {items.slice(0, 6).map((n) => {
                  const style = CATEGORY_STYLES[n.category];
                  return (
                    <li key={n.id}>
                      <Link
                        to={n.href}
                        onClick={() => {
                          markRead(n.id);
                          setOpen(false);
                        }}
                        className={cn(
                          "flex gap-3 p-3 border-s-4 hover:bg-surface-50 focus-ring transition-colors",
                          style.border,
                          !n.isRead && "bg-surface-50/70",
                        )}
                      >
                        <span
                          className={cn(
                            "h-7 w-7 rounded-md inline-flex items-center justify-center shrink-0",
                            style.iconBg,
                            style.iconText,
                          )}
                          aria-hidden
                        >
                          {style.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className={cn(
                                "text-sm text-ink-primary truncate",
                                !n.isRead ? "font-semibold" : "font-medium",
                              )}
                            >
                              {isAr ? n.titleAr : n.title}
                            </p>
                            {!n.isRead && (
                              <span
                                className="h-2 w-2 rounded-full bg-info-600 shrink-0 mt-1.5"
                                aria-label="unread"
                              />
                            )}
                          </div>
                          <p className="text-xs text-ink-secondary mt-0.5 line-clamp-2">
                            {isAr ? n.bodyAr : n.body}
                          </p>
                          <p className="text-[11px] text-ink-muted mt-1">
                            {formatRelativeTime(n.createdAt, isAr)}
                          </p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <footer className="border-t border-border-default p-2 bg-surface-50">
            <Link
              to={viewAllHref}
              onClick={() => setOpen(false)}
              className="block text-center text-sm font-medium text-navy-800 py-1.5 rounded hover:bg-surface-100 focus-ring"
            >
              {isAr ? "عرض كل الإشعارات ←" : "View all notifications →"}
            </Link>
          </footer>
        </div>
      )}
    </div>
  );
};

export { CATEGORY_STYLES };
