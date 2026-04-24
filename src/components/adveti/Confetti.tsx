/**
 * ConfettiBurst — pure-CSS confetti shower. Renders 36 falling pieces in
 * brand colours (navy / gold / success), then auto-dismisses after `duration`
 * ms (default 3000). No external libraries.
 */
import * as React from "react";
import { cn } from "@/lib/utils";

export interface ConfettiBurstProps {
  duration?: number;
  pieces?: number;
  className?: string;
  onDone?: () => void;
}

const COLOR_CLASSES = [
  "bg-gold-500",
  "bg-navy-700",
  "bg-success-600",
  "bg-gold-400",
  "bg-navy-900",
];

const SHAPES = ["rounded-sm", "rounded-full", "rounded-none"];

interface Piece {
  left: string;
  delay: string;
  duration: string;
  drift: string;
  color: string;
  shape: string;
  size: string;
}

const buildPieces = (n: number): Piece[] =>
  Array.from({ length: n }).map((_, i) => ({
    left: `${(i / n) * 100 + Math.random() * (100 / n)}%`,
    delay: `${Math.random() * 0.6}s`,
    duration: `${2 + Math.random() * 1.5}s`,
    drift: `${(Math.random() - 0.5) * 80}px`,
    color: COLOR_CLASSES[i % COLOR_CLASSES.length],
    shape: SHAPES[i % SHAPES.length],
    size: i % 3 === 0 ? "h-3 w-2" : "h-2 w-2",
  }));

export const ConfettiBurst: React.FC<ConfettiBurstProps> = ({
  duration = 3000,
  pieces = 36,
  className,
  onDone,
}) => {
  const items = React.useMemo(() => buildPieces(pieces), [pieces]);
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    const t = window.setTimeout(() => {
      setVisible(false);
      onDone?.();
    }, duration);
    return () => window.clearTimeout(t);
  }, [duration, onDone]);

  if (!visible) return null;

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 z-[80] overflow-hidden",
        className,
      )}
    >
      {items.map((p, i) => (
        <span
          key={i}
          className={cn(
            "absolute top-0 animate-confetti-fall opacity-90",
            p.color,
            p.shape,
            p.size,
          )}
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            transform: `translateX(${p.drift})`,
          }}
        />
      ))}
    </div>
  );
};
