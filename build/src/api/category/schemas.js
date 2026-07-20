"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allCategoryQuerySchema = exports.categoryQuerySchema = exports.updateCategoryBodySchema = exports.createCategoryBodySchema = exports.categoryTypeSchema = void 0;
const type_provider_typebox_1 = require("@fastify/type-provider-typebox");
const schemas_1 = require("../schemas");
exports.categoryTypeSchema = type_provider_typebox_1.Type.Union([
    type_provider_typebox_1.Type.Literal("tour"),
    type_provider_typebox_1.Type.Literal("activity"),
]);
const categoryFields = {
    slug: type_provider_typebox_1.Type.String({ minLength: 1, maxLength: 100 }),
    label: type_provider_typebox_1.Type.String({ minLength: 1, maxLength: 100 }),
    image: schemas_1.nullableUrlSchema,
    type: exports.categoryTypeSchema,
    removedImageUrls: schemas_1.removedImageUrlsSchema,
};
exports.createCategoryBodySchema = type_provider_typebox_1.Type.Object({
    slug: categoryFields.slug,
    label: categoryFields.label,
    type: categoryFields.type,
    image: type_provider_typebox_1.Type.Optional(categoryFields.image),
    removedImageUrls: type_provider_typebox_1.Type.Optional(categoryFields.removedImageUrls),
});
exports.updateCategoryBodySchema = type_provider_typebox_1.Type.Object({
    id: schemas_1.idParamsSchema.properties.id,
    ...type_provider_typebox_1.Type.Partial(type_provider_typebox_1.Type.Object(categoryFields)).properties,
}, { minProperties: 2 });
exports.categoryQuerySchema = type_provider_typebox_1.Type.Object({
    ...schemas_1.paginationProperties,
    query: type_provider_typebox_1.Type.Optional(type_provider_typebox_1.Type.String()),
    type: type_provider_typebox_1.Type.Optional(exports.categoryTypeSchema),
    sortBy: type_provider_typebox_1.Type.Optional(type_provider_typebox_1.Type.Union([
        type_provider_typebox_1.Type.Literal("slug"),
        type_provider_typebox_1.Type.Literal("label"),
        type_provider_typebox_1.Type.Literal("type"),
    ])),
    orderBy: type_provider_typebox_1.Type.Optional(schemas_1.orderBySchema),
});
exports.allCategoryQuerySchema = type_provider_typebox_1.Type.Object({ type: exports.categoryTypeSchema });
