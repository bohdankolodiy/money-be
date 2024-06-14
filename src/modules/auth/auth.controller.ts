import { FastifyReply, FastifyRequest } from "fastify";
import bcrypt from "bcrypt";
import { UserAuthType, UserEmailType } from "./auth.schema";
import { User } from "../../models/user.model";

import { IUser } from "../../interfaces/user.interface";
import { EmailTemplate } from "../../models/email.model";
import { IEmailTemplate } from "../../interfaces/email.interface";

const SECRET_KEY = 10;

export async function createUser(
  req: FastifyRequest<{
    Body: UserAuthType;
  }>,
  reply: FastifyReply
) {
  try {
    const { password, email } = req.body;
    const hash = await bcrypt.hash(password, SECRET_KEY);
    const user: IUser = new User(hash, email);

    await sendMail(req.mailer, email, reply);

    return reply.code(201).send({ message: "success" });
  } catch (e) {
    return reply.code(500).send(e);
  }
}

export async function LoginUser(
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

export async function verifyUser(
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

async function sendMail(mailer: any, email: string, reply: FastifyReply) {
  const varificationLink = `http://localhost:4200/callback?email=${email}`;
  const html = `<b>Hi, from Money Inc</b> <br>
  <p>Please click at link for verification you email:</p> <br>
  <a href="${varificationLink}">${varificationLink}</a>`;
  const mail: IEmailTemplate = new EmailTemplate(
    email,
    "Varification Link",
    varificationLink,
    html
  );
  return await mailer.sendMail(mail, (errors: Error) => {
    if (errors) {
      reply.code(500).send(errors);
    }
  });
}
