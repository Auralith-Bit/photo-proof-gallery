import { useId } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

export default function Select({
  label,
  error,
  helperText,
  className,
  id,
  required,
  children,
  ...rest
}) {
  const autoId = useId();
  const inputId = id || autoId;
  const describedBy = error
    ? `${inputId}-error`
    : helperText
      ? `${inputId}-helper`
      : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-charcoal">
          {label}
          {required && (
            <span className="ml-0.5 text-error" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      <div className="relative">
        <select
          id={inputId}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            "h-10 w-full appearance-none rounded-control border bg-white px-3 pr-9 text-sm text-charcoal",
            "focus:outline-none focus:ring-2",
            error
              ? "border-error focus:ring-error/25"
              : "border-sand focus:border-olive focus:ring-olive/25",
            "disabled:cursor-not-allowed disabled:bg-ivory disabled:text-charcoal/50",
            className
          )}
          {...rest}
        >
          {children}
        </select>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/50"
        />
      </div>
      {error && (
        <p id={`${inputId}-error`} className="text-[13px] text-error">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${inputId}-helper`} className="text-[13px] text-charcoal/60">
          {helperText}
        </p>
      )}
    </div>
  );
}