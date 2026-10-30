import { useState } from "react";
import { Archive, ExternalLink, Pencil, RotateCcw, Trash2, UserCog } from "lucide-react";
import IconButton from "../ui/IconButton";
import ConfirmDialog from "../ui/ConfirmDialog";
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from "../ui/DropdownMenu";
import { useArchiveClient, useRestoreClient, useDeleteClient } from "../../hooks/useClients";

export default function ClientActionsMenu({
  client,
  onOpen,
  onEdit,
  showOpen = true,
  showEdit = true,
}) {
  const archive = useArchiveClient();
  const restore = useRestoreClient();
  const del = useDeleteClient();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const hasTopItems = showOpen || showEdit;
  const albumWord = client.albumCount === 1 ? "album" : "albums";

  return (
    <>
      <DropdownMenu
        align="end"
        trigger={
          <IconButton label={`Actions for ${client.fullName}`}>
            <UserCog size={16} aria-hidden="true" />
          </IconButton>
        }
      >
        {showOpen && (
          <DropdownMenuItem onSelect={onOpen}>
            <ExternalLink size={14} aria-hidden="true" /> Open Profile
          </DropdownMenuItem>
        )}
        {showEdit && (
          <DropdownMenuItem onSelect={onEdit}>
            <Pencil size={14} aria-hidden="true" /> Edit Client
          </DropdownMenuItem>
        )}
        {hasTopItems && <DropdownMenuSeparator />}
        {client.status === "archived" ? (
          <DropdownMenuItem onSelect={() => restore.mutate(client.id)}>
            <RotateCcw size={14} aria-hidden="true" /> Restore
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onSelect={() => archive.mutate(client.id)}>
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
        title="Delete this client?"
        description={`Deleting ${client.fullName} permanently removes their contact details. Their ${client.albumCount} ${albumWord} will remain but will no longer be assigned to any client. This cannot be undone.`}
        confirmLabel="Delete client"
        danger
        loading={del.isPending}
        onConfirm={() => del.mutate(client.id, { onSuccess: () => setConfirmOpen(false) })}
      />
    </>
  );
}