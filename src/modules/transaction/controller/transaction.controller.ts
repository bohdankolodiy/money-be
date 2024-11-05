import { FastifyReply, FastifyRequest } from "fastify";
import { IUser } from "../../../interfaces/user.interface";
// import { IInfo, IUser } from "../../../interfaces/user.interface";
// import { MoneyStatus } from "../../../enums/money-status.enum";
// import { userService } from "../../user/services/user.service";
import { TransactType, UpdateStatusType } from "../schema/transaction.schema";
// import { transactionService } from "../services/transaction.service";

class TransactionController {
  user: Omit<IUser, "password"> | null = null;

  async transactUsersMoney(
    req: FastifyRequest<{
      Body: TransactType;
    }>,
    reply: FastifyReply
  ) {
    try {
      // const { amount, wallet, comment } = req.body;
      // const user = await userService.getAuthUser(req);

      // const error = transactionService.checkValidation(
      //   user.balance,
      //   amount,
      //   wallet
      // );
      // if (error) return reply.code(400).send({ message: error });

      // const reciever = await userService.findOneByWallet(req.db, wallet);

      // if (!reciever)
      //   return reply
      //     .code(400)
      //     .send({ message: "No reciever with that wallet" });

      // const userInfo: Omit<IInfo, "amount"> =
      //   transactionService.generateTransactionInfo(
      //     user.id,
      //     "payment",
      //     -amount,
      //     comment,
      //     wallet
      //   );

      // const recieverInfo: Omit<IInfo, "amount"> =
      //   transactionService.generateTransactionInfo(
      //     reciever.id,
      //     "income",
      //     amount,
      //     comment,
      //     user.wallet
      //   );

      // await transactionService.transactionPayment(
      //   req.db,
      //   userInfo,
      //   recieverInfo
      // );

      return reply.code(201).send({
        // balance: user.balance,
        balance: 0,
      });
    } catch (e) {
      return reply.code(500).send(e);
    }
  }

  async updatePaymentStatus(
    req: FastifyRequest<{ Body: UpdateStatusType }>,
    reply: FastifyReply
  ) {
    try {
      // const { status, wallet, amount, transact_id } = req.body;
      // const reciever = await userService.findOneByWallet(req.db, wallet);

      // const user = await userService.getAuthUser(req);

      // if (!reciever)
      //   return reply.code(400).send({ message: "No reciever with that id" });

      // let senderNewBalance = user!.balance;

      // let newRecieverAmount = reciever!.balance;

      // const senderInfo: Omit<IInfo, "history"> = {
      //   id: user.id,
      //   amount: senderNewBalance,
      // };

      // const recieverInfo: Omit<IInfo, "history"> = {
      //   id: reciever.id,
      //   amount: newRecieverAmount,
      // };

      // switch (status) {
      //   case MoneyStatus.Success:
      //     senderNewBalance = user!.balance + Math.abs(amount);
      //     newRecieverAmount = reciever!.balance - Math.abs(amount);

      //     senderInfo.amount = senderNewBalance;
      //     recieverInfo.amount = newRecieverAmount;

      //     break;
      //   case MoneyStatus.Revert:
      //     senderNewBalance = user!.balance + Math.abs(amount);
      //     newRecieverAmount = reciever!.balance - Math.abs(amount);

      //     senderInfo.amount = senderNewBalance;
      //     recieverInfo.amount = newRecieverAmount;
      //     break;
      // }
      // await transactionService.transactionUpdatePayment(
      //   req.db,
      //   senderInfo,
      //   recieverInfo,
      //   transact_id,
      //   status
      // );

      // return reply.code(200).send({
      //   balance: senderInfo.amount,
      // });
      return reply.code(200).send({
        balance: 0,
      });
    } catch (e) {
      return reply.code(500).send({ message: e });
    }
  }
}

export const transactionController = new TransactionController();
