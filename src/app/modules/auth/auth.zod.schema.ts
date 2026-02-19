import { z } from "zod";

export const resetPasswordSchema = z.object({
  token: z.string({ message: "Token is required" }),
  newPassword: z
    .string({ message: "New password is required" })
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string({ message: "Confirm password is required" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

