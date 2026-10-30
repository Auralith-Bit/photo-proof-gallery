import { ArrowRight, CreditCard, HardDrive, Palette, ShieldCheck, User } from "lucide-react";
import Card from "../../../components/ui/Card";
import StorageCard from "../../../components/workspace/StorageCard";
import { useSettingsNav } from "../settingsNavContext";
import { useStorage } from "../../../hooks/useStorage";

const cards = [
  { to: "/settings/profile", title: "Profile", desc: "Your display name, email, and studio photo.", icon: User },
  { to: "/settings/security", title: "Security", desc: "Change your password and manage active sessions.", icon: ShieldCheck },
  { to: "/settings/branding", title: "Studio Branding", desc: "Control how your name and logo appear to clients.", icon: Palette },
  { to: "/settings/preferences", title: "Preferences", desc: "Defaults for new albums, downloads, dates, and views.", icon: CreditCard },
];

export default function SettingsOverviewPage() {
  const { requestNavigate } = useSettingsNav();
  const storageQuery = useStorage();

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-[28px] font-semibold leading-9 text-charcoal">Settings</h1>
        <p className="mt-1 text-sm text-charcoal/60">Manage your studio, security, and defaults.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map(({ to, title, desc, icon: Icon }) => (
          <Card key={to} padded={false}>
            <button
              type="button"
              onClick={() => requestNavigate(to)}
              className="flex w-full items-start gap-4 rounded-card p-5 text-left transition-colors hover:bg-ivory/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-olive/60"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-control bg-ivory text-olive">
                <Icon size={18} aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="text-[15px] font-semibold text-charcoal">{title}</span>
                  <ArrowRight size={15} className="shrink-0 text-charcoal/40" aria-hidden="true" />
                </span>
                <span className="mt-0.5 block text-[13px] text-charcoal/60">{desc}</span>
              </span>
            </button>
          </Card>
        ))}
      </div>

      <section aria-label="Storage" className="flex flex-col gap-2">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-charcoal">
          <HardDrive size={18} className="text-olive" aria-hidden="true" /> Storage
        </h2>
        <StorageCard query={storageQuery} />
      </section>
    </div>
  );
}