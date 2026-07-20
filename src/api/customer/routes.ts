import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { authenticateAdmin } from "../../utils/auth";
import {
  handleCustomerLogin,
  handleCustomerSignup,
  handleDeleteCustomer,
  handleGetCustomerByToken,
  handleGetCustomers,
  handleUpdateCustomer,
} from "./handlers";
import {
  customerLoginBodySchema,
  customerQuerySchema,
  customerSignupBodySchema,
  customerUpdateBodySchema,
} from "./schemas";

const customerRoutes: FastifyPluginAsyncTypebox = async (app) => {
  app.post(
    "/signup",
    {
      schema: {
        tags: ["Customers"],
        summary: "Create a customer account",
        body: customerSignupBodySchema,
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
        body: customerLoginBodySchema,
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
        querystring: customerQuerySchema,
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
        body: customerUpdateBodySchema,
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
};

export default customerRoutes;
