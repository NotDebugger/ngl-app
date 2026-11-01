import { Types } from "mongoose";
import z from "zod";

export const sendMessageDTO = z.object({
  content: z.string().trim().min(2).max(200),
  receiver: z
    .string()
    .trim()
    .refine((val) => Types.ObjectId.isValid(val)),
});

export const getAllMessagesDTO = z.object({
  userId: z
    .string()
    .trim()
    .refine((val) => Types.ObjectId.isValid(val)),
});
