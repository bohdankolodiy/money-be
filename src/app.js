"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const auth_route_1 = require("./modules/auth/auth.route");
const auth_decorator_1 = __importDefault(require("./modules/auth/auth.decorator"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const server = (0, fastify_1.default)();
server.register(jwt_1.default, {
    secret: "supersecret",
});
server.register(auth_decorator_1.default);
server.addHook("preHandler", (req, res, next) => {
    req.jwt = server.jwt;
    return next();
});
// routes
server.register(auth_route_1.authRoutes, { prefix: "api/v1/auth" });
server.listen({ port: 3000 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
