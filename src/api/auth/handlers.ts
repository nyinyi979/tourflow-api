import { FastifyReply, FastifyRequest } from "fastify";
import { messages } from "../messages";
import { TLogin, TSignup, TUpdate } from "./types";
import {
  signup,
  login,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "./controllers";
import { DeleteRequestByString, PagKeys } from "../types";
import { authenticate } from "../../utils/auth";

export const handleSignup = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const data = await signup(req.body as TSignup);
    if (!data) return res.status(409).send({ ...messages.duplicateEmail });
    return res.status(201).send({ ...messages.createOk, data });
  } catch (err) {
    throw err;
  }
};

export const handleLogin = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const data = await login(req.body as TLogin);
    res.code(200).send({ ...messages.verifyOk, ...data });
  } catch (err) {
    throw err;
  }
};

export const handleGetUsers = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  try {
    const params = req.query as PagKeys;
    if (params.page === undefined || params.perPage === undefined)
      return res.status(400).send({ ...messages.schemaError });
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
  req: FastifyRequest,
  res: FastifyReply,
) => {
  try {
    const params = req.params as DeleteRequestByString;
    if (!params.id) return res.status(400).send({ ...messages.schemaError });
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
  req: FastifyRequest,
  res: FastifyReply,
) => {
  try {
    const data = await updateUser(req.body as TUpdate);
    res.code(200).send({ ...messages.verifyOk, data });
  } catch (err) {
    throw err;
  }
};

export const handleDeleteAdmin = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  try {
    const params = req.params as DeleteRequestByString;
    if (!params.id) return res.status(400).send({ ...messages.schemaError });
    const data = await deleteUser(params.id);
    res.code(200).send({ ...messages.verifyOk, data });
  } catch (err) {
    throw err;
  }
};
