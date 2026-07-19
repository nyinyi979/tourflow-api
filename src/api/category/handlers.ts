import { FastifyReply, FastifyRequest } from "fastify";
import { messages } from "../messages";
import { DeleteRequestByString } from "../types";
import {
  createCategory,
  getAllCategories,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "./controllers";
import {
  AllCategoryReadRequest,
  CategoryReadRequest,
  TCategory,
  UCategory,
} from "./types";
import { handleCategoryImage, removeCategoryImages } from "./utils";

export const handleCreateCategory = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  let uploadedImage: string | null = null;
  let created = false;
  try {
    const result = await handleCategoryImage(req.body as TCategory);
    uploadedImage = result.uploadedImage;
    const data = await createCategory(result.body);
    created = true;
    await removeCategoryImages(result.body.removedImageUrls, data.image);
    return res.status(201).send({ ...messages.createOk, data });
  } catch (err) {
    if (!created) await removeCategoryImages([uploadedImage]);
    console.log(err);
    throw err;
  }
};

export const handleGetCategories = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  try {
    const params = req.query as CategoryReadRequest;
    const response = await getCategories({
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

export const handleGetAllCategories = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  try {
    const params = req.query as AllCategoryReadRequest;
    const response = await getAllCategories(params.type);
    return res.status(200).send({ ...messages.verifyOk, data: response });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const handleGetCategoryById = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  try {
    const { id } = req.params as DeleteRequestByString;
    const data = await getCategoryById(id);
    if (!data) return res.status(404).send({ ...messages.notFound });
    return res.status(200).send({ ...messages.verifyOk, data });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const handleUpdateCategory = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  let uploadedImage: string | null = null;
  let updated = false;
  try {
    const body = req.body as UCategory;
    const previous = await getCategoryById(body.id);
    if (!previous) return res.status(404).send({ ...messages.notFound });
    const result = await handleCategoryImage(body);
    uploadedImage = result.uploadedImage;
    const data = await updateCategory(result.body);
    if (!data) throw new Error("Category not found");
    updated = true;
    const replaced =
      body.image !== undefined && body.image !== previous.image
        ? previous.image
        : null;
    await removeCategoryImages(
      [...(body.removedImageUrls || []), replaced],
      data.image,
    );
    return res.status(200).send({ ...messages.updateOk, data });
  } catch (err) {
    if (!updated) await removeCategoryImages([uploadedImage]);
    console.log(err);
    throw err;
  }
};

export const handleDeleteCategory = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  try {
    const { id } = req.params as DeleteRequestByString;
    const data = await deleteCategory(id);
    if (!data) return res.status(404).send({ ...messages.notFound });
    await removeCategoryImages([data.image]);
    return res.status(200).send({ ...messages.deleteOk, data });
  } catch (err) {
    console.log(err);
    throw err;
  }
};
