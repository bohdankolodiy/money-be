import { ITransactHistory } from "./history.interface";

export interface IUser {
  id: string;
  email: string;
  password: string;
  wallet: string;
  balance: number;
  transactionsHistory: ITransactHistory[];
}
