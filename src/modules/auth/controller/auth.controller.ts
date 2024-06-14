import { FastifyReply, FastifyRequest } from "fastify";
import bcrypt from "bcrypt";
import { UserAuthType, UserEmailType } from "../schema/auth.schema";
import { User } from "../../../models/user.model";

import { IUser } from "../../../interfaces/user.interface";
import { AuthService } from "../service/auth.service";

export class AuthController {
  async createUser(
    req: FastifyRequest<{
      Body: UserAuthType;
    }>,
    reply: FastifyReply
  ) {
    try {
      const { password, email } = req.body;

      const hash = await bcrypt.hash(password, +process.env.SECRET_KEY!);
      const user: IUser = new User(hash, email);

      await AuthService.prototype.sendMail(req.mailer, email, reply);

      return reply.code(201).send({ message: "success" });
    } catch (e) {
      return reply.code(500).send(e);
    }
  }

  async LoginUser(
    req: FastifyRequest<{
      Body: UserAuthType;
    }>,
    reply: FastifyReply
  ) {
    try {
      const { email, password } = req.body;
      const user: IUser = new User("dsfdsfsdfs", email);
      const isMatch = await bcrypt.compare(password, user.password);

      if (!user || !isMatch) {
        return reply.code(401).send({
          message: "Invalid email or password",
        });
      }

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
      Body: UserEmailType;
    }>,
    reply: FastifyReply
  ) {
    try {
      const { email } = req.body;
      const user: IUser = new User("dsfsdf", email);

      user.isVerify = true;

      return reply.code(201).send({ message: "success" });
    } catch (e) {
      return reply.code(500).send(e);
    }
  }
}
