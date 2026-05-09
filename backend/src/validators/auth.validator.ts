import { z } from "zod";

const emailSchema = z
  .string()
  .email("A valid email is required.")
  .transform((value) => value.toLowerCase().trim());

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(80),
    email: emailSchema,
    password: z
      .string()
      .min(8)
      .max(120)
      .regex(/[A-Z]/, "Password must include one uppercase letter.")
      .regex(/[a-z]/, "Password must include one lowercase letter.")
      .regex(/[0-9]/, "Password must include one number.")
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: z.string().min(8).max(120)
  })
});
