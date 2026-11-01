import * as messageService from "../service/message.service.js";
import { sendMessageDTO, getAllMessagesDTO } from "../dto/message.dto.js";
import { validateBody } from "../../../lib/validation/validation.js";

export async function sendMessage(req, res, next) {
  try {
    const data = validateBody(sendMessageDTO, req.body);
    const { content, receiver } = data;
    const sender = req.user?.id;

    const message = await messageService.sendMessage(content, receiver, sender);

    res.json({
      message: "Message sent successfully",
      success: true,
      data: message,
    });
  } catch (err) {
    next(err);
  }
}

export async function getAllMessages(req, res, next) {
  try {
    const data = validateBody(getAllMessagesDTO, req.body);

    const messages = await messageService.sendMessage(data.userId);

    res.json({
      message: "Messages found successfully",
      success: true,
      data: messages,
    });
  } catch (err) {
    next(err);
  }
}
