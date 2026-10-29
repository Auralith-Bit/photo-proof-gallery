import { useId } from "react";
import { cn } from "../../lib/utils";

export default function Checkbox({ label, error, id, className, ...rest }) {
  const autoId = useId();
  const inputId = id || autoId;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-start gap-2.5">
        <input
          type="checkbox"
          id={inputId}
          aria-invalid={error ? true : undefined}
          className={cn(
            "mt-0.5 h-4 w-4 shrink-0 rounded border-sand accent-olive",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive/60",
            className
          )}
          {...rest}
        />
        <label htmlFor={inputId} className="text-sm leading-5 text-charcoal/80">
          {label}
        </label>
      </div>
      {error && <p className="text-[13px] text-error">{error}</p>}
    </div>
  );
}