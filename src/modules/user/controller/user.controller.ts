import { FastifyReply, FastifyRequest } from "fastify";
import { IInfo, IUser } from "../../../interfaces/user.interface";
import { MoneyStatus } from "../../../enums/money-status.enum";
import { userService } from "../services/user.service";
import {
  TransactType,
  TransferType,
  UpdateStatusType,
} from "../schema/user.schema";
import { History } from "../../../models/history.model";

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

      const userInfo: Omit<IInfo, "amount"> = {
        id: userController.user.id,
        history: new History(
          -amount,
          "payment",
          userController.user.id,
          MoneyStatus.Pending,
          comment,
          null,
          wallet
        ),
      };

      const recieverInfo: Omit<IInfo, "amount"> = {
        id: reciever.id,
        history: new History(
          amount,
          "income",
          reciever.id,
          MoneyStatus.Pending,
          comment,
          null,
          userController.user.wallet
        ),
      };

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

      const userInfo: IInfo = {
        id: userController.user.id,
        amount: newUserAmount,
        history: new History(
          amount,
          "deposit",
          userController.user.id,
          MoneyStatus.Success,
          "",
          card
        ),
      };

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

      const userInfo: IInfo = {
        id: userController.user.id,
        amount: newUserAmount,
        history: new History(
          -amount,
          "withdrawal",
          userController.user.id,
          MoneyStatus.Success,
          "",
          card
        ),
      };

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
      const { status, wallet, amount, date } = req.body;

      if (!userController.user)
        userController.user = await userService.getAuthUser(req);

      const reciever = await userService.findOneByWallet(req.db, wallet);
      if (!reciever)
        return reply.code(400).send({ message: "No reciever with that id" });

      const newUserAmount =
        status === MoneyStatus.Success
          ? userController.user!.balance + Math.abs(amount)
          : userController.user!.balance;

      const newRecieverAmount =
        status === MoneyStatus.Success
          ? reciever!.balance - Math.abs(amount)
          : reciever!.balance;

      const userInfo: Omit<IInfo, "history"> = {
        id: userController.user.id,
        amount: newUserAmount,
      };

      const recieverInfo: Omit<IInfo, "history"> = {
        id: reciever.id,
        amount: newRecieverAmount,
      };

      await userService.transactionUpdatePayment(
        req.db,
        userInfo,
        recieverInfo,
        status,
        date
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
