"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerQuerySchema = exports.customerUpdateBodySchema = exports.customerLoginBodySchema = exports.customerSignupBodySchema = void 0;
const type_provider_typebox_1 = require("@fastify/type-provider-typebox");
const schemas_1 = require("../schemas");
const customerFields = {
    name: type_provider_typebox_1.Type.String({ minLength: 1, maxLength: 150 }),
    email: type_provider_typebox_1.Type.String({ format: "email", maxLength: 255 }),
    password: type_provider_typebox_1.Type.String({ minLength: 8, maxLength: 255 }),
    avatar: schemas_1.nullableUrlSchema,
    removedImageUrls: schemas_1.removedImageUrlsSchema,
};
exports.customerSignupBodySchema = type_provider_typebox_1.Type.Object({
    name: customerFields.name,
    email: customerFields.email,
    password: customerFields.password,
    avatar: type_provider_typebox_1.Type.Optional(customerFields.avatar),
    removedImageUrls: type_provider_typebox_1.Type.Optional(customerFields.removedImageUrls),
});
exports.customerLoginBodySchema = type_provider_typebox_1.Type.Object({
    email: customerFields.email,
    password: type_provider_typebox_1.Type.String({ minLength: 1, maxLength: 255 }),
});
exports.customerUpdateBodySchema = type_provider_typebox_1.Type.Partial(type_provider_typebox_1.Type.Object(customerFields), { minProperties: 1 });
exports.customerQuerySchema = type_provider_typebox_1.Type.Object({
    ...schemas_1.paginationProperties,
    query: type_provider_typebox_1.Type.Optional(type_provider_typebox_1.Type.String()),
    sortBy: type_provider_typebox_1.Type.Optional(type_provider_typebox_1.Type.Union([
        type_provider_typebox_1.Type.Literal("name"),
        type_provider_typebox_1.Type.Literal("email"),
        type_provider_typebox_1.Type.Literal("registeredAt"),
        type_provider_typebox_1.Type.Literal("createdAt"),
        type_provider_typebox_1.Type.Literal("updatedAt"),
    ])),
    orderBy: type_provider_typebox_1.Type.Optional(schemas_1.orderBySchema),
});
