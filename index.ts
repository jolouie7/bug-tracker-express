import express, { Express, Request, Response } from "express";
import "dotenv/config";
import passport from "passport";
import bodyParser from "body-parser";

import userController from "./src/controllers/user.controller";

const app: Express = express();
app.use(bodyParser.json());
app.use(passport.initialize());
const port = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server!!");
});

// Routes
app.use("/", userController);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
