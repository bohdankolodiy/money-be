import fastify from "fastify";
import { authRoutes } from "./modules/auth/routes/auth.route";
import { VerifyToken } from "./modules/auth/decorator/auth.decorator";
import fastifyJwt, { JWT } from "@fastify/jwt";
import { Transporter } from "nodemailer";
import { PostgresDb, fastifyPostgres } from "@fastify/postgres";
import * as dotenv from "dotenv";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: any;
  }
  interface FastifyRequest {
    jwt: JWT;
    mailer: Transporter;
    db: PostgresDb;
  }
}

const server = fastify();
dotenv.config();

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

server.register(fastifyPostgres, {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: Number(process.env.DB_PORT!),
});

server.decorate("authenticate", VerifyToken);

server.addHook("preHandler", (req, res, next) => {
  req.jwt = server.jwt;
  req.mailer = ("mailer" in server ? server.mailer : null) as Transporter;
  req.db = server.pg;

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
