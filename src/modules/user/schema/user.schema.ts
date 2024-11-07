import { Type } from "@sinclair/typebox";

export const UserObject = Type.Object({
  id: Type.String(),
  email: Type.String({ format: "email" }),
  wallet_id: Type.String(),
});

export const UsersForChatObject = Type.Object({
  id: Type.String(),
  wallet: Type.String(),
});

export const UsersArray = Type.Array(UserObject);
export const UsersForChatArray = Type.Array(UsersForChatObject);

export const getUserSchema = {
  schema: {
    response: {
      200: UserObject,
    },
  },
};

export const getUsersSchema = {
  schema: {
    response: {
      200: UsersArray,
    },
  },
};

export const getUsersForChatSchema = {
  schema: {
    response: {
      200: UsersForChatArray,
    },
  },
};
