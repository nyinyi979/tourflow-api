import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { authenticateAdmin } from "../../utils/auth";
import { handleGetDashboard } from "./handlers";

const dashboardRoutes: FastifyPluginAsyncTypebox = async (app) => {
  app.get("", {
    preHandler: authenticateAdmin,
    schema: {
      tags: ["Dashboard"],
      summary: "Get dashboard statistics",
      security: [{ accessToken: [] }],
    },
    handler: handleGetDashboard,
  });
};

export default dashboardRoutes;
