import { Outlet, useParams, useNavigate, useLocation } from "react-router-dom";
import { useAlbum } from "../../hooks/useAlbums";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/Tabs";
import AlbumWorkspaceHeader from "../../components/album/AlbumWorkspaceHeader";

export default function AlbumWorkspaceLayout() {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: album, isLoading, isError } = useAlbum(albumId);

  function currentTab() {
    const path = location.pathname;
    if (path.endsWith("/details")) return "details";
    if (path.endsWith("/privacy")) return "privacy";
    if (path.endsWith("/client")) return "client";
    return "photos";
  }

  function handleTabChange(value) {
    const base = `/albums/${albumId}`;
    if (value === "photos") navigate(base);
    else navigate(`${base}/${value}`);
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16">
        <p className="text-charcoal/60">This album could not be found.</p>
        <button
          onClick={() => navigate("/albums")}
          className="rounded-control bg-charcoal px-4 py-2 text-sm font-medium text-white hover:bg-charcoal/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive/60"
        >
          Back to My Albums
        </button>
      </div>
    );
  }

  return (
    <div>
      <AlbumWorkspaceHeader album={album} loading={isLoading} />
      <Tabs value={currentTab()} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="details">Album Details</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="client">Client</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="mt-4">
        <Outlet context={{ album }} />
      </div>
    </div>
  );
}