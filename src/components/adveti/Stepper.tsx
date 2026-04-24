import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface Step {
  label: string;
  description?: string;
}

export interface StepperProps {
  steps: Step[];
  currentStep: number; // 0-indexed; everything below is completed
  orientation?: "horizontal" | "vertical" | "auto";
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  orientation = "auto",
  className,
}) => {
  const baseOrientation =
    orientation === "auto" ? "md:flex-row flex-col" : orientation === "horizontal" ? "flex-row" : "flex-col";

  return (
    <ol
      role="list"
      aria-label="Progress"
      className={cn(
        "flex w-full gap-0",
        baseOrientation,
        className,
      )}
    >
      {steps.map((step, i) => {
        const completed = i < currentStep;
        const active = i === currentStep;
        const last = i === steps.length - 1;

        return (
          <li
            key={step.label}
            className={cn(
              "flex flex-1 min-w-0",
              orientation === "auto" && "md:flex-row flex-row md:items-center",
              orientation === "vertical" && "flex-row",
              orientation === "horizontal" && "flex-row items-center",
            )}
          >
            <div className="flex items-start gap-3 md:flex-row flex-row">
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "h-8 w-8 rounded-full inline-flex items-center justify-center text-sm font-semibold transition-all duration-normal ease-out",
                    completed && "bg-gold-500 text-navy-950 ring-2 ring-gold-300",
                    active && "bg-navy-800 text-ink-inverse ring-4 ring-navy-800/15",
                    !completed && !active &&
                      "bg-surface-0 text-ink-muted border border-border-default",
                  )}
                  aria-current={active ? "step" : undefined}
                >
                  {completed ? <Check size={16} strokeWidth={3} /> : i + 1}
                </span>
                {!last && orientation === "vertical" && (
                  <span
                    className={cn(
                      "w-px flex-1 my-1 min-h-6",
                      completed ? "bg-gold-500" : "bg-border-default",
                    )}
                  />
                )}
              </div>
              <div className="pb-4 md:pb-0 md:pt-0.5">
                <p
                  className={cn(
                    "text-sm font-medium leading-tight",
                    (active || completed) ? "text-ink-primary" : "text-ink-muted",
                  )}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-xs text-ink-secondary mt-0.5">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
            {!last && orientation !== "vertical" && (
              <div
                className={cn(
                  "hidden md:block flex-1 h-px mx-3 self-center",
                  completed ? "bg-gold-500" : "bg-border-default",
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
};
