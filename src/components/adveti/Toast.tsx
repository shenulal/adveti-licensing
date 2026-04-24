import * as React from "react";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from "lucide-react";

export type ToastType = "success" | "warning" | "error" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastCtx {
  toasts: ToastItem[];
  push: (t: Omit<ToastItem, "id">) => void;
  dismiss: (id: string) => void;
}

const Ctx = React.createContext<ToastCtx | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const dismiss = React.useCallback(
    (id: string) => setToasts((s) => s.filter((t) => t.id !== id)),
    [],
  );

  const push = React.useCallback<ToastCtx["push"]>(
    (t) => {
      const id = Math.random().toString(36).slice(2);
      const item: ToastItem = { duration: 4000, ...t, id };
      setToasts((s) => [...s, item]);
      if (item.duration && item.duration > 0) {
        window.setTimeout(() => dismiss(id), item.duration);
      }
    },
    [dismiss],
  );

  return (
    <Ctx.Provider value={{ toasts, push, dismiss }}>
      {children}
      <div
        className={cn(
          "fixed z-[60] flex flex-col gap-2 pointer-events-none",
          "bottom-4 end-4 max-w-sm w-[calc(100%-2rem)]",
        )}
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((t) => (
          <ToastView key={t.id} toast={t} onClose={() => dismiss(t.id)} />
        ))}
      </div>
    </Ctx.Provider>
  );
};

export const useToast = () => {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
};

const styles: Record<
  ToastType,
  { ring: string; icon: React.ReactNode; bg: string; iconColor: string }
> = {
  success: {
    ring: "border-success-600/30",
    icon: <CheckCircle2 size={18} />,
    bg: "bg-success-100",
    iconColor: "text-success-600",
  },
  warning: {
    ring: "border-warning-600/30",
    icon: <AlertTriangle size={18} />,
    bg: "bg-warning-100",
    iconColor: "text-warning-600",
  },
  error: {
    ring: "border-danger-600/30",
    icon: <AlertCircle size={18} />,
    bg: "bg-danger-100",
    iconColor: "text-danger-600",
  },
  info: {
    ring: "border-info-600/30",
    icon: <Info size={18} />,
    bg: "bg-info-100",
    iconColor: "text-info-600",
  },
};

const ToastView: React.FC<{ toast: ToastItem; onClose: () => void }> = ({
  toast,
  onClose,
}) => {
  const s = styles[toast.type];
  return (
    <div
      role="alert"
      className={cn(
        "pointer-events-auto bg-surface-0 border rounded-lg shadow-lg p-3 flex gap-3 items-start animate-slide-in-right",
        s.ring,
      )}
    >
      <span
        className={cn(
          "h-8 w-8 rounded-md inline-flex items-center justify-center shrink-0",
          s.bg,
          s.iconColor,
        )}
      >
        {s.icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-ink-primary">{toast.title}</p>
        {toast.description && (
          <p className="text-sm text-ink-secondary mt-0.5">
            {toast.description}
          </p>
        )}
      </div>
      <button
        onClick={onClose}
        className="text-ink-muted hover:text-ink-primary p-1 rounded focus-ring"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
};

// ===== Inline alert (non-toast banner) =====
export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: ToastType;
  title?: React.ReactNode;
  children?: React.ReactNode;
  onDismiss?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  type = "info",
  title,
  children,
  className,
  onDismiss,
  ...props
}) => {
  const s = styles[type];
  return (
    <div
      role="alert"
      className={cn(
        "rounded-md border p-4 flex gap-3 items-start",
        s.bg,
        s.ring,
        className,
      )}
      {...props}
    >
      <span className={cn("shrink-0", s.iconColor)}>{s.icon}</span>
      <div className="flex-1 min-w-0">
        {title && (
          <p className="text-sm font-semibold text-ink-primary">{title}</p>
        )}
        {children && (
          <div className="text-sm text-ink-secondary mt-0.5">{children}</div>
        )}
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-ink-muted hover:text-ink-primary"
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
