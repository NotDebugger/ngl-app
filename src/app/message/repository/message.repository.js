import { Message } from "../model/message.model.js";

export async function createMessage(content, receiver, sender) {
  return await Message.create({
    content,
    receiver,
    sender,
  });
}

export async function getAllMessages(id) {
  return await Message.find(
    { receiver: id },
    {},
    { populate: { path: "sender", select: "name" } },
  );
}
