import { Aperture, X } from "lucide-react";
import { useUiStore } from "../../stores/uiStore";
import { NavList } from "./Sidebar";

export default function MobileDrawer() {
  const open = useUiStore((s) => s.mobileDrawerOpen);
  const setOpen = useUiStore((s) => s.setMobileDrawerOpen);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
      <div
        className="absolute inset-0 bg-charcoal/50"
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <div className="absolute inset-y-0 left-0 flex w-64 flex-col bg-charcoal">
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 px-4">
          <span className="flex items-center gap-2">
            <Aperture size={20} aria-hidden="true" className="text-gold" />
            <span className="font-serif text-lg text-white">Frameora</span>
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close navigation menu"
            className="rounded-control p-2 text-white/60 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive/70"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <NavList onNavigate={() => setOpen(false)} />
        </div>
      </div>
    </div>
  );
}