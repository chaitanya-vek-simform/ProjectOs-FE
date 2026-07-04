import { z } from "zod";

import { ROLE_OPTIONS } from "@/constants/auth";
import { LABELS } from "@/constants/labels";

const auth = LABELS.AUTH;

const passwordSchema = z
  .string()
  .min(8, auth.PASSWORD_COMPLEXITY_ERROR)
  .regex(
    /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+/,
    auth.PASSWORD_COMPLEXITY_ERROR,
  );

export const loginSchema = z.object({
  email: z.email(auth.EMAIL_INVALID).min(1, auth.EMAIL_REQUIRED),
  password: z.string().min(1, auth.PASSWORD_REQUIRED),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.email(auth.EMAIL_INVALID).min(1, auth.EMAIL_REQUIRED),
});
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, auth.CONFIRM_PASSWORD_REQUIRED),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: auth.PASSWORD_MISMATCH,
    path: ["confirmPassword"],
  });
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(1, auth.NAME_REQUIRED),
    email: z.email(auth.EMAIL_INVALID).min(1, auth.EMAIL_REQUIRED),
    orgName: z.string().min(1, auth.ORG_NAME_REQUIRED),
    role: z.enum(ROLE_OPTIONS, auth.ROLE_REQUIRED),
    password: passwordSchema,
    confirmPassword: z.string().min(1, auth.CONFIRM_PASSWORD_REQUIRED),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: auth.PASSWORD_MISMATCH,
    path: ["confirmPassword"],
  });
export type RegisterFormValues = z.infer<typeof registerSchema>;
