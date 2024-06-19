import { FastifyInstance } from "fastify";
import {
  userLoginSchema,
  userRegisterSchema,
  userVerifySchema,
} from "../schema/auth.schema";
import { authController } from "../controller/auth.controller";

export async function authRoutes(app: FastifyInstance) {
  app.post("/register", userRegisterSchema, authController.registerUser);
  app.post("/login", userLoginSchema, authController.loginUser);
  app.post("/verifyUser", userVerifySchema, authController.verifyUser);
  app.delete("/logout", () => {});
}
