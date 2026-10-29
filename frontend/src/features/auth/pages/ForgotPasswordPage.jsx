import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import AuthLayout from "../../../app/layouts/AuthLayout";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import InlineAlert from "../../../components/ui/InlineAlert";
import { requestPasswordReset } from "../../../services/auth.service";

const emailField = z
  .string()
  .min(1, "Email is required.")
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address.");

const schema = z.object({ email: emailField });

export default function ForgotPasswordPage() {
  const [sentTo, setSentTo] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  async function onSubmit(values) {
    await requestPasswordReset(values.email);
    setSentTo(values.email);
  }

  if (sentTo) {
    return (
      <AuthLayout title="Check your email" subtitle="We've received your request.">
        <div className="flex flex-col gap-4">
          <InlineAlert tone="success">
            If an account exists for <span className="font-medium">{sentTo}</span>, a password
            reset link is on its way.
          </InlineAlert>
          <p className="text-sm text-charcoal/60">
            Didn't receive it? Check your spam folder or try again.
          </p>
          <Button variant="outline" onClick={() => setSentTo("")}>
            Use a different email
          </Button>
          <Link to="/login" className="rounded text-center text-sm text-olive hover:underline">
            Back to sign in
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot password"
      subtitle="Enter your account email and we'll send a reset link."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <Input
          label="Email"
          type="email"
          placeholder="you@studio.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Button type="submit" size="lg" loading={isSubmitting} className="w-full">
          Send Reset Link
        </Button>
        <Link to="/login" className="rounded text-center text-sm text-olive hover:underline">
          Back to sign in
        </Link>
      </form>
    </AuthLayout>
  );
}