import bcrypt from "bcrypt";
import db from "../../db";
import { TLogin, TUpdate } from "./types";
import { PagKeys } from "../types";
import { sign, verify } from "jsonwebtoken";
import { usersTable } from "../../db/user";
import { eq } from "drizzle-orm";

export const login = async (data: TLogin) => {
  const user = await db.query.usersTable.findFirst({
    columns: {
      id: true,
      password: true,
      email: true,
    },
    where: eq(usersTable.email, data.email),
  });
  if (!user) throw new Error("User not found");
  const password = await bcrypt.compare(data.password, user.password);
  if (!password) throw new Error("Invalid password");

  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not configured");

  const token = sign({ id: user.id, accountType: "admin" }, secret, {
    algorithm: "HS256",
    expiresIn: "7d",
  });
  return { user: { ...user, password: null }, token };
};

export const getUsers = async ({ page, perPage }: PagKeys) => {
  return await db.transaction(async (tx) => {
    const data = await tx.query.usersTable.findMany({
      limit: perPage,
      offset: page * perPage,
      columns: {
        id: true,
        email: true,
        role: true,
      },
    });
    const count = await tx.$count(usersTable);
    return { data, count };
  });
};

export const getUserById = async (id: string) => {
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, id),
    columns: {
      id: true,
      username: true,
      email: true,
      role: true,
    },
  });
  if (!user) throw new Error("User not found");
  return user;
};

export const getUserByToken = async (token: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not configured");

  const payload = verify(token, secret, { algorithms: ["HS256"] });
  if (
    typeof payload === "string" ||
    typeof payload.id !== "string" ||
    payload.accountType !== "admin"
  ) {
    throw new Error("Invalid token payload");
  }

  return getUserById(payload.id);
};

export const updateUser = async (data: TUpdate) => {
  const user = await db.query.usersTable.findFirst({
    columns: {
      id: true,
      password: true,
      email: true,
    },
    where: eq(usersTable.id, data.id),
  });
  if (!user) throw new Error("User not found");
  let hashedPassword = null;
  if (data.password) {
    hashedPassword = await bcrypt.hash(data.password, 10);
  }
  const response = await db
    .update(usersTable)
    .set({
      ...data,
      password: hashedPassword || user.password,
    })
    .where(eq(usersTable.id, data.id))
    .returning({
      id: usersTable.id,
      email: usersTable.email,
      role: usersTable.role,
    });
  return response[0];
};
export const deleteUser = async (id: string) => {
  const data = await db
    .delete(usersTable)
    .where(eq(usersTable.id, id))
    .returning();
  return data;
};
