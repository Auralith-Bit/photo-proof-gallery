import { useId } from "react";
import { cn } from "../../lib/utils";

export default function Textarea({
  label,
  error,
  helperText,
  className,
  id,
  required,
  rows = 4,
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
      <textarea
        id={inputId}
        rows={rows}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          "w-full rounded-control border bg-white px-3 py-2 text-sm text-charcoal",
          "placeholder:text-charcoal/40",
          "focus:outline-none focus:ring-2",
          error
            ? "border-error focus:ring-error/25"
            : "border-sand focus:border-olive focus:ring-olive/25",
          "disabled:cursor-not-allowed disabled:bg-ivory disabled:text-charcoal/50",
          className
        )}
        {...rest}
      />
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