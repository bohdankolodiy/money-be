import generateUniqueId from "generate-unique-id";
import { ITransaction } from "../interfaces/transact.interface";

export class Transactions implements ITransaction {
  id = generateUniqueId();
  amount: number;
  status: string;
  recieverid: string;
  senderid: string;

  constructor(
    amount: number,
    recieverid: string,
    senderid: string,
    status: string
  ) {
    this.amount = amount;
    this.recieverid = recieverid;
    this.senderid = senderid;
    this.status = status;
  }
}
