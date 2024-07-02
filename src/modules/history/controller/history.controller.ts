import { FastifyReply, FastifyRequest } from "fastify";
import { historyService } from "../services/history.service";
import { ITransactHistory } from "../../../interfaces/history.interface";

class HistoryController {
  async getHistory(req: FastifyRequest, reply: FastifyReply) {
    try {
      const historyId = (req.query as { id: string }).id;

      const history: ITransactHistory[] = await historyService.getAllHistory(
        req.db,
        historyId
      );

      reply.code(200).send(history);
    } catch (e) {
      reply.code(500).send({ message: "smth went wrong" });
    }
  }

  async getUserHistory(req: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (req.params as { id: string }).id;

      const history = await historyService.getUserHistory(req.db, userId);

      reply.code(200).send(history);
    } catch (e) {
      reply.code(500).send({ message: "smth went wrong" });
    }
  }
}

export const historyController = new HistoryController();
