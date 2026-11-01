import express from "express";
import "./lib/db/mongoose.js";
import { authRouter } from "./app/auth/auth.route.js";
import cors from "cors";
import { env } from "./lib/config/env.js";
import { globalErrorHandler } from "./lib/error/error.handler.js";
import { correlationId } from "./lib/correlation/correlationId.js";
import { messageRouter } from "./app/message/message.route.js";
import cookieParser from "cookie-parser";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.cors.origin,
      credentials: true,
    }),
  );

  app.use(cookieParser());
  app.use(express.json());
  app.use(correlationId);

  app.use("/auth", authRouter);
  app.use("/message", messageRouter);

  // global error handler
  app.use(globalErrorHandler);

  return app;
}
