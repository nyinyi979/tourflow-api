import { FastifyInstance } from "fastify";
import { authenticateAdmin } from "../../utils/auth";
import {
  handleCustomerSignup,
  handleCustomerLogin,
  handleGetCustomers,
  handleGetCustomerByToken,
  handleUpdateCustomer,
  handleDeleteCustomer,
} from "./handlers";

const customerBodyProperties = {
  name: { type: "string", minLength: 1, maxLength: 150 },
  email: { type: "string", format: "email", maxLength: 255 },
  password: { type: "string", minLength: 8, maxLength: 255 },
  avatar: {
    anyOf: [{ type: "string", maxLength: 2048 }, { type: "null" }],
  },
  removedImageUrls: {
    type: "array",
    items: { anyOf: [{ type: "string" }, { type: "null" }] },
  },
};

export default async function customerRoutes(app: FastifyInstance) {
  app.post(
    "/signup",
    {
      schema: {
        tags: ["Customers"],
        summary: "Create a customer account",
        body: {
          type: "object",
          required: ["name", "email", "password"],
          properties: customerBodyProperties,
        },
      },
    },
    handleCustomerSignup,
  );

  app.post(
    "/login",
    {
      schema: {
        tags: ["Customers"],
        summary: "Log in to a customer account",
        body: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: customerBodyProperties.email,
            password: { type: "string", minLength: 1, maxLength: 255 },
          },
        },
      },
    },
    handleCustomerLogin,
  );

  app.get(
    "",
    {
      preHandler: authenticateAdmin,
      schema: {
        tags: ["Customers"],
        summary: "List customers",
        security: [{ accessToken: [] }],
        querystring: {
          type: "object",
          required: ["page", "perPage"],
          properties: {
            page: { type: "integer", minimum: 0 },
            perPage: { type: "integer", minimum: 1, maximum: 100 },
            query: { type: "string" },
            sortBy: {
              type: "string",
              enum: ["name", "email", "registeredAt", "createdAt", "updatedAt"],
            },
            orderBy: { type: "string", enum: ["asc", "desc"] },
          },
        },
      },
    },
    handleGetCustomers,
  );

  app.get(
    "/me",
    {
      schema: {
        tags: ["Customers"],
        summary: "Get the current customer",
        security: [{ accessToken: [] }],
      },
    },
    handleGetCustomerByToken,
  );

  app.put(
    "/me",
    {
      schema: {
        tags: ["Customers"],
        summary: "Update the current customer",
        security: [{ accessToken: [] }],
        body: {
          type: "object",
          minProperties: 1,
          properties: customerBodyProperties,
        },
      },
    },
    handleUpdateCustomer,
  );

  app.delete(
    "/me",
    {
      schema: {
        tags: ["Customers"],
        summary: "Delete the current customer account",
        security: [{ accessToken: [] }],
      },
    },
    handleDeleteCustomer,
  );
}
