import { Static, Type } from "@sinclair/typebox";

export const TransferBodyObject = Type.Object({
  amount: Type.Number(),
  card: Type.String(),
});

export const WalletResponseSchema = Type.Object({
  id: Type.String(),
  wallet: Type.String(),
  balance: Type.Number(),
});

export const TransferResponseSchema = Type.Object({
  balance: Type.Number(),
});

export type TransferType = Static<typeof TransferBodyObject>;

export const transferMoneySchema = {
  schema: {
    body: TransferBodyObject,
    response: {
      201: TransferResponseSchema,
    },
  },
};

export const getWalletSchema = {
  schema: {
    response: {
      200: WalletResponseSchema,
    },
  },
};
