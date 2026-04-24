import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "@/components/adveti";
import { useLang } from "@/hooks/useLang";
import { useAuth } from "./AuthContext";
import { Clock } from "lucide-react";

/**
 * Session timeout overlay. Mounted inside authenticated shells.
 *
 * Behaviour:
 *  - Becomes visible WARN_BEFORE_MS before the idle session expires.
 *  - Runs a visible countdown.
 *  - User can extend ("Stay signed in") or sign out immediately.
 *  - On countdown 0 → signOut + redirect to /auth/login?reason=timeout.
 *  - User activity (mouse/key) before the warning resets the timer.
 */
const TOTAL_SESSION_MS = 15 * 60 * 1000; // 15 minutes idle
const WARN_BEFORE_MS = 2 * 60 * 1000;   // show warning 2m before expiry

export const SessionTimeoutModal: React.FC = () => {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [warning, setWarning] = React.useState(false);
  const [secondsLeft, setSecondsLeft] = React.useState(WARN_BEFORE_MS / 1000);
  const idleSinceRef = React.useRef<number>(Date.now());

  // Reset idle timer on activity (only while warning is hidden)
  React.useEffect(() => {
    if (!user) return;
    const reset = () => {
      if (warning) return;
      idleSinceRef.current = Date.now();
    };
    const events: (keyof DocumentEventMap)[] = [
      "mousemove",
      "keydown",
      "click",
      "scroll",
      "touchstart",
    ];
    events.forEach((e) => document.addEventListener(e, reset, { passive: true }));
    return () => {
      events.forEach((e) => document.removeEventListener(e, reset));
    };
  }, [user, warning]);

  // Tick: check whether we should show the warning
  React.useEffect(() => {
    if (!user) return;
    const id = window.setInterval(() => {
      const elapsed = Date.now() - idleSinceRef.current;
      const remaining = TOTAL_SESSION_MS - elapsed;
      if (remaining <= 0) {
        signOut();
        navigate("/auth/login?reason=timeout", { replace: true });
        return;
      }
      if (remaining <= WARN_BEFORE_MS) {
        setWarning(true);
        setSecondsLeft(Math.max(0, Math.ceil(remaining / 1000)));
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [user, signOut, navigate]);

  const stay = () => {
    idleSinceRef.current = Date.now();
    setWarning(false);
    setSecondsLeft(WARN_BEFORE_MS / 1000);
  };

  const signOutNow = () => {
    signOut();
    navigate("/auth/login?reason=timeout", { replace: true });
  };

  if (!user) return null;

  const mm = String(Math.floor(secondsLeft / 60)).padStart(1, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <Modal
      open={warning}
      onClose={stay}
      closeOnBackdrop={false}
      title={
        <span className="inline-flex items-center gap-2">
          <Clock size={18} className="text-warning-600" />
          {isAr ? "جلستك على وشك الانتهاء" : "Your session is about to expire"}
        </span>
      }
      footer={
        <>
          <Button variant="ghost" onClick={signOutNow}>
            {isAr ? "تسجيل الخروج الآن" : "Sign out now"}
          </Button>
          <Button variant="primary" onClick={stay}>
            {isAr ? "ابقَ مسجل الدخول" : "Stay signed in"}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-4">
        <span className="h-12 w-12 rounded-full bg-warning-100 text-warning-600 inline-flex items-center justify-center shrink-0">
          <Clock size={22} />
        </span>
        <div>
          <p className="text-sm text-ink-secondary">
            {isAr
              ? "سيتم تسجيل خروجك خلال:"
              : "You will be signed out in:"}
          </p>
          <p
            dir="ltr"
            className="mt-1 text-3xl font-bold tabular-nums text-navy-900"
          >
            {mm}:{ss}
          </p>
          <p className="mt-2 text-xs text-ink-muted">
            {isAr
              ? "حافظ على بياناتك بالنقر على «ابقَ مسجل الدخول»."
              : "Keep your work safe by choosing \"Stay signed in\"."}
          </p>
        </div>
      </div>
    </Modal>
  );
};