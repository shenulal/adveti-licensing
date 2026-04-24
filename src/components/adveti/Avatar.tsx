import * as React from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "h-6 w-6 text-[10px]",
  md: "h-8 w-8 text-xs",
  lg: "h-10 w-10 text-sm",
};

const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

export const Avatar: React.FC<AvatarProps> = ({
  name,
  src,
  size = "md",
  className,
}) => {
  const [errored, setErrored] = React.useState(false);
  const showImg = src && !errored;
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full overflow-hidden font-semibold ring-1 ring-border-default shrink-0",
        showImg ? "bg-surface-100" : "bg-navy-700 text-ink-inverse",
        sizes[size],
        className,
      )}
      aria-label={name}
    >
      {showImg ? (
        <img
          src={src}
          alt={name}
          onError={() => setErrored(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        initials(name) || "?"
      )}
    </span>
  );
};
