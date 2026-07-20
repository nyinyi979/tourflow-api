"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = tourRoutes;
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
        difficulty: { type: "string" },
        sortBy: {
            type: "string",
            enum: ["title", "price", "duration", "rating", "popularity", "createdAt"],
        },
        orderBy: { type: "string", enum: ["asc", "desc"] },
    },
};
const tourProperties = {
    id: { type: "string", format: "uuid" },
    slug: { type: "string", minLength: 1, maxLength: 100 },
    title: { type: "string", minLength: 1, maxLength: 255 },
    description: { type: "string", minLength: 1 },
    price: { type: "number", minimum: 0 },
    duration: { type: "integer", minimum: 1 },
    difficulty: { type: "string", minLength: 1, maxLength: 50 },
    categoryId: { type: "string", format: "uuid" },
    capacity: { type: "integer", minimum: 1 },
    rating: { type: "number", minimum: 0, maximum: 5 },
    reviewCount: { type: "integer", minimum: 0 },
    popularity: { type: "integer", minimum: 0 },
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
    itinerary: {
        type: "array",
        items: {
            type: "object",
            required: ["day", "title", "description"],
            properties: {
                id: { type: "string", format: "uuid" },
                day: { type: "integer", minimum: 1 },
                title: { type: "string", minLength: 1, maxLength: 255 },
                description: { type: "string", minLength: 1 },
            },
        },
    },
    removedImageUrls: {
        type: "array",
        items: { anyOf: [{ type: "string" }, { type: "null" }] },
    },
};
async function tourRoutes(app) {
    app.post("", {
        preHandler: auth_1.authenticateAdmin,
        schema: {
            tags: ["Tours"],
            summary: "Create a tour",
            security: [{ accessToken: [] }],
            body: {
                type: "object",
                required: [
                    "slug",
                    "title",
                    "description",
                    "price",
                    "duration",
                    "difficulty",
                    "categoryId",
                    "capacity",
                ],
                properties: tourProperties,
            },
        },
    }, handlers_1.handleCreateTour);
    app.get("", { schema: { tags: ["Tours"], summary: "List tours", querystring } }, handlers_1.handleGetTours);
    app.get("/:id", { schema: { tags: ["Tours"], summary: "Get a tour", params: idParams } }, handlers_1.handleGetTourById);
    app.put("", {
        preHandler: auth_1.authenticateAdmin,
        schema: {
            tags: ["Tours"],
            summary: "Update a tour",
            security: [{ accessToken: [] }],
            body: {
                type: "object",
                required: ["id"],
                minProperties: 2,
                properties: tourProperties,
            },
        },
    }, handlers_1.handleUpdateTour);
    app.delete("/:id", {
        preHandler: auth_1.authenticateAdmin,
        schema: {
            tags: ["Tours"],
            summary: "Delete a tour",
            security: [{ accessToken: [] }],
            params: idParams,
        },
    }, handlers_1.handleDeleteTour);
}
