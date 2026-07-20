import { FastifyReply, FastifyRequest } from "fastify";
import { messages } from "../messages";
import {
  signup,
  login,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "./controllers";
import { authenticate } from "../../utils/auth";
import { TypeBoxRequest } from "../request";
import {
  loginBodySchema,
  signupBodySchema,
  updateUserBodySchema,
} from "./schemas";
import { idParamsSchema, paginationQuerySchema } from "../schemas";

export const handleSignup = async (
  req: TypeBoxRequest<{ body: typeof signupBodySchema }>,
  res: FastifyReply,
) => {
  try {
    const data = await signup(req.body);
    if (!data) return res.status(409).send({ ...messages.duplicateEmail });
    return res.status(201).send({ ...messages.createOk, data });
  } catch (err) {
    throw err;
  }
};

export const handleLogin = async (
  req: TypeBoxRequest<{ body: typeof loginBodySchema }>,
  res: FastifyReply,
) => {
  try {
    const data = await login(req.body);
    res.code(200).send({ ...messages.verifyOk, ...data });
  } catch (err) {
    throw err;
  }
};

export const handleGetUsers = async (
  req: TypeBoxRequest<{ querystring: typeof paginationQuerySchema }>,
  res: FastifyReply,
) => {
  try {
    const params = req.query;
    const response = await getUsers({
      page: +params.page,
      perPage: +params.perPage,
    });
    res.code(200).send({ ...messages.verifyOk, ...response });
  } catch (err) {
    throw err;
  }
};

export const handleGetUserById = async (
  req: TypeBoxRequest<{ params: typeof idParamsSchema }>,
  res: FastifyReply,
) => {
  try {
    const params = req.params;
    const response = await getUserById(params.id);
    res.code(200).send({ ...messages.verifyOk, data: response });
  } catch (err) {
    throw err;
  }
};

export const handleGetUserByToken = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  try {
    const data = await authenticate(req, res);
    if (!data) return;
    res.code(200).send({ ...messages.verifyOk, data });
  } catch (err) {
    throw err;
  }
};

export const handleUpdateUser = async (
  req: TypeBoxRequest<{ body: typeof updateUserBodySchema }>,
  res: FastifyReply,
) => {
  try {
    const data = await updateUser(req.body);
    res.code(200).send({ ...messages.verifyOk, data });
  } catch (err) {
    throw err;
  }
};

export const handleDeleteAdmin = async (
  req: TypeBoxRequest<{ params: typeof idParamsSchema }>,
  res: FastifyReply,
) => {
  try {
    const params = req.params;
    const data = await deleteUser(params.id);
    res.code(200).send({ ...messages.verifyOk, data });
  } catch (err) {
    throw err;
  }
};
