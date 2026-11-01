import { Router } from "express";
import * as messageController from "./controller/message.controller.js";
import { guard } from "../../lib/auth/guard.js";

export const messageRouter = Router();

messageRouter.post("/", messageController.sendMessage);
messageRouter.post("/public", guard, messageController.sendMessage);
messageRouter.post("/get-all-messages", guard, messageController.sendMessage);
