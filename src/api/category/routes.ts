import { FastifyInstance } from "fastify";
import { authenticateAdmin } from "../../utils/auth";
import {
  handleCreateCategory,
  handleGetAllCategories,
  handleGetCategories,
  handleGetCategoryById,
  handleUpdateCategory,
  handleDeleteCategory,
} from "./handlers";

const idParams = {
  type: "object",
  required: ["id"],
  properties: { id: { type: "string", format: "uuid" } },
};
const querystring = {
  type: "object",
  required: ["page", "perPage"],
  properties: {
    page: { type: "integer", minimum: 0 },
    perPage: { type: "integer", minimum: 1, maximum: 100 },
    query: { type: "string" },
    type: { type: "string", enum: ["tour", "activity"] },
    sortBy: { type: "string", enum: ["slug", "label", "type"] },
    orderBy: { type: "string", enum: ["asc", "desc"] },
  },
};
const categoryProperties = {
  id: { type: "string", format: "uuid" },
  slug: { type: "string", minLength: 1, maxLength: 100 },
  label: { type: "string", minLength: 1, maxLength: 100 },
  image: { anyOf: [{ type: "string", maxLength: 2048 }, { type: "null" }] },
  type: { type: "string", enum: ["tour", "activity"] },
  removedImageUrls: {
    type: "array",
    items: { anyOf: [{ type: "string" }, { type: "null" }] },
  },
};

export default async function categoryRoutes(app: FastifyInstance) {
  app.post(
    "",
    {
      preHandler: authenticateAdmin,
      schema: {
        tags: ["Categories"],
        summary: "Create a category",
        security: [{ accessToken: [] }],
        body: {
          type: "object",
          required: ["slug", "label", "type"],
          properties: categoryProperties,
        },
      },
    },
    handleCreateCategory,
  );
  app.get(
    "",
    {
      schema: { tags: ["Categories"], summary: "List categories", querystring },
    },
    handleGetCategories,
  );
  app.get("/all", {
    schema: {
      tags: ["Categories"],
      summary: "List all categories",
      querystring: {
        type: "object",
        required: ["type"],
        properties: {
          type: { type: "string", enum: ["tour", "activity"] },
        },
      },
    },
    handler: handleGetAllCategories,
  });
  app.get(
    "/:id",
    {
      schema: {
        tags: ["Categories"],
        summary: "Get a category",
        params: idParams,
      },
    },
    handleGetCategoryById,
  );
  app.put(
    "",
    {
      preHandler: authenticateAdmin,
      schema: {
        tags: ["Categories"],
        summary: "Update a category",
        security: [{ accessToken: [] }],
        body: {
          type: "object",
          required: ["id"],
          minProperties: 2,
          properties: categoryProperties,
        },
      },
    },
    handleUpdateCategory,
  );
  app.delete(
    "/:id",
    {
      preHandler: authenticateAdmin,
      schema: {
        tags: ["Categories"],
        summary: "Delete a category",
        security: [{ accessToken: [] }],
        params: idParams,
      },
    },
    handleDeleteCategory,
  );
}
