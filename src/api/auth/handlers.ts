import { FastifyReply, FastifyRequest } from "fastify";
import { messages } from "../messages";
import { TLogin, TUpdate } from "./types";
import {
  login,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "./controllers";
import { DeleteRequestByString, PagKeys } from "../types";
import { authenticate } from "../../utils/auth";

export const handleLogin = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const data = await login(req.body as TLogin);
    res.code(200).send({ ...messages.verifyOk, ...data });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const handleGetUsers = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  try {
    const params = req.query as PagKeys;
    if (!params.page || !params.perPage)
      res.status(500).send({ message: "Params page and perPage are required" });
    const response = await getUsers({
      page: +params.page,
      perPage: +params.perPage,
    });
    res.code(200).send({ ...messages.verifyOk, ...response });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const handleGetUserById = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  try {
    const params = req.params as DeleteRequestByString;
    if (!params.id) res.status(500).send({ message: "Params ID is required" });
    const response = await getUserById(params.id);
    res.code(200).send({ ...messages.verifyOk, data: response });
  } catch (err) {
    console.log(err);
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
    console.log(err);
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
    console.log(err);
    throw err;
  }
};

export const handleDeleteAdmin = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  try {
    const params = req.params as DeleteRequestByString;
    if (!params.id) res.status(500).send({ message: "Params ID is required" });
    const data = await deleteUser(params.id);
    res.code(200).send({ ...messages.verifyOk, data });
  } catch (err) {
    console.log(err);
    throw err;
  }
};
