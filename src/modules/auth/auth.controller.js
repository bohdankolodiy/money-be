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
exports.verifyUser = exports.LoginUser = exports.createUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = require("../../models/user.model");
const email_model_1 = require("../../models/email.model");
const SECRET_KEY = 10;
function createUser(req, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { password, email } = req.body;
            const hash = yield bcrypt_1.default.hash(password, SECRET_KEY);
            const user = new user_model_1.User(hash, email);
            yield sendMail(req.mailer, email, reply);
            return reply.code(201).send({ message: "success" });
        }
        catch (e) {
            return reply.code(500).send(e);
        }
    });
}
exports.createUser = createUser;
function LoginUser(req, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const user = new user_model_1.User("dsfdsfsdfs", email);
            const isMatch = yield bcrypt_1.default.compare(password, user.password);
            if (!user || !isMatch) {
                return reply.code(401).send({
                    message: "Invalid email or password",
                });
            }
            const payload = {
                id: user.id,
                email: user.email,
            };
            const token = req.jwt.sign(payload);
            return reply.code(201).send({ accessToken: token });
        }
        catch (e) {
            return reply.code(500).send(e);
        }
    });
}
exports.LoginUser = LoginUser;
function verifyUser(req, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email } = req.body;
            const user = new user_model_1.User("dsfsdf", email);
            user.isVerify = true;
            return reply.code(201).send({ message: "success" });
        }
        catch (e) {
            return reply.code(500).send(e);
        }
    });
}
exports.verifyUser = verifyUser;
function sendMail(mailer, email, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const varificationLink = `http://localhost:4200/callback?email=${email}`;
        const html = `<b>Hi, from Money Inc</b> <br>
  <p>Please click at link for verification you email:</p> <br>
  <a href="${varificationLink}">${varificationLink}</a>`;
        const mail = new email_model_1.EmailTemplate(email, "Varification Link", varificationLink, html);
        return yield mailer.sendMail(mail, (errors) => {
            if (errors) {
                reply.code(500).send(errors);
            }
        });
    });
}
