import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Globe } from "lucide-react";
import Card from "../../../components/ui/Card";
import Select from "../../../components/ui/Select";
import Switch from "../../../components/ui/Switch";
import Skeleton from "../../../components/ui/Skeleton";
import SaveBar from "../../../components/settings/SaveBar";
import { usePreferences, useUpdatePreferences } from "../../../hooks/useSettings";
import { useSaveStatus } from "../../../hooks/useSaveStatus";
import { useSettingsDirtyStore } from "../../../stores/settingsDirtyStore";
import { useLocaleStore, DATE_FORMAT_OPTIONS, TIMEZONE_OPTIONS } from "../../../stores/localStore";
import { cn } from "../../../lib/utils";

const schema = z.object({
  defaultAlbumAccess: z.enum(["private", "share"]),
  defaultDownload: z.boolean(),
  viewPreference: z.enum(["grid", "list"]),
  notifyClientAccess: z.boolean(),
  notifyLowStorage: z.boolean(),
});

function formatPreview(pattern) {
  try {
    return format(new Date("2025-08-15T12:00:00Z"), pattern);
  } catch {
    return "—";
  }
}

function timezonePreview(tz) {
  try {
    return new Intl.DateTimeFormat("en-US", { timeZone: tz, dateStyle: "medium", timeStyle: "short" }).format(new Date());
  } catch {
    return "Unavailable";
  }
}

function PreferencesForm({ preferences }) {
  const update = useUpdatePreferences();
  const setDirty = useSettingsDirtyStore((s) => s.setDirty);
  const dateFormat = useLocaleStore((s) => s.dateFormat);
  const timezone = useLocaleStore((s) => s.timezone);
  const setDateFormat = useLocaleStore((s) => s.setDateFormat);
  const setTimezone = useLocaleStore((s) => s.setTimezone);

  // Capture locale baseline so changes to it also count as "unsaved".
  const [baseLocale] = useState({ dateFormat, timezone });
  const localeDirty = dateFormat !== baseLocale.dateFormat || timezone !== baseLocale.timezone;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      defaultAlbumAccess: preferences.defaultAlbumAccess,
      defaultDownload: preferences.defaultDownload,
      viewPreference: preferences.viewPreference,
      notifyClientAccess: preferences.notifyClientAccess,
      notifyLowStorage: preferences.notifyLowStorage,
    },
  });

  const values = watch();
  const dirty = isDirty || localeDirty;
  const status = useSaveStatus(update, dirty);

  useEffect(() => setDirty(dirty), [dirty, setDirty]);
  useEffect(() => () => setDirty(false), [setDirty]);

  function onSubmit(data) {
    // Apply locale immediately (persisted to localStorage, used app-wide).
    setDateFormat(data.__dateFormat ?? dateFormat);
    setTimezone(data.__timezone ?? timezone);
    // Sync preferred view to the key the Albums page reads.
    try {
      localStorage.setItem("frameora:albumsView", data.viewPreference);
    } catch {
      /* ignore */
    }
    update.mutate(
      {
        defaultAlbumAccess: data.defaultAlbumAccess,
        defaultDownload: data.defaultDownload,
        viewPreference: data.viewPreference,
        notifyClientAccess: data.notifyClientAccess,
        notifyLowStorage: data.notifyLowStorage,
      },
      { onSuccess: () => reset(undefined, { keepDirty: false }) }
    );
  }

  // Fold locale into the form so a single Save handles everything.
  const formValues = { ...values, __dateFormat: dateFormat, __timezone: timezone };

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-[28px] font-semibold leading-9 text-charcoal">Preferences</h1>
        <p className="mt-1 text-sm text-charcoal/60">Defaults that apply across your studio and new albums.</p>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
        noValidate
        // inject locale into submit payload via hidden registration
      >
        <Card className="flex flex-col gap-5">
          <h2 className="text-lg font-semibold text-charcoal">New albums</h2>

          <Select label="Default album access" error={errors.defaultAlbumAccess?.message} {...register("defaultAlbumAccess")}>
            <option value="private">Private draft — you share it manually</option>
            <option value="share">Ready to share — gallery enabled on creation</option>
          </Select>
          <p className="-mt-2 text-[13px] text-charcoal/50">Applies to albums you create from now on.</p>

          <div className="flex items-center justify-between gap-4 border-t border-sand pt-4">
            <div>
              <p className="text-sm font-medium text-charcoal">Allow downloads by default</p>
              <p className="text-[13px] text-charcoal/60">New albums start with client downloads enabled.</p>
            </div>
            <Switch checked={values.defaultDownload} label="Allow downloads" onChange={(v) => setValue("defaultDownload", v, { shouldDirty: true })} />
          </div>
        </Card>

        <Card className="flex flex-col gap-5">
          <h2 className="text-lg font-semibold text-charcoal">Appearance</h2>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-charcoal">Preferred albums view</p>
            <div className="flex gap-2">
              {["grid", "list"].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setValue("viewPreference", opt, { shouldDirty: true })}
                  aria-pressed={values.viewPreference === opt}
                  className={cn(
                    "rounded-control border px-4 py-2 text-sm font-medium capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive/60",
                    values.viewPreference === opt ? "border-olive bg-olive text-white" : "border-sand bg-white text-charcoal/70 hover:border-olive/50"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
            <p className="text-[13px] text-charcoal/50">Used as the default layout on the My Albums page.</p>
          </div>
        </Card>

        <Card className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-charcoal">Notifications</h2>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-charcoal">Client gallery access</p>
              <p className="text-[13px] text-charcoal/60">Notify me when a client opens a shared album.</p>
            </div>
            <Switch checked={values.notifyClientAccess} label="Client access notifications" onChange={(v) => setValue("notifyClientAccess", v, { shouldDirty: true })} />
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-sand pt-4">
            <div>
              <p className="text-sm font-medium text-charcoal">Low storage</p>
              <p className="text-[13px] text-charcoal/60">Warn me as I approach my storage allowance.</p>
            </div>
            <Switch checked={values.notifyLowStorage} label="Low storage notifications" onChange={(v) => setValue("notifyLowStorage", v, { shouldDirty: true })} />
          </div>
        </Card>

        <Card className="flex flex-col gap-5">
          <h2 className="text-lg font-semibold text-charcoal">Date & time</h2>

          <Select label="Date format" value={dateFormat} onChange={(e) => { setDateFormat(e.target.value); }} error={errors.dateFormat?.message}>
            {DATE_FORMAT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>
          <p className="-mt-2 flex items-center gap-1.5 text-[13px] text-charcoal/50">
            Preview: <span className="font-medium text-charcoal/70">{formatPreview(dateFormat)}</span>
          </p>

          <div className="flex flex-col gap-2 border-t border-sand pt-4">
            <label htmlFor="tz" className="flex items-center gap-1.5 text-sm font-medium text-charcoal">
              <Globe size={14} aria-hidden="true" /> Timezone
            </label>
            <Select id="tz" value={timezone} onChange={(e) => setTimezone(e.target.value)}>
              {TIMEZONE_OPTIONS.map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </Select>
            <p className="text-[13px] text-charcoal/50">
              Current time in {timezone}: <span className="font-medium text-charcoal/70">{timezonePreview(timezone)}</span>
            </p>
          </div>
        </Card>

        <SaveBar status={status} dirty={dirty} onSave={handleSubmit(onSubmit)} onDiscard={() => { reset(undefined, { keepDirty: false }); setDateFormat(baseLocale.dateFormat); setTimezone(baseLocale.timezone); }} />
      </form>
    </div>
  );
}

export default function PreferencesSettingsPage() {
  const { data: preferences, isLoading } = usePreferences();
  if (isLoading || !preferences) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-48 w-full rounded-card" />
        <Skeleton className="h-40 w-full rounded-card" />
      </div>
    );
  }
  return <PreferencesForm preferences={preferences} />;
}