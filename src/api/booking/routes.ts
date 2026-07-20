import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { authenticateAdmin } from "../../utils/auth";
import { idParamsSchema } from "../schemas";
import {
  handleCreateBooking,
  handleDeleteBooking,
  handleGetBookingById,
  handleGetBookings,
  handleGetMyBookings,
  handleUpdateBooking,
} from "./handlers";
import {
  bookingQuerySchema,
  createBookingBodySchema,
  updateBookingBodySchema,
} from "./schemas";

const bookingRoutes: FastifyPluginAsyncTypebox = async (app) => {
  app.post("", {
    schema: {
      tags: ["Bookings"],
      summary: "Create a booking",
      security: [{ accessToken: [] }],
      body: createBookingBodySchema,
    },
    handler: handleCreateBooking,
  });
  app.get("", {
    preHandler: authenticateAdmin,
    schema: {
      tags: ["Bookings"],
      summary: "List bookings",
      security: [{ accessToken: [] }],
      querystring: bookingQuerySchema,
    },
    handler: handleGetBookings,
  });
  app.get("/mine", {
    schema: {
      tags: ["Bookings"],
      summary: "List my bookings",
      security: [{ accessToken: [] }],
      querystring: bookingQuerySchema,
    },
    handler: handleGetMyBookings,
  });
  app.get("/:id", {
    schema: {
      tags: ["Bookings"],
      summary: "Get a booking",
      security: [{ accessToken: [] }],
      params: idParamsSchema,
    },
    handler: handleGetBookingById,
  });
  app.put("/:id", {
    schema: {
      tags: ["Bookings"],
      summary: "Update a booking",
      security: [{ accessToken: [] }],
      params: idParamsSchema,
      body: updateBookingBodySchema,
    },
    handler: handleUpdateBooking,
  });
  app.delete("/:id", {
    schema: {
      tags: ["Bookings"],
      summary: "Delete a booking",
      security: [{ accessToken: [] }],
      params: idParamsSchema,
    },
    handler: handleDeleteBooking,
  });
};

export default bookingRoutes;
