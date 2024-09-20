import { ITransactHistory } from "../interfaces/history.interface";
import generateUniqueId from "generate-unique-id";

export class History implements ITransactHistory {
  id = generateUniqueId();
  amount: number;
  action: string;
  userid: string;
  status: string;
  date: string = new Date().toLocaleString();
  card: string | null;
  wallet: string | null;
  comment: string | null;
  transact_id: string | null;

  constructor(
    amount: number,
    action: string,
    userId: string,
    status: string,
    comment: string | null = null,
    card: string | null = null,
    wallet: string | null = null,
    transact_id: string | null = null
  ) {
    this.amount = amount;
    this.action = action;
    this.userid = userId;
    this.status = status;
    this.card = card;
    this.wallet = wallet;
    this.comment = comment;
    this.transact_id = transact_id;
  }
}
