"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../../utils/auth");
const schemas_1 = require("../schemas");
const handlers_1 = require("./handlers");
const schemas_2 = require("./schemas");
const testimonialRoutes = async (app) => {
    app.post("", {
        preHandler: auth_1.authenticateAdmin,
        schema: {
            tags: ["Testimonials"],
            summary: "Create a testimonial",
            security: [{ accessToken: [] }],
            body: schemas_2.createTestimonialBodySchema,
        },
        handler: handlers_1.handleCreateTestimonial,
    });
    app.get("", {
        schema: {
            tags: ["Testimonials"],
            summary: "List testimonials",
            querystring: schemas_2.testimonialQuerySchema,
        },
        handler: handlers_1.handleGetTestimonials,
    });
    app.get("/:id", {
        schema: {
            tags: ["Testimonials"],
            summary: "Get a testimonial",
            params: schemas_1.idParamsSchema,
        },
        handler: handlers_1.handleGetTestimonialById,
    });
    app.put("", {
        preHandler: auth_1.authenticateAdmin,
        schema: {
            tags: ["Testimonials"],
            summary: "Update a testimonial",
            security: [{ accessToken: [] }],
            body: schemas_2.updateTestimonialBodySchema,
        },
        handler: handlers_1.handleUpdateTestimonial,
    });
    app.delete("/:id", {
        preHandler: auth_1.authenticateAdmin,
        schema: {
            tags: ["Testimonials"],
            summary: "Delete a testimonial",
            security: [{ accessToken: [] }],
            params: schemas_1.idParamsSchema,
        },
        handler: handlers_1.handleDeleteTestimonial,
    });
};
exports.default = testimonialRoutes;
