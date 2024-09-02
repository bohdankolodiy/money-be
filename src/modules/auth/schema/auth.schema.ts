import { Static, Type } from "@sinclair/typebox";

export const UserAuthObject = Type.Object({
  password: Type.String(),
  email: Type.String({ format: "email" }),
});

export const forgetPasswordObject = Type.Object({
  email: Type.String({ format: "email" }),
});

export const resetPasswordObject = Type.Object({
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

export const UserIdObject = Type.Object({
  id: Type.String(),
});

export const UserTokenObject = Type.Object({
  accessToken: Type.String(),
});

export const UserDefaultObject = Type.Object({
  message: Type.String(),
});

export type UserType = Static<typeof UserObject>;
export type UserAuthType = Static<typeof UserAuthObject>;
export type UserIdType = Static<typeof UserIdObject>;
export type TokenType = Static<typeof UserTokenObject>;
export type ForgetPasswordType = Static<typeof forgetPasswordObject>;
export type ResetPasswordType = Static<typeof resetPasswordObject>;

export const userRegisterSchema = {
  schema: {
    body: UserAuthObject,
    response: {
      201: UserDefaultObject,
    },
  },
};

export const userLoginSchema = {
  schema: {
    body: UserAuthObject,
    response: {
      200: UserTokenObject,
    },
  },
};

export const userVerifySchema = {
  schema: {
    body: UserIdObject,
    response: {
      200: UserDefaultObject,
    },
  },
};

export const forgetPasswordSchema = {
  schema: {
    body: forgetPasswordObject,
    response: {
      200: UserDefaultObject,
    },
  },
};

export const resetPasswordSchema = {
  schema: {
    body: resetPasswordObject,
    response: {
      200: UserDefaultObject,
    },
  },
};

export const deleteSchema = {
  schema: {
    response: {
      203: null,
    },
  },
};
