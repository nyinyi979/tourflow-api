"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = activityRoutes;
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
        categoryId: { type: "string", format: "uuid" },
        sortBy: {
            type: "string",
            enum: ["title", "price", "duration", "rating", "createdAt"],
        },
        orderBy: { type: "string", enum: ["asc", "desc"] },
    },
};
const activityProperties = {
    id: { type: "string", format: "uuid" },
    slug: { type: "string", minLength: 1, maxLength: 100 },
    title: { type: "string", minLength: 1, maxLength: 255 },
    description: { type: "string", minLength: 1 },
    longDescription: { anyOf: [{ type: "string" }, { type: "null" }] },
    price: { type: "number", minimum: 0 },
    duration: { type: "integer", minimum: 1 },
    categoryId: { type: "string", format: "uuid" },
    rating: { type: "number", minimum: 0, maximum: 5 },
    meetingPoint: { anyOf: [{ type: "string" }, { type: "null" }] },
    images: {
        type: "array",
        items: {
            type: "object",
            required: ["url"],
            properties: {
                id: { type: "string", format: "uuid" },
                url: { type: "string", maxLength: 2048 },
            },
        },
    },
    highlights: {
        type: "array",
        items: {
            type: "object",
            required: ["label"],
            properties: {
                id: { type: "string", format: "uuid" },
                label: { type: "string", minLength: 1 },
            },
        },
    },
    included: {
        type: "array",
        items: {
            type: "object",
            required: ["label"],
            properties: {
                id: { type: "string", format: "uuid" },
                label: { type: "string", minLength: 1 },
            },
        },
    },
    removedImageUrls: {
        type: "array",
        items: { anyOf: [{ type: "string" }, { type: "null" }] },
    },
};
async function activityRoutes(app) {
    app.post("", {
        preHandler: auth_1.authenticateAdmin,
        schema: {
            tags: ["Activities"],
            summary: "Create an activity",
            security: [{ accessToken: [] }],
            body: {
                type: "object",
                required: [
                    "slug",
                    "title",
                    "description",
                    "price",
                    "duration",
                    "categoryId",
                ],
                properties: activityProperties,
            },
        },
    }, handlers_1.handleCreateActivity);
    app.get("", {
        schema: { tags: ["Activities"], summary: "List activities", querystring },
    }, handlers_1.handleGetActivities);
    app.get("/:id", {
        schema: {
            tags: ["Activities"],
            summary: "Get an activity",
            params: idParams,
        },
    }, handlers_1.handleGetActivityById);
    app.put("", {
        preHandler: auth_1.authenticateAdmin,
        schema: {
            tags: ["Activities"],
            summary: "Update an activity",
            security: [{ accessToken: [] }],
            body: {
                type: "object",
                required: ["id"],
                minProperties: 2,
                properties: activityProperties,
            },
        },
    }, handlers_1.handleUpdateActivity);
    app.delete("/:id", {
        preHandler: auth_1.authenticateAdmin,
        schema: {
            tags: ["Activities"],
            summary: "Delete an activity",
            security: [{ accessToken: [] }],
            params: idParams,
        },
    }, handlers_1.handleDeleteActivity);
}
