import { FastifyReply, FastifyRequest } from "fastify";
import { messages } from "../messages";
import { DeleteRequestByString } from "../types";
import {
  createTour,
  getTourById,
  getTours,
  updateTour,
  deleteTour,
} from "./controllers";
import { TourReadRequest, TTour, UTour } from "./types";
import { handleTourImages, removeTourImages } from "./utils";

export const handleCreateTour = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  let uploaded: string[] = [];
  let saved = false;
  try {
    const result = await handleTourImages(req.body as TTour);
    uploaded = result.uploadedImages;
    const data = await createTour(result.body);
    if (!data) throw new Error("Tour was not created");
    saved = true;
    await removeTourImages(result.body.removedImageUrls, data.images);
    return res.status(201).send({ ...messages.createOk, data });
  } catch (err) {
    if (!saved) await removeTourImages(uploaded);
    throw err;
  }
};

export const handleGetTours = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  try {
    const params = req.query as TourReadRequest;
    const response = await getTours({
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

export const handleGetTourById = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  try {
    const data = await getTourById((req.params as DeleteRequestByString).id);
    if (!data) return res.status(404).send({ ...messages.notFound });
    return res.status(200).send({ ...messages.verifyOk, data });
  } catch (err) {
    throw err;
  }
};

export const handleUpdateTour = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  let uploaded: string[] = [];
  let saved = false;
  try {
    const body = req.body as UTour;
    const previous = await getTourById(body.id);
    if (!previous) return res.status(404).send({ ...messages.notFound });
    const result = await handleTourImages(body);
    uploaded = result.uploadedImages;
    const data = await updateTour(result.body);
    if (!data) throw new Error("Tour not found");
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
    await removeTourImages(
      [...(body.removedImageUrls || []), ...replaced],
      data.images,
    );
    return res.status(200).send({ ...messages.updateOk, data });
  } catch (err) {
    if (!saved) await removeTourImages(uploaded);
    throw err;
  }
};

export const handleDeleteTour = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  try {
    const data = await deleteTour((req.params as DeleteRequestByString).id);
    if (!data) return res.status(404).send({ ...messages.notFound });
    await removeTourImages(
      data.images.map((image: { url: string }) => image.url),
    );
    return res.status(200).send({ ...messages.deleteOk, data });
  } catch (err) {
    throw err;
  }
};
