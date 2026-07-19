import { FastifyReply, FastifyRequest } from "fastify";
import { messages } from "../messages";
import { DeleteRequestByString } from "../types";
import {
  createTestimonial,
  getTestimonialById,
  getTestimonials,
  updateTestimonial,
  deleteTestimonial,
} from "./controllers";
import { TestimonialReadRequest, TTestimonial, UTestimonial } from "./types";
import { handleTestimonialAvatar, removeTestimonialAvatars } from "./utils";

export const handleCreateTestimonial = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  let uploaded: string | null = null;
  let saved = false;
  try {
    const result = await handleTestimonialAvatar(req.body as TTestimonial);
    uploaded = result.uploadedAvatar;
    const data = await createTestimonial(result.body);
    saved = true;
    await removeTestimonialAvatars(result.body.removedImageUrls, data.avatar);
    return res.status(201).send({ ...messages.createOk, data });
  } catch (err) {
    if (!saved) await removeTestimonialAvatars([uploaded]);
    console.log(err);
    throw err;
  }
};

export const handleGetTestimonials = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  try {
    const params = req.query as TestimonialReadRequest;
    const response = await getTestimonials({
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
export const handleGetTestimonialById = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  try {
    const data = await getTestimonialById(
      (req.params as DeleteRequestByString).id,
    );
    if (!data) return res.status(404).send({ ...messages.notFound });
    return res.status(200).send({ ...messages.verifyOk, data });
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const handleUpdateTestimonial = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  let uploaded: string | null = null;
  let saved = false;
  try {
    const body = req.body as UTestimonial;
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
    console.log(err);
    throw err;
  }
};
export const handleDeleteTestimonial = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  try {
    const data = await deleteTestimonial(
      (req.params as DeleteRequestByString).id,
    );
    if (!data) return res.status(404).send({ ...messages.notFound });
    await removeTestimonialAvatars([data.avatar]);
    return res.status(200).send({ ...messages.deleteOk, data });
  } catch (err) {
    console.log(err);
    throw err;
  }
};
