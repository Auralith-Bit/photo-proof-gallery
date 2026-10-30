import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save } from "lucide-react";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import ClientFormFields from "../../../components/client/ClientFormFields";
import { clientSchema } from "../clientSchema";
import { useCreateClient } from "../../../hooks/useClients";

export default function CreateClientPage() {
  const navigate = useNavigate();
  const createClient = useCreateClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(clientSchema),
    defaultValues: { fullName: "", email: "", phone: "", notes: "" },
  });

  function onSubmit(values) {
    createClient.mutate(values, {
      onSuccess: (client) => navigate(`/clients/${client.id}`),
    });
  }

  return (
    <div className="mx-auto max-w-2xl">
      <button
        type="button"
        onClick={() => navigate("/clients")}
        className="mb-6 flex items-center gap-1.5 rounded-control text-sm font-medium text-charcoal/60 hover:text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive/60"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back to Clients
      </button>

      <h1 className="text-[28px] font-semibold leading-9 text-charcoal">Add Client</h1>
      <p className="mt-1 text-sm text-charcoal/60">
        Clients don't need an account to view their albums — this record just keeps your studio organized.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-6" noValidate>
        <Card className="flex flex-col gap-5">
          <ClientFormFields register={register} errors={errors} />
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate("/clients")}>
            Cancel
          </Button>
          <Button type="submit" loading={createClient.isPending}>
            <Save size={16} aria-hidden="true" />
            Save Client
          </Button>
        </div>
      </form>
    </div>
  );
}