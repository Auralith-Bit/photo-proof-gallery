import { Aperture, Check, Download, LogOut, MoreVertical, Images } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/DropdownMenu";

function BrandMark({ branding }) {
  const showLogo = branding.logoStyle === "logo" || branding.logoStyle === "both";
  const showName = branding.logoStyle === "name" || branding.logoStyle === "both";
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      {showLogo &&
        (branding.logoUrl ? (
          <img src={branding.logoUrl} alt="" className="h-8 w-8 shrink-0 rounded-md object-cover" />
        ) : (
          <Aperture size={24} className="shrink-0 text-gold" aria-hidden="true" />
        ))}
      {showName && (
        <span className="truncate font-serif text-lg text-charcoal">
          {branding.studioName?.trim() || "Frameora"}
        </span>
      )}
    </div>
  );
}

export default function ClientHeader({
  branding,
  album,
  allowDownload,
  selectionMode,
  selectedCount,
  onToggleSelect,
  onDownloadAll,
  onDownloadSelected,
  onLeave,
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-sand bg-ivory/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 md:px-8">
        <BrandMark branding={branding} />

        <div className="ml-auto flex min-w-0 flex-1 flex-col items-end text-right md:items-center md:flex-none md:text-center">
          <h1 className="max-w-[42ch] truncate font-serif text-lg text-charcoal md:text-xl">
            {album.title}
          </h1>
          <p className="flex items-center gap-2 text-[13px] text-charcoal/55">
            {album.eventDate && <span>{new Date(album.eventDate).toLocaleDateString()}</span>}
            <span className="flex items-center gap-1">
              <Images size={12} aria-hidden="true" />
              {album.photoCount}
            </span>
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {allowDownload && (
            <button
              type="button"
              onClick={onToggleSelect}
              aria-pressed={selectionMode}
              className={`hidden items-center gap-1.5 rounded-control px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive/60 sm:flex ${
                selectionMode ? "bg-olive text-white" : "text-charcoal/70 hover:bg-sand/60 hover:text-charcoal"
              }`}
            >
              <Check size={15} aria-hidden="true" />
              {selectionMode ? "Selecting" : "Select"}
            </button>
          )}

          <DropdownMenu
            align="end"
            trigger={
              <button
                type="button"
                aria-label="Gallery options"
                className="flex h-9 w-9 items-center justify-center rounded-control text-charcoal/70 hover:bg-sand/60 hover:text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive/60"
              >
                <MoreVertical size={18} aria-hidden="true" />
              </button>
            }
          >
            {allowDownload && (
              <>
                {selectionMode && selectedCount > 0 && (
                  <DropdownMenuItem onSelect={onDownloadSelected}>
                    <Download size={14} aria-hidden="true" /> Download selected ({selectedCount})
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onSelect={onDownloadAll}>
                  <Download size={14} aria-hidden="true" /> Download all ({album.photoCount})
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem onSelect={onLeave}>
              <LogOut size={14} aria-hidden="true" /> Leave gallery
            </DropdownMenuItem>
          </DropdownMenu>
        </div>
      </div>

      {album.description && (
        <p className="mx-auto max-w-[1440px] px-4 pb-3 text-[13px] text-charcoal/55 md:px-8">
          {album.description}
        </p>
      )}
    </header>
  );
}