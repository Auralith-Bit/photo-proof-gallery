import { Outlet } from "react-router-dom";
import Sidebar from "../../components/workspace/Sidebar";
import MobileDrawer from "../../components/workspace/MobileDrawer";
import Topbar from "../../components/workspace/Topbar";
import Toaster from "../../components/ui/Toaster";
import { useUiStore } from "../../stores/uiStore";
import { cn } from "../../lib/utils";

export default function WorkspaceLayout() {
  const collapsed = useUiStore((s) => s.sidebarCollapsed);

  return (
    <div className="min-h-screen bg-ivory">
      <Sidebar />
      <MobileDrawer />
      <div
        className={cn(
          "flex min-h-screen flex-col transition-[padding-left] duration-200",
          collapsed ? "lg:pl-[76px]" : "lg:pl-60"
        )}
      >
        <Topbar />
        <main id="main-content" className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto w-full max-w-[1440px]">
            <Outlet />
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
}