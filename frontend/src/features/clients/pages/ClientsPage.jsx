import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Images, Mail, Phone, Plus, Search, Users } from "lucide-react";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";
import Skeleton from "../../../components/ui/Skeleton";
import EmptyState from "../../../components/ui/EmptyState";
import ErrorState from "../../../components/ui/ErrorState";
import ClientActionsMenu from "../../../components/client/ClientActionsMenu";
import { useClients } from "../../../hooks/useClients";
import { clientStatusMap, formatDate, getInitials } from "../../../lib/formatters";
import { cn } from "../../../lib/utils";

function DirectorySkeleton() {
  return (
    <Card padded={false} className="divide-y divide-sand">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="hidden h-4 w-24 md:block" />
          <Skeleton className="hidden h-4 w-16 md:block" />
        </div>
      ))}
    </Card>
  );
}

export default function ClientsPage() {
  const navigate = useNavigate();
  const { data: clients, isLoading, isError, refetch } = useClients();
  const [term, setTerm] = useState("");

  const filtered = useMemo(() => {
    const list = clients ?? [];
    const q = term.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (c) =>
        c.fullName.toLowerCase().includes(q) ||
        (c.email ?? "").toLowerCase().includes(q) ||
        (c.phone ?? "").toLowerCase().includes(q)
    );
  }, [clients, term]);

  const total = clients?.length ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-semibold leading-9 text-charcoal">Clients</h1>
          <p className="mt-1 text-sm text-charcoal/60">
            {isLoading ? "Loading clients…" : `${total} client${total === 1 ? "" : "s"} in your directory`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search
              size={15}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40"
            />
            <input
              type="search"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Search clients…"
              aria-label="Search clients"
              className="h-10 w-52 rounded-control border border-sand bg-white pl-9 pr-3 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-olive focus:outline-none focus:ring-2 focus:ring-olive/25"
            />
          </div>
          <Button onClick={() => navigate("/clients/new")}>
            <Plus size={16} aria-hidden="true" /> Add Client
          </Button>
        </div>
      </header>

      {isError ? (
        <ErrorState
          title="We couldn't load your clients"
          description="Something went wrong while fetching your client directory."
          onRetry={() => refetch()}
        />
      ) : isLoading ? (
        <DirectorySkeleton />
      ) : total === 0 ? (
        <EmptyState
          icon={Users}
          title="No clients yet"
          description="Organizing albums by client makes it easy to find every gallery for a given person or business. Clients don't need an account to view their albums — they only need the link and password."
        >
          <Button onClick={() => navigate("/clients/new")}>
            <Plus size={16} aria-hidden="true" /> Add Client
          </Button>
          <Button variant="outline" onClick={() => navigate("/albums/new")}>
            <Images size={16} aria-hidden="true" /> Create Album Without a Client
          </Button>
        </EmptyState>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No clients found"
          description={`No clients match "${term}". Try a different name, email, or phone number.`}
        >
          <Button variant="outline" onClick={() => setTerm("")}>
            Clear search
          </Button>
        </EmptyState>
      ) : (
        <>
          {/* Wide screens: semantic table */}
          <div className="hidden md:block">
            <Card padded={false} className="overflow-hidden">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">Client directory</caption>
                <thead className="border-b border-sand bg-ivory/60 text-[13px] font-medium text-charcoal/60">
                  <tr>
                    <th scope="col" className="px-4 py-3">Client</th>
                    <th scope="col" className="px-4 py-3">Contact</th>
                    <th scope="col" className="px-4 py-3">Albums</th>
                    <th scope="col" className="px-4 py-3">Most recent</th>
                    <th scope="col" className="px-4 py-3">Added</th>
                    <th scope="col" className="px-4 py-3"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand">
                  {filtered.map((client) => {
                    const status = clientStatusMap[client.status] ?? clientStatusMap.active;
                    return (
                      <tr key={client.id} className="hover:bg-ivory/50">
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => navigate(`/clients/${client.id}`)}
                            className="flex items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive/60 rounded-control"
                          >
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-olive text-[13px] font-semibold text-white">
                              {getInitials(client.fullName)}
                            </span>
                            <span className="min-w-0">
                              <span className="flex items-center gap-2">
                                <span className="truncate font-medium text-charcoal">{client.fullName}</span>
                                {client.status === "archived" && (
                                  <Badge tone={status.tone}>{status.label}</Badge>
                                )}
                              </span>
                            </span>
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-0.5 text-[13px] text-charcoal/70">
                            <span className="flex items-center gap-1.5">
                              <Mail size={12} aria-hidden="true" />
                              {client.email || "—"}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Phone size={12} aria-hidden="true" />
                              {client.phone || "—"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-charcoal/70">{client.albumCount}</td>
                        <td className="px-4 py-3">
                          {client.latestAlbum ? (
                            <div className="flex flex-col">
                              <span className="max-w-[180px] truncate text-charcoal">{client.latestAlbum.title}</span>
                              <span className="text-[13px] text-charcoal/50">{formatDate(client.latestAlbum.eventDate)}</span>
                            </div>
                          ) : (
                            <span className="text-charcoal/40">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-[13px] text-charcoal/60">{formatDate(client.createdAt)}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex">
                            <ClientActionsMenu
                              client={client}
                              onOpen={() => navigate(`/clients/${client.id}`)}
                              onEdit={() => navigate(`/clients/${client.id}?edit=1`)}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
          </div>

          {/* Narrow screens: stacked cards */}
          <div className="flex flex-col gap-3 md:hidden">
            {filtered.map((client) => {
              const status = clientStatusMap[client.status] ?? clientStatusMap.active;
              return (
                <Card key={client.id} className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => navigate(`/clients/${client.id}`)}
                      className="flex min-w-0 items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive/60 rounded-control"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-olive text-sm font-semibold text-white">
                        {getInitials(client.fullName)}
                      </span>
                      <span className="min-w-0">
                        <span className="flex items-center gap-2">
                          <span className="truncate font-semibold text-charcoal">{client.fullName}</span>
                          {client.status === "archived" && <Badge tone={status.tone}>{status.label}</Badge>}
                        </span>
                        <span className="block text-[13px] text-charcoal/50">
                          {client.albumCount} album{client.albumCount === 1 ? "" : "s"}
                        </span>
                      </span>
                    </button>
                    <ClientActionsMenu
                      client={client}
                      onOpen={() => navigate(`/clients/${client.id}`)}
                      onEdit={() => navigate(`/clients/${client.id}?edit=1`)}
                    />
                  </div>
                  <div className="flex flex-col gap-1 border-t border-sand pt-3 text-[13px] text-charcoal/70">
                    <span className="flex items-center gap-1.5"><Mail size={12} aria-hidden="true" />{client.email || "—"}</span>
                    <span className="flex items-center gap-1.5"><Phone size={12} aria-hidden="true" />{client.phone || "—"}</span>
                    {client.latestAlbum && (
                      <span className="truncate text-charcoal/50">
                        Latest: {client.latestAlbum.title} · {formatDate(client.latestAlbum.eventDate)}
                      </span>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}