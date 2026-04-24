import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      helperText,
      error,
      options,
      placeholder,
      required,
      id,
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    const reactId = React.useId();
    const sid = id ?? reactId;
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={sid}
            className="block text-sm font-medium text-ink-primary mb-1.5"
          >
            {label}
            {required && <span className="text-danger-600 ms-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={sid}
            disabled={disabled}
            aria-invalid={!!error}
            className={cn(
              "h-10 w-full rounded-md bg-surface-0 text-ink-primary appearance-none",
              "ps-3 pe-10 border transition-colors duration-fast ease-out",
              "focus:outline-none focus:ring-2",
              error
                ? "border-danger-600 focus:border-danger-600 focus:ring-danger-600/20"
                : "border-border-default focus:border-navy-800 focus:ring-navy-800/20",
              disabled && "bg-surface-100 opacity-60 cursor-not-allowed",
              className,
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="absolute inset-y-0 end-3 my-auto text-ink-muted pointer-events-none"
          />
        </div>
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
Select.displayName = "Select";
