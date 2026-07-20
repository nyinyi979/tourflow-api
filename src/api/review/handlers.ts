import { FastifyReply, FastifyRequest } from "fastify";
import { authenticateCustomer } from "../../utils/auth";
import { messages } from "../messages";
import { DeleteRequestByString } from "../types";
import {
  createReview,
  getReviewById,
  getReviews,
  updateReview,
  deleteReview,
} from "./controllers";
import { ReviewReadRequest, TReview, UReview } from "./types";

export const handleCreateReview = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  try {
    const customer = await authenticateCustomer(req, res);
    if (!customer) return;
    const data = await createReview(customer, req.body as TReview);
    return res.status(201).send({ ...messages.createOk, data });
  } catch (err) {
    throw err;
  }
};

export const handleGetPublishedReviews = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  try {
    const params = req.query as ReviewReadRequest;
    const response = await getReviews(
      { ...params, page: +params.page, perPage: +params.perPage },
      true,
    );
    return res
      .status(200)
      .send({ ...messages.verifyOk, ...params, ...response });
  } catch (err) {
    throw err;
  }
};
export const handleGetAdminReviews = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  try {
    const params = req.query as ReviewReadRequest;
    const response = await getReviews({
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
export const handleGetReviewById = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  try {
    const data = await getReviewById((req.params as DeleteRequestByString).id);
    if (!data || data.status !== "published")
      return res.status(404).send({ ...messages.notFound });
    return res.status(200).send({ ...messages.verifyOk, data });
  } catch (err) {
    throw err;
  }
};
export const handleUpdateReview = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  try {
    const data = await updateReview(req.body as UReview);
    if (!data) return res.status(404).send({ ...messages.notFound });
    return res.status(200).send({ ...messages.updateOk, data });
  } catch (err) {
    throw err;
  }
};
export const handleDeleteReview = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  try {
    const data = await deleteReview((req.params as DeleteRequestByString).id);
    if (!data) return res.status(404).send({ ...messages.notFound });
    return res.status(200).send({ ...messages.deleteOk, data });
  } catch (err) {
    throw err;
  }
};
