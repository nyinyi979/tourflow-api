"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = reviewRoutes;
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
        tourId: { type: "string", format: "uuid" },
        status: { type: "string", enum: ["published", "hidden"] },
        sortBy: {
            type: "string",
            enum: ["rating", "reviewedAt", "status", "createdAt"],
        },
        orderBy: { type: "string", enum: ["asc", "desc"] },
    },
};
const reviewCreateBody = {
    type: "object",
    required: ["tourId", "rating", "comment"],
    properties: {
        tourId: { type: "string", format: "uuid" },
        rating: { type: "integer", minimum: 1, maximum: 5 },
        comment: { type: "string", minLength: 1 },
    },
};
const reviewUpdateBody = {
    type: "object",
    required: ["id"],
    minProperties: 2,
    properties: {
        id: { type: "string", format: "uuid" },
        rating: { type: "integer", minimum: 1, maximum: 5 },
        comment: { type: "string", minLength: 1 },
        status: { type: "string", enum: ["published", "hidden"] },
    },
};
async function reviewRoutes(app) {
    app.post("", {
        schema: {
            tags: ["Reviews"],
            summary: "Create a review",
            security: [{ accessToken: [] }],
            body: reviewCreateBody,
        },
    }, handlers_1.handleCreateReview);
    app.get("", {
        schema: {
            tags: ["Reviews"],
            summary: "List published reviews",
            querystring,
        },
    }, handlers_1.handleGetPublishedReviews);
    app.get("/admin", {
        preHandler: auth_1.authenticateAdmin,
        schema: {
            tags: ["Reviews"],
            summary: "List all reviews",
            security: [{ accessToken: [] }],
            querystring,
        },
    }, handlers_1.handleGetAdminReviews);
    app.get("/:id", {
        schema: { tags: ["Reviews"], summary: "Get a review", params: idParams },
    }, handlers_1.handleGetReviewById);
    app.put("", {
        preHandler: auth_1.authenticateAdmin,
        schema: {
            tags: ["Reviews"],
            summary: "Update a review",
            security: [{ accessToken: [] }],
            body: reviewUpdateBody,
        },
    }, handlers_1.handleUpdateReview);
    app.delete("/:id", {
        preHandler: auth_1.authenticateAdmin,
        schema: {
            tags: ["Reviews"],
            summary: "Delete a review",
            security: [{ accessToken: [] }],
            params: idParams,
        },
    }, handlers_1.handleDeleteReview);
}
