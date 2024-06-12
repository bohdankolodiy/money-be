import { FastifyReply, FastifyRequest } from "fastify";
import bcrypt from "bcrypt";
import { UserAuthType } from "./auth.schema";
import generateUniqueId from "generate-unique-id";
import { IUser } from "../../interfaces/user.interface";

const SECRET_KEY = 10;

export async function createUser(
  req: FastifyRequest<{
    Body: UserAuthType;
  }>,
  reply: FastifyReply
) {
  const { password, email } = req.body;
  try {
    const hash = await bcrypt.hash(password, SECRET_KEY);
    const user: IUser = {
      id: generateUniqueId(),
      password: hash,
      email,
      wallet: generateUniqueId({
        length: 16,
        useLetters: false,
      }),
      balance: 0,
      transactionsHistory: [],
    };

    const payload = {
      id: user.id,
      email: user.email,
    };

    const token = req?.jwt?.sign(payload);
    console.log(user);

    return reply.code(201).send({ accessToken: token });
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
    const user: IUser = {
      id: generateUniqueId(),
      password: "dsfdsfsdfs",
      email: "sadas@gmail.com",
      wallet: generateUniqueId({
        length: 16,
        useLetters: false,
      }),
      balance: 0,
      transactionsHistory: [],
    };
    const { email, password } = req.body;
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
