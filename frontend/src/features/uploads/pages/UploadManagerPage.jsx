import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FolderPlus, HardDriveUpload, Images, Plus } from "lucide-react";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";
import Skeleton from "../../../components/ui/Skeleton";
import EmptyState from "../../../components/ui/EmptyState";
import ErrorState from "../../../components/ui/ErrorState";
import InlineAlert from "../../../components/ui/InlineAlert";
import UploadDropzone from "../../../components/album/UploadDropzone";
import UploadQueue from "../../../components/uploads/UploadQueue";
import { useAlbums } from "../../../hooks/useAlbums";
import { useUploadQueue } from "../../../hooks/useUploadQueue";

export default function UploadManagerPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dropzoneRef = useRef(null);
  const albumsQuery = useAlbums();
  const queue = useUploadQueue();

  const selectableAlbums = useMemo(
    () => (albumsQuery.data ?? []).filter((album) => album.status !== "archived"),
    [albumsQuery.data]
  );

  const [albumValue, setAlbumValue] = useState("");

  // Apply a ?album= preset once albums are available.
  useEffect(() => {
    const preset = searchParams.get("album");
    if (preset && selectableAlbums.some((a) => a.id === preset)) {
      setAlbumValue(preset);
      queue.setAlbum(preset);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectableAlbums, searchParams]);

  function handleSelectChange(event) {
    const value = event.target.value;
    setAlbumValue(value);
    queue.setAlbum(value || null);
  }

  function handleDrop(acceptedFiles) {
    if (!albumValue) return;
    queue.addFiles(acceptedFiles);
  }

  const canUpload = Boolean(albumValue) && !albumsQuery.isLoading && !albumsQuery.isError;
  const batchActive = queue.active > 0;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-semibold leading-9 text-charcoal">Upload Manager</h1>
          <p className="mt-1 text-sm text-charcoal/60">
            Add photographs to an album. Choose a destination, then drag files in or browse.
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/albums/new")}>
          <FolderPlus size={16} aria-hidden="true" /> New Album
        </Button>
      </header>

      {albumsQuery.isError ? (
        <ErrorState
          title="We couldn't load your albums"
          description="Uploads need a destination album. Please retry."
          onRetry={() => albumsQuery.refetch()}
        />
      ) : albumsQuery.isLoading ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-10 w-72 rounded-control" />
          <Skeleton className="h-40 w-full rounded-card" />
        </div>
      ) : (albumsQuery.data ?? []).length === 0 ? (
        <EmptyState
          icon={Images}
          title="No albums to upload into"
          description="Create an album first — uploads are always organized inside an album."
        >
          <Button onClick={() => navigate("/albums/new")}>
            <Plus size={16} aria-hidden="true" /> Create Album
          </Button>
        </EmptyState>
      ) : selectableAlbums.length === 0 ? (
        <EmptyState
          icon={HardDriveUpload}
          title="No active or draft albums"
          description="All of your albums are archived. Restore one or create a new album to upload photos."
        >
          <Button onClick={() => navigate("/albums")}>Go to My Albums</Button>
        </EmptyState>
      ) : (
        <>
          <div className="flex flex-wrap items-end gap-3">
            <div className="w-full sm:w-80">
              <Select
                label="Upload into album"
                value={albumValue}
                onChange={handleSelectChange}
                disabled={batchActive}
                helperText={
                  batchActive
                    ? "Locked while uploads are in progress."
                    : "Archived albums can't receive uploads."
                }
              >
                <option value="">Select an album…</option>
                {selectableAlbums.map((album) => (
                  <option key={album.id} value={album.id}>
                    {album.title}
                  </option>
                ))}
              </Select>
            </div>

            <Button variant="secondary" disabled={!canUpload} onClick={() => dropzoneRef.current?.open()}>
              <Plus size={16} aria-hidden="true" /> Select Files
            </Button>
          </div>

          {!albumValue && (
            <InlineAlert tone="info">Choose a destination album to enable uploads.</InlineAlert>
          )}

          <UploadDropzone
            ref={dropzoneRef}
            onDrop={handleDrop}
            disabled={!canUpload}
            hint="JPEG, PNG, WebP or HEIC · up to 25 MB each"
          />

          <UploadQueue
            items={queue.items}
            stats={queue.stats}
            active={queue.active}
            overall={queue.overall}
            onCancelItem={queue.cancelItem}
            onRetryItem={queue.retryItem}
            onRemoveItem={queue.removeItem}
            onCancelAll={queue.cancelAll}
            onClearFinished={queue.clearFinished}
          />
        </>
      )}
    </div>
  );
}