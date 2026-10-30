import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Aperture, CloudOff, Eye, ImageOff, Lock, ShieldOff, Unlink } from "lucide-react";
import PasswordInput from "../../../components/ui/PasswordInput";
import Button from "../../../components/ui/Button";
import InlineAlert from "../../../components/ui/InlineAlert";
import Skeleton from "../../../components/ui/Skeleton";
import { useResolveAlbum } from "../../../hooks/useClientAccess";
import { verifyAlbumAccess } from "../../../services/client-access.service";
import { useClientSessionStore } from "../../../stores/clientAccessStore";
import { getBrandingSync } from "../../../services/settings.service";
import { cn } from "../../../lib/utils";

function BrandLine() {
  const branding = getBrandingSync();
  const showLogo = branding.logoStyle === "logo" || branding.logoStyle === "both";
  const showName = branding.logoStyle === "name" || branding.logoStyle === "both";
  return (
    <div className="flex items-center justify-center gap-2.5">
      {showLogo &&
        (branding.logoUrl ? (
          <img src={branding.logoUrl} alt="" className="h-9 w-9 rounded-md object-cover" />
        ) : (
          <Aperture size={26} className="text-gold" aria-hidden="true" />
        ))}
      {showName && <span className="font-serif text-xl text-charcoal">{branding.studioName || "Frameora"}</span>}
    </div>
  );
}

function StatusScreen({ icon: Icon, title, children }) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sand/70 text-olive">
        <Icon size={24} aria-hidden="true" />
      </span>
      <h1 className="font-serif text-2xl text-charcoal">{title}</h1>
      <div className="max-w-xs text-sm text-charcoal/60">{children}</div>
    </div>
  );
}

export default function AlbumPasswordPage() {
  const { accessToken } = useParams();
  const navigate = useNavigate();
  const authorize = useClientSessionStore((s) => s.authorize);
  const { data: meta, isFetching, error: resolveError } = useResolveAlbum(accessToken);

  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | incorrect | rate | network
  const [retryAfter, setRetryAfter] = useState(0);
  const [coverFailed, setCoverFailed] = useState(false);
  const autoEntered = useRef(false);

  // Live countdown while rate-limited.
  useEffect(() => {
    if (retryAfter <= 0) return undefined;
    const t = setTimeout(() => setRetryAfter((v) => Math.max(0, v - 1)), 1000);
    return () => clearTimeout(t);
  }, [retryAfter]);

  // Auto-enter open albums (no password required), exactly once.
  useEffect(() => {
    if (!meta || autoEntered.current) return;
    const open = meta.accessEnabled && meta.status === "active" && !meta.hasPassword;
    if (!open) return;
    autoEntered.current = true;
    setStatus("submitting");
    verifyAlbumAccess(accessToken, "")
      .then((payload) => {
        authorize(accessToken, payload);
        navigate(`/a/${accessToken}/gallery`, { replace: true });
      })
      .catch((e) => mapError(e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta]);

  function mapError(e) {
    if (e.code === "RATE_LIMITED") {
      setStatus("rate");
      setRetryAfter(e.retryAfter || 30);
    } else if (e.code === "NETWORK") {
      setStatus("network");
    } else if (e.code === "DISABLED" || e.code === "UNAVAILABLE" || e.code === "INVALID_LINK") {
      // race: state changed between resolve and verify -> reflect it
      setStatus("idle");
    } else {
      setStatus("incorrect");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (status === "submitting" || (status === "rate" && retryAfter > 0)) return;
    setStatus("submitting");
    try {
      const payload = await verifyAlbumAccess(accessToken, password);
      authorize(accessToken, payload);
      navigate(`/a/${accessToken}/gallery`, { replace: true });
    } catch (err) {
      mapError(err);
    }
  }

  // ---- Resolve-level states (before any form) ----
  if (isFetching && !meta) {
    return (
      <Centered>
        <div className="flex w-full max-w-sm flex-col items-center gap-4">
          <BrandLine />
          <Skeleton className="h-44 w-full rounded-card" />
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-10 w-full" />
        </div>
      </Centered>
    );
  }

  if (resolveError) {
    const code = resolveError.code;
    return (
      <Centered>
        <StatusScreen
          icon={code === "INVALID_LINK" ? Unlink : code === "DISABLED" ? ShieldOff : CloudOff}
          title={
            code === "INVALID_LINK"
              ? "This link doesn't look right"
              : code === "DISABLED"
                ? "This gallery isn't available yet"
                : "This gallery is no longer available"
          }
        >
          {code === "INVALID_LINK"
            ? "Check the link or scan the QR code again. If the problem continues, ask your photographer to resend it."
            : code === "DISABLED"
              ? "Your photographer hasn't shared this gallery with you yet. Please check back soon."
              : "This gallery has been removed or archived. Please contact your photographer."}
        </StatusScreen>
      </Centered>
    );
  }

  // Disabled / archived discovered at resolve time (no form).
  if (meta && (!meta.accessEnabled || meta.status === "archived")) {
    return (
      <Centered>
        <StatusScreen
          icon={meta.accessEnabled ? CloudOff : ShieldOff}
          title={meta.accessEnabled ? "This gallery is no longer available" : "This gallery isn't available yet"}
        >
          {meta.accessEnabled
            ? "This gallery has been removed or archived. Please contact your photographer."
            : "Your photographer hasn't shared this gallery with you yet. Please check back soon."}
        </StatusScreen>
      </Centered>
    );
  }

  const locked = status === "rate" && retryAfter > 0;
  const submitting = status === "submitting";

  return (
    <Centered>
      <div className="w-full max-w-sm">
        <div className="mb-6">
          <BrandLine />
        </div>

        <div className="overflow-hidden rounded-card border border-sand bg-white shadow-subtle">
          {/* Sanctioned cover teaser (metadata only). */}
          {meta?.coverPhotoUrl && !coverFailed && (
            <img
              src={meta.coverPhotoUrl}
              alt=""
              onError={() => setCoverFailed(true)}
              className="h-40 w-full object-cover"
            />
          )}

          <div className="flex flex-col gap-4 p-6">
            <div className="flex flex-col gap-1 text-center">
              <h1 className="font-serif text-2xl leading-8 text-charcoal">{meta?.title || "Your gallery"}</h1>
              <p className="text-sm text-charcoal/60">
                Enter the password your photographer shared to view your private gallery.
              </p>
            </div>

            {status === "incorrect" && (
              <InlineAlert tone="error">The password is incorrect. Please try again.</InlineAlert>
            )}
            {status === "network" && (
              <InlineAlert tone="error">
                We couldn't verify your password. Check your connection and try again.
              </InlineAlert>
            )}
            {status === "rate" && (
              <InlineAlert tone="warning">
                Too many attempts. Please wait {retryAfter}s before trying again.
              </InlineAlert>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              <PasswordInput
                label="Album password"
                placeholder="Enter password"
                autoComplete="off"
                autoFocus
                disabled={locked || submitting}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (status === "incorrect" || status === "network") setStatus("idle");
                }}
              />
              <Button type="submit" size="lg" className="w-full" loading={submitting} disabled={locked || !password}>
                {submitting ? "Verifying…" : "View Album"}
              </Button>
            </form>

            <p className="flex items-center justify-center gap-1.5 text-center text-[13px] text-charcoal/50">
              <Lock size={12} aria-hidden="true" />
              Your photos are private. This link is unique to you.
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-charcoal/40">
          Powered by <span className="font-serif text-charcoal/60">Frameora</span>
        </p>
      </div>
    </Centered>
  );
}

function Centered({ children }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ivory px-4 py-10">
      {children}
    </main>
  );
}