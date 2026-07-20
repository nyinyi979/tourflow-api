import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { authenticateAdmin } from "../../utils/auth";
import { idParamsSchema } from "../schemas";
import {
  handleCreateTour,
  handleDeleteTour,
  handleGetTourById,
  handleGetTours,
  handleUpdateTour,
} from "./handlers";
import {
  createTourBodySchema,
  tourQuerySchema,
  updateTourBodySchema,
} from "./schemas";

const tourRoutes: FastifyPluginAsyncTypebox = async (app) => {
  app.post("", {
    preHandler: authenticateAdmin,
    schema: {
      tags: ["Tours"],
      summary: "Create a tour",
      security: [{ accessToken: [] }],
      body: createTourBodySchema,
    },
    handler: handleCreateTour,
  });
  app.get("", {
    schema: {
      tags: ["Tours"],
      summary: "List tours",
      querystring: tourQuerySchema,
    },
    handler: handleGetTours,
  });
  app.get("/:id", {
    schema: {
      tags: ["Tours"],
      summary: "Get a tour",
      params: idParamsSchema,
    },
    handler: handleGetTourById,
  });
  app.put("", {
    preHandler: authenticateAdmin,
    schema: {
      tags: ["Tours"],
      summary: "Update a tour",
      security: [{ accessToken: [] }],
      body: updateTourBodySchema,
    },
    handler: handleUpdateTour,
  });
  app.delete("/:id", {
    preHandler: authenticateAdmin,
    schema: {
      tags: ["Tours"],
      summary: "Delete a tour",
      security: [{ accessToken: [] }],
      params: idParamsSchema,
    },
    handler: handleDeleteTour,
  });
};

export default tourRoutes;
