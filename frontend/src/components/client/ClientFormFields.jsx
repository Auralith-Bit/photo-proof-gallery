import Input from "../ui/Input";
import Textarea from "../ui/Textarea";

export default function ClientFormFields({ register, errors }) {
  return (
    <>
      <Input
        label="Full name"
        placeholder="e.g. Emma Miller"
        required
        error={errors.fullName?.message}
        {...register("fullName")}
      />
      <Input
        label="Email"
        type="email"
        placeholder="client@example.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        label="Phone number"
        type="tel"
        placeholder="+1 555-0100"
        autoComplete="tel"
        error={errors.phone?.message}
        {...register("phone")}
      />
      <Textarea
        label="Internal notes"
        placeholder="Optional notes only you can see…"
        rows={3}
        error={errors.notes?.message}
        {...register("notes")}
      />
    </>
  );
}