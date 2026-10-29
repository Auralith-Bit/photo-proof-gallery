import { useDropzone } from "react-dropzone";
import { Upload, Image as ImageIcon } from "lucide-react";
import { cn } from "../../lib/utils";

const ACCEPT = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/heic": [".heic"],
  "image/webp": [".webp"],
};

export default function UploadDropzone({ onDrop, disabled }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: ACCEPT,
    onDrop,
    disabled,
    multiple: true,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-card border-2 border-dashed px-6 py-10 text-center transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive/60",
        isDragActive
          ? "border-olive bg-olive/5"
          : "border-sand bg-white hover:border-olive/50 hover:bg-ivory",
        disabled && "cursor-not-allowed opacity-50 hover:border-sand hover:bg-white"
      )}
    >
      <input {...getInputProps()} aria-label="Upload photos" />
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ivory text-olive">
        {isDragActive ? <ImageIcon size={22} aria-hidden="true" /> : <Upload size={22} aria-hidden="true" />}
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-base font-semibold text-charcoal">
          {isDragActive ? "Drop photos here" : "Drag and drop photos"}
        </p>
        <p className="text-sm text-charcoal/60">
          or <span className="font-medium text-olive">browse files</span>
        </p>
        <p className="mt-1 text-xs text-charcoal/50">
          Supports JPEG, PNG, WebP, and HEIC
        </p>
      </div>
    </div>
  );
}