import { FastifyInstance } from "fastify";
import { walletController } from "../controller/wallet.controller";
import { transferMoneySchema } from "../schema/wallet.schema";

export async function walletRoutes(app: FastifyInstance) {
  app.put(
    "/deposit",
    {
      preHandler: [app.authenticate],
      ...transferMoneySchema,
    },
    walletController.userDeposit
  );
  app.put(
    "/withdrawal",
    {
      preHandler: [app.authenticate],
      ...transferMoneySchema,
    },
    walletController.userWithdrawal
  );
}
