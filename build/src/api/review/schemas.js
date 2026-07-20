"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewQuerySchema = exports.updateReviewBodySchema = exports.createReviewBodySchema = exports.reviewStatusSchema = void 0;
const type_provider_typebox_1 = require("@fastify/type-provider-typebox");
const schemas_1 = require("../schemas");
exports.reviewStatusSchema = type_provider_typebox_1.Type.Union([
    type_provider_typebox_1.Type.Literal("published"),
    type_provider_typebox_1.Type.Literal("hidden"),
]);
exports.createReviewBodySchema = type_provider_typebox_1.Type.Object({
    tourId: schemas_1.uuidSchema,
    rating: type_provider_typebox_1.Type.Integer({ minimum: 1, maximum: 5 }),
    comment: type_provider_typebox_1.Type.String({ minLength: 1 }),
});
exports.updateReviewBodySchema = type_provider_typebox_1.Type.Object({
    id: schemas_1.idParamsSchema.properties.id,
    ...type_provider_typebox_1.Type.Partial(type_provider_typebox_1.Type.Object({
        rating: type_provider_typebox_1.Type.Integer({ minimum: 1, maximum: 5 }),
        comment: type_provider_typebox_1.Type.String({ minLength: 1 }),
        status: exports.reviewStatusSchema,
    })).properties,
}, { minProperties: 2 });
exports.reviewQuerySchema = type_provider_typebox_1.Type.Object({
    ...schemas_1.paginationProperties,
    query: type_provider_typebox_1.Type.Optional(type_provider_typebox_1.Type.String()),
    tourId: type_provider_typebox_1.Type.Optional(schemas_1.uuidSchema),
    status: type_provider_typebox_1.Type.Optional(exports.reviewStatusSchema),
    sortBy: type_provider_typebox_1.Type.Optional(type_provider_typebox_1.Type.Union([
        type_provider_typebox_1.Type.Literal("rating"),
        type_provider_typebox_1.Type.Literal("reviewedAt"),
        type_provider_typebox_1.Type.Literal("status"),
        type_provider_typebox_1.Type.Literal("createdAt"),
    ])),
    orderBy: type_provider_typebox_1.Type.Optional(schemas_1.orderBySchema),
});
