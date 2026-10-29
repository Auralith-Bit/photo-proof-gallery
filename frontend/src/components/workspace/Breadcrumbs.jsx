import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const labels = {
  dashboard: "Dashboard",
  albums: "My Albums",
  new: "Create Album",
  details: "Album Details",
  privacy: "Privacy",
  client: "Client",
  uploads: "Uploads",
  clients: "Clients",
  analytics: "Analytics",
  settings: "Settings",
  profile: "Profile",
  security: "Security",
  branding: "Studio Branding",
  preferences: "Preferences",
};

export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);

  const crumbs = [];
  let path = "";
  let previous = null;

  for (const segment of segments) {
    path += `/${segment}`;
    let label = labels[segment];
    if (!label) {
      label = previous === "clients" ? "Client" : "Album";
    }
    crumbs.push({ path, label });
    previous = segment;
  }

  if (crumbs.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="hidden min-w-0 md:block">
      <ol className="flex items-center gap-1 text-sm text-charcoal/60">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={crumb.path} className="flex min-w-0 items-center gap-1">
              {index > 0 && (
                <ChevronRight size={14} aria-hidden="true" className="shrink-0 text-charcoal/40" />
              )}
              {isLast ? (
                <span aria-current="page" className="truncate font-medium text-charcoal">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.path}
                  className="truncate rounded hover:text-charcoal hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive/60"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}