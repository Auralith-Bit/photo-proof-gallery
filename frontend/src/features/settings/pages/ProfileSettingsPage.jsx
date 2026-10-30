import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BadgeCheck, Mail, Send } from "lucide-react";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import Skeleton from "../../../components/ui/Skeleton";
import Avatar from "../../../components/ui/Avatar";
import ImageUpload from "../../../components/ui/ImageUpload";
import SaveBar from "../../../components/settings/SaveBar";
import { useProfile, useUpdateProfile, useResendVerification } from "../../../hooks/useSettings";
import { useSaveStatus } from "../../../hooks/useSaveStatus";
import { useSettingsDirtyStore } from "../../../stores/settingsDirtyStore";

const schema = z.object({
  displayName: z.string().min(2, "Enter your display name."),
  email: z.string().min(1, "Email is required.").email("Enter a valid email address."),
  image: z.object({ name: z.string(), url: z.string() }).nullable(),
});

function ProfileForm({ profile }) {
  const update = useUpdateProfile();
  const resend = useResendVerification();
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
      displayName: profile.displayName,
      email: profile.email,
      image: profile.imageUrl ? { name: profile.imageName, url: profile.imageUrl } : null,
    },
  });

  const image = watch("image");
  const status = useSaveStatus(update, isDirty);

  useEffect(() => setDirty(isDirty), [isDirty, setDirty]);
  useEffect(() => () => setDirty(false), [setDirty]);

  function onSubmit(values) {
    update.mutate(
      {
        displayName: values.displayName,
        email: values.email,
        imageUrl: values.image?.url ?? null,
        imageName: values.image?.name ?? "",
      },
      { onSuccess: () => reset(values, { keepDirty: false }) }
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-[28px] font-semibold leading-9 text-charcoal">Profile</h1>
        <p className="mt-1 text-sm text-charcoal/60">This information identifies you inside your workspace.</p>
      </header>

      <Card className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-4">
          <Avatar src={image?.url} name={watch("displayName")} size="lg" />
          <ImageUpload
            round
            label="Upload photo"
            value={image}
            onChange={(v) => setValue("image", v, { shouldDirty: true })}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Input label="Display name" required error={errors.displayName?.message} {...register("displayName")} />
          <Input label="Email" type="email" required error={errors.email?.message} {...register("email")} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-control border border-sand bg-ivory px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Mail size={15} className="text-charcoal/50" aria-hidden="true" />
            <span className="text-charcoal/70">Email verification</span>
            {profile.emailVerified ? (
              <Badge tone="active">
                <BadgeCheck size={12} aria-hidden="true" /> Verified
              </Badge>
            ) : (
              <Badge tone="expired">Pending</Badge>
            )}
          </div>
          {!profile.emailVerified && (
            <Button variant="ghost" size="sm" loading={resend.isPending} onClick={() => resend.mutate()}>
              <Send size={14} aria-hidden="true" /> Resend verification
            </Button>
          )}
        </div>
      </Card>

      <SaveBar status={status} dirty={isDirty} onSave={handleSubmit(onSubmit)} onDiscard={() => reset(undefined, { keepDirty: false })} />
    </div>
  );
}

export default function ProfileSettingsPage() {
  const { data: profile, isLoading } = useProfile();
  if (isLoading || !profile) {
    return (
      <Card className="flex flex-col gap-5">
        <Skeleton className="h-8 w-40" />
        <div className="flex gap-4"><Skeleton className="h-16 w-16 rounded-full" /><Skeleton className="h-16 flex-1" /></div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </Card>
    );
  }
  return <ProfileForm profile={profile} />;
}