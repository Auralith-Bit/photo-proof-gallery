import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../../app/layouts/AuthLayout";
import Input from "../../../components/ui/Input";
import PasswordInput from "../../../components/ui/PasswordInput";
import Checkbox from "../../../components/ui/checkbox";
import Button from "../../../components/ui/Button";
import InlineAlert from "../../../components/ui/InlineAlert";
import { register as registerUser } from "../../../services/auth.service";
import { toast } from "../../../stores/toastStore";

const emailField = z
  .string()
  .min(1, "Email is required.")
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address.");

const passwordField = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .regex(/[A-Za-z]/, "Password must include a letter.")
  .regex(/\d/, "Password must include a number.");

const schema = z
  .object({
    name: z.string().min(2, "Enter your full name."),
    email: emailField,
    password: passwordField,
    confirmPassword: z.string(),
    accept: z.boolean().refine((value) => value === true, "Please accept the terms to continue."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formError, setFormError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { accept: false } });

  async function onSubmit(values) {
    setFormError("");
    try {
      await registerUser(values);
      toast.success("Your studio workspace is ready.", "Welcome to Frameora");
      navigate("/dashboard");
    } catch (error) {
      setFormError(error.message);
    }
  }

  return (
    <AuthLayout title="Create your studio" subtitle="Organize albums and share galleries in minutes.">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        {formError && <InlineAlert tone="error">{formError}</InlineAlert>}

        <Input
          label="Full name"
          placeholder="Alex Morgan"
          autoComplete="name"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="Email"
          type="email"
          placeholder="you@studio.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <PasswordInput
          label="Password"
          placeholder="••••••••"
          autoComplete="new-password"
          helperText="At least 8 characters with letters and numbers."
          error={errors.password?.message}
          {...register("password")}
        />
        <PasswordInput
          label="Confirm password"
          placeholder="••••••••"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        <Checkbox
          label="I agree to the Frameora terms of service and privacy policy."
          error={errors.accept?.message}
          {...register("accept")}
        />

        <Button type="submit" size="lg" loading={isSubmitting} className="w-full">
          Create Account
        </Button>

        <p className="text-center text-sm text-charcoal/60">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-olive hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}