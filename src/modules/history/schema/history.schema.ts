import { Static, Type } from "@sinclair/typebox";

export const HistorySchema = Type.Object({
  id: Type.String(),
  amount: Type.Number(),
  action: Type.String(),
  userid: Type.String(),
  status: Type.String(),
  date: Type.String(),
  comment: Type.String() || Type.Null(),
  card: Type.String() || Type.Null(),
  wallet: Type.String() || Type.Null(),
  transactid: Type.String() || Type.Null(),
});

export const HistoryResponseSchema = Type.Array(
  Type.Object({
    amount: Type.Number(),
    date: Type.String(),
    items: Type.Array(HistorySchema),
  })
);

export const HistoryRequestSchema = Type.Object({
  id: Type.String(),
});

export type HistoryRequestType = Static<typeof HistoryRequestSchema>;

export const allHistorySchema = {
  schema: {
    response: {
      200: HistoryResponseSchema,
    },
  },
};
