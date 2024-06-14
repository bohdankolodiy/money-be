import { FastifyError, FastifyInstance } from "fastify";
import { userPostSchema } from "../schema/auth.schema";
import { AuthController } from "../controller/auth.controller";

export async function authRoutes(
  app: FastifyInstance,
  opt: any,
  done: (err?: FastifyError) => void
) {
  app.post("/register", userPostSchema, new AuthController().createUser);
  app.post("/login", () => {});
  app.delete("/logout", () => {});

  done();
}
