import {
  Eye,
  FolderPlus,
  Info,
  KeyRound,
  Link2,
  Pencil,
  Upload,
} from "lucide-react";
import { formatRelativeTime } from "../../lib/formatters";

const iconMap = {
  album_created: FolderPlus,
  photos_uploaded: Upload,
  album_updated: Pencil,
  password_changed: KeyRound,
  album_link_copied: Link2,
  client_accessed: Eye,
};

export default function ActivityItem({ activity }) {
  const Icon = iconMap[activity.type] ?? Info;

  return (
    <li className="flex items-start gap-3 py-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ivory text-olive">
        <Icon size={14} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-charcoal">{activity.message}</p>
        <p className="mt-0.5 text-[13px] text-charcoal/50">
          {formatRelativeTime(activity.createdAt)}
        </p>
      </div>
    </li>
  );
}