import { IChat, IMessages } from "../interfaces/chat.interface";
import generateUniqueId from "generate-unique-id";

export class ChatModel implements IChat {
  chat_id = generateUniqueId();
  wallet_1: string;
  wallet_2: string;
  user1_id: string;
  user2_id: string;
  last_message_id: string | null = null;

  constructor(
    user1_id: string,
    wallet_1: string,
    user2_id: string,
    wallet_2: string
  ) {
    this.wallet_1 = wallet_1;
    this.wallet_2 = wallet_2;
    this.user1_id = user1_id;
    this.user2_id = user2_id;
  }
}

export class MessageModel implements IMessages {
  message_id = generateUniqueId();
  text: string;
  send_date: string = new Date().toLocaleString();
  chat_id: string;
  sender_id: string;

  constructor(text: string, chat_id: string, sender_id: string) {
    this.text = text;
    this.chat_id = chat_id;
    this.sender_id = sender_id;
  }
}
