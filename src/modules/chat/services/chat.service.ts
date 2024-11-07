import { PostgresDb } from "@fastify/postgres";
import {
  IChat,
  IChatResponse,
  IMessages,
  IMessagesReply,
} from "../../../interfaces/chat.interface";

class ChatService {
  async getUserChats(db: PostgresDb, userId: string): Promise<IChatResponse[]> {
    return await db.transact(async () => {
      const chats = (
        await db.query(
          `SELECT 
              chat.chat_id,
              chat.user1_id,
              chat.user2_id,
              w1.wallet AS wallet_1,
              w2.wallet AS wallet_2,
              chat.last_message_id
            FROM 
                chat
            JOIN 
                users u1 ON chat.user1_id = u1.id
            JOIN 
                wallets w1 ON u1.wallet_id = w1.id
            JOIN 
                users u2 ON chat.user2_id = u2.id
            JOIN 
                wallets w2 ON u2.wallet_id = w2.id
            WHERE 
                u1.id = $1 or u2.id = $1`,
          [userId]
        )
      ).rows;

      const lastMessages: IChatResponse[] = [];
      for (let i = 0; i < chats.length; i++) {
        const currChat = chats[i];
        lastMessages.push({
          ...currChat,
          last_message: currChat.last_message_id
            ? (
                await db.query("Select * from messages where message_id=$1", [
                  currChat.last_message_id,
                ])
              ).rows[0]
            : null,
        } as IChatResponse);
      }

      return lastMessages.sort(
        (a, b) =>
          new Date(a.last_message?.send_date).getDate() -
          new Date(b.last_message?.send_date).getDate()
      );
    });
  }

  async getUserChatMessage(
    db: PostgresDb,
    chat_id: string
  ): Promise<IMessagesReply[]> {
    return await db.transact(async () => {
      const messages: IMessages[] = (
        await db.query("Select * from messages where chat_id=$1", [chat_id])
      ).rows.sort(
        (a, b) =>
          new Date(a.send_date).getDate() - new Date(b.send_date).getDate()
      );

      const send_dates: Array<{ date: string }> = (
        await db.query(
          "SELECT DISTINCT DATE_TRUNC('day', send_date::TIMESTAMP) as date from messages where chat_id = $1  ORDER BY date",
          [chat_id]
        )
      ).rows;

      const mappedMessages: IMessagesReply[] = send_dates.map((res) => ({
        date: res.date,
        messages: messages.filter(
          (item: IMessages) =>
            new Date(item?.send_date).setHours(0, 0, 0, 0) ===
            new Date(res.date).getTime()
        ),
      }));

      return mappedMessages;
    });
  }

  async createChat(db: PostgresDb, body: IChat): Promise<IChat> {
    return await db.transact(async () => {
      return (
        await db.query(
          "INSERT INTO chat(chat_id, user1_id, user2_id, last_message_id) VALUES ($1, $2, $3, $4) RETURNING *",
          [body.chat_id, body.user1_id, body.user2_id, body.last_message_id]
        )
      ).rows[0];
    });
  }

  async createMessage(db: PostgresDb, body: IMessages): Promise<unknown> {
    return await db.transact(async () => {
      await db.query(
        "INSERT INTO messages( message_id, text, send_date, chat_id, sender_id) VALUES ($1, $2, $3, $4, $5) RETURNING MESSAGE_ID",
        [
          body.message_id,
          body.text,
          body.send_date,
          body.chat_id,
          body.sender_id,
        ]
      );

      await chatService.updateChatLastMessage(
        db,
        body.message_id,
        body.chat_id
      );
    });
  }

  async updateChatLastMessage(
    db: PostgresDb,
    message_id: string,
    chat_id: string
  ): Promise<unknown> {
    return db.query(`Update chat set last_message_id = $1 where chat_id = $2`, [
      message_id,
      chat_id,
    ]);
  }

  async deleteChat(db: PostgresDb, chat_id: string): Promise<unknown> {
    return db.query(`Delete from chat where chat_id = $1`, [chat_id]);
  }
}

export const chatService = new ChatService();
