import { FastifyInstance } from "fastify";
import { authenticateAdmin } from "../../utils/auth";
import {
  handleCreateBooking,
  handleGetBookingById,
  handleGetBookings,
  handleGetMyBookings,
  handleUpdateBooking,
  handleDeleteBooking,
} from "./handlers";
const idParams = {
  type: "object",
  required: ["id"],
  properties: { id: { type: "string", format: "uuid" } },
};
const querystring = {
  type: "object",
  required: ["page", "perPage"],
  properties: {
    page: { type: "integer", minimum: 0 },
    perPage: { type: "integer", minimum: 1, maximum: 100 },
    query: { type: "string" },
    status: {
      type: "string",
      enum: ["pending", "confirmed", "cancelled", "completed"],
    },
    itemType: { type: "string", enum: ["tour", "activity"] },
    sortBy: {
      type: "string",
      enum: [
        "bookingNumber",
        "travelDate",
        "totalPrice",
        "status",
        "createdAt",
      ],
    },
    orderBy: { type: "string", enum: ["asc", "desc"] },
  },
};
const bookingCreateBody = {
  type: "object",
  required: ["itemType", "travelDate", "adults"],
  properties: {
    itemType: { type: "string", enum: ["tour", "activity"] },
    tourId: { anyOf: [{ type: "string", format: "uuid" }, { type: "null" }] },
    activityId: {
      anyOf: [{ type: "string", format: "uuid" }, { type: "null" }],
    },
    travelDate: { type: "string", format: "date" },
    adults: { type: "integer", minimum: 1 },
    children: { type: "integer", minimum: 0, default: 0 },
  },
};
const bookingUpdateBody = {
  type: "object",
  minProperties: 1,
  properties: {
    travelDate: { type: "string", format: "date" },
    adults: { type: "integer", minimum: 1 },
    children: { type: "integer", minimum: 0 },
    status: {
      type: "string",
      enum: ["pending", "confirmed", "cancelled", "completed"],
    },
  },
};
export default async function bookingRoutes(app: FastifyInstance) {
  app.post(
    "",
    {
      schema: {
        tags: ["Bookings"],
        summary: "Create a booking",
        security: [{ accessToken: [] }],
        body: bookingCreateBody,
      },
    },
    handleCreateBooking,
  );
  app.get(
    "",
    {
      preHandler: authenticateAdmin,
      schema: {
        tags: ["Bookings"],
        summary: "List bookings",
        security: [{ accessToken: [] }],
        querystring,
      },
    },
    handleGetBookings,
  );
  app.get(
    "/mine",
    {
      schema: {
        tags: ["Bookings"],
        summary: "List my bookings",
        security: [{ accessToken: [] }],
        querystring,
      },
    },
    handleGetMyBookings,
  );
  app.get(
    "/:id",
    {
      schema: {
        tags: ["Bookings"],
        summary: "Get a booking",
        security: [{ accessToken: [] }],
        params: idParams,
      },
    },
    handleGetBookingById,
  );
  app.put(
    "/:id",
    {
      schema: {
        tags: ["Bookings"],
        summary: "Update a booking",
        security: [{ accessToken: [] }],
        params: idParams,
        body: bookingUpdateBody,
      },
    },
    handleUpdateBooking,
  );
  app.delete(
    "/:id",
    {
      schema: {
        tags: ["Bookings"],
        summary: "Delete a booking",
        security: [{ accessToken: [] }],
        params: idParams,
      },
    },
    handleDeleteBooking,
  );
}
