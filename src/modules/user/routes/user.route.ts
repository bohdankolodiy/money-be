import { FastifyInstance } from "fastify";
import { userController } from "../controller/user.controller";
import {
  getUserSchema,
  getUsersSchema,
} from "../schema/user.schema";

export async function userRoutes(app: FastifyInstance) {
  app.get(
    "/",
    {
      preHandler: [app.authenticate],
      ...getUserSchema,
    },
    userController.getUser
  );
  app.get(
    "/all",
    {
      preHandler: [app.authenticate],
      ...getUsersSchema,
    },
    userController.getUsers
  );
}
