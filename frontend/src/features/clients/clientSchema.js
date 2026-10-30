import { z } from "zod";

export const clientSchema = z.object({
  fullName: z.string().min(2, "Enter the client's full name."),
  email: z
    .string()
    .optional()
    .refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "Enter a valid email address."),
  phone: z.string().optional(),
  notes: z.string().optional(),
});