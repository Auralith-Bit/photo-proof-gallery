import { Outlet, Navigate, useLocation } from "react-router-dom";
import Sidebar from "../../components/workspace/Sidebar";
import MobileDrawer from "../../components/workspace/MobileDrawer";
import Topbar from "../../components/workspace/Topbar";
import Toaster from "../../components/ui/Toaster";
import { useUiStore } from "../../stores/uiStore";
import { useUser } from "../../hooks/useUser";
import { cn } from "../../lib/utils";

export default function WorkspaceLayout() {
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const location = useLocation();
  const { data: user, isLoading, isError } = useUser();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-olive border-t-transparent" />
          <p className="text-sm font-medium text-charcoal/60">Verifying session…</p>
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

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