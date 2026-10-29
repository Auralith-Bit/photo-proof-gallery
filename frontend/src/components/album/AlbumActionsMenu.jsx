import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Archive,
  Copy,
  ExternalLink,
  Eye,
  FolderDown,
  MoreHorizontal,
  Pencil,
  RotateCcw,
  Share2,
  Trash2,
} from "lucide-react";
import IconButton from "../ui/IconButton";
import ConfirmDialog from "../ui/ConfirmDialog";
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from "../ui/DropdownMenu";
import { useArchiveAlbum, useRestoreAlbum, useDeleteAlbum } from "../../hooks/useAlbums";
import { buildAlbumLink, downloadAlbumQr } from "../../lib/sharing";
import { toast } from "../../stores/toastStore";

export default function AlbumActionsMenu({ album, variant = "card" }) {
  const navigate = useNavigate();
  const archiveMutation = useArchiveAlbum();
  const restoreMutation = useRestoreAlbum();
  const deleteMutation = useDeleteAlbum();
  const [confirmOpen, setConfirmOpen] = useState(false);

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(buildAlbumLink(album));
      toast.success("Album link copied to clipboard.");
    } catch {
      toast.error("Couldn't copy the link. Please copy it from the Privacy tab.");
    }
  }

  async function handleQrDownload() {
    try {
      await downloadAlbumQr(album);
      toast.success("QR code downloaded.");
    } catch {
      toast.error("Couldn't generate the QR code.");
    }
  }

  return (
    <>
      <DropdownMenu
        align="end"
        trigger={
          <IconButton
            label={`Actions for ${album.title}`}
            className={variant === "card" ? "bg-white/90 hover:bg-white" : undefined}
          >
            <MoreHorizontal size={16} aria-hidden="true" />
          </IconButton>
        }
      >
        <DropdownMenuItem onSelect={() => navigate(`/albums/${album.id}`)}>
          <ExternalLink size={14} aria-hidden="true" /> Open Album
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => navigate(`/albums/${album.id}/details`)}>
          <Pencil size={14} aria-hidden="true" /> Edit Details
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => navigate(`/albums/${album.id}/privacy`)}>
          <Share2 size={14} aria-hidden="true" /> Manage Privacy
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => navigate(`/a/${album.accessToken}/gallery`)}>
          <Eye size={14} aria-hidden="true" /> Preview Client Gallery
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleCopyLink}>
          <Copy size={14} aria-hidden="true" /> Copy Album Link
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleQrDownload}>
          <FolderDown size={14} aria-hidden="true" /> Download QR Code
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {album.status === "archived" ? (
          <DropdownMenuItem onSelect={() => restoreMutation.mutate(album.id)}>
            <RotateCcw size={14} aria-hidden="true" /> Restore
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onSelect={() => archiveMutation.mutate(album.id)}>
            <Archive size={14} aria-hidden="true" /> Archive
          </DropdownMenuItem>
        )}
        <DropdownMenuItem danger onSelect={() => setConfirmOpen(true)}>
          <Trash2 size={14} aria-hidden="true" /> Delete
        </DropdownMenuItem>
      </DropdownMenu>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete this album?"
        description={`"${album.title}" and its photos will be permanently removed, and clients will lose access immediately. This cannot be undone.`}
        confirmLabel="Delete album"
        danger
        loading={deleteMutation.isPending}
        onConfirm={() =>
          deleteMutation.mutate(album.id, { onSuccess: () => setConfirmOpen(false) })
        }
      />
    </>
  );
}