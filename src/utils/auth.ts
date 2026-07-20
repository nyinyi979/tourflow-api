import { FastifyReply, FastifyRequest } from "fastify";
import { getUserByToken } from "../api/auth/controllers";
import { getCustomerByToken } from "../api/customer/controllers";
import { AppError, ForbiddenError, UnauthorizedError } from "./errors";

const getAccessToken = (req: FastifyRequest) => {
  const token = req.headers["x-access-token"];
  if (!token || typeof token !== "string") throw new UnauthorizedError();
  return token;
};

const rethrowServerError = (error: unknown) => {
  if (error instanceof AppError && error.statusCode >= 500) throw error;
};

export const authenticate = async function (
  req: FastifyRequest,
  _res: FastifyReply,
) {
  try {
    return await getUserByToken(getAccessToken(req));
  } catch (error) {
    rethrowServerError(error);
    throw new UnauthorizedError();
  }
};

export const authenticateAdmin = async function (
  req: FastifyRequest,
  _res: FastifyReply,
) {
  try {
    const user = await getUserByToken(getAccessToken(req));
    if (user.role !== 1) throw new ForbiddenError();
    return user;
  } catch (error) {
    rethrowServerError(error);
    if (error instanceof ForbiddenError) throw error;
    throw new UnauthorizedError();
  }
};

export const authenticateCustomer = async function (
  req: FastifyRequest,
  _res: FastifyReply,
) {
  try {
    return await getCustomerByToken(getAccessToken(req));
  } catch (error) {
    rethrowServerError(error);
    throw new UnauthorizedError();
  }
};

export const authenticateUser = async function (
  req: FastifyRequest,
  _res: FastifyReply,
) {
  const token = getAccessToken(req);
  try {
    const customer = await getCustomerByToken(token);
    return { ...customer, accountType: "customer" as const };
  } catch (error) {
    rethrowServerError(error);
    try {
      const admin = await getUserByToken(token);
      return { ...admin, accountType: "admin" as const };
    } catch (error) {
      rethrowServerError(error);
      throw new UnauthorizedError();
    }
  }
};
