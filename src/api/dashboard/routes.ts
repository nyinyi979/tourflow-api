import { FastifyInstance } from "fastify";
import { authenticateAdmin } from "../../utils/auth";
import { handleGetDashboard } from "./handlers";
export default async function dashboardRoutes(app: FastifyInstance) {
  app.get(
    "",
    {
      preHandler: authenticateAdmin,
      schema: {
        tags: ["Dashboard"],
        summary: "Get dashboard statistics",
        security: [{ accessToken: [] }],
      },
    },
    handleGetDashboard,
  );
}
