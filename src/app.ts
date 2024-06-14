import fastify from "fastify";
import { authRoutes } from "./modules/auth/auth.route";
import jwtPlugin from "./modules/auth/auth.decorator";
import fastifyJwt, { FastifyJWT, JWT } from "@fastify/jwt";
import { Transporter } from "nodemailer";

declare module "fastify" {
  interface FastifyRequest {
    jwt: JWT;
    mailer: Transporter;
  }
}

const server = fastify();

server.register(fastifyJwt, {
  secret: "supersecret",
});

server.register(require("fastify-mailer"), {
  defaults: { from: "Destini Goodwin <destini46@ethereal.email>" },
  transport: {
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "destini46@ethereal.email",
      pass: "FX1VUbNgvnUp17uWsa",
    },
  },
});

server.register(jwtPlugin);

server.addHook("preHandler", (req, res, next) => {
  req.jwt = server.jwt;
  req.mailer = ("mailer" in server ? server.mailer : null) as Transporter;

  return next();
});

// routes
server.register(authRoutes, { prefix: "api/v1/auth" });

server.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
