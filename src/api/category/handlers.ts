import { FastifyReply } from "fastify";
import { messages } from "../messages";
import {
  createCategory,
  getAllCategories,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "./controllers";
import { handleCategoryImage, removeCategoryImages } from "./utils";
import { TypeBoxRequest } from "../request";
import { idParamsSchema } from "../schemas";
import {
  allCategoryQuerySchema,
  categoryQuerySchema,
  createCategoryBodySchema,
  updateCategoryBodySchema,
} from "./schemas";

export const handleCreateCategory = async (
  req: TypeBoxRequest<{ body: typeof createCategoryBodySchema }>,
  res: FastifyReply,
) => {
  let uploadedImage: string | null = null;
  let created = false;
  try {
    const result = await handleCategoryImage(req.body);
    uploadedImage = result.uploadedImage;
    const data = await createCategory(result.body);
    created = true;
    await removeCategoryImages(result.body.removedImageUrls, data.image);
    return res.status(201).send({ ...messages.createOk, data });
  } catch (err) {
    if (!created) await removeCategoryImages([uploadedImage]);
    throw err;
  }
};

export const handleGetCategories = async (
  req: TypeBoxRequest<{ querystring: typeof categoryQuerySchema }>,
  res: FastifyReply,
) => {
  try {
    const params = req.query;
    const response = await getCategories({
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

export const handleGetAllCategories = async (
  req: TypeBoxRequest<{ querystring: typeof allCategoryQuerySchema }>,
  res: FastifyReply,
) => {
  try {
    const params = req.query;
    const response = await getAllCategories(params.type);
    return res.status(200).send({ ...messages.verifyOk, data: response });
  } catch (err) {
    throw err;
  }
};

export const handleGetCategoryById = async (
  req: TypeBoxRequest<{ params: typeof idParamsSchema }>,
  res: FastifyReply,
) => {
  try {
    const { id } = req.params;
    const data = await getCategoryById(id);
    if (!data) return res.status(404).send({ ...messages.notFound });
    return res.status(200).send({ ...messages.verifyOk, data });
  } catch (err) {
    throw err;
  }
};

export const handleUpdateCategory = async (
  req: TypeBoxRequest<{ body: typeof updateCategoryBodySchema }>,
  res: FastifyReply,
) => {
  let uploadedImage: string | null = null;
  let updated = false;
  try {
    const body = req.body;
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
    throw err;
  }
};

export const handleDeleteCategory = async (
  req: TypeBoxRequest<{ params: typeof idParamsSchema }>,
  res: FastifyReply,
) => {
  try {
    const { id } = req.params;
    const data = await deleteCategory(id);
    if (!data) return res.status(404).send({ ...messages.notFound });
    await removeCategoryImages([data.image]);
    return res.status(200).send({ ...messages.deleteOk, data });
  } catch (err) {
    throw err;
  }
};
