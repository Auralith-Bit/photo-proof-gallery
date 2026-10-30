import { Outlet } from "react-router-dom";
import Toaster from "../../components/ui/Toaster";

export default function ClientLayout() {
  return (
    <div className="min-h-screen bg-ivory text-charcoal">
      <Outlet />
      <Toaster />
    </div>
  );
}