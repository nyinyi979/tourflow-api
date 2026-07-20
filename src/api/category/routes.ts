import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { authenticateAdmin } from "../../utils/auth";
import { idParamsSchema } from "../schemas";
import {
  handleCreateCategory,
  handleDeleteCategory,
  handleGetAllCategories,
  handleGetCategories,
  handleGetCategoryById,
  handleUpdateCategory,
} from "./handlers";
import {
  allCategoryQuerySchema,
  categoryQuerySchema,
  createCategoryBodySchema,
  updateCategoryBodySchema,
} from "./schemas";

const categoryRoutes: FastifyPluginAsyncTypebox = async (app) => {
  app.post("", {
    preHandler: authenticateAdmin,
    schema: {
      tags: ["Categories"],
      summary: "Create a category",
      security: [{ accessToken: [] }],
      body: createCategoryBodySchema,
    },
    handler: handleCreateCategory,
  });
  app.get("", {
    schema: {
      tags: ["Categories"],
      summary: "List categories",
      querystring: categoryQuerySchema,
    },
    handler: handleGetCategories,
  });
  app.get("/all", {
    schema: {
      tags: ["Categories"],
      summary: "List all categories",
      querystring: allCategoryQuerySchema,
    },
    handler: handleGetAllCategories,
  });
  app.get("/:id", {
    schema: {
      tags: ["Categories"],
      summary: "Get a category",
      params: idParamsSchema,
    },
    handler: handleGetCategoryById,
  });
  app.put("", {
    preHandler: authenticateAdmin,
    schema: {
      tags: ["Categories"],
      summary: "Update a category",
      security: [{ accessToken: [] }],
      body: updateCategoryBodySchema,
    },
    handler: handleUpdateCategory,
  });
  app.delete("/:id", {
    preHandler: authenticateAdmin,
    schema: {
      tags: ["Categories"],
      summary: "Delete a category",
      security: [{ accessToken: [] }],
      params: idParamsSchema,
    },
    handler: handleDeleteCategory,
  });
};

export default categoryRoutes;
