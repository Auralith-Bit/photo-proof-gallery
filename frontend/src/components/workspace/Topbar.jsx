import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Menu, PanelLeft, Plus, Search } from "lucide-react";
import Button from "../ui/Button";
import IconButton from "../ui/IconButton";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/DropdownMenu";
import { useUiStore } from "../../stores/uiStore";
import Breadcrumbs from "./Breadcrumbs";

export default function Topbar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const setDrawerOpen = useUiStore((s) => s.setMobileDrawerOpen);

  function handleSearch(event) {
    event.preventDefault();
    const term = query.trim();
    if (term) navigate(`/albums?q=${encodeURIComponent(term)}`);
  }

  return (
    <header className="sticky top-0 z-30 border-b border-sand bg-ivory/95 backdrop-blur">
      <div className="flex h-16 items-center gap-2 px-4 md:gap-3 md:px-8">
        <IconButton label="Open navigation menu" className="lg:hidden" onClick={() => setDrawerOpen(true)}>
          <Menu size={18} aria-hidden="true" />
        </IconButton>
        <IconButton label="Toggle sidebar" className="hidden lg:inline-flex" onClick={toggleSidebar}>
          <PanelLeft size={18} aria-hidden="true" />
        </IconButton>

        <Breadcrumbs />

        <div className="ml-auto flex items-center gap-2 md:gap-3">
          <form onSubmit={handleSearch} role="search" className="relative hidden sm:block">
            <Search
              size={15}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search albums…"
              aria-label="Search albums"
              className="h-10 w-44 rounded-control border border-sand bg-white pl-9 pr-3 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-olive focus:outline-none focus:ring-2 focus:ring-olive/25 lg:w-56"
            />
          </form>

          <Button onClick={() => navigate("/albums/new")} className="hidden sm:inline-flex">
            <Plus size={16} aria-hidden="true" />
            Create Album
          </Button>
          <IconButton label="Create album" className="sm:hidden" onClick={() => navigate("/albums/new")}>
            <Plus size={18} aria-hidden="true" />
          </IconButton>

          <DropdownMenu
            align="end"
            trigger={
              <IconButton label="Notifications">
                <Bell size={18} aria-hidden="true" />
              </IconButton>
            }
          >
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <div className="px-2.5 py-6 text-center text-sm text-charcoal/60">
              No notifications yet.
            </div>
          </DropdownMenu>

          <DropdownMenu
            align="end"
            trigger={
              <button
                type="button"
                aria-label="Account menu"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-olive text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
              >
                FP
              </button>
            }
          >
            <DropdownMenuLabel>Signed in as Photographer</DropdownMenuLabel>
            <DropdownMenuItem onSelect={() => navigate("/settings/profile")}>Profile</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => navigate("/settings/branding")}>Studio Branding</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => navigate("/settings/security")}>Security</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => navigate("/login")}>Sign Out</DropdownMenuItem>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}