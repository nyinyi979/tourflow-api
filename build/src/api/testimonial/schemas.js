"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testimonialQuerySchema = exports.updateTestimonialBodySchema = exports.createTestimonialBodySchema = void 0;
const type_provider_typebox_1 = require("@fastify/type-provider-typebox");
const schemas_1 = require("../schemas");
const testimonialFields = {
    name: type_provider_typebox_1.Type.String({ minLength: 1, maxLength: 150 }),
    avatar: schemas_1.nullableUrlSchema,
    quote: type_provider_typebox_1.Type.String({ minLength: 1 }),
    rating: type_provider_typebox_1.Type.Integer({ minimum: 1, maximum: 5 }),
    removedImageUrls: schemas_1.removedImageUrlsSchema,
};
exports.createTestimonialBodySchema = type_provider_typebox_1.Type.Object({
    name: testimonialFields.name,
    quote: testimonialFields.quote,
    rating: testimonialFields.rating,
    avatar: type_provider_typebox_1.Type.Optional(testimonialFields.avatar),
    removedImageUrls: type_provider_typebox_1.Type.Optional(testimonialFields.removedImageUrls),
});
exports.updateTestimonialBodySchema = type_provider_typebox_1.Type.Object({
    id: schemas_1.idParamsSchema.properties.id,
    ...type_provider_typebox_1.Type.Partial(type_provider_typebox_1.Type.Object(testimonialFields)).properties,
}, { minProperties: 2 });
exports.testimonialQuerySchema = type_provider_typebox_1.Type.Object({
    ...schemas_1.paginationProperties,
    query: type_provider_typebox_1.Type.Optional(type_provider_typebox_1.Type.String()),
    sortBy: type_provider_typebox_1.Type.Optional(type_provider_typebox_1.Type.Union([
        type_provider_typebox_1.Type.Literal("name"),
        type_provider_typebox_1.Type.Literal("rating"),
        type_provider_typebox_1.Type.Literal("createdAt"),
    ])),
    orderBy: type_provider_typebox_1.Type.Optional(schemas_1.orderBySchema),
});
