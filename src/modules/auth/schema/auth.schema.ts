import { Static, Type } from "@sinclair/typebox";

export const UserAuthBodyObject = Type.Object({
  password: Type.String(),
  email: Type.String({ format: "email" }),
});

export const ForgetPasswordBodyObject = Type.Object({
  email: Type.String({ format: "email" }),
});

export const ResetPasswordBodyObject = Type.Object({
  password: Type.String(),
  token: Type.String(),
});

export const UserObject = Type.Object({
  id: Type.String(),
  email: Type.String({ format: "email" }),
  password: Type.String(),
  wallet: Type.String(),
  balance: Type.Number(),
  transactionsHistory: Type.Array(Type.Number()),
});

export const UserIdBodyObject = Type.Object({
  id: Type.String(),
});

export const UserTokenObject = Type.Object({
  accessToken: Type.String(),
});

export const UserDefaultObject = Type.Object({
  message: Type.String(),
});

export type UserType = Static<typeof UserObject>;
export type UserAuthType = Static<typeof UserAuthBodyObject>;
export type UserIdType = Static<typeof UserIdBodyObject>;
export type TokenType = Static<typeof UserTokenObject>;
export type ForgetPasswordType = Static<typeof ForgetPasswordBodyObject>;
export type ResetPasswordType = Static<typeof ResetPasswordBodyObject>;

export const userRegisterSchema = {
  schema: {
    body: UserAuthBodyObject,
    response: {
      201: UserDefaultObject,
    },
  },
};

export const userLoginSchema = {
  schema: {
    body: UserAuthBodyObject,
    response: {
      200: UserTokenObject,
    },
  },
};

export const userVerifySchema = {
  schema: {
    body: UserIdBodyObject,
    response: {
      200: UserDefaultObject,
    },
  },
};

export const forgetPasswordSchema = {
  schema: {
    body: ForgetPasswordBodyObject,
    response: {
      200: UserDefaultObject,
    },
  },
};

export const resetPasswordSchema = {
  schema: {
    body: ResetPasswordBodyObject,
    response: {
      200: UserDefaultObject,
    },
  },
};

export const deleteSchema = {
  schema: {
    response: {
      204: Type.Any(),
    },
  },
};
