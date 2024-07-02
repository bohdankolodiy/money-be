import { FastifyInstance } from "fastify";
import { historyController } from "../controller/history.controller";
import { allHistorySchema } from "../schema/history.schema";

export async function historyRoutes(app: FastifyInstance) {
  app.get(
    "/",
    { preHandler: [app.authenticate] },
    historyController.getHistory
  );
  app.get(
    "/:id",
    { preHandler: [app.authenticate], ...allHistorySchema },
    historyController.getUserHistory
  );
}
