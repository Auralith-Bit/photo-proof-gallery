import { cn } from "../../lib/utils";
import Spinner from "./Spinner";

const variants = {
  primary: "bg-charcoal text-white hover:bg-charcoal/90 active:bg-charcoal",
  secondary: "bg-olive text-white hover:bg-olive/90 active:bg-olive",
  outline: "border border-sand bg-white text-charcoal hover:bg-ivory active:bg-sand/60",
  ghost: "text-charcoal hover:bg-sand/60 active:bg-sand",
  danger: "bg-error text-white hover:bg-error/90 active:bg-error",
};

const sizes = {
  sm: "h-9 px-3 text-sm gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-5 text-base gap-2",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className,
  children,
  type = "button",
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center rounded-control font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...rest}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}