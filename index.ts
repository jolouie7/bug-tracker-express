import express, { Express, Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import passport from "passport";

// Import Routes
import { UserRoute } from "./src/routes/User";

const app: Express = express();
app.use(express.json());
app.use(passport.initialize());
const port = process.env.PORT;

// cors middleware
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server!!");
});

// Routes
app.use("/", UserRoute);

// Catch-all 404 route
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({ message: "Not Found" });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
