"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userPostSchema = exports.User = exports.UserAuth = void 0;
const typebox_1 = require("@sinclair/typebox");
exports.UserAuth = typebox_1.Type.Object({
    password: typebox_1.Type.String(),
    email: typebox_1.Type.String({ format: "email" }),
});
exports.User = typebox_1.Type.Object({
    email: typebox_1.Type.String({ format: "email" }),
    wallet: typebox_1.Type.String(),
    amount: typebox_1.Type.Number(),
    transactionsHistory: typebox_1.Type.Array(typebox_1.Type.Number()),
});
exports.userPostSchema = {
    schema: {
        body: exports.UserAuth,
        response: {
            200: exports.User,
        },
    },
};
