"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = testimonialRoutes;
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
        sortBy: { type: "string", enum: ["name", "rating", "createdAt"] },
        orderBy: { type: "string", enum: ["asc", "desc"] },
    },
};
const testimonialProperties = {
    id: { type: "string", format: "uuid" },
    name: { type: "string", minLength: 1, maxLength: 150 },
    avatar: {
        anyOf: [{ type: "string", maxLength: 2048 }, { type: "null" }],
    },
    quote: { type: "string", minLength: 1 },
    rating: { type: "integer", minimum: 1, maximum: 5 },
    removedImageUrls: {
        type: "array",
        items: { anyOf: [{ type: "string" }, { type: "null" }] },
    },
};
async function testimonialRoutes(app) {
    app.post("", {
        preHandler: auth_1.authenticateAdmin,
        schema: {
            tags: ["Testimonials"],
            summary: "Create a testimonial",
            security: [{ accessToken: [] }],
            body: {
                type: "object",
                required: ["name", "quote", "rating"],
                properties: testimonialProperties,
            },
        },
    }, handlers_1.handleCreateTestimonial);
    app.get("", {
        schema: {
            tags: ["Testimonials"],
            summary: "List testimonials",
            querystring,
        },
    }, handlers_1.handleGetTestimonials);
    app.get("/:id", {
        schema: {
            tags: ["Testimonials"],
            summary: "Get a testimonial",
            params: idParams,
        },
    }, handlers_1.handleGetTestimonialById);
    app.put("", {
        preHandler: auth_1.authenticateAdmin,
        schema: {
            tags: ["Testimonials"],
            summary: "Update a testimonial",
            security: [{ accessToken: [] }],
            body: {
                type: "object",
                required: ["id"],
                minProperties: 2,
                properties: testimonialProperties,
            },
        },
    }, handlers_1.handleUpdateTestimonial);
    app.delete("/:id", {
        preHandler: auth_1.authenticateAdmin,
        schema: {
            tags: ["Testimonials"],
            summary: "Delete a testimonial",
            security: [{ accessToken: [] }],
            params: idParams,
        },
    }, handlers_1.handleDeleteTestimonial);
}
