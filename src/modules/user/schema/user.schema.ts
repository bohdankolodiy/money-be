import { Type } from "@sinclair/typebox";

export const UserObject = Type.Object({
  id: Type.String(),
  email: Type.String({ format: "email" }),
  wallet: Type.String(),
  balance: Type.Number(),
});

export const UsersArray = Type.Array(UserObject);

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
