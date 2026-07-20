"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../../utils/auth");
const schemas_1 = require("../schemas");
const handlers_1 = require("./handlers");
const schemas_2 = require("./schemas");
const reviewRoutes = async (app) => {
    app.post("", {
        schema: {
            tags: ["Reviews"],
            summary: "Create a review",
            security: [{ accessToken: [] }],
            body: schemas_2.createReviewBodySchema,
        },
        handler: handlers_1.handleCreateReview,
    });
    app.get("", {
        schema: {
            tags: ["Reviews"],
            summary: "List published reviews",
            querystring: schemas_2.reviewQuerySchema,
        },
        handler: handlers_1.handleGetPublishedReviews,
    });
    app.get("/admin", {
        preHandler: auth_1.authenticateAdmin,
        schema: {
            tags: ["Reviews"],
            summary: "List all reviews",
            security: [{ accessToken: [] }],
            querystring: schemas_2.reviewQuerySchema,
        },
        handler: handlers_1.handleGetAdminReviews,
    });
    app.get("/:id", {
        schema: {
            tags: ["Reviews"],
            summary: "Get a review",
            params: schemas_1.idParamsSchema,
        },
        handler: handlers_1.handleGetReviewById,
    });
    app.put("", {
        preHandler: auth_1.authenticateAdmin,
        schema: {
            tags: ["Reviews"],
            summary: "Update a review",
            security: [{ accessToken: [] }],
            body: schemas_2.updateReviewBodySchema,
        },
        handler: handlers_1.handleUpdateReview,
    });
    app.delete("/:id", {
        preHandler: auth_1.authenticateAdmin,
        schema: {
            tags: ["Reviews"],
            summary: "Delete a review",
            security: [{ accessToken: [] }],
            params: schemas_1.idParamsSchema,
        },
        handler: handlers_1.handleDeleteReview,
    });
};
exports.default = reviewRoutes;
