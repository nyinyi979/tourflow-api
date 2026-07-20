import { FastifyReply } from "fastify";
import { authenticateCustomer } from "../../utils/auth";
import { messages } from "../messages";
import {
  createReview,
  getReviewById,
  getReviews,
  updateReview,
  deleteReview,
} from "./controllers";
import { TypeBoxRequest } from "../request";
import { idParamsSchema } from "../schemas";
import {
  createReviewBodySchema,
  reviewQuerySchema,
  updateReviewBodySchema,
} from "./schemas";

export const handleCreateReview = async (
  req: TypeBoxRequest<{ body: typeof createReviewBodySchema }>,
  res: FastifyReply,
) => {
  try {
    const customer = await authenticateCustomer(req, res);
    if (!customer) return;
    const data = await createReview(customer, req.body);
    return res.status(201).send({ ...messages.createOk, data });
  } catch (err) {
    throw err;
  }
};

export const handleGetPublishedReviews = async (
  req: TypeBoxRequest<{ querystring: typeof reviewQuerySchema }>,
  res: FastifyReply,
) => {
  try {
    const params = req.query;
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
  req: TypeBoxRequest<{ querystring: typeof reviewQuerySchema }>,
  res: FastifyReply,
) => {
  try {
    const params = req.query;
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
  req: TypeBoxRequest<{ params: typeof idParamsSchema }>,
  res: FastifyReply,
) => {
  try {
    const data = await getReviewById(req.params.id);
    if (!data || data.status !== "published")
      return res.status(404).send({ ...messages.notFound });
    return res.status(200).send({ ...messages.verifyOk, data });
  } catch (err) {
    throw err;
  }
};
export const handleUpdateReview = async (
  req: TypeBoxRequest<{ body: typeof updateReviewBodySchema }>,
  res: FastifyReply,
) => {
  try {
    const data = await updateReview(req.body);
    if (!data) return res.status(404).send({ ...messages.notFound });
    return res.status(200).send({ ...messages.updateOk, data });
  } catch (err) {
    throw err;
  }
};
export const handleDeleteReview = async (
  req: TypeBoxRequest<{ params: typeof idParamsSchema }>,
  res: FastifyReply,
) => {
  try {
    const data = await deleteReview(req.params.id);
    if (!data) return res.status(404).send({ ...messages.notFound });
    return res.status(200).send({ ...messages.deleteOk, data });
  } catch (err) {
    throw err;
  }
};
