import { useEffect, useRef, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import Button from "./Button";
import { cn } from "../../lib/utils";

const MAX_BYTES = 2 * 1024 * 1024; // 2 MB

// Reusable image picker used by Profile (avatar) and Branding (logo).
// Calls onChange({ name, url } | null). Object URLs are revoked on replace/unmount.
export default function ImageUpload({ value, onChange, label = "Upload image", round = false, className }) {
  const inputRef = useRef(null);
  const lastUrlRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (lastUrlRef.current) URL.revokeObjectURL(lastUrlRef.current);
    };
  }, []);

  function handleFile(event) {
    setError("");
    const file = event.target.files?.[0];
    event.target.value = ""; // allow re-selecting the same file
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError("Please choose an image file.");
    if (file.size > MAX_BYTES) return setError("Image must be 2 MB or smaller.");

    const url = URL.createObjectURL(file);
    if (lastUrlRef.current) URL.revokeObjectURL(lastUrlRef.current);
    lastUrlRef.current = url;
    onChange({ name: file.name, url });
  }

  function handleRemove() {
    if (lastUrlRef.current) {
      URL.revokeObjectURL(lastUrlRef.current);
      lastUrlRef.current = null;
    }
    onChange(null);
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden border border-sand bg-ivory text-charcoal/30",
            round ? "rounded-full" : "rounded-card"
          )}
        >
          {value?.url ? (
            <img src={value.url} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImagePlus size={20} aria-hidden="true" />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
              {value?.url ? "Change" : label}
            </Button>
            {value?.url && (
              <Button type="button" variant="ghost" size="sm" onClick={handleRemove}>
                <Trash2 size={14} aria-hidden="true" /> Remove
              </Button>
            )}
          </div>
          {value?.name && <p className="max-w-[200px] truncate text-[13px] text-charcoal/50">{value.name}</p>}
          <p className="text-[13px] text-charcoal/50">PNG or JPG, up to 2 MB.</p>
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={handleFile} aria-label={label} />
      {error && <p className="text-[13px] text-error">{error}</p>}
    </div>
  );
}