import { Static, Type } from "@sinclair/typebox";

export const UserAuth = Type.Object({
  password: Type.String(),
  email: Type.String({ format: "email" }),
});

export const UserSchema = Type.Object({
  id: Type.String(),
  email: Type.String({ format: "email" }),
  password: Type.String(),
  wallet: Type.String(),
  balance: Type.Number(),
  transactionsHistory: Type.Array(Type.Number()),
});

export const UserEmailSchema = Type.Object({
  email: Type.String({ format: "email" }),
});

export type UserType = Static<typeof UserSchema>;
export type UserAuthType = Static<typeof UserAuth>;
export type UserEmailType = Static<typeof UserEmailSchema>;

export const userPostSchema = {
  schema: {
    body: UserAuth,
    response: {
      200: UserSchema,
    },
  },
};
