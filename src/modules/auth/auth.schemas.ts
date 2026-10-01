import { z } from "zod";

const passwordSchema = z
  .string()
  .min(10, "Password must be at least 10 characters.")
  .max(128, "Password must be at most 128 characters.")
  .regex(/[a-z]/, "Password must include a lowercase letter.")
  .regex(/[A-Z]/, "Password must include an uppercase letter.")
  .regex(/[0-9]/, "Password must include a number.")
  .regex(/[^A-Za-z0-9]/, "Password must include a symbol.");

export const registerUserSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().toLowerCase(),
  password: passwordSchema
});

export const loginUserSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(1, "Password is required.").max(128)
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
