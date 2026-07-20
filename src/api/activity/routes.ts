import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { authenticateAdmin } from "../../utils/auth";
import { idParamsSchema } from "../schemas";
import {
  handleCreateActivity,
  handleDeleteActivity,
  handleGetActivities,
  handleGetActivityById,
  handleUpdateActivity,
} from "./handlers";
import {
  activityQuerySchema,
  createActivityBodySchema,
  updateActivityBodySchema,
} from "./schemas";

const activityRoutes: FastifyPluginAsyncTypebox = async (app) => {
  app.post("", {
    preHandler: authenticateAdmin,
    schema: {
      tags: ["Activities"],
      summary: "Create an activity",
      security: [{ accessToken: [] }],
      body: createActivityBodySchema,
    },
    handler: handleCreateActivity,
  });
  app.get("", {
    schema: {
      tags: ["Activities"],
      summary: "List activities",
      querystring: activityQuerySchema,
    },
    handler: handleGetActivities,
  });
  app.get("/:id", {
    schema: {
      tags: ["Activities"],
      summary: "Get an activity",
      params: idParamsSchema,
    },
    handler: handleGetActivityById,
  });
  app.put("", {
    preHandler: authenticateAdmin,
    schema: {
      tags: ["Activities"],
      summary: "Update an activity",
      security: [{ accessToken: [] }],
      body: updateActivityBodySchema,
    },
    handler: handleUpdateActivity,
  });
  app.delete("/:id", {
    preHandler: authenticateAdmin,
    schema: {
      tags: ["Activities"],
      summary: "Delete an activity",
      security: [{ accessToken: [] }],
      params: idParamsSchema,
    },
    handler: handleDeleteActivity,
  });
};

export default activityRoutes;
