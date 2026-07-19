import { FastifyReply, FastifyRequest } from "fastify";
import { messages } from "../api/messages";
import { getUserByToken } from "../api/auth/controllers";
import { getCustomerByToken } from "../api/customer/controllers";

export const authenticate = async function (
  req: FastifyRequest,
  res: FastifyReply,
) {
  try {
    const token = req.headers["x-access-token"];
    if (!token || typeof token !== "string") {
      throw new Error("Missing X-Access-Token header");
    } else {
      const user = await getUserByToken(token);
      return user;
    }
  } catch (err) {
    res.status(401).send({ ...messages.unthorizedAccess });
  }
};

export const authenticateAdmin = async function (
  req: FastifyRequest,
  res: FastifyReply,
) {
  try {
    const token = req.headers["x-access-token"];
    if (!token || typeof token !== "string") {
      throw new Error("Missing X-Access-Token header");
    } else {
      const user = await getUserByToken(token);
      if (user.role !== 1) {
        throw new Error("Unauthorized access");
      }
      return user;
    }
  } catch (err) {
    res.status(401).send({ ...messages.unthorizedAccess });
  }
};

export const authenticateCustomer = async function (
  req: FastifyRequest,
  res: FastifyReply,
) {
  try {
    const token = req.headers["x-access-token"];
    if (!token || typeof token !== "string") {
      throw new Error("Missing X-Access-Token header");
    }

    return await getCustomerByToken(token);
  } catch (err) {
    res.status(401).send({ ...messages.unthorizedAccess });
  }
};

export const authenticateUser = async function (
  req: FastifyRequest,
  res: FastifyReply,
) {
  try {
    const token = req.headers["x-access-token"];
    if (!token || typeof token !== "string") {
      throw new Error("Missing X-Access-Token header");
    }

    try {
      const customer = await getCustomerByToken(token);
      return { ...customer, accountType: "customer" as const };
    } catch {
      const admin = await getUserByToken(token);
      return { ...admin, accountType: "admin" as const };
    }
  } catch (err) {
    res.status(401).send({ ...messages.unthorizedAccess });
  }
};
