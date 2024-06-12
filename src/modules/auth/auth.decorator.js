"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwtPlugin = (fastify, opts, done) => __awaiter(void 0, void 0, void 0, function* () {
    fastify.decorate("authenticate", function (request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield request.jwtVerify();
                // const token = request.headers.access_token;
                // if (!token) {
                //   return reply.status(401).send({ message: "Authentication required" });
                // }
                // // here decoded will be a different type by default but we want it to be of user-payload type
                // const decoded = fastify.jwt.verify(token.toString());
                // request.user = decoded;
            }
            catch (err) {
                reply.send(err);
            }
        });
    });
    done();
});
exports.default = jwtPlugin;
