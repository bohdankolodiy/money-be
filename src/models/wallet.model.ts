import generateUniqueId from "generate-unique-id";
import { IWallet } from "../interfaces/wallet.interface";

export class Wallet implements IWallet {
  id = generateUniqueId();
  wallet = generateUniqueId({
    length: 16,
    useLetters: false,
  });
  balance = 0.0;
}
