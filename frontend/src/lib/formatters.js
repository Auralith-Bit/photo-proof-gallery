import { format, formatDistanceToNow } from "date-fns";
import { getLocale } from "../stores/localStore";

export function formatDate(dateString) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "—";
  try {
    return format(date, getLocale().dateFormat);
  } catch {
    return format(date, "MMM d, yyyy");
  }
}

export function formatRelativeTime(dateString) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "—";
  return formatDistanceToNow(date, { addSuffix: true });
}

export function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export const albumStatusMap = {
  active: { label: "Active", tone: "active" },
  draft: { label: "Draft", tone: "draft" },
  archived: { label: "Archived", tone: "archived" },
};

export const clientStatusMap = {
  active: { label: "Active", tone: "active" },
  archived: { label: "Archived", tone: "archived" },
};

export function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}