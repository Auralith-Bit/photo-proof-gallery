import { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { CreditCard, HardDrive, Palette, Settings2, ShieldCheck, User } from "lucide-react";
import ConfirmDialog from "../ui/ConfirmDialog";
import { useSettingsDirtyStore } from "../../stores/settingsDirtyStore";
import { SettingsNavContext } from "../../features/settings/settingsNavContext";
import { cn } from "../../lib/utils";

const sections = [
  { to: "/settings", label: "Overview", icon: Settings2, end: true },
  { to: "/settings/profile", label: "Profile", icon: User },
  { to: "/settings/security", label: "Security", icon: ShieldCheck },
  { to: "/settings/branding", label: "Studio Branding", icon: Palette },
  { to: "/settings/preferences", label: "Preferences", icon: CreditCard },
];

export default function SettingsLayout() {
  const navigate = useNavigate();
  const dirty = useSettingsDirtyStore((s) => s.dirty);
  const setDirty = useSettingsDirtyStore((s) => s.setDirty);
  const [pendingPath, setPendingPath] = useState(null);

  // Warn on browser tab close / refresh while there are unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const requestNavigate = useMemo(
    () => (path) => {
      if (dirty) setPendingPath(path);
      else navigate(path);
    },
    [dirty, navigate]
  );

  function confirmDiscard() {
    setDirty(false);
    const path = pendingPath;
    setPendingPath(null);
    if (path) navigate(path);
  }

  return (
    <SettingsNavContext.Provider value={{ requestNavigate }}>
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        <nav
          aria-label="Settings sections"
          className="flex gap-1 overflow-x-auto pb-1 lg:w-56 lg:shrink-0 lg:flex-col lg:overflow-visible lg:pb-0"
        >
          {sections.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={(e) => {
                e.preventDefault();
                requestNavigate(to);
              }}
              className={({ isActive }) =>
                cn(
                  "flex shrink-0 items-center gap-2.5 rounded-control px-3.5 py-2.5 text-sm font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive/60",
                  isActive ? "bg-olive text-white" : "text-charcoal/70 hover:bg-sand/60 hover:text-charcoal"
                )
              }
            >
              <Icon size={16} aria-hidden="true" />
              <span className="whitespace-nowrap">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(pendingPath)}
        onOpenChange={(open) => !open && setPendingPath(null)}
        title="Discard unsaved changes?"
        description="You have unsaved changes in this section. If you leave now, they will be lost."
        confirmLabel="Discard changes"
        cancelLabel="Stay here"
        danger
        onConfirm={confirmDiscard}
      />
    </SettingsNavContext.Provider>
  );
}

// Local import kept at the bottom to avoid a circular-looking top import block.
import { Outlet } from "react-router-dom";