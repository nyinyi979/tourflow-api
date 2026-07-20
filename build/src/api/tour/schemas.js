"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tourQuerySchema = exports.updateTourBodySchema = exports.createTourBodySchema = exports.itineraryDaySchema = exports.tourHighlightSchema = exports.tourImageSchema = void 0;
const type_provider_typebox_1 = require("@fastify/type-provider-typebox");
const schemas_1 = require("../schemas");
exports.tourImageSchema = type_provider_typebox_1.Type.Object({
    id: type_provider_typebox_1.Type.Optional(schemas_1.uuidSchema),
    url: type_provider_typebox_1.Type.String({ maxLength: 2048 }),
});
exports.tourHighlightSchema = type_provider_typebox_1.Type.Object({
    id: type_provider_typebox_1.Type.Optional(schemas_1.uuidSchema),
    label: type_provider_typebox_1.Type.String({ minLength: 1 }),
});
exports.itineraryDaySchema = type_provider_typebox_1.Type.Object({
    id: type_provider_typebox_1.Type.Optional(schemas_1.uuidSchema),
    day: type_provider_typebox_1.Type.Integer({ minimum: 1 }),
    title: type_provider_typebox_1.Type.String({ minLength: 1, maxLength: 255 }),
    description: type_provider_typebox_1.Type.String({ minLength: 1 }),
});
const tourFields = {
    slug: type_provider_typebox_1.Type.String({ minLength: 1, maxLength: 100 }),
    title: type_provider_typebox_1.Type.String({ minLength: 1, maxLength: 255 }),
    description: type_provider_typebox_1.Type.String({ minLength: 1 }),
    price: type_provider_typebox_1.Type.Number({ minimum: 0 }),
    duration: type_provider_typebox_1.Type.Integer({ minimum: 1 }),
    difficulty: type_provider_typebox_1.Type.String({ minLength: 1, maxLength: 50 }),
    categoryId: schemas_1.uuidSchema,
    capacity: type_provider_typebox_1.Type.Integer({ minimum: 1 }),
    rating: type_provider_typebox_1.Type.Number({ minimum: 0, maximum: 5 }),
    reviewCount: type_provider_typebox_1.Type.Integer({ minimum: 0 }),
    popularity: type_provider_typebox_1.Type.Integer({ minimum: 0 }),
    images: type_provider_typebox_1.Type.Array(exports.tourImageSchema),
    highlights: type_provider_typebox_1.Type.Array(exports.tourHighlightSchema),
    itinerary: type_provider_typebox_1.Type.Array(exports.itineraryDaySchema),
    removedImageUrls: schemas_1.removedImageUrlsSchema,
};
exports.createTourBodySchema = type_provider_typebox_1.Type.Object({
    slug: tourFields.slug,
    title: tourFields.title,
    description: tourFields.description,
    price: tourFields.price,
    duration: tourFields.duration,
    difficulty: tourFields.difficulty,
    categoryId: tourFields.categoryId,
    capacity: tourFields.capacity,
    rating: type_provider_typebox_1.Type.Optional(tourFields.rating),
    reviewCount: type_provider_typebox_1.Type.Optional(tourFields.reviewCount),
    popularity: type_provider_typebox_1.Type.Optional(tourFields.popularity),
    images: type_provider_typebox_1.Type.Optional(tourFields.images),
    highlights: type_provider_typebox_1.Type.Optional(tourFields.highlights),
    itinerary: type_provider_typebox_1.Type.Optional(tourFields.itinerary),
    removedImageUrls: type_provider_typebox_1.Type.Optional(tourFields.removedImageUrls),
});
exports.updateTourBodySchema = type_provider_typebox_1.Type.Object({
    id: schemas_1.idParamsSchema.properties.id,
    ...type_provider_typebox_1.Type.Partial(type_provider_typebox_1.Type.Object(tourFields)).properties,
}, { minProperties: 2 });
exports.tourQuerySchema = type_provider_typebox_1.Type.Object({
    ...schemas_1.paginationProperties,
    query: type_provider_typebox_1.Type.Optional(type_provider_typebox_1.Type.String()),
    categoryId: type_provider_typebox_1.Type.Optional(schemas_1.uuidSchema),
    difficulty: type_provider_typebox_1.Type.Optional(type_provider_typebox_1.Type.String()),
    sortBy: type_provider_typebox_1.Type.Optional(type_provider_typebox_1.Type.Union([
        type_provider_typebox_1.Type.Literal("title"),
        type_provider_typebox_1.Type.Literal("price"),
        type_provider_typebox_1.Type.Literal("duration"),
        type_provider_typebox_1.Type.Literal("rating"),
        type_provider_typebox_1.Type.Literal("popularity"),
        type_provider_typebox_1.Type.Literal("createdAt"),
    ])),
    orderBy: type_provider_typebox_1.Type.Optional(schemas_1.orderBySchema),
});
