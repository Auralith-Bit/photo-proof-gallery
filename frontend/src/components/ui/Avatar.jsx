import { getInitials } from "../../lib/formatters";
import { cn } from "../../lib/utils";

const sizes = {
  sm: "h-9 w-9 text-[13px]",
  md: "h-12 w-12 text-base",
  lg: "h-16 w-16 text-xl",
};

export default function Avatar({ src, name = "", size = "md", alt, className }) {
  const dims = sizes[size] ?? sizes.md;
  if (src) {
    return (
      <img
        src={src}
        alt={alt ?? (name ? `${name}'s profile photo` : "Profile photo")}
        className={cn("shrink-0 rounded-full object-cover", dims, className)}
      />
    );
  }
  return (
    <span
      aria-hidden={name ? undefined : true}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-olive font-semibold text-white",
        dims,
        className
      )}
    >
      {getInitials(name) || "?"}
    </span>
  );
}