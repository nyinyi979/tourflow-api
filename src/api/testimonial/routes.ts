import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { authenticateAdmin } from "../../utils/auth";
import { idParamsSchema } from "../schemas";
import {
  handleCreateTestimonial,
  handleDeleteTestimonial,
  handleGetTestimonialById,
  handleGetTestimonials,
  handleUpdateTestimonial,
} from "./handlers";
import {
  createTestimonialBodySchema,
  testimonialQuerySchema,
  updateTestimonialBodySchema,
} from "./schemas";

const testimonialRoutes: FastifyPluginAsyncTypebox = async (app) => {
  app.post("", {
    preHandler: authenticateAdmin,
    schema: {
      tags: ["Testimonials"],
      summary: "Create a testimonial",
      security: [{ accessToken: [] }],
      body: createTestimonialBodySchema,
    },
    handler: handleCreateTestimonial,
  });
  app.get("", {
    schema: {
      tags: ["Testimonials"],
      summary: "List testimonials",
      querystring: testimonialQuerySchema,
    },
    handler: handleGetTestimonials,
  });
  app.get("/:id", {
    schema: {
      tags: ["Testimonials"],
      summary: "Get a testimonial",
      params: idParamsSchema,
    },
    handler: handleGetTestimonialById,
  });
  app.put("", {
    preHandler: authenticateAdmin,
    schema: {
      tags: ["Testimonials"],
      summary: "Update a testimonial",
      security: [{ accessToken: [] }],
      body: updateTestimonialBodySchema,
    },
    handler: handleUpdateTestimonial,
  });
  app.delete("/:id", {
    preHandler: authenticateAdmin,
    schema: {
      tags: ["Testimonials"],
      summary: "Delete a testimonial",
      security: [{ accessToken: [] }],
      params: idParamsSchema,
    },
    handler: handleDeleteTestimonial,
  });
};

export default testimonialRoutes;
