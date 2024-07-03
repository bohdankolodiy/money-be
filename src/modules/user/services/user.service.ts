import { PostgresDb } from "@fastify/postgres";
import { IInfo, IUser } from "../../../interfaces/user.interface";
import { FastifyRequest } from "fastify";
import { QueryResult } from "pg";
import { historyService } from "../../history/services/history.service";
import { MoneyStatus } from "../../../enums/money-status.enum";

interface IToken {
  id: string;
}

class UserService {
  async getUserById(db: PostgresDb, id: string): Promise<IUser> {
    return (await db.query(`Select * from users where id = $1`, [id])).rows[0];
  }

  async findOneByWallet(db: PostgresDb, wallet: string): Promise<IUser> {
    return (await db.query(`Select * from users where wallet=$1`, [wallet]))
      .rows[0];
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

  async getAuthUser(req: FastifyRequest): Promise<IUser> {
    const decodedId: string = await this.getUserId(req);
    return this.getUserById(req.db, decodedId);
  }

  async getUserId(req: FastifyRequest): Promise<string> {
    const token = req.headers.authorization!.split(" ")[1];
    const decodeToken: IToken | null = await req.jwt.decode(token);
    return decodeToken?.id ?? "";
  }

  async transactionTransfer(db: PostgresDb, userInfo: IInfo): Promise<unknown> {
    return db.transact(async () => {
      await userService.transferMoney(db, userInfo.amount, userInfo.id);
      await historyService.setHistoryNote(db, userInfo.history);
    });
  }

  async transactionPayment(
    db: PostgresDb,
    userInfo: Omit<IInfo, "amount">,
    recieverInfo: Omit<IInfo, "amount">
  ): Promise<unknown> {
    return db.transact(async () => {
      await historyService.setHistoryNote(db, userInfo.history);
      await historyService.setHistoryNote(db, recieverInfo.history);
    });
  }

  async transactionUpdatePayment(
    db: PostgresDb,
    userInfo: Omit<IInfo, "history">,
    recieverInfo: Omit<IInfo, "history">,
    status: string,
    date: string
  ): Promise<unknown> {
    return db.transact(async () => {
      if (status === MoneyStatus.Success) {
        await userService.transferMoney(db, userInfo.amount, userInfo.id);
        await userService.transferMoney(
          db,
          recieverInfo.amount,
          recieverInfo.id
        );
      }
      await historyService.updateHistoryStatus(
        db,
        userInfo.id,
        recieverInfo.id,
        status,
        date
      );
    });
  }
}

export const userService = new UserService();
