import { FastifyReply, FastifyRequest } from "fastify";
import { IUser } from "../../../interfaces/user.interface";
import { userService } from "../services/user.service";

class UserController {
  user: Omit<IUser, "password"> | null = null;

  async getUser(req: FastifyRequest, reply: FastifyReply) {
    try {
      const user: IUser = await userService.getAuthUser(req);
      userController.user = user;

      return reply.code(200).send(user);
    } catch (e) {
      return reply.code(500).send({ message: e });
    }
  }

  async getUsers(req: FastifyRequest, reply: FastifyReply) {
    try {
      const users: IUser[] = await userService.getUsers(req);

      return reply.code(200).send(users);
    } catch (e) {
      return reply.code(500).send({ message: e });
    }
  }

  async updateUserMoney(amount: number) {
    userController.user!.balance = amount;
  }


}

export const userController = new UserController();
