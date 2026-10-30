import { Aperture, Image as ImageIcon } from "lucide-react";
import { cn } from "../../lib/utils";

// LIVE preview: reads the current (possibly unsaved) form values and reflects
// exactly the configurable branding options — nothing more.
export default function BrandingPreview({ studioName, logoUrl, logoStyle, showFooter, footerText }) {
  const showLogo = logoStyle === "logo" || logoStyle === "both";
  const showName = logoStyle === "name" || logoStyle === "both";

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
        <span className="shrink-0 text-[13px] text-charcoal/50">24 photos</span>
      </div>

      <div className="grid grid-cols-3 gap-2 p-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex aspect-square items-center justify-center rounded-control bg-sand/60 text-charcoal/25"
          >
            <ImageIcon size={18} aria-hidden="true" />
          </div>
        ))}
      </div>

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