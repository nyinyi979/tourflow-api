import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { authenticateAdmin } from "../../utils/auth";
import { idParamsSchema } from "../schemas";
import {
  handleCreateReview,
  handleDeleteReview,
  handleGetAdminReviews,
  handleGetPublishedReviews,
  handleGetReviewById,
  handleUpdateReview,
} from "./handlers";
import {
  createReviewBodySchema,
  reviewQuerySchema,
  updateReviewBodySchema,
} from "./schemas";

const reviewRoutes: FastifyPluginAsyncTypebox = async (app) => {
  app.post("", {
    schema: {
      tags: ["Reviews"],
      summary: "Create a review",
      security: [{ accessToken: [] }],
      body: createReviewBodySchema,
    },
    handler: handleCreateReview,
  });
  app.get("", {
    schema: {
      tags: ["Reviews"],
      summary: "List published reviews",
      querystring: reviewQuerySchema,
    },
    handler: handleGetPublishedReviews,
  });
  app.get("/admin", {
    preHandler: authenticateAdmin,
    schema: {
      tags: ["Reviews"],
      summary: "List all reviews",
      security: [{ accessToken: [] }],
      querystring: reviewQuerySchema,
    },
    handler: handleGetAdminReviews,
  });
  app.get("/:id", {
    schema: {
      tags: ["Reviews"],
      summary: "Get a review",
      params: idParamsSchema,
    },
    handler: handleGetReviewById,
  });
  app.put("", {
    preHandler: authenticateAdmin,
    schema: {
      tags: ["Reviews"],
      summary: "Update a review",
      security: [{ accessToken: [] }],
      body: updateReviewBodySchema,
    },
    handler: handleUpdateReview,
  });
  app.delete("/:id", {
    preHandler: authenticateAdmin,
    schema: {
      tags: ["Reviews"],
      summary: "Delete a review",
      security: [{ accessToken: [] }],
      params: idParamsSchema,
    },
    handler: handleDeleteReview,
  });
};

export default reviewRoutes;
