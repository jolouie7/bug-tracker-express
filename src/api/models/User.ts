import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const findUser = async (id: string) => {
  return prisma.user.findUnique({ where: { id } });
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const createUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
) => {
  const hashedPassword = bcrypt.hashSync(password, 10);

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
};

export const verifyPassword = (password: string, hashedPassword: string) => {
  return bcrypt.compareSync(password, hashedPassword);
};
