import z, { email } from "zod";

export const signupDTO = z.object({
  email: z.email().toLowerCase().trim(),
  name: z.string().min(2).max(20).trim(),
  password: z.string().min(8).max(20).trim(),
  provider: z.enum(["local", "google", "facebook"]).default("local"),
  dob: z.date().optional(),
  gender: z.enum(["male", "female"]).optional(),
});

export const verifyAccountDTO = z.object({
  email: z.email().toLowerCase().trim(),
  code: z.string().length(6).trim(),
});
export const twoStepVerificationDTO = z.object({
  email: z.email().toLowerCase().trim(),
  code: z.string().length(6).trim(),
});

export const loginDTO = z.object({
  email: z.email().toLowerCase().trim(),
  password: z.string().min(2).max(20).trim(),
});

export const sendOtpDTO = z.object({
  email: z.email().toLowerCase().trim(),
});

export const resetPasswordDTO = z.object({
  email: z.email().toLowerCase().trim(),
  code: z.string().length(6).trim(),
  newPassword: z.string().min(2).max(20).trim(),
});

export const loginWithGoogleDTO = z.object({
  credential: z.string().trim(),
});
