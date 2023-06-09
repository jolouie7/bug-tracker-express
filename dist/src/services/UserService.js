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
exports.verifyPassword = exports.createUser = exports.findUserByEmail = exports.findUser = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
const findUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.user.findUnique({ where: { id } });
});
exports.findUser = findUser;
const findUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.user.findUnique({ where: { email } });
});
exports.findUserByEmail = findUserByEmail;
const createUser = (firstName, lastName, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = bcryptjs_1.default.hashSync(password, 10);
    const validEmail = require("validator").isEmail(email);
    if (!validEmail) {
        throw new Error("Invalid email");
    }
    return prisma.user.create({
        data: {
            firstName,
            lastName,
            email,
            password: hashedPassword,
        },
    });
});
exports.createUser = createUser;
const verifyPassword = (password, hashedPassword) => {
    return bcryptjs_1.default.compareSync(password, hashedPassword);
};
exports.verifyPassword = verifyPassword;
