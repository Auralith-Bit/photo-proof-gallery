import { Construction } from "lucide-react";

export default function PlaceholderPage({ title }) {
  return (
    <section className="flex flex-col gap-2">
      <h1 className="text-[28px] font-semibold leading-9 text-charcoal">{title}</h1>
      <p className="flex items-center gap-2 text-sm text-charcoal/60">
        <Construction size={14} aria-hidden="true" />
        Full page arrives in an upcoming phase. The workspace shell is live.
      </p>
    </section>
  );
}