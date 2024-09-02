import { PostgresDb } from "@fastify/postgres";
import { IInfo, IUser } from "../../../interfaces/user.interface";
import { FastifyRequest } from "fastify";
import { QueryResult } from "pg";
import { historyService } from "../../history/services/history.service";
import { MoneyStatus } from "../../../enums/money-status.enum";
import { Transactions } from "../../../models/transaction.model";
import { History } from "../../../models/history.model";

interface IToken {
  id: string;
}

class UserService {
  async getUserById(db: PostgresDb, id: string): Promise<IUser> {
    return (await db.query(`Select * from users where id = $1`, [id])).rows[0];
  }

  async getUsers(req: FastifyRequest): Promise<IUser[]> {
    return (
      await req.db.query(`Select * from users where id != $1`, [
        (await userService.getAuthUser(req)).id,
      ])
    ).rows;
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

  async getUserId(
    req: FastifyRequest,
    token: string = req.headers.authorization!
  ): Promise<string> {
    const splitToken = token.split(" ")[1] ?? token;
    const decodeToken: IToken | null = await req.jwt.decode(splitToken);
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
      const transaction = new Transactions(
        recieverInfo.history.amount,
        recieverInfo.history.id,
        userInfo.history.id,
        "Pending"
      );
      const transactid = (
        await historyService.createTransaction(db, transaction)
      ).id;
      await historyService.updateHistoryTransactionId(
        db,
        transactid,
        transaction.senderid,
        transaction.recieverid
      );
    });
  }

  async transactionUpdatePayment(
    db: PostgresDb,
    userInfo: Omit<IInfo, "history">,
    recieverInfo: Omit<IInfo, "history">,
    transactid: string,
    status: string
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
      await historyService.updateHistoryStatus(db, transactid, status);
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

  generateTransactionInfo(
    id: string,
    type: string,
    amount: number,
    comment: string,
    wallet: string
  ): Omit<IInfo, "amount"> {
    return {
      id: id,
      history: new History(
        amount,
        type,
        id,
        MoneyStatus.Pending,
        comment,
        null,
        wallet
      ),
    };
  }
}

export const userService = new UserService();
