import { FastifyReply, FastifyRequest } from "fastify";
import { IInfo } from "../../../interfaces/user.interface";
import { walletService } from "../services/wallet.service";
import { TransferType } from "../schema/wallet.schema";
import { userService } from "../../user/services/user.service";
import { userController } from "../../user/controller/user.controller";

class WalletController {
  async userDeposit(
    req: FastifyRequest<{ Body: TransferType }>,
    reply: FastifyReply
  ) {
    try {
      const { amount, card } = req.body;

      const user = await userService.getAuthUser(req);

      const error = walletService.checkValidation(
        user.balance,
        amount,
        card,
        false
      );
      if (error) return reply.code(400).send({ message: error });

      const newUserAmount = user!.balance + amount;

      const userInfo: IInfo = walletService.generateTransferInfo(
        user.id,
        "deposit",
        amount,
        newUserAmount,
        card
      );

      await walletService.transactionTransfer(req.db, userInfo);

      userController.updateUserMoney(newUserAmount);
      return reply.code(200).send({
        balance: newUserAmount,
      });
    } catch (e) {
      return reply.code(500).send(e);
    }
  }

  async userWithdrawal(
    req: FastifyRequest<{ Body: TransferType }>,
    reply: FastifyReply
  ) {
    try {
      const { amount, card } = req.body;
      const user = await userService.getAuthUser(req);

      const error = walletService.checkValidation(user.balance, amount, card);
      if (error) return reply.code(400).send({ message: error });

      const newUserAmount = user!.balance - amount;

      const userInfo: IInfo = walletService.generateTransferInfo(
        user.id,
        "withdrawal",
        -amount,
        newUserAmount,
        card
      );

      await walletService.transactionTransfer(req.db, userInfo);

      userController.updateUserMoney(newUserAmount);
      return reply.code(200).send({
        balance: newUserAmount,
      });
    } catch (e) {
      return reply.code(500).send(e);
    }
  }
}

export const walletController = new WalletController();
