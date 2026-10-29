import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../../app/layouts/AuthLayout";
import Input from "../../../components/ui/Input";
import PasswordInput from "../../../components/ui/PasswordInput";
import Button from "../../../components/ui/Button";
import InlineAlert from "../../../components/ui/InlineAlert";
import { login } from "../../../services/auth.service";

const emailField = z
  .string()
  .min(1, "Email is required.")
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address.");

const schema = z.object({
  email: emailField,
  password: z.string().min(1, "Password is required."),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const [formError, setFormError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  async function onSubmit(values) {
    setFormError("");
    try {
      await login(values);
      navigate("/dashboard");
    } catch (error) {
      setFormError(error.message);
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your studio workspace.">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        {formError && <InlineAlert tone="error">{formError}</InlineAlert>}

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
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />

        <div className="flex justify-end">
          <Link to="/forgot-password" className="rounded text-sm text-olive hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" size="lg" loading={isSubmitting} className="w-full">
          Sign In
        </Button>

        <p className="text-center text-sm text-charcoal/60">
          New to Frameora?{" "}
          <Link to="/register" className="font-medium text-olive hover:underline">
            Create an account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}