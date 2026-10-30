import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import QRCode from "qrcode";
import {
  Copy,
  Download,
  ExternalLink,
  KeyRound,
  Link2,
  RefreshCw,
  ShieldCheck,
  ShieldOff,
} from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Switch from "../ui/Switch";
import Dialog from "../ui/Dialog";
import ConfirmDialog from "../ui/ConfirmDialog";
import PasswordInput from "../ui/PasswordInput";
import InlineAlert from "../ui/InlineAlert";
import Skeleton from "../ui/Skeleton";
import {
  useSetAccessEnabled,
  useSetDownloadPermission,
  useSetAlbumPassword,
  useRemoveAlbumPassword,
  useRegenerateAlbumLink,
} from "../../hooks/useAlbumPrivacy";
import { buildAlbumLink, downloadAlbumQr } from "../../lib/sharing";
import { toast } from "../../stores/toastStore";

function PasswordDialog({ open, onOpenChange, albumId, isChange }) {
  const setPassword = useSetAlbumPassword();
  const [password, setPasswordValue] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setPasswordValue("");
      setConfirm("");
      setError("");
      setPassword.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function handleSave() {
    setError("");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirm) return setError("Passwords do not match.");
    setPassword.mutate(
      { albumId, password },
      { onSuccess: () => onOpenChange(false), onError: (e) => setError(e.message) }
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={isChange ? "Change album password" : "Set album password"}
      description="Clients will need this password to open the gallery. It is never included in the link."
      width="max-w-md"
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={setPassword.isPending}>
            Cancel
          </Button>
          <Button onClick={handleSave} loading={setPassword.isPending}>
            {isChange ? "Update password" : "Set password"}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {error && <InlineAlert tone="error">{error}</InlineAlert>}
        <PasswordInput
          label="New password"
          placeholder="••••••••"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPasswordValue(e.target.value)}
        />
        <PasswordInput
          label="Confirm password"
          placeholder="••••••••"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
      </div>
    </Dialog>
  );
}

function PrivacyPanel({ album }) {
  const setAccess = useSetAccessEnabled();
  const setDownload = useSetDownloadPermission();
  const removePassword = useRemoveAlbumPassword();
  const regenerate = useRegenerateAlbumLink();

  const [passwordOpen, setPasswordOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [regenerateOpen, setRegenerateOpen] = useState(false);
  const [qr, setQr] = useState("");

  const link = buildAlbumLink(album);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(link, {
      margin: 1,
      width: 220,
      color: { dark: "#272923", light: "#FFFFFF" },
    })
      .then((url) => !cancelled && setQr(url))
      .catch(() => !cancelled && setQr(""));
    return () => {
      cancelled = true;
    };
  }, [link]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Album link copied to clipboard.");
    } catch {
      toast.error("Couldn't copy the link. Please try again.");
    }
  }

  async function handleDownloadQr() {
    try {
      await downloadAlbumQr(album);
      toast.success("QR code downloaded.");
    } catch {
      toast.error("Couldn't generate the QR code.");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Left: controls */}
      <div className="flex flex-col gap-6 lg:col-span-3">
        {/* Access */}
        <Card className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-olive" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-charcoal">Gallery Access</h2>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-charcoal">Enable client access</p>
              <p className="text-[13px] text-charcoal/60">
                When off, the gallery cannot be opened even with the correct link and password.
              </p>
            </div>
            <Switch
              checked={album.accessEnabled}
              label="Enable client access"
              disabled={setAccess.isPending}
              onChange={(enabled) => setAccess.mutate({ albumId: album.id, enabled })}
            />
          </div>
          {!album.accessEnabled && (
            <InlineAlert tone="info">
              <span className="flex items-center gap-1.5">
                <ShieldOff size={14} aria-hidden="true" /> This gallery is currently private.
              </span>
            </InlineAlert>
          )}
        </Card>

        {/* Password */}
        <Card className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <KeyRound size={18} className="text-olive" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-charcoal">Password Protection</h2>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-charcoal">
                {album.hasPassword ? "A password is set" : "No password set"}
              </p>
              <p className="text-[13px] text-charcoal/60">
                {album.hasPassword
                  ? "Clients must enter the password to view this gallery."
                  : "Anyone with the link can open the gallery without a password."}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button variant="outline" size="sm" onClick={() => setPasswordOpen(true)}>
                {album.hasPassword ? "Change" : "Set password"}
              </Button>
              {album.hasPassword && (
                <Button variant="ghost" size="sm" onClick={() => setRemoveOpen(true)}>
                  Remove
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Permissions */}
        <Card className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Download size={18} className="text-olive" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-charcoal">Download Permission</h2>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-charcoal">Allow clients to download photos</p>
              <p className="text-[13px] text-charcoal/60">
                When off, download controls are hidden in the client gallery.
              </p>
            </div>
            <Switch
              checked={album.allowDownload}
              label="Allow downloads"
              disabled={setDownload.isPending}
              onChange={(allow) => setDownload.mutate({ albumId: album.id, allow })}
            />
          </div>
        </Card>

        {/* Advanced */}
        <Card className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <RefreshCw size={18} className="text-olive" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-charcoal">Access Link</h2>
          </div>
          <p className="text-[13px] text-charcoal/60">
            Regenerating creates a new link and QR code. The previous link and any printed QR codes
            will stop working immediately.
          </p>
          <div>
            <Button variant="outline" size="sm" onClick={() => setRegenerateOpen(true)}>
              <RefreshCw size={14} aria-hidden="true" /> Regenerate link
            </Button>
          </div>
        </Card>
      </div>

      {/* Right: share panel (QR prominent) */}
      <div className="lg:col-span-2">
        <Card className="flex flex-col items-center gap-4 lg:sticky lg:top-24">
          <h2 className="self-start text-lg font-semibold text-charcoal">Share This Album</h2>

          <div className="flex h-[236px] w-[236px] items-center justify-center rounded-card border border-sand bg-white">
            {qr ? (
              <img src={qr} alt="QR code for this album's gallery link" className="h-[220px] w-[220px]" />
            ) : (
              <Skeleton className="h-[220px] w-[220px]" />
            )}
          </div>

          <p className="text-center text-[13px] text-charcoal/60">
            Scanning opens the album route. The client is still asked for the password before seeing
            any photos.
          </p>

          <div className="flex w-full items-center gap-2 rounded-control border border-sand bg-ivory px-3 py-2">
            <Link2 size={14} className="shrink-0 text-charcoal/40" aria-hidden="true" />
            <span className="min-w-0 flex-1 truncate font-mono text-xs text-charcoal/70">{link}</span>
          </div>

          <div className="grid w-full grid-cols-2 gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              <Copy size={14} aria-hidden="true" /> Copy link
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadQr}>
              <Download size={14} aria-hidden="true" /> Download QR
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="col-span-2"
              onClick={() => window.open(`/a/${album.accessToken}/gallery`, "_blank")}
            >
              <ExternalLink size={14} aria-hidden="true" /> Preview client gallery
            </Button>
          </div>
        </Card>
      </div>

      {/* Dialogs */}
      <PasswordDialog
        open={passwordOpen}
        onOpenChange={setPasswordOpen}
        albumId={album.id}
        isChange={album.hasPassword}
      />

      <ConfirmDialog
        open={removeOpen}
        onOpenChange={setRemoveOpen}
        title="Remove album password?"
        description="Clients will be able to open the gallery with only the link. You can set a new password at any time."
        confirmLabel="Remove password"
        danger
        loading={removePassword.isPending}
        onConfirm={() =>
          removePassword.mutate(album.id, { onSuccess: () => setRemoveOpen(false) })
        }
      />

      <ConfirmDialog
        open={regenerateOpen}
        onOpenChange={setRegenerateOpen}
        title="Regenerate access link?"
        description="The current link and QR code will stop working. Share the new ones with your client."
        confirmLabel="Regenerate link"
        loading={regenerate.isPending}
        onConfirm={() =>
          regenerate.mutate(album.id, { onSuccess: () => setRegenerateOpen(false) })
        }
      />
    </div>
  );
}

export default function AlbumPrivacyTab() {
  const context = useOutletContext();
  const album = context?.album;

  if (!album) {
    return (
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="flex flex-col gap-6 lg:col-span-3">
          <Skeleton className="h-32 w-full rounded-card" />
          <Skeleton className="h-32 w-full rounded-card" />
        </div>
        <Skeleton className="h-80 w-full rounded-card lg:col-span-2" />
      </div>
    );
  }

  return <PrivacyPanel album={album} />;
}