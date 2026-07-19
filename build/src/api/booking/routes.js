"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = bookingRoutes;
const auth_1 = require("../../utils/auth");
const handlers_1 = require("./handlers");
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
async function bookingRoutes(app) {
    app.post("", {
        schema: {
            tags: ["Bookings"],
            summary: "Create a booking",
            security: [{ accessToken: [] }],
            body: bookingCreateBody,
        },
    }, handlers_1.handleCreateBooking);
    app.get("", {
        preHandler: auth_1.authenticateAdmin,
        schema: {
            tags: ["Bookings"],
            summary: "List bookings",
            security: [{ accessToken: [] }],
            querystring,
        },
    }, handlers_1.handleGetBookings);
    app.get("/mine", {
        schema: {
            tags: ["Bookings"],
            summary: "List my bookings",
            security: [{ accessToken: [] }],
            querystring,
        },
    }, handlers_1.handleGetMyBookings);
    app.get("/:id", {
        schema: {
            tags: ["Bookings"],
            summary: "Get a booking",
            security: [{ accessToken: [] }],
            params: idParams,
        },
    }, handlers_1.handleGetBookingById);
    app.put("/:id", {
        schema: {
            tags: ["Bookings"],
            summary: "Update a booking",
            security: [{ accessToken: [] }],
            params: idParams,
            body: bookingUpdateBody,
        },
    }, handlers_1.handleUpdateBooking);
    app.delete("/:id", {
        schema: {
            tags: ["Bookings"],
            summary: "Delete a booking",
            security: [{ accessToken: [] }],
            params: idParams,
        },
    }, handlers_1.handleDeleteBooking);
}
