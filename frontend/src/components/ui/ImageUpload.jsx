import { useEffect, useRef, useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import Button from "./Button";
import { cn } from "../../lib/utils";
import { getInitials } from "../../lib/formatters";
import { toast } from "../../stores/toastStore";

const MAX_BYTES = 2 * 1024 * 1024; // 2 MB

/**
 * Reusable image picker used by Profile (avatar) and Branding (logo).
 *
 * Props:
 *   value      – { name, url } | null  (controlled)
 *   onChange   – called with { name, url } | null
 *   uploadFn   – optional async (file, type) => { url }
 *                If provided, the file is uploaded before onChange is called,
 *                so onChange receives a persistent Cloudinary URL instead of a blob URL.
 *   uploadType – "avatar" | "logo"  (passed to uploadFn)
 *   name       – display name used for the initials fallback (avatar only)
 *   round      – circular vs rounded-square
 */
export default function ImageUpload({
  value,
  onChange,
  label = "Upload image",
  round = false,
  name = "",
  uploadFn = null,
  uploadType = "avatar",
  className,
}) {
  const inputRef = useRef(null);
  const lastBlobRef = useRef(null); // only used when no uploadFn (local preview)
  const [uploading, setUploading] = useState(false);

  // Revoke any local blob URL on unmount
  useEffect(() => {
    return () => {
      if (lastBlobRef.current) URL.revokeObjectURL(lastBlobRef.current);
    };
  }, []);

  async function handleFile(event) {
    const file = event.target.files?.[0];
    event.target.value = ""; // allow re-selecting the same file
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose a PNG or JPG image file.", "Invalid file type");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error(
        "The selected image exceeds the 2 MB size limit. Please choose a smaller file.",
        "Image too large"
      );
      return;
    }

    if (uploadFn) {
      // Priority 2 — upload to Cloudinary via backend, get persistent URL
      setUploading(true);
      try {
        const result = await uploadFn(file, uploadType);
        onChange({ name: file.name, url: result.url });
      } catch (err) {
        toast.error(err.message || "Image upload failed. Please try again.", "Upload failed");
      } finally {
        setUploading(false);
      }
    } else {
      // Fallback: local blob preview (no persistence — used when no uploadFn given)
      const url = URL.createObjectURL(file);
      if (lastBlobRef.current) URL.revokeObjectURL(lastBlobRef.current);
      lastBlobRef.current = url;
      onChange({ name: file.name, url });
    }
  }

  function handleRemove() {
    if (lastBlobRef.current) {
      URL.revokeObjectURL(lastBlobRef.current);
      lastBlobRef.current = null;
    }
    onChange(null);
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden font-semibold text-white",
            round ? "rounded-full" : "rounded-card",
            value?.url ? "" : "bg-olive"
          )}
        >
          {uploading ? (
            <Loader2 size={22} className="animate-spin text-white/80" aria-label="Uploading…" />
          ) : value?.url ? (
            <img
              src={value.url}
              alt={name ? `${name}'s profile photo` : "Profile photo"}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="select-none text-xl">{getInitials(name) || "?"}</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              loading={uploading}
              onClick={() => inputRef.current?.click()}
            >
              {value?.url ? "Change" : label}
            </Button>
            {value?.url && !uploading && (
              <Button type="button" variant="ghost" size="sm" onClick={handleRemove}>
                <Trash2 size={14} aria-hidden="true" /> Remove
              </Button>
            )}
          </div>
          {!value?.url && !uploading && (
            <p className="text-[13px] text-charcoal/50">PNG or JPG, up to 2 MB.</p>
          )}
          {uploading && (
            <p className="text-[13px] text-charcoal/50">Uploading…</p>
          )}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleFile}
        aria-label={label}
        disabled={uploading}
      />
    </div>
  );
}