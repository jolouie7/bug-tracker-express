"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const passport_1 = __importDefault(require("passport"));
// Import Routes
const User_1 = require("./src/routes/User");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(passport_1.default.initialize());
const port = process.env.PORT;
// cors middleware
app.use((0, cors_1.default)());
app.get("/", (req, res) => {
    res.send("Express + TypeScript Server!!");
});
// Routes
app.use("/", User_1.UserRoute);
// Catch-all 404 route
app.use("*", (req, res) => {
    res.status(404).json({ message: "Not Found" });
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
