"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activityQuerySchema = exports.updateActivityBodySchema = exports.createActivityBodySchema = exports.activityLabelSchema = exports.activityImageSchema = void 0;
const type_provider_typebox_1 = require("@fastify/type-provider-typebox");
const schemas_1 = require("../schemas");
exports.activityImageSchema = type_provider_typebox_1.Type.Object({
    id: type_provider_typebox_1.Type.Optional(schemas_1.uuidSchema),
    url: type_provider_typebox_1.Type.String({ maxLength: 2048 }),
});
exports.activityLabelSchema = type_provider_typebox_1.Type.Object({
    id: type_provider_typebox_1.Type.Optional(schemas_1.uuidSchema),
    label: type_provider_typebox_1.Type.String({ minLength: 1 }),
});
const activityFields = {
    slug: type_provider_typebox_1.Type.String({ minLength: 1, maxLength: 100 }),
    title: type_provider_typebox_1.Type.String({ minLength: 1, maxLength: 255 }),
    description: type_provider_typebox_1.Type.String({ minLength: 1 }),
    longDescription: type_provider_typebox_1.Type.Union([type_provider_typebox_1.Type.String(), type_provider_typebox_1.Type.Null()]),
    price: type_provider_typebox_1.Type.Number({ minimum: 0 }),
    duration: type_provider_typebox_1.Type.Integer({ minimum: 1 }),
    categoryId: schemas_1.uuidSchema,
    rating: type_provider_typebox_1.Type.Number({ minimum: 0, maximum: 5 }),
    meetingPoint: type_provider_typebox_1.Type.Union([type_provider_typebox_1.Type.String(), type_provider_typebox_1.Type.Null()]),
    images: type_provider_typebox_1.Type.Array(exports.activityImageSchema),
    highlights: type_provider_typebox_1.Type.Array(exports.activityLabelSchema),
    included: type_provider_typebox_1.Type.Array(exports.activityLabelSchema),
    removedImageUrls: schemas_1.removedImageUrlsSchema,
};
exports.createActivityBodySchema = type_provider_typebox_1.Type.Object({
    slug: activityFields.slug,
    title: activityFields.title,
    description: activityFields.description,
    price: activityFields.price,
    duration: activityFields.duration,
    categoryId: activityFields.categoryId,
    longDescription: type_provider_typebox_1.Type.Optional(activityFields.longDescription),
    rating: type_provider_typebox_1.Type.Optional(activityFields.rating),
    meetingPoint: type_provider_typebox_1.Type.Optional(activityFields.meetingPoint),
    images: type_provider_typebox_1.Type.Optional(activityFields.images),
    highlights: type_provider_typebox_1.Type.Optional(activityFields.highlights),
    included: type_provider_typebox_1.Type.Optional(activityFields.included),
    removedImageUrls: type_provider_typebox_1.Type.Optional(activityFields.removedImageUrls),
});
exports.updateActivityBodySchema = type_provider_typebox_1.Type.Object({
    id: schemas_1.idParamsSchema.properties.id,
    ...type_provider_typebox_1.Type.Partial(type_provider_typebox_1.Type.Object(activityFields)).properties,
}, { minProperties: 2 });
exports.activityQuerySchema = type_provider_typebox_1.Type.Object({
    ...schemas_1.paginationProperties,
    query: type_provider_typebox_1.Type.Optional(type_provider_typebox_1.Type.String()),
    categoryId: type_provider_typebox_1.Type.Optional(schemas_1.uuidSchema),
    sortBy: type_provider_typebox_1.Type.Optional(type_provider_typebox_1.Type.Union([
        type_provider_typebox_1.Type.Literal("title"),
        type_provider_typebox_1.Type.Literal("price"),
        type_provider_typebox_1.Type.Literal("duration"),
        type_provider_typebox_1.Type.Literal("rating"),
        type_provider_typebox_1.Type.Literal("createdAt"),
    ])),
    orderBy: type_provider_typebox_1.Type.Optional(schemas_1.orderBySchema),
});
