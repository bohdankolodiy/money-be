import { Static, Type } from "@sinclair/typebox";

export const MessageObject = Type.Object({
  message_id: Type.String(),
  text: Type.String(),
  send_date: Type.String(),
  chat_id: Type.String(),
  sender_id: Type.String(),
});

export const ChatObject = Type.Object({
  chat_id: Type.String(),
  user1_id: Type.String(),
  user2_id: Type.String(),
  wallet_1: Type.String(),
  wallet_2: Type.String(),
  last_message_id: Type.String() || Type.Null(),
});

export const MessageResponseObject = Type.Object({
  date: Type.String(),
  messages: Type.Array(MessageObject),
});

export const ChatResponseObject = Type.Array(
  Type.Object({
    chat_id: Type.String(),
    user1_id: Type.String(),
    user2_id: Type.String(),
    wallet_1: Type.String(),
    wallet_2: Type.String(),
    last_message_id: Type.String() || Type.Null(),
    last_message: MessageObject ?? Type.Null(),
  })
);

export const ParamsObject = Type.Object({
  id: Type.String(),
});

export const ChatBobyObject = Type.Object({
  user_reciever_id: Type.String(),
});

export const MessageBobyObject = Type.Object({
  text: Type.String(),
  chat_id: Type.String(),
  sender_id: Type.String(),
  reciever_id: Type.String(),
});

export type CreateChatType = Static<typeof ChatBobyObject>;
export type MessageType = Static<typeof MessageBobyObject>;
export type ParamsType = Static<typeof ParamsObject>;

export const ChatSchema = {
  schema: {
    response: {
      200: ChatResponseObject,
    },
  },
};

export const CreateChatSchema = {
  schema: {
    body: ChatBobyObject,
    response: {
      201: ChatObject,
    },
  },
};

export const DeleteChatSchema = {
  schema: {
    params: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string" },
      },
    },
    response: {
      204: Type.Null(),
    },
  },
};

export const MessageSchema = {
  schema: {
    params: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string" },
      },
    },
    response: {
      200: Type.Array(MessageResponseObject),
    },
  },
};

export const AddMessageSchema = {
  schema: {
    body: MessageBobyObject,
    response: {
      201: MessageObject,
    },
  },
};
