import { FastifyReply, FastifyRequest } from "fastify";
import { historyService } from "../services/history.service";
import { ITransactHistory } from "../../../interfaces/history.interface";

class HistoryController {
  async getHistory(req: FastifyRequest, reply: FastifyReply) {
    try {
      const historyId = (req.query as { id: string }).id;

      if (!historyId) return reply.code(400).send("Please, provide correct id");

      const history: ITransactHistory[] = await historyService.getAllHistory(
        req.db,
        historyId
      );

      return reply.code(200).send(history);
    } catch (e) {
      return reply.code(500).send({ message: "smth went wrong" });
    }
  }

  async getUserHistory(req: FastifyRequest, reply: FastifyReply) {
    try {
      const wallet_id = (req.params as { id: string }).id;

      if (!wallet_id) return reply.code(400).send("Please, provide correct id");

      const history = await historyService.getUserHistory(req.db, wallet_id);

      return reply.code(200).send(history);
    } catch (e) {
      return reply.code(500).send({ message: "smth went wrong" });
    }
  }
}

export const historyController = new HistoryController();
