import { FastifyReply, FastifyRequest } from "fastify";
import { messages } from "../messages";
import { DeleteRequestByString } from "../types";
import {
  createActivity,
  getActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
} from "./controllers";
import { ActivityReadRequest, TActivity, UActivity } from "./types";
import { handleActivityImages, removeActivityImages } from "./utils";

export const handleCreateActivity = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  let uploaded: string[] = [];
  let saved = false;
  try {
    const result = await handleActivityImages(req.body as TActivity);
    uploaded = result.uploadedImages;
    const data = await createActivity(result.body);
    if (!data) throw new Error("Activity was not created");
    saved = true;
    await removeActivityImages(result.body.removedImageUrls, data.images);
    return res.status(201).send({ ...messages.createOk, data });
  } catch (err) {
    if (!saved) await removeActivityImages(uploaded);
    console.log(err);
    throw err;
  }
};

export const handleGetActivities = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  try {
    const params = req.query as ActivityReadRequest;
    const response = await getActivities({
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
export const handleGetActivityById = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  try {
    const data = await getActivityById(
      (req.params as DeleteRequestByString).id,
    );
    if (!data) return res.status(404).send({ ...messages.notFound });
    return res.status(200).send({ ...messages.verifyOk, data });
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const handleUpdateActivity = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  let uploaded: string[] = [];
  let saved = false;
  try {
    const body = req.body as UActivity;
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
    console.log(err);
    throw err;
  }
};
export const handleDeleteActivity = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  try {
    const data = await deleteActivity((req.params as DeleteRequestByString).id);
    if (!data) return res.status(404).send({ ...messages.notFound });
    await removeActivityImages(
      data.images.map((image: { url: string }) => image.url),
    );
    return res.status(200).send({ ...messages.deleteOk, data });
  } catch (err) {
    console.log(err);
    throw err;
  }
};
