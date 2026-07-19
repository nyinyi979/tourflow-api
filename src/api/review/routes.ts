import { FastifyInstance } from "fastify";
import { authenticateAdmin } from "../../utils/auth";
import {
  handleCreateReview,
  handleGetAdminReviews,
  handleGetPublishedReviews,
  handleGetReviewById,
  handleUpdateReview,
  handleDeleteReview,
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
    tourId: { type: "string", format: "uuid" },
    status: { type: "string", enum: ["published", "hidden"] },
    sortBy: {
      type: "string",
      enum: ["rating", "reviewedAt", "status", "createdAt"],
    },
    orderBy: { type: "string", enum: ["asc", "desc"] },
  },
};
const reviewCreateBody = {
  type: "object",
  required: ["tourId", "rating", "comment"],
  properties: {
    tourId: { type: "string", format: "uuid" },
    rating: { type: "integer", minimum: 1, maximum: 5 },
    comment: { type: "string", minLength: 1 },
  },
};
const reviewUpdateBody = {
  type: "object",
  required: ["id"],
  minProperties: 2,
  properties: {
    id: { type: "string", format: "uuid" },
    rating: { type: "integer", minimum: 1, maximum: 5 },
    comment: { type: "string", minLength: 1 },
    status: { type: "string", enum: ["published", "hidden"] },
  },
};
export default async function reviewRoutes(app: FastifyInstance) {
  app.post(
    "",
    {
      schema: {
        tags: ["Reviews"],
        summary: "Create a review",
        security: [{ accessToken: [] }],
        body: reviewCreateBody,
      },
    },
    handleCreateReview,
  );
  app.get(
    "",
    {
      schema: {
        tags: ["Reviews"],
        summary: "List published reviews",
        querystring,
      },
    },
    handleGetPublishedReviews,
  );
  app.get(
    "/admin",
    {
      preHandler: authenticateAdmin,
      schema: {
        tags: ["Reviews"],
        summary: "List all reviews",
        security: [{ accessToken: [] }],
        querystring,
      },
    },
    handleGetAdminReviews,
  );
  app.get(
    "/:id",
    {
      schema: { tags: ["Reviews"], summary: "Get a review", params: idParams },
    },
    handleGetReviewById,
  );
  app.put(
    "",
    {
      preHandler: authenticateAdmin,
      schema: {
        tags: ["Reviews"],
        summary: "Update a review",
        security: [{ accessToken: [] }],
        body: reviewUpdateBody,
      },
    },
    handleUpdateReview,
  );
  app.delete(
    "/:id",
    {
      preHandler: authenticateAdmin,
      schema: {
        tags: ["Reviews"],
        summary: "Delete a review",
        security: [{ accessToken: [] }],
        params: idParams,
      },
    },
    handleDeleteReview,
  );
}
