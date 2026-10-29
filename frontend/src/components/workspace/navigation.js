import {
  LayoutDashboard,
  Images,
  Upload,
  Users,
  BarChart3,
  Settings,
} from "lucide-react";

export const workspaceNav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/albums", label: "My Albums", icon: Images },
  { to: "/uploads", label: "Uploads", icon: Upload },
  { to: "/clients", label: "Clients", icon: Users },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];