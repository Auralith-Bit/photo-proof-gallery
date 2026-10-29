import { CloudOff } from "lucide-react";
import { cn } from "../../lib/utils";
import Button from "./Button";

export default function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this content. Please try again.",
  onRetry,
  className,
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-card border border-sand bg-white px-6 py-12 text-center",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error/10 text-error">
        <CloudOff size={20} aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-charcoal">{title}</h3>
      <p className="max-w-sm text-sm text-charcoal/60">{description}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}