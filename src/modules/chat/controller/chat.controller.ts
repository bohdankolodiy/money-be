import { FastifyReply, FastifyRequest } from "fastify";
import { chatService } from "../services/chat.service";
import { IUser } from "../../../interfaces/user.interface";
import { ChatModel, MessageModel } from "../../../models/chat.model";
import { CreateChatType, MessageType } from "../schema/chat.schema";
import { userService } from "../../user/services/user.service";

class ChatController {
  async getAllChats(req: FastifyRequest, reply: FastifyReply) {
    try {
      const chats = await chatService.getUserChats(
        req.db,
        (req.user as IUser).id
      );
      return reply.code(200).send(chats);
    } catch (e) {
      return reply.code(500).send(e);
    }
  }

  async getMessagesByChatId(req: FastifyRequest, reply: FastifyReply) {
    try {
      const messageId = (req.params as { id: string }).id;
      const messages = await chatService.getUserChatMessage(req.db, messageId);
      return reply.code(200).send(messages);
    } catch (e) {
      return reply.code(500).send(e);
    }
  }

  async createChat(
    req: FastifyRequest<{ Body: CreateChatType }>,
    reply: FastifyReply
  ) {
    try {
      const { wallet_2, user2_id } = req.body as CreateChatType;

      const { wallet, id } = await userService.getUserById(
        req.db,
        (req.user as IUser).id
      );
      const newChat = new ChatModel(id, wallet, user2_id, wallet_2);
      const chat = await chatService.createChat(req.db, newChat);

      return reply.code(201).send(chat);
    } catch (e) {
      return reply.code(500).send(e);
    }
  }

  async addMessage(
    req: FastifyRequest<{ Body: MessageType }>,
    reply: FastifyReply
  ) {
    try {
      const { chat_id, sender_id, text } = req.body as MessageType;
      const newMessage = new MessageModel(text, chat_id, sender_id);

      req.socketIo.clients.forEach((cl) => {
        cl.send("get_message");
      });

      await chatService.createMessage(req.db, newMessage);
      return reply.code(201).send(newMessage);
    } catch (e) {
      return reply.code(500).send(e);
    }
  }
}

export const chatController = new ChatController();
