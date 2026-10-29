import { cn } from "../../lib/utils";

export default function Skeleton({ className }) {
  return <div className={cn("animate-pulse rounded-md bg-sand/70", className)} aria-hidden="true" />;
}