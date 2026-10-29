import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "../../../app/layouts/AuthLayout";
import PasswordInput from "../../../components/ui/PasswordInput";
import Button from "../../../components/ui/Button";
import InlineAlert from "../../../components/ui/InlineAlert";
import { resetPassword } from "../../../services/auth.service";

const passwordField = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .regex(/[A-Za-z]/, "Password must include a letter.")
  .regex(/\d/, "Password must include a number.");

const schema = z
  .object({
    password: passwordField,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [done, setDone] = useState(false);
  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const linkInvalid = !token || token === "expired";

  async function onSubmit(values) {
    setFormError("");
    try {
      await resetPassword({ token, password: values.password });
      setDone(true);
    } catch (error) {
      setFormError(error.message);
    }
  }

  if (linkInvalid) {
    return (
      <AuthLayout
        title="Reset link invalid"
        subtitle="This password reset link is invalid or has expired."
      >
        <div className="flex flex-col gap-4">
          <InlineAlert tone="error">Please request a new reset link to continue.</InlineAlert>
          <Button size="lg" onClick={() => navigate("/forgot-password")}>
            Request a New Link
          </Button>
          <Link to="/login" className="rounded text-center text-sm text-olive hover:underline">
            Back to sign in
          </Link>
        </div>
      </AuthLayout>
    );
  }

  if (done) {
    return (
      <AuthLayout title="Password updated" subtitle="Your password has been changed successfully.">
        <div className="flex flex-col gap-4">
          <InlineAlert tone="success">You can now sign in with your new password.</InlineAlert>
          <Button size="lg" onClick={() => navigate("/login")}>
            Go to Sign In
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Set a new password" subtitle="Choose a strong password for your account.">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        {formError && <InlineAlert tone="error">{formError}</InlineAlert>}
        <PasswordInput
          label="New password"
          placeholder="••••••••"
          autoComplete="new-password"
          helperText="At least 8 characters with letters and numbers."
          error={errors.password?.message}
          {...register("password")}
        />
        <PasswordInput
          label="Confirm new password"
          placeholder="••••••••"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        <Button type="submit" size="lg" loading={isSubmitting} className="w-full">
          Update Password
        </Button>
      </form>
    </AuthLayout>
  );
}