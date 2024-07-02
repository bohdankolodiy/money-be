import { Static, Type } from "@sinclair/typebox";

export const UserSchema = Type.Object({
  id: Type.String(),
  email: Type.String({ format: "email" }),
  wallet: Type.String(),
  balance: Type.Number(),
});

export const TransactSchema = Type.Object({
  wallet: Type.String(),
  comment: Type.String(),
  amount: Type.Number(),
});

export const updateStatusSchema = Type.Object({
  wallet: Type.String(),
  status: Type.String(),
  date: Type.String(),
  amount: Type.Number(),
});

export const TransferSchema = Type.Object({
  amount: Type.Number(),
  card: Type.String(),
});

export const TransferResponseSchema = Type.Object({
  balance: Type.Number(),
});

export type TransferType = Static<typeof TransferSchema>;
export type TransactType = Static<typeof TransactSchema>;
export type UpdateStatusType = Static<typeof updateStatusSchema>;

export const getUserSchema = {
  schema: {
    response: {
      200: UserSchema,
    },
  },
};

export const transferMoneySchema = {
  schema: {
    body: TransferSchema,
    response: {
      200: TransferResponseSchema,
    },
  },
};

export const transactMoneySchema = {
  schema: {
    body: TransactSchema,
    response: {
      200: TransferResponseSchema,
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
