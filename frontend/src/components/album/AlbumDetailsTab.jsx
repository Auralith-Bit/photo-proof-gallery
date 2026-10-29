import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, AlertCircle, Loader2, Save } from "lucide-react";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import Select from "../ui/Select";
import Button from "../ui/Button";
import Skeleton from "../ui/Skeleton";
import { useClients } from "../../hooks/useClients";
import { useUpdateAlbum } from "../../hooks/useAlbums";

const schema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  description: z.string().optional(),
  eventDate: z.string().optional(),
  clientId: z.string().optional(),
});

const SAVE_DELAY = 1000; // 1s debounce for autosave

function AlbumDetailsForm({ album }) {
  const { data: clients } = useClients();
  const updateMutation = useUpdateAlbum();
  const [status, setStatus] = useState("idle"); // idle | unsaved | saving | saved | error

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { isDirty, errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: album.title,
      description: album.description || "",
      eventDate: album.eventDate || "",
      clientId: album.clientId || "",
    },
  });

  const values = watch();
  const signature = JSON.stringify(values); // stable identity for the effect

  function persist() {
    setStatus("saving");
    updateMutation.mutate(
      { albumId: album.id, data: values },
      {
        onSuccess: () => {
          setStatus("saved");
          reset(values, { keepDirty: false });
          setTimeout(() => setStatus("idle"), 2000);
        },
        onError: () => setStatus("error"),
      }
    );
  }

  // Autosave (debounced). Depends on the serialized signature, not object identity,
  // so status changes don't re-trigger a second save.
  useEffect(() => {
    if (!isDirty) {
      setStatus("idle");
      return;
    }
    setStatus("unsaved");
    const timer = setTimeout(persist, SAVE_DELAY);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature, isDirty]);

  function handleCancel() {
    reset({
      title: album.title,
      description: album.description || "",
      eventDate: album.eventDate || "",
      clientId: album.clientId || "",
    });
    setStatus("idle");
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Status indicator + manual actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2" aria-live="polite">
          {status === "unsaved" && (
            <span className="flex items-center gap-1.5 text-sm text-charcoal/60">
              <span className="h-2 w-2 rounded-full bg-olive" aria-hidden="true" />
              Unsaved changes
            </span>
          )}
          {status === "saving" && (
            <span className="flex items-center gap-1.5 text-sm text-olive">
              <Loader2 size={14} className="animate-spin" aria-hidden="true" />
              Saving…
            </span>
          )}
          {status === "saved" && (
            <span className="flex items-center gap-1.5 text-sm text-success">
              <CheckCircle2 size={14} aria-hidden="true" />
              Saved
            </span>
          )}
          {status === "error" && (
            <span className="flex items-center gap-1.5 text-sm text-error">
              <AlertCircle size={14} aria-hidden="true" />
              Error saving. Please try again.
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            disabled={!isDirty || status === "saving"}
          >
            Cancel
          </Button>
          <Button size="sm" onClick={persist} disabled={!isDirty || status === "saving"}>
            <Save size={14} aria-hidden="true" />
            Save now
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit(persist)} className="flex flex-col gap-6" noValidate>
        <Card className="flex flex-col gap-5">
          <h2 className="text-lg font-semibold text-charcoal">Album Information</h2>

          <Input
            label="Album Title"
            placeholder="e.g. Miller-Jones Summer Wedding"
            error={errors.title?.message}
            required
            {...register("title")}
          />
          <Textarea
            label="Description"
            placeholder="Briefly describe the event or shoot…"
            error={errors.description?.message}
            {...register("description")}
          />
          <Input
            label="Event Date"
            type="date"
            error={errors.eventDate?.message}
            {...register("eventDate")}
          />
        </Card>

        <Card className="flex flex-col gap-5">
          <h2 className="text-lg font-semibold text-charcoal">Client Assignment</h2>

          <Select label="Assign to Client" error={errors.clientId?.message} {...register("clientId")}>
            <option value="">Leave unassigned</option>
            {(clients ?? []).map((client) => (
              <option key={client.id} value={client.id}>
                {client.fullName}
              </option>
            ))}
          </Select>

          <p className="text-[13px] text-charcoal/60">
            Changing the client will not delete the client record. It only updates this album's
            assignment.
          </p>
        </Card>
      </form>
    </div>
  );
}

export default function AlbumDetailsTab() {
  const context = useOutletContext();
  const album = context?.album;

  // The layout renders the outlet even while the album is loading.
  // Guard so the form never mounts with an undefined album.
  if (!album) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-5 w-40" />
        <Card className="flex flex-col gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-10 w-full" />
        </Card>
      </div>
    );
  }

  return <AlbumDetailsForm album={album} />;
}