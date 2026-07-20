import { FastifyReply } from "fastify";
import { authenticateCustomer, authenticateUser } from "../../utils/auth";
import { messages } from "../messages";
import {
  createBooking,
  getBookingById,
  getBookings,
  updateBooking,
  deleteBooking,
} from "./controllers";
import { TypeBoxRequest } from "../request";
import { idParamsSchema } from "../schemas";
import {
  bookingQuerySchema,
  createBookingBodySchema,
  updateBookingBodySchema,
} from "./schemas";

export const handleCreateBooking = async (
  req: TypeBoxRequest<{ body: typeof createBookingBodySchema }>,
  res: FastifyReply,
) => {
  try {
    const customer = await authenticateCustomer(req, res);
    if (!customer) return;
    const data = await createBooking(customer.id, req.body);
    return res.status(201).send({ ...messages.createOk, data });
  } catch (err) {
    throw err;
  }
};

export const handleGetBookings = async (
  req: TypeBoxRequest<{ querystring: typeof bookingQuerySchema }>,
  res: FastifyReply,
) => {
  try {
    const params = req.query;
    const response = await getBookings({
      ...params,
      page: +params.page,
      perPage: +params.perPage,
    });
    return res
      .status(200)
      .send({ ...messages.verifyOk, ...params, ...response });
  } catch (err) {
    throw err;
  }
};
export const handleGetMyBookings = async (
  req: TypeBoxRequest<{ querystring: typeof bookingQuerySchema }>,
  res: FastifyReply,
) => {
  try {
    const customer = await authenticateCustomer(req, res);
    if (!customer) return;
    const params = req.query;
    const response = await getBookings(
      { ...params, page: +params.page, perPage: +params.perPage },
      customer.id,
    );
    return res
      .status(200)
      .send({ ...messages.verifyOk, ...params, ...response });
  } catch (err) {
    throw err;
  }
};
export const handleGetBookingById = async (
  req: TypeBoxRequest<{ params: typeof idParamsSchema }>,
  res: FastifyReply,
) => {
  try {
    const user = await authenticateUser(req, res);
    if (!user) return;
    const data = await getBookingById(req.params.id);
    if (!data) return res.status(404).send({ ...messages.notFound });
    if (user.accountType === "customer" && data.customerId !== user.id)
      return res.status(403).send({ ...messages.forbiddenAccess });
    return res.status(200).send({ ...messages.verifyOk, data });
  } catch (err) {
    throw err;
  }
};
export const handleUpdateBooking = async (
  req: TypeBoxRequest<{
    params: typeof idParamsSchema;
    body: typeof updateBookingBodySchema;
  }>,
  res: FastifyReply,
) => {
  try {
    const user = await authenticateUser(req, res);
    if (!user) return;
    const id = req.params.id;
    const current = await getBookingById(id);
    if (!current) return res.status(404).send({ ...messages.notFound });
    const body = req.body;
    if (
      user.accountType === "customer" &&
      (current.customerId !== user.id ||
        (body.status && body.status !== "cancelled"))
    )
      return res.status(403).send({ ...messages.forbiddenAccess });
    const data = await updateBooking(id, body);
    return res.status(200).send({ ...messages.updateOk, data });
  } catch (err) {
    throw err;
  }
};
export const handleDeleteBooking = async (
  req: TypeBoxRequest<{ params: typeof idParamsSchema }>,
  res: FastifyReply,
) => {
  try {
    const user = await authenticateUser(req, res);
    if (!user) return;
    const id = req.params.id;
    const current = await getBookingById(id);
    if (!current) return res.status(404).send({ ...messages.notFound });
    if (user.accountType === "customer" && current.customerId !== user.id)
      return res.status(403).send({ ...messages.forbiddenAccess });
    const data = await deleteBooking(id);
    return res.status(200).send({ ...messages.deleteOk, data });
  } catch (err) {
    throw err;
  }
};
