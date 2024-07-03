import { PostgresDb } from "@fastify/postgres";
import {
  ITransactHistory,
  ITransformHistory,
} from "../../../interfaces/history.interface";

class HistoryService {
  async getAllHistory(
    db: PostgresDb,
    historyId: string
  ): Promise<ITransactHistory[]> {
    return (
      await db.query("Select * from history where id=$1 order by date desc", [
        historyId,
      ])
    ).rows;
  }

  async getUserHistory(
    db: PostgresDb,
    userId: string
  ): Promise<ITransformHistory[]> {
    return await db.transact(async () => {
      const history = (
        await db.query(
          "Select * from history where userId=$1 order by date desc",
          [userId]
        )
      ).rows;

      const filterHistory = (
        await db.query(
          `SELECT DATE_TRUNC('day', h.date::TIMESTAMP) AS date,
                  COALESCE(SUM(CASE WHEN h.status = 'Success' THEN h.amount ELSE 0 END), 0) AS amount
           FROM (
                SELECT DISTINCT DATE_TRUNC('day', date::TIMESTAMP) AS truncated_date
                FROM history
           ) AS history_date
           LEFT JOIN history h ON DATE_TRUNC('day', h.date::TIMESTAMP) = history_date.truncated_date
                   AND h.userid = $1
           WHERE h.date IS NOT NULL
           GROUP BY DATE_TRUNC('day', h.date::TIMESTAMP)
           ORDER BY DATE_TRUNC('day', h.date::TIMESTAMP) DESC;`,
          [userId]
        )
      ).rows;

      return filterHistory.map((res) => ({
        ...res,
        items: history.filter(
          (item: ITransactHistory) =>
            new Date(item.date).setHours(0, 0, 0, 0) ===
            new Date(res.date).getTime()
        ),
      }));
    });
  }

  async setHistoryNote(
    db: PostgresDb,
    body: ITransactHistory
  ): Promise<{ id: string }> {
    return (
      await db.query(
        "INSERT INTO history(id, amount, action, userId, status, date, card, wallet) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING ID",
        [
          body.id,
          body.amount,
          body.action,
          body.userid,
          body.status,
          body.date,
          body.card,
          body.wallet,
        ]
      )
    ).rows[0];
  }

  async updateHistoryStatus(
    db: PostgresDb,
    userId: string,
    recieverId: string,
    status: string,
    date: string
  ): Promise<unknown> {
    return await db.transact(async () => {
      await db.query(
        `Update history set status = $1 where userid = $2 and date = $3`,
        [status, userId, date]
      );
      await db.query(
        `Update history set status = $1 where userid = $2 and date = $3`,
        [status, recieverId, date]
      );
    });
  }
}

export const historyService = new HistoryService();
