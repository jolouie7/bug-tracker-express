import express from "express";
const router = express.Router();

import { SignIn, SignUp } from "../controllers/user.controller";

router.post("/signin", SignIn);
router.post("/signup", SignUp);

export { router as UserRoute };
