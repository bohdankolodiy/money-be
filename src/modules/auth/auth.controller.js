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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const generate_unique_id_1 = __importDefault(require("generate-unique-id"));
const SECRET_KEY = 10;
function createUser(req, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const { password, email } = req.body;
        try {
            const hash = yield bcrypt_1.default.hash(password, SECRET_KEY);
            const user = {
                id: (0, generate_unique_id_1.default)(),
                password: hash,
                email,
                wallet: (0, generate_unique_id_1.default)({
                    length: 16,
                    useLetters: false,
                }),
                transactionsHistory: [],
            };
            const payload = {
                id: user.id,
                email: user.email,
            };
            const token = (_a = req === null || req === void 0 ? void 0 : req.jwt) === null || _a === void 0 ? void 0 : _a.sign(payload);
            console.log(user);
            return reply.code(201).send({ token: token });
        }
        catch (e) {
            return reply.code(500).send(e);
        }
    });
}
exports.createUser = createUser;
