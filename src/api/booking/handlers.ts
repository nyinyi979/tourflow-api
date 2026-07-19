import { FastifyReply, FastifyRequest } from "fastify";
import {
  authenticateAdmin,
  authenticateCustomer,
  authenticateUser,
} from "../../utils/auth";
import { messages } from "../messages";
import { DeleteRequestByString } from "../types";
import {
  createBooking,
  getBookingById,
  getBookings,
  updateBooking,
  deleteBooking,
} from "./controllers";
import { BookingReadRequest, TBooking, UBooking } from "./types";

export const handleCreateBooking = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  try {
    const customer = await authenticateCustomer(req, res);
    if (!customer) return;
    const data = await createBooking(customer.id, req.body as TBooking);
    return res.status(201).send({ ...messages.createOk, data });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const handleGetBookings = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  try {
    const params = req.query as BookingReadRequest;
    const response = await getBookings({
      ...params,
      page: +params.page,
      perPage: +params.perPage,
    });
    return res
      .status(200)
      .send({ ...messages.verifyOk, ...params, ...response });
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const handleGetMyBookings = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  try {
    const customer = await authenticateCustomer(req, res);
    if (!customer) return;
    const params = req.query as BookingReadRequest;
    const response = await getBookings(
      { ...params, page: +params.page, perPage: +params.perPage },
      customer.id,
    );
    return res
      .status(200)
      .send({ ...messages.verifyOk, ...params, ...response });
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const handleGetBookingById = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  try {
    const user = await authenticateUser(req, res);
    if (!user) return;
    const data = await getBookingById((req.params as DeleteRequestByString).id);
    if (!data) return res.status(404).send({ ...messages.notFound });
    if (user.accountType === "customer" && data.customerId !== user.id)
      return res.status(403).send({ ...messages.forbiddenAccess });
    return res.status(200).send({ ...messages.verifyOk, data });
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const handleUpdateBooking = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  try {
    const user = await authenticateUser(req, res);
    if (!user) return;
    const id = (req.params as DeleteRequestByString).id;
    const current = await getBookingById(id);
    if (!current) return res.status(404).send({ ...messages.notFound });
    const body = req.body as UBooking;
    if (
      user.accountType === "customer" &&
      (current.customerId !== user.id ||
        (body.status && body.status !== "cancelled"))
    )
      return res.status(403).send({ ...messages.forbiddenAccess });
    const data = await updateBooking(id, body);
    return res.status(200).send({ ...messages.updateOk, data });
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const handleDeleteBooking = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  try {
    const user = await authenticateUser(req, res);
    if (!user) return;
    const id = (req.params as DeleteRequestByString).id;
    const current = await getBookingById(id);
    if (!current) return res.status(404).send({ ...messages.notFound });
    if (user.accountType === "customer" && current.customerId !== user.id)
      return res.status(403).send({ ...messages.forbiddenAccess });
    const data = await deleteBooking(id);
    return res.status(200).send({ ...messages.deleteOk, data });
  } catch (err) {
    console.log(err);
    throw err;
  }
};
