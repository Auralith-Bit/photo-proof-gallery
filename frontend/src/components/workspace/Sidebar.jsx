import { NavLink } from "react-router-dom";
import { Aperture } from "lucide-react";
import { useUiStore } from "../../stores/uiStore";
import { workspaceNav } from "./navigation";
import { cn } from "../../lib/utils";

export function NavList({ collapsed = false, onNavigate }) {
  return (
    <nav aria-label="Main navigation" className="flex flex-col gap-1 px-3">
      {workspaceNav.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "group relative flex h-10 items-center gap-3 rounded-control px-3 text-sm font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive/70",
              isActive
                ? "bg-olive text-white"
                : "text-white/60 hover:bg-white/5 hover:text-white",
              collapsed && "justify-center px-0"
            )
          }
        >
          {({ isActive }) => (
            <>
              <Icon
                size={18}
                aria-hidden="true"
                className={isActive ? "text-white" : "text-white/60 group-hover:text-white"}
              />
              {!collapsed && <span>{label}</span>}
              {collapsed && (
                <span
                  className="pointer-events-none absolute left-full z-50 ml-2 whitespace-nowrap rounded-md border border-sand bg-white px-2 py-1 text-xs font-medium text-charcoal opacity-0 shadow-elevated transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                  role="tooltip"
                >
                  {label}
                </span>
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

export default function Sidebar() {
  const collapsed = useUiStore((s) => s.sidebarCollapsed);

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 hidden flex-col bg-charcoal transition-[width] duration-200 lg:flex",
        collapsed ? "w-[76px]" : "w-60"
      )}
    >
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-white/10",
          collapsed ? "justify-center" : "gap-2.5 px-5"
        )}
      >
        <Aperture size={22} aria-hidden="true" className="text-gold" />
        {!collapsed && <span className="font-serif text-lg text-white">Frameora</span>}
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <NavList collapsed={collapsed} />
      </div>

      {!collapsed && (
        <div className="shrink-0 border-t border-white/10 px-5 py-4">
          <p className="text-xs text-white/40">Every moment. Beautifully preserved.</p>
        </div>
      )}
    </aside>
  );
}