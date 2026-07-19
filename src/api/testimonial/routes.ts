import { FastifyInstance } from "fastify";
import { authenticateAdmin } from "../../utils/auth";
import {
  handleCreateTestimonial,
  handleGetTestimonialById,
  handleGetTestimonials,
  handleUpdateTestimonial,
  handleDeleteTestimonial,
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
    sortBy: { type: "string", enum: ["name", "rating", "createdAt"] },
    orderBy: { type: "string", enum: ["asc", "desc"] },
  },
};
const testimonialProperties = {
  id: { type: "string", format: "uuid" },
  name: { type: "string", minLength: 1, maxLength: 150 },
  avatar: {
    anyOf: [{ type: "string", maxLength: 2048 }, { type: "null" }],
  },
  quote: { type: "string", minLength: 1 },
  rating: { type: "integer", minimum: 1, maximum: 5 },
  removedImageUrls: {
    type: "array",
    items: { anyOf: [{ type: "string" }, { type: "null" }] },
  },
};
export default async function testimonialRoutes(app: FastifyInstance) {
  app.post(
    "",
    {
      preHandler: authenticateAdmin,
      schema: {
        tags: ["Testimonials"],
        summary: "Create a testimonial",
        security: [{ accessToken: [] }],
        body: {
          type: "object",
          required: ["name", "quote", "rating"],
          properties: testimonialProperties,
        },
      },
    },
    handleCreateTestimonial,
  );
  app.get(
    "",
    {
      schema: {
        tags: ["Testimonials"],
        summary: "List testimonials",
        querystring,
      },
    },
    handleGetTestimonials,
  );
  app.get(
    "/:id",
    {
      schema: {
        tags: ["Testimonials"],
        summary: "Get a testimonial",
        params: idParams,
      },
    },
    handleGetTestimonialById,
  );
  app.put(
    "",
    {
      preHandler: authenticateAdmin,
      schema: {
        tags: ["Testimonials"],
        summary: "Update a testimonial",
        security: [{ accessToken: [] }],
        body: {
          type: "object",
          required: ["id"],
          minProperties: 2,
          properties: testimonialProperties,
        },
      },
    },
    handleUpdateTestimonial,
  );
  app.delete(
    "/:id",
    {
      preHandler: authenticateAdmin,
      schema: {
        tags: ["Testimonials"],
        summary: "Delete a testimonial",
        security: [{ accessToken: [] }],
        params: idParams,
      },
    },
    handleDeleteTestimonial,
  );
}
