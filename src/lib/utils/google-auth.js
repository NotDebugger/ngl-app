import { OAuth2Client } from "google-auth-library";
import { AppError } from "../../pkg/error/error.js";
import { env } from "../config/env.js";

const client = new OAuth2Client();

export async function verifyGoogleToken() {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: env.googleOAuth.clientId,
    });
    return ticket.getPayload();
  } catch (err) {
    throw new AppError("invalid google token", 403);
  }
}
