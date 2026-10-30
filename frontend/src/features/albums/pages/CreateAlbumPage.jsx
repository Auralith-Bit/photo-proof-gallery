import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import PasswordInput from "../../../components/ui/PasswordInput";
import Textarea from "../../../components/ui/Textarea";
import Select from "../../../components/ui/Select";
import { useClients } from "../../../hooks/useClients";
import { useCreateAlbum } from "../../../hooks/useAlbums";

const schema = z
  .object({
    title: z.string().min(2, "Title must be at least 2 characters."),
    description: z.string().optional(),
    eventDate: z.string().optional(),
    clientMode: z.enum(["none", "existing", "new"]),
    clientId: z.string().optional(),
    newClientName: z.string().optional(),
    password: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.clientMode === "existing" && !data.clientId) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select a client.", path: ["clientId"] });
    }
    if (data.clientMode === "new" && (!data.newClientName || data.newClientName.length < 2)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Client name must be at least 2 characters.",
        path: ["newClientName"],
      });
    }
  });

export default function CreateAlbumPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const presetClient = searchParams.get("client");
  const { data: clients } = useClients();
  const createMutation = useCreateAlbum();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      eventDate: "",
      clientMode: presetClient ? "existing" : "none",
      clientId: presetClient || "",
      newClientName: "",
      password: "",
    },
  });

  const clientMode = watch("clientMode");

  async function onSubmit(values) {
    try {
      const newAlbum = await createMutation.mutateAsync(values);
      navigate(`/albums/${newAlbum.id}`);
    } catch {
      // error surfaced via hook toast
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <button
        type="button"
        onClick={() => navigate("/albums")}
        className="mb-6 flex items-center gap-1.5 rounded-control text-sm font-medium text-charcoal/60 hover:text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive/60"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back to My Albums
      </button>

      <h1 className="text-[28px] font-semibold leading-9 text-charcoal">Create New Album</h1>
      <p className="mt-1 text-sm text-charcoal/60">
        Set up the details, assign a client, and secure the gallery.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-6" noValidate>
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
          <Input label="Event Date" type="date" error={errors.eventDate?.message} {...register("eventDate")} />
        </Card>

        <Card className="flex flex-col gap-5">
          <h2 className="text-lg font-semibold text-charcoal">Client Assignment</h2>
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-charcoal">Assign to a client</p>
            <div className="flex flex-wrap gap-4">
              {["none", "existing", "new"].map((mode) => (
                <label key={mode} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    value={mode}
                    {...register("clientMode")}
                    className="h-4 w-4 border-sand accent-olive focus:ring-olive"
                  />
                  <span className="text-sm text-charcoal">
                    {mode === "none" && "Leave unassigned"}
                    {mode === "existing" && "Select existing client"}
                    {mode === "new" && "Create new client"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {clientMode === "existing" && (
            <Select label="Select Client" error={errors.clientId?.message} {...register("clientId")}>
              <option value="">Choose a client…</option>
              {(clients ?? []).map((client) => (
                <option key={client.id} value={client.id}>
                  {client.fullName}
                </option>
              ))}
            </Select>
          )}

          {clientMode === "new" && (
            <Input
              label="New Client Name"
              placeholder="e.g. Sarah & Mark Davis"
              error={errors.newClientName?.message}
              {...register("newClientName")}
            />
          )}
        </Card>

        <Card className="flex flex-col gap-5">
          <h2 className="text-lg font-semibold text-charcoal">Privacy & Access</h2>
          <PasswordInput
            label="Album Password"
            placeholder="Create a secure password for the client"
            helperText="Clients will need this password to view their gallery. Leave blank for no password."
            error={errors.password?.message}
            {...register("password")}
          />
          <p className="rounded-control border border-sand bg-ivory px-3 py-2.5 text-[13px] text-charcoal/60">
            The album URL will not contain the password. Clients will be prompted to enter it securely when they access the gallery.
          </p>
        </Card>

        <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-sand bg-ivory/95 py-4 backdrop-blur sm:static sm:border-t-0 sm:bg-transparent sm:py-0">
          <Button type="button" variant="outline" onClick={() => navigate("/albums")}>
            Cancel
          </Button>
          <Button type="submit" loading={createMutation.isPending}>
            <ImageIcon size={16} aria-hidden="true" />
            Create Album
          </Button>
        </div>
      </form>
    </div>
  );
}