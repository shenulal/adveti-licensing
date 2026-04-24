import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: string;
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
  required?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      success,
      iconStart,
      iconEnd,
      type = "text",
      required,
      id,
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    const reactId = React.useId();
    const inputId = id ?? reactId;
    const [showPwd, setShowPwd] = React.useState(false);
    const isPwd = type === "password";
    const effectiveType = isPwd ? (showPwd ? "text" : "password") : type;

    const state = error ? "error" : success ? "success" : "default";

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-ink-primary mb-1.5"
          >
            {label}
            {required && <span className="text-danger-600 ms-1">*</span>}
          </label>
        )}
        <div className="relative">
          {iconStart && (
            <span className="absolute inset-y-0 start-0 flex items-center ps-3 text-ink-muted pointer-events-none">
              {iconStart}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            type={effectiveType}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={
              error || helperText || success ? `${inputId}-help` : undefined
            }
            className={cn(
              "h-10 w-full rounded-md bg-surface-0 text-ink-primary placeholder:text-ink-muted",
              "border transition-colors duration-fast ease-out",
              "focus:outline-none focus:ring-2 focus:ring-offset-0",
              iconStart ? "ps-10" : "ps-3",
              iconEnd || isPwd ? "pe-10" : "pe-3",
              state === "default" &&
                "border-border-default focus:border-navy-800 focus:ring-navy-800/20",
              state === "error" &&
                "border-danger-600 focus:border-danger-600 focus:ring-danger-600/20",
              state === "success" &&
                "border-success-600 focus:border-success-600 focus:ring-success-600/20",
              disabled && "bg-surface-100 opacity-60 cursor-not-allowed",
              className,
            )}
            {...props}
          />
          {isPwd && (
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              className="absolute inset-y-0 end-0 flex items-center pe-3 text-ink-muted hover:text-ink-primary"
              aria-label={showPwd ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
          {!isPwd && iconEnd && (
            <span className="absolute inset-y-0 end-0 flex items-center pe-3 text-ink-muted">
              {iconEnd}
            </span>
          )}
        </div>
        {(error || success || helperText) && (
          <p
            id={`${inputId}-help`}
            className={cn(
              "mt-1.5 text-xs flex items-center gap-1",
              error && "text-danger-600",
              success && "text-success-600",
              !error && !success && "text-ink-secondary",
            )}
          >
            {error && <AlertCircle size={12} aria-hidden />}
            {success && <CheckCircle2 size={12} aria-hidden />}
            {error || success || helperText}
          </p>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helperText, error, required, id, className, ...props }, ref) => {
    const reactId = React.useId();
    const tid = id ?? reactId;
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={tid}
            className="block text-sm font-medium text-ink-primary mb-1.5"
          >
            {label}
            {required && <span className="text-danger-600 ms-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={tid}
          aria-invalid={!!error}
          className={cn(
            "w-full min-h-[96px] rounded-md bg-surface-0 text-ink-primary placeholder:text-ink-muted",
            "px-3 py-2 border transition-colors duration-fast ease-out resize-y",
            "focus:outline-none focus:ring-2",
            error
              ? "border-danger-600 focus:border-danger-600 focus:ring-danger-600/20"
              : "border-border-default focus:border-navy-800 focus:ring-navy-800/20",
            className,
          )}
          {...props}
        />
        {(error || helperText) && (
          <p
            className={cn(
              "mt-1.5 text-xs",
              error ? "text-danger-600" : "text-ink-secondary",
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  },
);
Textarea.displayName = "Textarea";
