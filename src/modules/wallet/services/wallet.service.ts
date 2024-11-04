import { PostgresDb } from "@fastify/postgres";
import { IInfo } from "../../../interfaces/user.interface";
import { QueryResult } from "pg";
import { historyService } from "../../history/services/history.service";
import { MoneyStatus } from "../../../enums/money-status.enum";
import { History } from "../../../models/history.model";
import { PaymentsService } from "../../../shared/services/payments/payments.service";

class WalletService extends PaymentsService {
  constructor() {
    super();
  }

  async transferMoney(
    db: PostgresDb,
    amount: number,
    userId: string
  ): Promise<QueryResult> {
    return await db.query(`Update users Set balance = $1 where id=$2`, [
      amount,
      userId,
    ]);
  }

  async transactionTransfer(db: PostgresDb, userInfo: IInfo): Promise<unknown> {
    return db.transact(async () => {
      await walletService.transferMoney(db, userInfo.amount, userInfo.id);
      await historyService.setHistoryNote(db, userInfo.history);
    });
  }

  generateTransferInfo(
    id: string,
    type: string,
    amount: number,
    newUserAmount: number,
    card: string
  ): IInfo {
    return {
      id: id,
      amount: newUserAmount,
      history: new History(amount, type, id, MoneyStatus.Success, "", card),
    };
  }
}

export const walletService = new WalletService();
