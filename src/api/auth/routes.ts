import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { authenticateAdmin } from "../../utils/auth";
import {
  handleDeleteAdmin,
  handleGetUserById,
  handleGetUserByToken,
  handleGetUsers,
  handleLogin,
  handleUpdateUser,
} from "./handlers";
import { loginBodySchema, updateUserBodySchema } from "./schemas";
import { idParamsSchema, paginationQuerySchema } from "../schemas";

const authRoutes: FastifyPluginAsyncTypebox = async (app) => {
  app.post(
    "/login",
    {
      schema: {
        tags: ["Authentication"],
        summary: "Log in",
        body: loginBodySchema,
      },
    },
    handleLogin,
  );
  app.get(
    "",
    {
      preHandler: authenticateAdmin,
      schema: {
        tags: ["Authentication"],
        summary: "List users",
        security: [{ accessToken: [] }],
        querystring: paginationQuerySchema,
      },
    },
    handleGetUsers,
  );
  app.get(
    "/:id",
    {
      preHandler: authenticateAdmin,
      schema: {
        tags: ["Authentication"],
        summary: "Get a user by ID",
        security: [{ accessToken: [] }],
        params: idParamsSchema,
      },
    },
    handleGetUserById,
  );
  app.post(
    "/me",
    {
      schema: {
        tags: ["Authentication"],
        summary: "Get the current user",
        security: [{ accessToken: [] }],
      },
    },
    handleGetUserByToken,
  );
  app.put(
    "/",
    {
      preHandler: authenticateAdmin,
      schema: {
        tags: ["Authentication"],
        summary: "Update a user",
        security: [{ accessToken: [] }],
        body: updateUserBodySchema,
      },
    },
    handleUpdateUser,
  );
  app.delete(
    "/:id",
    {
      preHandler: authenticateAdmin,
      schema: {
        tags: ["Authentication"],
        summary: "Delete a user",
        security: [{ accessToken: [] }],
        params: idParamsSchema,
      },
    },
    handleDeleteAdmin,
  );
};

export default authRoutes;
