import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "../../lib/utils";

const tones = {
  error: "border-error/30 bg-error/10 text-error",
  success: "border-success/30 bg-success/10 text-success",
  info: "border-olive/30 bg-olive/10 text-olive",
};

const icons = { error: AlertCircle, success: CheckCircle2, info: Info };

export default function InlineAlert({ tone = "info", children, className }) {
  const Icon = icons[tone] ?? Info;
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2.5 rounded-control border px-3 py-2.5 text-sm",
        tones[tone],
        className
      )}
    >
      <Icon size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
      <div className="flex-1">{children}</div>
    </div>
  );
}