import { Construction, Database } from "lucide-react";
import { useAlbums } from "../../hooks/useAlbums";
import Skeleton from "../ui/Skeleton";
import Card from "../ui/Card";

export default function PlaceholderPage({ title, routePath }) {
  // Only fetch on the dashboard to prove it works
  const { data: albums, isLoading } = useAlbums();
  const isDashboard = routePath === "/dashboard";

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-[28px] font-semibold leading-9 text-charcoal">{title}</h1>
      
      <p className="flex items-center gap-2 text-sm text-charcoal/60">
        <Construction size={14} aria-hidden="true" />
        Full page arrives in an upcoming phase. The workspace shell is live.
      </p>

      {isDashboard && (
        <Card className="mt-4 max-w-md">
          <div className="flex items-center gap-3">
            <Database className="text-olive" size={20} />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-charcoal/60">
                Mock Data Test
              </p>
              {isLoading ? (
                <Skeleton className="h-6 w-24 mt-1" />
              ) : (
                <p className="text-xl font-semibold text-charcoal">
                  {albums?.length || 0} Albums Loaded
                </p>
              )}
            </div>
          </div>
        </Card>
      )}
    </section>
  );
}