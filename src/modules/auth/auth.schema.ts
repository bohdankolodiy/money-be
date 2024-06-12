import { Static, Type } from "@sinclair/typebox";

export const UserAuth = Type.Object({
  password: Type.String(),
  email: Type.String({ format: "email" }),
});

export const User = Type.Object({
  id: Type.String(),
  email: Type.String({ format: "email" }),
  password: Type.String(),
  wallet: Type.String(),
  balance: Type.Number(),
  transactionsHistory: Type.Array(Type.Number()),
});

export type UserType = Static<typeof User>;
export type UserAuthType = Static<typeof UserAuth>;

export const userPostSchema = {
  schema: {
    body: UserAuth,
    response: {
      200: User,
    },
  },
};
