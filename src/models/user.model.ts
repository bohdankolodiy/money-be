import { IUser } from "../interfaces/user.interface";
import generateUniqueId from "generate-unique-id";

export class User implements IUser {
  id = generateUniqueId();
  password: string;
  email: string;
  wallet_id: string;
  is_verify: boolean = false;

  constructor(hash: string, email: string, wallet_id: string) {
    this.password = hash;
    this.email = email;
    this.wallet_id = wallet_id;
  }
}
