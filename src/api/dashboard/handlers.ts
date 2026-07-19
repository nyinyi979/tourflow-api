import { FastifyReply, FastifyRequest } from "fastify";
import { messages } from "../messages";
import { getDashboard } from "./controllers";
export const handleGetDashboard = async (
  _req: FastifyRequest,
  res: FastifyReply,
) => {
  try {
    const data = await getDashboard();
    return res.status(200).send({ ...messages.verifyOk, ...data });
  } catch (err) {
    console.log(err);
    throw err;
  }
};
