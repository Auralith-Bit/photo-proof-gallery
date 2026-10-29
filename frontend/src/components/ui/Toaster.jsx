import { useEffect } from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import { useToastStore } from "../../stores/toastStore";
import { cn } from "../../lib/utils";

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const tones = {
  success: "text-success",
  error: "text-error",
  warning: "text-warning",
  info: "text-olive",
};

function ToastItem({ toast }) {
  const dismiss = useToastStore((s) => s.dismiss);

  useEffect(() => {
    const timer = setTimeout(() => dismiss(toast.id), 4500);
    return () => clearTimeout(timer);
  }, [toast.id, dismiss]);

  const Icon = icons[toast.type] ?? Info;

  return (
    <div className="pointer-events-auto flex w-80 items-start gap-3 rounded-card border border-sand bg-white p-4 shadow-elevated" role="status">
      <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", tones[toast.type])} aria-hidden="true" />
      <div className="flex-1 text-sm">
        {toast.title && <p className="font-medium text-charcoal">{toast.title}</p>}
        <p className="text-charcoal/70">{toast.message}</p>
      </div>
      <button
        type="button"
        onClick={() => dismiss(toast.id)}
        aria-label="Dismiss notification"
        className="text-charcoal/40 hover:text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive/60 rounded"
      >
        <X size={14} aria-hidden="true" />
      </button>
    </div>
  );
}

export default function Toaster() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="pointer-events-none fixed bottom-4 right-4 z-[100] flex flex-col gap-2"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  );
}