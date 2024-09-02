import { FastifyInstance } from "fastify";
import { userController } from "../controller/user.controller";
import {
  getUserSchema,
  transferMoneySchema,
  transactMoneySchema,
  updatePaymentStatusSchema,
  getUsersSchema,
} from "../schema/user.schema";

export async function userRoutes(app: FastifyInstance) {
  app.get(
    "/",
    {
      preHandler: [app.authenticate],
      ...getUserSchema,
    },
    userController.getUser
  );
  app.get(
    "/all",
    {
      preHandler: [app.authenticate],
      ...getUsersSchema,
    },
    userController.getUsers
  );
  app.put(
    "/transact",
    {
      preHandler: [app.authenticate],
      ...transactMoneySchema,
    },
    userController.transactUsersMoney
  );
  app.put(
    "/deposit",
    {
      preHandler: [app.authenticate],
      ...transferMoneySchema,
    },
    userController.userDeposit
  );
  app.put(
    "/withdrawal",
    {
      preHandler: [app.authenticate],
      ...transferMoneySchema,
    },
    userController.userWithdrawal
  );

  app.put(
    "/status-update",
    {
      preHandler: [app.authenticate],
      ...updatePaymentStatusSchema,
    },
    userController.updatePaymentStatus
  );
}
