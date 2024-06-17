import { FastifyReply, FastifyRequest } from "fastify";
import bcrypt from "bcrypt";
import { UserAuthType, UserIdType } from "../schema/auth.schema";
import { User } from "../../../models/user.model";

import { IUser } from "../../../interfaces/user.interface";
import { authService } from "../service/auth.service";
import { PoolClient } from "pg";

class AuthController {
  // possible solution with db connecion;
  private _pg: PoolClient | undefined;

  constructor(db?: PoolClient) {
    this._pg = db;
  }

  async registerUser(
    req: FastifyRequest<{
      Body: UserAuthType;
    }>,
    reply: FastifyReply
  ) {
    try {
      const { password, email } = req.body;

      const hash = await bcrypt.hash(password, +process.env.SECRET_KEY!);
      const user: IUser = new User(hash, email);

      const userId = (await authService.createUser(req.db!, user))?.id;

      if (!userId) {
        reply
          .code(500)
          .send({ message: "Smth went wrong... User wasnot created" });
      }

      await authService.sendMail(req.mailer, user);

      return reply.code(201).send({ message: "success" });
    } catch (e) {
      return reply.code(500).send(e);
    }
  }

  async loginUser(
    req: FastifyRequest<{
      Body: UserAuthType;
    }>,
    reply: FastifyReply
  ) {
    try {
      const { email, password } = req.body;

      const user: IUser = await authService.findOne(req.db, email);

      if (!user)
        return reply.code(401).send({ message: "Invalid email or password" });
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch)
        return reply.code(401).send({
          message: "Invalid email or password",
        });

      const payload = {
        id: user.id,
        email: user.email,
      };

      const token = req.jwt.sign(payload);

      return reply.code(201).send({ accessToken: token });
    } catch (e) {
      return reply.code(500).send(e);
    }
  }

  async verifyUser(
    req: FastifyRequest<{
      Body: UserIdType;
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = req.body;

      await authService.verifyUser(req.db, id);

      return reply.code(201).send({ message: "success" });
    } catch (e) {
      return reply.code(500).send(e);
    }
  }
}

export const authController = new AuthController();
