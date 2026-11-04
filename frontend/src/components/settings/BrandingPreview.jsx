import { Aperture, Image as ImageIcon } from "lucide-react";
import { cn } from "../../lib/utils";

// LIVE preview: reads the current (possibly unsaved) form values plus real
// gallery data (photos + total count) and reflects exactly what a client
// would see — nothing more.
export default function BrandingPreview({
  studioName,
  logoUrl,
  logoStyle,
  showFooter,
  footerText,
  photos = [],
  photoCount = 0,
}) {
  const showLogo = logoStyle === "logo" || logoStyle === "both";
  const showName = logoStyle === "name" || logoStyle === "both";

  const visible = photos.slice(0, 6);
  const placeholders = Math.max(0, 6 - visible.length);

  return (
    <div className="overflow-hidden rounded-card border border-sand bg-ivory">
      <div className="flex items-center justify-between gap-2 border-b border-sand bg-white px-4 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          {showLogo &&
            (logoUrl ? (
              <img src={logoUrl} alt="" className="h-7 w-7 rounded-md object-cover" />
            ) : (
              <Aperture size={22} className="shrink-0 text-gold" aria-hidden="true" />
            ))}
          {showName && (
            <span className="truncate font-serif text-lg text-charcoal">
              {studioName?.trim() || "Studio name"}
            </span>
          )}
        </div>
        <span className="shrink-0 text-[13px] text-charcoal/50">
          {photoCount === 1 ? "1 photo" : `${photoCount} photos`}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 p-4">
        {visible.map((photo) => (
          <div
            key={photo.id}
            className="aspect-square overflow-hidden rounded-control bg-sand/60"
          >
            <img
              src={photo.thumbnailUrl || photo.url}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        ))}
        {Array.from({ length: placeholders }).map((_, i) => (
          <div
            key={`ph_${i}`}
            className="flex aspect-square items-center justify-center rounded-control bg-sand/60 text-charcoal/25"
          >
            <ImageIcon size={18} aria-hidden="true" />
          </div>
        ))}
      </div>

      {visible.length === 0 && (
        <p className="px-4 pb-4 text-center text-[13px] text-charcoal/40">
          Upload photos to see them in the preview.
        </p>
      )}

      {showFooter && (
        <div className="border-t border-sand bg-white px-4 py-3">
          <p className={cn("text-center text-[13px]", footerText?.trim() ? "text-charcoal/60" : "text-charcoal/30")}>
            {footerText?.trim() || "Gallery footer text appears here."}
          </p>
        </div>
      )}
    </div>
  );
}
