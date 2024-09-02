import fastify from "fastify";
import { authRoutes } from "./modules/auth/routes/auth.route";
import { userRoutes } from "./modules/user/routes/user.route";
import { historyRoutes } from "./modules/history/routes/history.route";
import { chatRoutes } from "./modules/chat/routes/chat.route";
import { VerifyToken } from "./modules/auth/decorator/auth.decorator";
import fastifyJwt, { JWT } from "@fastify/jwt";
import { Transporter } from "nodemailer";
import { PostgresDb, fastifyPostgres } from "@fastify/postgres";
import * as dotenv from "dotenv";
import FastifyCors from "@fastify/cors";
import { fastifyWebsocket } from "@fastify/websocket";
import * as WebSocket from "ws";

declare module "fastify" {
  interface FastifyInstance {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authenticate: any;
    // io: Server;
  }
  interface FastifyRequest {
    jwt: JWT;
    mailer: Transporter;
    db: PostgresDb;
    socketIo: WebSocket.Server;
  }
}

const server = fastify();
dotenv.config();

server.register(fastifyWebsocket);

server.register(FastifyCors, {
  origin: "*", // You can restrict this to a specific domain if needed
  methods: ["GET", "PUT", "POST", "DELETE"],
  allowedHeaders: ["Content-Type"], // Дозволені заголовки запитів
});

server.register(async function (fastify) {
  fastify.get("/ws", { websocket: true }, (connection, req) => {
    const { clients } = fastify.websocketServer;

    connection.send("hi from server");
  });
});

server.register(fastifyJwt, {
  secret: "supersecret",
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
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

server.addHook("onSend", (request, reply, payload, done) => {
  reply.headers({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });
  done();
});

server.addHook("preHandler", (req, res, next) => {
  req.jwt = server.jwt;
  req.mailer = ("mailer" in server ? server.mailer : null) as Transporter;
  req.db = server.pg;
  req.socketIo = server.websocketServer;

  return next();
});

// routes
server.register(authRoutes, { prefix: "api/v1/auth" });
server.register(userRoutes, { prefix: "api/v1/user" });
server.register(historyRoutes, { prefix: "api/v1/history" });
server.register(chatRoutes, { prefix: "api/v1/chat" });

server.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
