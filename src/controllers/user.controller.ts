import express, { Router } from "express";
import { PrismaClient } from "@prisma/client";
import * as User from "../models/User";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import bcrypt from "bcryptjs";
import "dotenv/config";

const router: Router = express.Router();
const prisma = new PrismaClient();

// Check if JWT_SECRET_KEY is defined in .env file. If not, terminate server
if (!process.env.JWT_SECRET_KEY) {
  console.error(
    "JWT_SECRET_KEY is not defined in .env file. Server cannot start without JWT_SECRET_KEY."
  );
  process.exit(1);
}

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET_KEY,
};

// Passport middleware to authenticate user
passport.use(
  new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    const user = await User.findUser(jwtPayload.id);
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  })
);

router.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const user = await User.createUser(firstName, lastName, email, password);

    res.json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ error: "Failed to create the user" });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = { id: user.id };
    const token = jwt.sign(payload, jwtOptions.secretOrKey);

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Error occurred during sign in" });
  }
});

export default router;
