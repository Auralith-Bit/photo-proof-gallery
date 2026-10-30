import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Monitor, Smartphone, LogOut, ShieldAlert } from "lucide-react";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import PasswordInput from "../../../components/ui/PasswordInput";
import Button from "../../../components/ui/Button";
import Switch from "../../../components/ui/Switch";
import Badge from "../../../components/ui/Badge";
import Skeleton from "../../../components/ui/Skeleton";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import SaveBar from "../../../components/settings/SaveBar";
import {
  useSecurity,
  useChangePassword,
  useUpdateSecurityPrefs,
  useRevokeSession,
  useRevokeOtherSessions,
} from "../../../hooks/useSettings";
import { useSaveStatus } from "../../../hooks/useSaveStatus";
import { useSettingsDirtyStore } from "../../../stores/settingsDirtyStore";
import { formatRelativeTime } from "../../../lib/formatters";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password."),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[A-Za-z]/, "Include a letter.")
      .regex(/\d/, "Include a number."),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, { message: "Passwords do not match.", path: ["confirmPassword"] });

function ChangePasswordCard() {
  const change = useChangePassword();
  const setDirty = useSettingsDirtyStore((s) => s.setDirty);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({ resolver: zodResolver(passwordSchema), defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" } });
  const status = useSaveStatus(change, isDirty);

  useEffect(() => setDirty(isDirty), [isDirty, setDirty]);
  useEffect(() => () => setDirty(false), [setDirty]);

  function onSubmit(values) {
    change.mutate(values, { onSuccess: () => reset(undefined, { keepDirty: false }) });
  }

  return (
    <Card className="flex flex-col gap-5">
      <h2 className="text-lg font-semibold text-charcoal">Change password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <PasswordInput label="Current password" autoComplete="current-password" error={errors.currentPassword?.message} {...register("currentPassword")} />
        <PasswordInput label="New password" autoComplete="new-password" helperText="At least 8 characters with letters and numbers." error={errors.newPassword?.message} {...register("newPassword")} />
        <PasswordInput label="Confirm new password" autoComplete="new-password" error={errors.confirmPassword?.message} {...register("confirmPassword")} />
        <div className="flex justify-end">
          <Button type="submit" loading={change.isPending} disabled={!isDirty}>Update password</Button>
        </div>
      </form>
    </Card>
  );
}

function SessionRow({ session, onRevoke, revoking }) {
  const Icon = /iphone|android|mobile/i.test(session.device) ? Smartphone : Monitor;
  return (
    <li className="flex items-center gap-3 py-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ivory text-olive">
        <Icon size={16} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 truncate text-sm font-medium text-charcoal">
          {session.device}
          {session.current && <Badge tone="active">Current</Badge>}
        </p>
        <p className="truncate text-[13px] text-charcoal/50">
          {session.browser} · {session.location} · {formatRelativeTime(session.lastActive)}
        </p>
      </div>
      {!session.current && (
        <Button variant="ghost" size="sm" onClick={() => onRevoke(session.id)} loading={revoking}>
          <LogOut size={14} aria-hidden="true" /> Revoke
        </Button>
      )}
    </li>
  );
}

function SecurityBody({ security }) {
  const updatePrefs = useUpdateSecurityPrefs();
  const revoke = useRevokeSession();
  const revokeOthers = useRevokeOtherSessions();
  const setDirty = useSettingsDirtyStore((s) => s.setDirty);
  const [confirmOthers, setConfirmOthers] = useState(false);
  const [revokingId, setRevokingId] = useState(null);

  const prefsDirty =
    security.notifyOnNewDevice !== undefined && // baseline exists
    (updatePrefs.variables?.notifyOnNewDevice !== undefined || updatePrefs.variables?.notifyOnClientAccess !== undefined)
      ? updatePrefs.isPending
      : false;

  // Track local preference edits as dirty until saved.
  const [prefs, setPrefs] = useState({
    notifyOnNewDevice: security.notifyOnNewDevice,
    notifyOnClientAccess: security.notifyOnClientAccess,
  });
  const localDirty =
    prefs.notifyOnNewDevice !== security.notifyOnNewDevice ||
    prefs.notifyOnClientAccess !== security.notifyOnClientAccess;

  useEffect(() => setDirty(localDirty || updatePrefs.isPending), [localDirty, updatePrefs.isPending, setDirty]);
  useEffect(() => () => setDirty(false), [setDirty]);

  const others = security.sessions.filter((s) => !s.current);

  function savePrefs() {
    updatePrefs.mutate(prefs, { onSuccess: () => {} });
  }
  function discardPrefs() {
    setPrefs({ notifyOnNewDevice: security.notifyOnNewDevice, notifyOnClientAccess: security.notifyOnClientAccess });
    updatePrefs.reset();
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-[28px] font-semibold leading-9 text-charcoal">Security</h1>
        <p className="mt-1 text-sm text-charcoal/60">
          Last password change {formatRelativeTime(security.passwordUpdatedAt)}.
        </p>
      </header>

      <ChangePasswordCard />

      <Card className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-charcoal">Active sessions</h2>
        <p className="text-[13px] text-charcoal/60">Devices currently signed in to your account.</p>
        <ul className="divide-y divide-sand">
          {security.sessions.map((s) => (
            <SessionRow
              key={s.id}
              session={s}
              revoking={revokingId === s.id && revoke.isPending}
              onRevoke={(id) => {
                setRevokingId(id);
                revoke.mutate(id, { onSettled: () => setRevokingId(null) });
              }}
            />
          ))}
        </ul>
        {others.length > 0 && (
          <div>
            <Button variant="outline" size="sm" onClick={() => setConfirmOthers(true)}>
              Sign out other sessions
            </Button>
          </div>
        )}
      </Card>

      <Card className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-charcoal">Security notifications</h2>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-charcoal">Alert me on new device sign‑in</p>
            <p className="text-[13px] text-charcoal/60">Receive an email when a new device accesses your account.</p>
          </div>
          <Switch checked={prefs.notifyOnNewDevice} label="New device alerts" onChange={(v) => setPrefs((p) => ({ ...p, notifyOnNewDevice: v }))} />
        </div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-charcoal">Alert me when a client opens a gallery</p>
            <p className="text-[13px] text-charcoal/60">Get notified when a client first accesses a shared album.</p>
          </div>
          <Switch checked={prefs.notifyOnClientAccess} label="Client access alerts" onChange={(v) => setPrefs((p) => ({ ...p, notifyOnClientAccess: v }))} />
        </div>
        <SaveBar
          status={useSaveStatus(updatePrefs, localDirty)}
          dirty={localDirty}
          onSave={savePrefs}
          onDiscard={discardPrefs}
          saveLabel="Save preferences"
        />
      </Card>

      <ConfirmDialog
        open={confirmOthers}
        onOpenChange={setConfirmOthers}
        title="Sign out other sessions?"
        description={`This will sign ${others.length} other ${others.length === 1 ? "device" : "devices"} out. You'll stay signed in on this device.`}
        confirmLabel="Sign out others"
        danger
        loading={revokeOthers.isPending}
        onConfirm={() => revokeOthers.mutate(undefined, { onSuccess: () => setConfirmOthers(false) })}
      />
    </div>
  );
}

export default function SecuritySettingsPage() {
  const { data: security, isLoading } = useSecurity();
  if (isLoading || !security) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-56 w-full rounded-card" />
        <Skeleton className="h-40 w-full rounded-card" />
      </div>
    );
  }
  return <SecurityBody security={security} />;
}