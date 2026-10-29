import { cn } from "../../lib/utils";

export default function EmptyState({ icon: Icon, title, description, children, className }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-card border border-dashed border-sand bg-white/60 px-6 py-12 text-center",
        className
      )}
    >
      {Icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sand/60 text-olive">
          <Icon size={20} aria-hidden="true" />
        </div>
      )}
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-semibold text-charcoal">{title}</h3>
        {description && <p className="max-w-sm text-sm text-charcoal/60">{description}</p>}
      </div>
      {children && (
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">{children}</div>
      )}
    </div>
  );
}