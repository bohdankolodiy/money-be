import fastify, { FastifyRequest } from "fastify";
import { authRoutes } from "./modules/auth/auth.route";
import jwtPlugin from "./modules/auth/auth.decorator";
import fastifyJwt, { FastifyJWT, JWT } from "@fastify/jwt";

declare module "fastify" {
  interface FastifyRequest {
    jwt: JWT;
  }
}

const server = fastify();

server.register(fastifyJwt, {
  secret: "supersecret",
});

server.register(jwtPlugin);

server.addHook("preHandler", (req, res, next) => {
  req.jwt = server.jwt;
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
