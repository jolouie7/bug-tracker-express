import * as UserService from "../services/UserService";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import bcrypt from "bcryptjs";
import "dotenv/config";

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
    const user = await UserService.findUser(jwtPayload.id);
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  })
);

export const SignUp = async (
  req: {
    body: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    };
  },
  res: any
) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const user = await UserService.createUser(
      firstName,
      lastName,
      email,
      password
    );

    res.json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ error: "Failed to create the user" });
  }
};

export const SignIn = async (
  req: { body: { email: string; password: string } },
  res: any
): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await UserService.findUserByEmail(email);

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = { id: user.id };
    const token = jwt.sign(payload, jwtOptions.secretOrKey);

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Error occurred during sign in" });
  }
};
