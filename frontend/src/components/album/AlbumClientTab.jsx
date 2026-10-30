import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowUpRight,
  Mail,
  PencilLine,
  Phone,
  Search,
  StickyNote,
  Unlink,
  UserPlus,
  Users,
} from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Dialog from "../ui/Dialog";
import ConfirmDialog from "../ui/ConfirmDialog";
import InlineAlert from "../ui/InlineAlert";
import Skeleton from "../ui/Skeleton";
import ClientFormFields from "../client/ClientFormFields";
import { useClients, useClient, useCreateClient } from "../../hooks/useClients";
import { useAssignClient, useUnassignClient } from "../../hooks/useAlbumClient";
import { formatDate } from "../../lib/formatters";
import { cn } from "../../lib/utils";

const createSchema = z.object({
  fullName: z.string().min(2, "Enter the client's full name."),
  email: z
    .string()
    .optional()
    .refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "Enter a valid email address."),
  phone: z.string().optional(),
  notes: z.string().optional(),
});

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

/* ---------- Create + auto-assign dialog ---------- */
function CreateClientDialog({ open, onOpenChange, albumId }) {
  const createClient = useCreateClient();
  const assign = useAssignClient(albumId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createSchema),
    defaultValues: { fullName: "", email: "", phone: "", notes: "" },
  });

  useEffect(() => {
    if (open) reset({ fullName: "", email: "", phone: "", notes: "" });
  }, [open, reset]);

  function onSubmit(values) {
    createClient.mutate(values, {
      onSuccess: (client) => {
        assign.mutate(client.id, { onSuccess: () => onOpenChange(false) });
      },
    });
  }

  const busy = createClient.isPending || assign.isPending;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Create a new client"
      description="The client will be added to your directory and assigned to this album."
      width="max-w-md"
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>
            Cancel
          </Button>
          <Button type="submit" form="create-client-form" loading={busy}>
            Create &amp; assign
          </Button>
        </>
      }
    >
      <form id="create-client-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <ClientFormFields register={register} errors={errors} />
      </form>
    </Dialog>
  );
}

/* ---------- Select existing client dialog ---------- */
function SelectClientDialog({ open, onOpenChange, albumId, currentClientId, clients, onCreateNew }) {
  const assign = useAssignClient(albumId);
  const [term, setTerm] = useState("");
  const [selected, setSelected] = useState(currentClientId || "");

  useEffect(() => {
    if (open) {
      setTerm("");
      setSelected(currentClientId || "");
      assign.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const filtered = (clients ?? []).filter((c) =>
    c.fullName.toLowerCase().includes(term.trim().toLowerCase())
  );

  function onConfirm() {
    if (!selected) return;
    assign.mutate(selected, { onSuccess: () => onOpenChange(false) });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={currentClientId ? "Change assigned client" : "Assign a client"}
      description="Select a client from your directory. This only affects this album."
      width="max-w-md"
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={assign.isPending}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={!selected || assign.isPending} loading={assign.isPending}>
            Assign client
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search size={15} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" />
          <input
            type="search"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search clients…"
            aria-label="Search clients"
            className="h-10 w-full rounded-control border border-sand bg-white pl-9 pr-3 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-olive focus:outline-none focus:ring-2 focus:ring-olive/25"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <p className="text-sm text-charcoal/60">
              {clients?.length ? "No clients match your search." : "You don't have any clients yet."}
            </p>
            <Button variant="outline" size="sm" onClick={onCreateNew}>
              <UserPlus size={14} aria-hidden="true" /> Create a client
            </Button>
          </div>
        ) : (
          <ul className="max-h-72 divide-y divide-sand overflow-y-auto rounded-control border border-sand">
            {filtered.map((client) => {
              const isSelected = selected === client.id;
              const isCurrent = currentClientId === client.id;
              return (
                <li key={client.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(client.id)}
                    aria-pressed={isSelected}
                    className={cn(
                      "flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-olive/60",
                      isSelected ? "bg-olive/10" : "hover:bg-ivory"
                    )}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-olive text-sm font-semibold text-white">
                      {initials(client.fullName)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-charcoal">
                        {client.fullName}
                      </span>
                      <span className="block truncate text-[13px] text-charcoal/50">
                        {client.email || client.phone || "No contact details"}
                      </span>
                    </span>
                    {isCurrent && (
                      <span className="shrink-0 rounded-full bg-sand px-2 py-0.5 text-[11px] font-medium text-charcoal/60">
                        Current
                      </span>
                    )}
                    {isSelected && !isCurrent && (
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-olive" aria-hidden="true" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Dialog>
  );
}

/* ---------- Assigned state ---------- */
function AssignedPanel({ album, client, onChange, onUnassign }) {
  return (
    <Card className="flex flex-col gap-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-olive text-base font-semibold text-white">
            {initials(client.fullName)}
          </span>
          <div>
            <h2 className="text-lg font-semibold text-charcoal">{client.fullName}</h2>
            <p className="text-[13px] text-charcoal/50">Client since {formatDate(client.createdAt)}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={onChange}>
            <PencilLine size={14} aria-hidden="true" /> Change client
          </Button>
          <Button variant="ghost" size="sm" onClick={onUnassign}>
            <Unlink size={14} aria-hidden="true" /> Unassign
          </Button>
        </div>
      </div>

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

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-sand pt-4">
        <p className="text-sm text-charcoal/60">
          <span className="font-semibold text-charcoal">{client.albumCount}</span>{" "}
          album{client.albumCount === 1 ? "" : "s"} associated with this client
        </p>
        <Link
          to={`/clients/${client.id}`}
          className="flex items-center gap-1 rounded text-sm font-medium text-olive hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive/60"
        >
          View client profile <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
      </div>

      <p className="text-[13px] text-charcoal/50">
        Changing or unassigning the client only updates this album. The client's record and their
        other albums are never deleted.
      </p>
    </Card>
  );
}

/* ---------- Unassigned state ---------- */
function UnassignedPanel({ onAssignExisting, onCreateNew }) {
  return (
    <Card className="flex flex-col items-center gap-4 px-6 py-12 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sand/60 text-olive">
        <Users size={20} aria-hidden="true" />
      </span>
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold text-charcoal">No client assigned</h2>
        <p className="max-w-sm text-sm text-charcoal/60">
          Assigning a client keeps your albums organized and makes it easy to find everything for a
          given person or business.
        </p>
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={onAssignExisting}>
          <Users size={16} aria-hidden="true" /> Assign existing client
        </Button>
        <Button variant="outline" onClick={onCreateNew}>
          <UserPlus size={16} aria-hidden="true" /> Create new client
        </Button>
      </div>
      <p className="mt-1 text-[13px] text-charcoal/50">
        Clients don't need an account to view their album — they only need the link and password.
      </p>
    </Card>
  );
}

/* ---------- Panel + guard ---------- */
function ClientPanel({ album }) {
  const clientId = album.clientId;
  const { data: clients } = useClients();
  const { data: client, isLoading: clientLoading, isError: clientError } = useClient(clientId);
  const unassign = useUnassignClient(album.id);

  const [selectOpen, setSelectOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [unassignOpen, setUnassignOpen] = useState(false);

  function openCreateFromSelect() {
    setSelectOpen(false);
    setCreateOpen(true);
  }

  if (!clientId) {
    return (
      <>
        <UnassignedPanel onAssignExisting={() => setSelectOpen(true)} onCreateNew={() => setCreateOpen(true)} />
        <SelectClientDialog
          open={selectOpen}
          onOpenChange={setSelectOpen}
          albumId={album.id}
          currentClientId={null}
          clients={clients}
          onCreateNew={openCreateFromSelect}
        />
        <CreateClientDialog open={createOpen} onOpenChange={setCreateOpen} albumId={album.id} />
      </>
    );
  }

  if (clientLoading) {
    return (
      <Card className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-20 w-full" />
      </Card>
    );
  }

  if (clientError || !client) {
    return (
      <Card className="flex flex-col gap-4">
        <InlineAlert tone="error">
          The assigned client record could not be found. You can assign a different client.
        </InlineAlert>
        <div>
          <Button variant="outline" size="sm" onClick={() => setSelectOpen(true)}>
            <Users size={14} aria-hidden="true" /> Assign a client
          </Button>
        </div>
        <SelectClientDialog
          open={selectOpen}
          onOpenChange={setSelectOpen}
          albumId={album.id}
          currentClientId={null}
          clients={clients}
          onCreateNew={openCreateFromSelect}
        />
        <CreateClientDialog open={createOpen} onOpenChange={setCreateOpen} albumId={album.id} />
      </Card>
    );
  }

  return (
    <>
      <AssignedPanel
        album={album}
        client={client}
        onChange={() => setSelectOpen(true)}
        onUnassign={() => setUnassignOpen(true)}
      />

      <SelectClientDialog
        open={selectOpen}
        onOpenChange={setSelectOpen}
        albumId={album.id}
        currentClientId={clientId}
        clients={clients}
        onCreateNew={openCreateFromSelect}
      />
      <CreateClientDialog open={createOpen} onOpenChange={setCreateOpen} albumId={album.id} />

      <ConfirmDialog
        open={unassignOpen}
        onOpenChange={setUnassignOpen}
        title="Unassign this client?"
        description={`"${client.fullName}" will no longer be linked to this album. Their client record and other albums stay intact.`}
        confirmLabel="Unassign"
        loading={unassign.isPending}
        onConfirm={() => unassign.mutate(undefined, { onSuccess: () => setUnassignOpen(false) })}
      />
    </>
  );
}

export default function AlbumClientTab() {
  const context = useOutletContext();
  const album = context?.album;

  if (!album) {
    return (
      <Card className="flex flex-col gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-20 w-full" />
      </Card>
    );
  }

  return <ClientPanel album={album} />;
}