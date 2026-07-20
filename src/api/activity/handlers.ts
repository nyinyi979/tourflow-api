import { FastifyReply } from "fastify";
import { messages } from "../messages";
import {
  createActivity,
  getActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
} from "./controllers";
import { handleActivityImages, removeActivityImages } from "./utils";
import { TypeBoxRequest } from "../request";
import { idParamsSchema } from "../schemas";
import {
  activityQuerySchema,
  createActivityBodySchema,
  updateActivityBodySchema,
} from "./schemas";

export const handleCreateActivity = async (
  req: TypeBoxRequest<{ body: typeof createActivityBodySchema }>,
  res: FastifyReply,
) => {
  let uploaded: string[] = [];
  let saved = false;
  try {
    const result = await handleActivityImages(req.body);
    uploaded = result.uploadedImages;
    const data = await createActivity(result.body);
    if (!data) throw new Error("Activity was not created");
    saved = true;
    await removeActivityImages(result.body.removedImageUrls, data.images);
    return res.status(201).send({ ...messages.createOk, data });
  } catch (err) {
    if (!saved) await removeActivityImages(uploaded);
    throw err;
  }
};

export const handleGetActivities = async (
  req: TypeBoxRequest<{ querystring: typeof activityQuerySchema }>,
  res: FastifyReply,
) => {
  try {
    const params = req.query;
    const response = await getActivities({
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
export const handleGetActivityById = async (
  req: TypeBoxRequest<{ params: typeof idParamsSchema }>,
  res: FastifyReply,
) => {
  try {
    const data = await getActivityById(req.params.id);
    if (!data) return res.status(404).send({ ...messages.notFound });
    return res.status(200).send({ ...messages.verifyOk, data });
  } catch (err) {
    throw err;
  }
};
export const handleUpdateActivity = async (
  req: TypeBoxRequest<{ body: typeof updateActivityBodySchema }>,
  res: FastifyReply,
) => {
  let uploaded: string[] = [];
  let saved = false;
  try {
    const body = req.body;
    const previous = await getActivityById(body.id);
    if (!previous) return res.status(404).send({ ...messages.notFound });
    const result = await handleActivityImages(body);
    uploaded = result.uploadedImages;
    const data = await updateActivity(result.body);
    if (!data) throw new Error("Activity not found");
    saved = true;
    const replaced = body.images
      ? previous.images
          .filter(
            (previousImage: { id: string; url: string }) =>
              !data.images.some(
                (image: { id: string; url: string }) =>
                  image.id === previousImage.id &&
                  image.url === previousImage.url,
              ),
          )
          .map((image: { url: string }) => image.url)
      : [];
    await removeActivityImages(
      [...(body.removedImageUrls || []), ...replaced],
      data.images,
    );
    return res.status(200).send({ ...messages.updateOk, data });
  } catch (err) {
    if (!saved) await removeActivityImages(uploaded);
    throw err;
  }
};
export const handleDeleteActivity = async (
  req: TypeBoxRequest<{ params: typeof idParamsSchema }>,
  res: FastifyReply,
) => {
  try {
    const data = await deleteActivity(req.params.id);
    if (!data) return res.status(404).send({ ...messages.notFound });
    await removeActivityImages(
      data.images.map((image: { url: string }) => image.url),
    );
    return res.status(200).send({ ...messages.deleteOk, data });
  } catch (err) {
    throw err;
  }
};
