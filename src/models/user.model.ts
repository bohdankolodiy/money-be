import { IUser } from "../interfaces/user.interface";
import generateUniqueId from "generate-unique-id";

export class User implements IUser {
  id = generateUniqueId();
  password: string;
  email: string;

  wallet = generateUniqueId({
    length: 16,
    useLetters: false,
  });
  balance = 0.0;
  isverify: boolean = false;

  constructor(hash: string, email: string) {
    this.password = hash;
    this.email = email;
  }
}
