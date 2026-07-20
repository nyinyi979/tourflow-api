import { FastifyInstance } from "fastify";
import {
  handleLogin,
  handleGetUsers,
  handleGetUserById,
  handleGetUserByToken,
  handleUpdateUser,
  handleDeleteAdmin,
} from "./handlers";
import { authenticateAdmin } from "../../utils/auth";

export default async function authRoutes(app: FastifyInstance) {
  app.post(
    "/login",
    {
      schema: {
        tags: ["Authentication"],
        summary: "Log in",
        body: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 1 },
          },
        },
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
        querystring: {
          type: "object",
          required: ["page", "perPage"],
          properties: {
            page: { type: "integer", minimum: 0 },
            perPage: { type: "integer", minimum: 1, maximum: 100 },
          },
        },
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
        params: {
          type: "object",
          required: ["id"],
          properties: { id: { type: "string", format: "uuid" } },
        },
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
        body: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string", format: "uuid" },
            username: { type: "string", minLength: 1, maxLength: 100 },
            email: { type: "string", format: "email", maxLength: 100 },
            password: {
              anyOf: [
                { type: "string", minLength: 8, maxLength: 255 },
                { type: "null" },
              ],
            },
            role: { type: "integer" },
          },
        },
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
        params: {
          type: "object",
          required: ["id"],
          properties: { id: { type: "string", format: "uuid" } },
        },
      },
    },
    handleDeleteAdmin,
  );
}
