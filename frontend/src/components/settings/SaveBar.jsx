import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import Button from "../ui/Button";

const statusMeta = {
  unsaved: { tone: "text-charcoal/60", label: "Unsaved changes", dot: true },
  saving: { tone: "text-olive", label: "Saving…", spin: true },
  saved: { tone: "text-success", label: "Saved", check: true },
  error: { tone: "text-error", label: "Couldn't save. Please try again.", alert: true },
};

export default function SaveBar({ status, dirty, onSave, onDiscard, saveLabel = "Save changes" }) {
  const meta = statusMeta[status];
  return (
    <div className="sticky bottom-0 z-10 -mx-4 flex flex-wrap items-center justify-between gap-3 border-t border-sand bg-ivory/95 px-4 py-4 backdrop-blur sm:mx-0 sm:rounded-card sm:border sm:px-5">
      <div aria-live="polite" className="min-h-[20px]">
        {meta && (
          <span className={`flex items-center gap-1.5 text-sm font-medium ${meta.tone}`}>
            {meta.dot && <span className="h-2 w-2 rounded-full bg-olive" aria-hidden="true" />}
            {meta.spin && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}
            {meta.check && <CheckCircle2 size={14} aria-hidden="true" />}
            {meta.alert && <AlertCircle size={14} aria-hidden="true" />}
            {meta.label}
          </span>
        )}
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onDiscard} disabled={!dirty || status === "saving"}>
          Discard
        </Button>
        <Button onClick={onSave} disabled={!dirty || status === "saving"} loading={status === "saving"}>
          {saveLabel}
        </Button>
      </div>
    </div>
  );
}