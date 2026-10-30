import { cn } from "../../lib/utils";

export default function Switch({ checked, onChange, label, id, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        checked ? "bg-olive" : "bg-sand",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-white shadow-subtle transition-transform",
          checked ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  );
}