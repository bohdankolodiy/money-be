import { FastifyError, FastifyInstance } from "fastify";
import { userPostSchema } from "./auth.schema";
import { createUser } from "./auth.controller";

export async function authRoutes(
  app: FastifyInstance,
  opt: any,
  done: (err?: FastifyError) => void
) {
  app.post("/register", userPostSchema, createUser);
  app.post("/login", () => {});
  app.delete("/logout", () => {});

  done();
}
