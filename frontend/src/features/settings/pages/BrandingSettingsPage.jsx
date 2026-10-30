import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye } from "lucide-react";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import Textarea from "../../../components/ui/Textarea";
import Switch from "../../../components/ui/Switch";
import Skeleton from "../../../components/ui/Skeleton";
import ImageUpload from "../../../components/ui/ImageUpload";
import SaveBar from "../../../components/settings/SaveBar";
import BrandingPreview from "../../../components/settings/BrandingPreview";
import { useBranding, useUpdateBranding } from "../../../hooks/useSettings";
import { useSaveStatus } from "../../../hooks/useSaveStatus";
import { useSettingsDirtyStore } from "../../../stores/settingsDirtyStore";

const schema = z
  .object({
    studioName: z.string().min(2, "Enter your studio name."),
    logo: z.object({ name: z.string(), url: z.string() }).nullable(),
    logoStyle: z.enum(["logo", "name", "both"]),
    showFooter: z.boolean(),
    footerText: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.showFooter && !data.footerText?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Add footer text or turn off the footer.", path: ["footerText"] });
    }
  });

const logoStyles = [
  { value: "both", label: "Logo + name" },
  { value: "logo", label: "Logo only" },
  { value: "name", label: "Name only" },
];

function BrandingForm({ branding }) {
  const update = useUpdateBranding();
  const setDirty = useSettingsDirtyStore((s) => s.setDirty);
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
      studioName: branding.studioName,
      logo: branding.logoUrl ? { name: branding.logoName, url: branding.logoUrl } : null,
      logoStyle: branding.logoStyle,
      showFooter: branding.showFooter,
      footerText: branding.footerText || "",
    },
  });

  const values = watch();
  const status = useSaveStatus(update, isDirty);
  useEffect(() => setDirty(isDirty), [isDirty, setDirty]);
  useEffect(() => () => setDirty(false), [setDirty]);

  function onSubmit(data) {
    update.mutate(
      {
        studioName: data.studioName,
        logoStyle: data.logoStyle,
        showFooter: data.showFooter,
        footerText: data.footerText,
        logoUrl: data.logo?.url ?? null,
        logoName: data.logo?.name ?? "",
      },
      { onSuccess: () => reset(data, { keepDirty: false }) }
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-[28px] font-semibold leading-9 text-charcoal">Studio Branding</h1>
        <p className="mt-1 text-sm text-charcoal/60">Control how your studio appears in client galleries.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="flex flex-col gap-6 lg:col-span-3">
          <Card className="flex flex-col gap-5">
            <h2 className="text-lg font-semibold text-charcoal">Studio identity</h2>
            <Input label="Studio name" required error={errors.studioName?.message} {...register("studioName")} />
            <ImageUpload
              label="Upload logo"
              value={values.logo}
              onChange={(v) => setValue("logo", v, { shouldDirty: true })}
            />
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-charcoal">Header style</p>
              <div className="flex flex-wrap gap-4">
                {logoStyles.map((opt) => (
                  <label key={opt.value} className="flex cursor-pointer items-center gap-2">
                    <input type="radio" value={opt.value} {...register("logoStyle")} className="h-4 w-4 border-sand accent-olive focus:ring-olive" />
                    <span className="text-sm text-charcoal">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </Card>

          <Card className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-charcoal">Gallery footer</h2>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-charcoal">Show footer in client galleries</p>
                <p className="text-[13px] text-charcoal/60">A short line displayed beneath the photo grid.</p>
              </div>
              <Switch checked={values.showFooter} label="Show footer" onChange={(v) => setValue("showFooter", v, { shouldDirty: true })} />
            </div>
            {values.showFooter && (
              <Textarea
                label="Footer text"
                rows={2}
                placeholder="© Your Studio — Every moment, beautifully preserved."
                error={errors.footerText?.message}
                {...register("footerText")}
              />
            )}
          </Card>
        </div>

        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-24">
            <p className="mb-2 flex items-center gap-1.5 text-[13px] font-medium text-charcoal/60">
              <Eye size={14} aria-hidden="true" /> Live preview
            </p>
            <BrandingPreview
              studioName={values.studioName}
              logoUrl={values.logo?.url}
              logoStyle={values.logoStyle}
              showFooter={values.showFooter}
              footerText={values.footerText}
            />
            <p className="mt-2 text-[13px] text-charcoal/50">
              This preview updates as you edit and reflects exactly what clients will see.
            </p>
          </div>
        </div>
      </div>

      <SaveBar status={status} dirty={isDirty} onSave={handleSubmit(onSubmit)} onDiscard={() => reset(undefined, { keepDirty: false })} />
    </div>
  );
}

export default function BrandingSettingsPage() {
  const { data: branding, isLoading } = useBranding();
  if (isLoading || !branding) {
    return (
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="flex flex-col gap-6 lg:col-span-3"><Skeleton className="h-64 w-full rounded-card" /><Skeleton className="h-40 w-full rounded-card" /></div>
        <Skeleton className="h-80 w-full rounded-card lg:col-span-2" />
      </div>
    );
  }
  return <BrandingForm branding={branding} />;
}