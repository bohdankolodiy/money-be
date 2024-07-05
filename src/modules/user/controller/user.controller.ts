import { FastifyReply, FastifyRequest } from "fastify";
import { IInfo, IUser } from "../../../interfaces/user.interface";
import { MoneyStatus } from "../../../enums/money-status.enum";
import { userService } from "../services/user.service";
import {
  TransactType,
  TransferType,
  UpdateStatusType,
} from "../schema/user.schema";

class UserController {
  user: Omit<IUser, "password"> | null = null;

  async getUser(req: FastifyRequest, reply: FastifyReply) {
    try {
      const user: IUser = await userService.getAuthUser(req);
      userController.user = user;

      return reply.code(200).send(user);
    } catch (e) {
      reply.code(500).send({ message: e });
    }
  }

  async transactUsersMoney(
    req: FastifyRequest<{
      Body: TransactType;
    }>,
    reply: FastifyReply
  ) {
    try {
      const { amount, wallet, comment } = req.body;
      if (!userController.user)
        userController.user = await userService.getAuthUser(req);

      const error = userController.checkValidation(amount, wallet);
      if (error) return reply.code(400).send({ message: error });

      const reciever = await userService.findOneByWallet(req.db, wallet);

      if (!reciever)
        return reply
          .code(400)
          .send({ message: "No reciever with that wallet" });

      const userInfo: Omit<IInfo, "amount"> =
        userService.generateTransactionInfo(
          userController.user.id,
          "payment",
          -amount,
          comment,
          wallet
        );

      const recieverInfo: Omit<IInfo, "amount"> =
        userService.generateTransactionInfo(
          reciever.id,
          "income",
          amount,
          comment,
          userController.user.wallet
        );

      await userService.transactionPayment(req.db, userInfo, recieverInfo);

      reply.code(200).send({
        balance: 0,
      });
    } catch (e) {
      reply.code(500).send(e);
    }
  }

  async userDeposit(
    req: FastifyRequest<{ Body: TransferType }>,
    reply: FastifyReply
  ) {
    try {
      const { amount, card } = req.body;

      if (!userController.user)
        userController.user = await userService.getAuthUser(req);

      const error = userController.checkValidation(amount, card);
      if (error) return reply.code(400).send({ message: error });

      const newUserAmount = userController.user!.balance + amount;

      const userInfo: IInfo = userService.generateTransferInfo(
        userController.user.id,
        "deposit",
        amount,
        newUserAmount,
        card
      );

      await userService.transactionTransfer(req.db, userInfo);

      userController.updateUserMoney(newUserAmount);
      reply.code(200).send({
        balance: newUserAmount,
      });
    } catch (e) {
      reply.code(500).send(e);
    }
  }

  async updateUserMoney(amount: number) {
    userController.user!.balance = amount;
  }

  async userWithdrawal(
    req: FastifyRequest<{ Body: TransferType }>,
    reply: FastifyReply
  ) {
    try {
      const { amount, card } = req.body;
      if (!userController.user)
        userController.user = await userService.getAuthUser(req);

      const error = userController.checkValidation(amount, card);
      if (error) return reply.code(400).send({ message: error });

      const newUserAmount = userController.user!.balance - amount;

      const userInfo: IInfo = userService.generateTransferInfo(
        userController.user.id,
        "withdrawal",
        -amount,
        newUserAmount,
        card
      );

      await userService.transactionTransfer(req.db, userInfo);

      userController.updateUserMoney(newUserAmount);
      reply.code(200).send({
        balance: newUserAmount,
      });
    } catch (e) {
      reply.code(500).send(e);
    }
  }

  async updatePaymentStatus(
    req: FastifyRequest<{ Body: UpdateStatusType }>,
    reply: FastifyReply
  ) {
    try {
      const { status, wallet, amount, transactid } = req.body;
      const reciever = await userService.findOneByWallet(req.db, wallet);

      if (!userController.user)
        userController.user = await userService.getAuthUser(req);

      if (!reciever)
        return reply.code(400).send({ message: "No reciever with that id" });

      const senderNewBalance =
        status === MoneyStatus.Success
          ? userController.user!.balance + Math.abs(amount)
          : userController.user!.balance;

      const newRecieverAmount =
        status === MoneyStatus.Success
          ? reciever!.balance - Math.abs(amount)
          : reciever!.balance;

      const senderInfo: Omit<IInfo, "history"> = {
        id: userController.user.id,
        amount: senderNewBalance,
      };

      const recieverInfo: Omit<IInfo, "history"> = {
        id: reciever.id,
        amount: newRecieverAmount,
      };

      await userService.transactionUpdatePayment(
        req.db,
        senderInfo,
        recieverInfo,
        transactid,
        status
      );

      return reply.code(200).send();
    } catch (e) {
      reply.code(500).send({ message: e });
    }
  }

  checkValidation(amount: number, card: string): string | void {
    if (amount > userController.user!.balance)
      return "Amount is bigger than balance";

    if (card.length !== 16) return "Card must be in 16 symbol length";
  }
}

export const userController = new UserController();
