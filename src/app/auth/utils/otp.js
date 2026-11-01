import crypto from "node:crypto";

export async function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}
