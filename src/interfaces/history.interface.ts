export interface ITransactHistory {
  id: string;
  amount: number;
  action: string;
  userid: string;
  status: string;
  date: string;
  comment?: string | null;
  card?: string | null;
  wallet?: string | null;
}

export interface ITransformHistory {
  date: string;
  amount: number;
  items: ITransactHistory[];
}
