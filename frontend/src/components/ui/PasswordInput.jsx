import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../../lib/utils";

export default function PasswordInput({
  label,
  error,
  helperText,
  className,
  id,
  required,
  ...rest
}) {
  const [visible, setVisible] = useState(false);
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
        <input
          id={inputId}
          type={visible ? "text" : "password"}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            "h-10 w-full rounded-control border bg-white px-3 pr-10 text-sm text-charcoal",
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
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-charcoal/50 hover:text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive/60 rounded-r-control"
        >
          {visible ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
        </button>
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