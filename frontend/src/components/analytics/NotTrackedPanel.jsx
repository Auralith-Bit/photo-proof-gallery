import Card from "../ui/Card";

export default function NotTrackedPanel({ icon: Icon, title, description }) {
  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sand/60 text-charcoal/50">
          <Icon size={15} aria-hidden="true" />
        </span>
        <h3 className="text-sm font-semibold text-charcoal">{title}</h3>
      </div>
      <p className="text-[13px] leading-5 text-charcoal/60">{description}</p>
      <span className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-ivory px-2.5 py-0.5 text-[11px] font-medium text-charcoal/55">
        <span className="h-1.5 w-1.5 rounded-full bg-charcoal/30" aria-hidden="true" />
        Requires backend tracking
      </span>
    </Card>
  );
}