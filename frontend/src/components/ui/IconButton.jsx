import { cn } from "../../lib/utils";

export default function IconButton({ label, className, children, ...rest }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-control text-charcoal/70 transition-colors",
        "hover:bg-sand/60 hover:text-charcoal",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive/60",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}