export class PaymentsService {
  checkValidation(
    balance: number,
    amount: number,
    card: string,
    checkAmount: boolean = true
  ): string | void {
    if (checkAmount && amount > balance) return "Amount is bigger than balance";

    if (card.length !== 16) return "Card must be in 16 symbol length";
  }
}
