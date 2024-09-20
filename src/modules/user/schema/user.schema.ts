import { Static, Type } from "@sinclair/typebox";

export const UserObject = Type.Object({
  id: Type.String(),
  email: Type.String({ format: "email" }),
  wallet: Type.String(),
  balance: Type.Number(),
});

export const UsersArray = Type.Array(UserObject);

export const TransactBodyObject = Type.Object({
  wallet: Type.String(),
  comment: Type.String(),
  amount: Type.Number(),
});

export const updateStatusSchema = Type.Object({
  wallet: Type.String(),
  status: Type.String(),
  transact_id: Type.String(),
  amount: Type.Number(),
});

export const TransferBodyObject = Type.Object({
  amount: Type.Number(),
  card: Type.String(),
});

export const TransferResponseSchema = Type.Object({
  balance: Type.Number(),
});

export type TransferType = Static<typeof TransferBodyObject>;
export type TransactType = Static<typeof TransactBodyObject>;
export type UpdateStatusType = Static<typeof updateStatusSchema>;

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

export const transferMoneySchema = {
  schema: {
    body: TransferBodyObject,
    response: {
      201: TransferResponseSchema,
    },
  },
};

export const transactMoneySchema = {
  schema: {
    body: TransactBodyObject,
    response: {
      201: TransferResponseSchema,
    },
  },
};

export const updatePaymentStatusSchema = {
  schema: {
    body: updateStatusSchema,
    response: {
      200: {},
    },
  },
};
