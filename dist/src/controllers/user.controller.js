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
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const User = __importStar(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
require("dotenv/config");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// Check if JWT_SECRET_KEY is defined in .env file. If not, terminate server
if (!process.env.JWT_SECRET_KEY) {
    console.error("JWT_SECRET_KEY is not defined in .env file. Server cannot start without JWT_SECRET_KEY.");
    process.exit(1);
}
const jwtOptions = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET_KEY,
};
// Passport middleware to authenticate user
passport_1.default.use(new passport_jwt_1.Strategy(jwtOptions, (jwtPayload, done) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User.findUser(jwtPayload.id);
    if (user) {
        return done(null, user);
    }
    else {
        return done(null, false);
    }
})));
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password } = req.body;
    try {
        const user = yield User.createUser(firstName, lastName, email, password);
        res.json({ message: "User created successfully", user });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to create the user" });
    }
}));
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield prisma.user.findUnique({ where: { email } });
        if (!user || !bcryptjs_1.default.compareSync(password, user.password)) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const payload = { id: user.id };
        const token = jsonwebtoken_1.default.sign(payload, jwtOptions.secretOrKey);
        res.json({ token });
    }
    catch (error) {
        res.status(500).json({ error: "Error occurred during sign in" });
    }
}));
exports.default = router;
