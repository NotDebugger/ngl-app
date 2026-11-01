import { AppError } from "../../pkg/error/error.js";

export const otpExpired = new AppError("OTP is expired.", 404);
export const invalidCode = new AppError("Invalid OTP.", 400);
export const invalidEmailOrPassword = new AppError(
  "Invalid email or password.",
  403,
);
