import { cn } from "../../lib/utils";

const tones = {
  active: "bg-success/10 text-success",
  draft: "bg-olive/15 text-olive",
  expired: "bg-warning/10 text-warning",
  archived: "bg-sand/70 text-charcoal/70",
  neutral: "bg-sand/70 text-charcoal/70",
};

export default function Badge({ tone = "neutral", children, className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone] ?? tones.neutral,
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {children}
    </span>
  );
}