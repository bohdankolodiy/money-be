"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const auth_route_1 = require("./modules/auth/routes/auth.route");
const auth_decorator_1 = __importDefault(require("./modules/auth/decorator/auth.decorator"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const postgres_1 = require("@fastify/postgres");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const server = (0, fastify_1.default)();
server.register(jwt_1.default, {
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
server.register(postgres_1.fastifyPostgres, {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: Number(process.env.DB_PORT),
});
server.register(auth_decorator_1.default);
server.addHook("preHandler", (req, res, next) => {
    req.jwt = server.jwt;
    req.mailer = ("mailer" in server ? server.mailer : null);
    req.db = server.pg;
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
