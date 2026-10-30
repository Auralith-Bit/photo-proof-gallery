import { useCallback, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Check, Download, Trash2, X } from "lucide-react";
import Button from "../../../components/ui/Button";
import ClientHeader from "../../../components/gallery/ClientHeader";
import ClientGalleryGrid from "../../../components/gallery/ClientGalleryGrid";
import ClientLightbox from "../../../components/gallery/ClientLightbox";
import { useClientSessionStore } from "../../../stores/clientAccessStore";
import { downloadPhotos } from "../../../lib/downloads";
import { toast } from "../../../stores/toastStore";

export default function ClientGalleryPage() {
  const { accessToken } = useParams();
  const navigate = useNavigate();
  const session = useClientSessionStore((s) => s.sessions[accessToken]);
  const revoke = useClientSessionStore((s) => s.revoke);

  const [selected, setSelected] = useState(() => new Set());
  const [selectionMode, setSelectionMode] = useState(false);
  const [lightbox, setLightbox] = useState(-1);

  const photos = session?.photos ?? [];
  const allowDownload = Boolean(session?.album?.allowDownload);

  const toggle = useCallback((index) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }, []);

  const selectedPhotos = useMemo(
    () => photos.filter((_, i) => selected.has(i)),
    [photos, selected]
  );

  // ---- Access guard: no verified session => return to the gate. ----
  if (!session) {
    return <Navigate to={`/a/${accessToken}`} replace />;
  }

  function handleDownloadAll() {
    if (!allowDownload || photos.length === 0) return;
    toast.info(`Preparing ${photos.length} downloads…`);
    downloadPhotos(photos);
  }

  function handleDownloadSelected() {
    if (!allowDownload || selectedPhotos.length === 0) return;
    toast.info(`Preparing ${selectedPhotos.length} downloads…`);
    downloadPhotos(selectedPhotos);
  }

  function handleLeave() {
    revoke(accessToken);
    navigate(`/a/${accessToken}`, { replace: true });
  }

  function exitSelection() {
    setSelectionMode(false);
    setSelected(new Set());
  }

  return (
    <div className="min-h-screen bg-ivory">
      <ClientHeader
        branding={session.branding}
        album={session.album}
        allowDownload={allowDownload}
        selectionMode={selectionMode}
        selectedCount={selected.size}
        onToggleSelect={() => (selectionMode ? exitSelection() : setSelectionMode(true))}
        onDownloadAll={handleDownloadAll}
        onDownloadSelected={handleDownloadSelected}
        onLeave={handleLeave}
      />

      <main className="mx-auto max-w-[1440px] px-4 py-6 md:px-8">
        {photos.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-24 text-center">
            <p className="text-base font-semibold text-charcoal">No photos yet</p>
            <p className="text-sm text-charcoal/60">Your photographer hasn't added any photographs to this gallery.</p>
          </div>
        ) : (
          <ClientGalleryGrid
            photos={photos}
            selectionMode={selectionMode}
            selected={selected}
            onToggle={toggle}
            onOpen={setLightbox}
          />
        )}
      </main>

      {session.branding.showFooter && session.branding.footerText && (
        <footer className="border-t border-sand py-6">
          <p className="px-4 text-center text-[13px] text-charcoal/55">{session.branding.footerText}</p>
        </footer>
      )}

      {/* Selection action bar */}
      {selectionMode && allowDownload && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-sand bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-4 py-3 md:px-8">
            <p className="flex items-center gap-2 text-sm font-medium text-charcoal">
              <Check size={15} className="text-olive" aria-hidden="true" />
              {selected.size} selected
            </p>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={exitSelection}>
                <X size={15} aria-hidden="true" /> Clear
              </Button>
              <Button size="sm" disabled={selected.size === 0} onClick={handleDownloadSelected}>
                <Download size={15} aria-hidden="true" /> Download
              </Button>
            </div>
          </div>
        </div>
      )}

      {lightbox >= 0 && (
        <ClientLightbox
          photos={photos}
          index={lightbox}
          allowDownload={allowDownload}
          onClose={() => setLightbox(-1)}
          onPrev={() => setLightbox((i) => Math.max(0, i - 1))}
          onNext={() => setLightbox((i) => Math.min(photos.length - 1, i + 1))}
        />
      )}
    </div>
  );
}