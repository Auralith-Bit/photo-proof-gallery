import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CalendarDays, Images, Mail, Pencil, Phone, Plus, StickyNote, UserPlus } from "lucide-react";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";
import Skeleton from "../../../components/ui/Skeleton";
import EmptyState from "../../../components/ui/EmptyState";
import ClientFormFields from "../../../components/client/ClientFormFields";
import ClientActionsMenu from "../../../components/client/ClientActionsMenu";
import { clientSchema } from "../clientSchema";
import { useClient, useUpdateClient } from "../../../hooks/useClients";
import { useAlbums } from "../../../hooks/useAlbums";
import { albumStatusMap, clientStatusMap, formatDate, getInitials } from "../../../lib/formatters";

function ClientEditForm({ client, onDone }) {
  const update = useUpdateClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      fullName: client.fullName,
      email: client.email || "",
      phone: client.phone || "",
      notes: client.notes || "",
    },
  });

  function onSubmit(values) {
    update.mutate(
      { clientId: client.id, data: values },
      { onSuccess: () => onDone(false) }
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <ClientFormFields register={register} errors={errors} />
      <div className="flex items-center justify-end gap-3 border-t border-sand pt-4">
        <Button type="button" variant="outline" onClick={() => onDone(false)} disabled={update.isPending}>
          Cancel
        </Button>
        <Button type="submit" loading={update.isPending}>
          Save changes
        </Button>
      </div>
    </form>
  );
}

function AssociatedAlbums({ albums, clientId, onAdd }) {
  if (albums.length === 0) {
    return (
      <Card className="flex flex-col items-center gap-3 px-6 py-10 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sand/60 text-olive">
          <Images size={20} aria-hidden="true" />
        </span>
        <div>
          <h3 className="text-base font-semibold text-charcoal">No albums yet</h3>
          <p className="mt-1 text-sm text-charcoal/60">Create an album and assign it to this client.</p>
        </div>
        <Button onClick={onAdd}>
          <Plus size={16} aria-hidden="true" /> Add Album
        </Button>
      </Card>
    );
  }

  return (
    <Card padded={false} className="divide-y divide-sand">
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="text-lg font-semibold text-charcoal">Associated Albums</h2>
        <Button variant="outline" size="sm" onClick={onAdd}>
          <Plus size={14} aria-hidden="true" /> Add Album
        </Button>
      </div>
      <ul>
        {albums.map((album) => {
          const status = albumStatusMap[album.status] ?? albumStatusMap.active;
          return (
            <li key={album.id}>
              <AssociatedAlbumRow album={album} status={status} />
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

function AssociatedAlbumRow({ album, status }) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => navigate(`/albums/${album.id}`)}
      className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-ivory/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-olive/60"
    >
      <span className="h-10 w-12 shrink-0 overflow-hidden rounded-control bg-sand/60">
        {album.coverPhotoUrl ? (
          <img src={album.coverPhotoUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
        ) : null}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-charcoal">{album.title}</span>
        <span className="flex items-center gap-3 text-[13px] text-charcoal/50">
          <span className="flex items-center gap-1">
            <CalendarDays size={12} aria-hidden="true" />
            {formatDate(album.eventDate)}
          </span>
          <span className="flex items-center gap-1">
            <Images size={12} aria-hidden="true" />
            {album.photoCount}
          </span>
        </span>
      </span>
      <Badge tone={status.tone}>{status.label}</Badge>
    </button>
  );
}

export default function ClientDetailsPage() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: client, isLoading, isError } = useClient(clientId);
  const albumsQuery = useAlbums();
  const [editMode, setEditMode] = useState(() => searchParams.get("edit") === "1");

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-5 w-32" />
        <Card className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
          <Skeleton className="h-24 w-full" />
        </Card>
      </div>
    );
  }

  if (isError || !client) {
    return (
      <EmptyState
        icon={UserPlus}
        title="Client not found"
        description="This client record may have been deleted."
      >
        <Button variant="outline" onClick={() => navigate("/clients")}>
          Back to Clients
        </Button>
      </EmptyState>
    );
  }

  const status = clientStatusMap[client.status] ?? clientStatusMap.active;
  const clientAlbums = (albumsQuery.data ?? []).filter((a) => a.clientId === client.id);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <button
        type="button"
        onClick={() => navigate("/clients")}
        className="flex items-center gap-1.5 rounded-control text-sm font-medium text-charcoal/60 hover:text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive/60"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back to Clients
      </button>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-olive text-base font-semibold text-white">
            {getInitials(client.fullName)}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-[24px] font-semibold leading-8 text-charcoal">{client.fullName}</h1>
              <Badge tone={status.tone}>{status.label}</Badge>
            </div>
            <p className="mt-0.5 text-[13px] text-charcoal/50">Client since {formatDate(client.createdAt)}</p>
          </div>
        </div>

        {!editMode && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>
              <Pencil size={14} aria-hidden="true" /> Edit
            </Button>
            <ClientActionsMenu client={client} showOpen={false} showEdit={false} />
          </div>
        )}
      </header>

      <Card className="flex flex-col gap-5">
        {editMode ? (
          <ClientEditForm client={client} onDone={setEditMode} />
        ) : (
          <>
            <h2 className="text-lg font-semibold text-charcoal">Contact Information</h2>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-2.5">
                <Mail size={16} className="mt-0.5 shrink-0 text-olive" aria-hidden="true" />
                <div className="min-w-0">
                  <dt className="text-[13px] font-medium text-charcoal/50">Email</dt>
                  <dd className="truncate text-sm text-charcoal">{client.email || "—"}</dd>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone size={16} className="mt-0.5 shrink-0 text-olive" aria-hidden="true" />
                <div className="min-w-0">
                  <dt className="text-[13px] font-medium text-charcoal/50">Phone</dt>
                  <dd className="truncate text-sm text-charcoal">{client.phone || "—"}</dd>
                </div>
              </div>
              <div className="flex items-start gap-2.5 sm:col-span-2">
                <StickyNote size={16} className="mt-0.5 shrink-0 text-olive" aria-hidden="true" />
                <div className="min-w-0">
                  <dt className="text-[13px] font-medium text-charcoal/50">Internal notes</dt>
                  <dd className="text-sm text-charcoal">{client.notes || "No notes."}</dd>
                </div>
              </div>
            </dl>
          </>
        )}
      </Card>

      <AssociatedAlbums
        albums={clientAlbums}
        clientId={client.id}
        onAdd={() => navigate(`/albums/new?client=${client.id}`)}
      />
    </div>
  );
}