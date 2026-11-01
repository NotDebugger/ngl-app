import z from "zod";
import { config } from "dotenv";
config();

const schema = z.object({
  MONGODB_URL: z.string(),

  CORS_ORIGIN: z.string(),

  REDIS_PORT: z.string().default("6379"),
  REDIS_HOST: z.string(),

  MAILJET_API_KEY: z.string(),
  MAILJET_SECRET_KEY: z.string(),
  FROM_NAME: z.string().trim(),
  FROM_EMAIL: z.string(),

  NODEMAILER_PORT: z.string(),
  NODEMAILER_HOST: z.string(),
  NODEMAILER_MAIL: z.string(),
  NODEMAILER_PASSWORD: z.string(),

  JWT_SECRET: z.string(),

  GOOGLE_AUTH_CLIENT_ID: z.string(),
});

const parsed = schema.parse(process.env);

export const env = {
  db: {
    url: parsed.MONGODB_URL,
  },

  redis: {
    port: parsed.REDIS_PORT,
    host: parsed.REDIS_HOST,
  },

  cors: {
    origin: parsed.CORS_ORIGIN,
  },

  mailjet: {
    apiKey: parsed.MAILJET_API_KEY,
    secretKey: parsed.MAILJET_SECRET_KEY,
    fromName: parsed.FROM_NAME,
    fromEmail: parsed.FROM_EMAIL,
  },

  nodemailer: {
    port: parsed.NODEMAILER_PORT,
    host: parsed.NODEMAILER_HOST,
    email: parsed.NODEMAILER_MAIL,
    password: parsed.NODEMAILER_PASSWORD,
  },

  jwt: {
    secret: parsed.JWT_SECRET,
  },

  googleOAuth: {
    clientId: parsed.GOOGLE_AUTH_CLIENT_ID,
  },
};
