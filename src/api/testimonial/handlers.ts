import { FastifyReply } from "fastify";
import { messages } from "../messages";
import {
  createTestimonial,
  getTestimonialById,
  getTestimonials,
  updateTestimonial,
  deleteTestimonial,
} from "./controllers";
import { handleTestimonialAvatar, removeTestimonialAvatars } from "./utils";
import { TypeBoxRequest } from "../request";
import { idParamsSchema } from "../schemas";
import {
  createTestimonialBodySchema,
  testimonialQuerySchema,
  updateTestimonialBodySchema,
} from "./schemas";

export const handleCreateTestimonial = async (
  req: TypeBoxRequest<{ body: typeof createTestimonialBodySchema }>,
  res: FastifyReply,
) => {
  let uploaded: string | null = null;
  let saved = false;
  try {
    const result = await handleTestimonialAvatar(req.body);
    uploaded = result.uploadedAvatar;
    const data = await createTestimonial(result.body);
    saved = true;
    await removeTestimonialAvatars(result.body.removedImageUrls, data.avatar);
    return res.status(201).send({ ...messages.createOk, data });
  } catch (err) {
    if (!saved) await removeTestimonialAvatars([uploaded]);
    throw err;
  }
};

export const handleGetTestimonials = async (
  req: TypeBoxRequest<{ querystring: typeof testimonialQuerySchema }>,
  res: FastifyReply,
) => {
  try {
    const params = req.query;
    const response = await getTestimonials({
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
export const handleGetTestimonialById = async (
  req: TypeBoxRequest<{ params: typeof idParamsSchema }>,
  res: FastifyReply,
) => {
  try {
    const data = await getTestimonialById(req.params.id);
    if (!data) return res.status(404).send({ ...messages.notFound });
    return res.status(200).send({ ...messages.verifyOk, data });
  } catch (err) {
    throw err;
  }
};
export const handleUpdateTestimonial = async (
  req: TypeBoxRequest<{ body: typeof updateTestimonialBodySchema }>,
  res: FastifyReply,
) => {
  let uploaded: string | null = null;
  let saved = false;
  try {
    const body = req.body;
    const previous = await getTestimonialById(body.id);
    if (!previous) return res.status(404).send({ ...messages.notFound });
    const result = await handleTestimonialAvatar(body);
    uploaded = result.uploadedAvatar;
    const data = await updateTestimonial(result.body);
    if (!data) throw new Error("Testimonial not found");
    saved = true;
    const replaced =
      body.avatar !== undefined && body.avatar !== previous.avatar
        ? previous.avatar
        : null;
    await removeTestimonialAvatars(
      [...(body.removedImageUrls || []), replaced],
      data.avatar,
    );
    return res.status(200).send({ ...messages.updateOk, data });
  } catch (err) {
    if (!saved) await removeTestimonialAvatars([uploaded]);
    throw err;
  }
};
export const handleDeleteTestimonial = async (
  req: TypeBoxRequest<{ params: typeof idParamsSchema }>,
  res: FastifyReply,
) => {
  try {
    const data = await deleteTestimonial(req.params.id);
    if (!data) return res.status(404).send({ ...messages.notFound });
    await removeTestimonialAvatars([data.avatar]);
    return res.status(200).send({ ...messages.deleteOk, data });
  } catch (err) {
    throw err;
  }
};
