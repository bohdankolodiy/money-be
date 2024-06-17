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

export const UserIdSchema = Type.Object({
  id: Type.String(),
});

export const UserTokenSchema = Type.Object({
  accessToken: Type.String(),
});

export const UserDefaultSchema = Type.Object({
  message: Type.String(),
});

export type UserType = Static<typeof UserSchema>;
export type UserAuthType = Static<typeof UserAuth>;
export type UserIdType = Static<typeof UserIdSchema>;
export type TokenType = Static<typeof UserTokenSchema>;

export const userRegisterSchema = {
  schema: {
    body: UserAuth,
    response: {
      201: UserDefaultSchema,
    },
  },
};

export const userLoginSchema = {
  schema: {
    body: UserAuth,
    response: {
      200: UserTokenSchema,
    },
  },
};

export const userVerifySchema = {
  schema: {
    body: UserIdSchema,
    response: {
      200: UserDefaultSchema,
    },
  },
};
