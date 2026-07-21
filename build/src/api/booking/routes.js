"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../../utils/auth");
const schemas_1 = require("../schemas");
const handlers_1 = require("./handlers");
const schemas_2 = require("./schemas");
const bookingRoutes = async (app) => {
    app.post("", {
        schema: {
            tags: ["Bookings"],
            summary: "Create a booking",
            security: [{ accessToken: [] }],
            body: schemas_2.createBookingBodySchema,
        },
        handler: handlers_1.handleCreateBooking,
    });
    app.get("", {
        preHandler: auth_1.authenticateAdmin,
        schema: {
            tags: ["Bookings"],
            summary: "List bookings",
            security: [{ accessToken: [] }],
            querystring: schemas_2.bookingQuerySchema,
        },
        handler: handlers_1.handleGetBookings,
    });
    app.get("/mine", {
        schema: {
            tags: ["Bookings"],
            summary: "List my bookings",
            security: [{ accessToken: [] }],
            querystring: schemas_2.bookingQuerySchema,
        },
        handler: handlers_1.handleGetMyBookings,
    });
    app.get("/:id", {
        schema: {
            tags: ["Bookings"],
            summary: "Get a booking",
            security: [{ accessToken: [] }],
            params: schemas_1.idParamsSchema,
        },
        handler: handlers_1.handleGetBookingById,
    });
    app.post("/:id/payment", {
        schema: {
            tags: ["Bookings"],
            summary: "Simulate a booking payment",
            security: [{ accessToken: [] }],
            params: schemas_1.idParamsSchema,
            body: schemas_2.payBookingBodySchema,
        },
        handler: handlers_1.handlePayBooking,
    });
    app.put("/:id", {
        schema: {
            tags: ["Bookings"],
            summary: "Update a booking",
            security: [{ accessToken: [] }],
            params: schemas_1.idParamsSchema,
            body: schemas_2.updateBookingBodySchema,
        },
        handler: handlers_1.handleUpdateBooking,
    });
    app.delete("/:id", {
        schema: {
            tags: ["Bookings"],
            summary: "Delete a booking",
            security: [{ accessToken: [] }],
            params: schemas_1.idParamsSchema,
        },
        handler: handlers_1.handleDeleteBooking,
    });
};
exports.default = bookingRoutes;
