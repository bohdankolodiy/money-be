import { FastifyReply, FastifyRequest } from "fastify";
import bcrypt from "bcrypt";
import {
  ForgetPasswordType,
  ResetPasswordType,
  UserAuthType,
  UserIdType,
} from "../schema/auth.schema";
import { User } from "../../../models/user.model";
import { IUser } from "../../../interfaces/user.interface";
import { authService } from "../service/auth.service";
import { MailTypes } from "../../../enums/mail.enum";
import { userService } from "../../user/services/user.service";

class AuthController {
  async registerUser(
    req: FastifyRequest<{
      Body: UserAuthType;
    }>,
    reply: FastifyReply
  ) {
    try {
      const { password, email } = req.body;

      const isExist: boolean = Boolean(
        await authService.findOne(req.db, email)
      );

      if (isExist) {
        return reply.code(401).send({
          message: "User already exist. Please login or verify you email!!!",
        });
      }

      const hash = await authController.generateHashPassword(password);
      const user: IUser = new User(hash, email);

      const userId = (await authService.createUser(req.db!, user))?.id;

      if (!userId) {
        return reply
          .code(500)
          .send({ message: "Smth went wrong... User wasnot created" });
      }

      await authService.sendMail(req.mailer, user, MailTypes.verification);

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

      if (!user.is_verify)
        return reply.code(401).send({
          message: "Verify you email",
        });

      const token = authController.signToken(req, user);

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

  async forgetPassword(
    req: FastifyRequest<{
      Body: ForgetPasswordType;
    }>,
    reply: FastifyReply
  ) {
    try {
      const { email } = req.body;

      const user = await authService.findOne(req.db, email);
      if (!user) return reply.code(400).send({ message: "User not found" });

      const token = authController.signToken(req, user);
      await authService.sendMail(
        req.mailer,
        user,
        MailTypes.resetPassword,
        token
      );

      return reply.code(201).send({ message: "success" });
    } catch (e) {
      return reply.code(500).send(e);
    }
  }

  async resetPassword(
    req: FastifyRequest<{
      Body: ResetPasswordType;
    }>,
    reply: FastifyReply
  ) {
    try {
      const { token, password } = req.body;

      if (!token) return reply.code(400).send({ message: "Token is required" });

      if (!req.jwt.verify(token))
        return reply.code(400).send({ message: "Wrong token" });

      const userId: string = await userService.getUserId(req, token);

      const hash = await authController.generateHashPassword(password);

      const user = await authService.updatePassword(req.db, userId, hash);
      if (!user) return reply.code(400).send({ message: "User not found" });

      return reply.code(201).send({ message: "success" });
    } catch (e) {
      return reply.code(500).send(e);
    }
  }

  async generateHashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, Number(process.env.SECRET_KEY!));
  }

  async delettAccount(req: FastifyRequest, reply: FastifyReply) {
    try {
      if (!req.user) return reply.code(400).send("User not found");
      await authService.deleteAccount(req.db, (req.user as IUser).id);
      reply.code(203).send();
    } catch (e) {
      reply.code(500).send({ message: e });
    }
  }

  signToken(req: FastifyRequest, user: IUser): string {
    const payload = {
      id: user.id,
      email: user.email,
    };

    return req.jwt.sign(payload);
  }
}

export const authController = new AuthController();
