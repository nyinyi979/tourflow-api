"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingQuerySchema = exports.updateBookingBodySchema = exports.createBookingBodySchema = exports.bookingItemTypeSchema = exports.bookingStatusSchema = void 0;
const type_provider_typebox_1 = require("@fastify/type-provider-typebox");
const schemas_1 = require("../schemas");
exports.bookingStatusSchema = type_provider_typebox_1.Type.Union([
    type_provider_typebox_1.Type.Literal("pending"),
    type_provider_typebox_1.Type.Literal("confirmed"),
    type_provider_typebox_1.Type.Literal("cancelled"),
    type_provider_typebox_1.Type.Literal("completed"),
]);
exports.bookingItemTypeSchema = type_provider_typebox_1.Type.Union([
    type_provider_typebox_1.Type.Literal("tour"),
    type_provider_typebox_1.Type.Literal("activity"),
]);
const bookingFields = {
    travelDate: type_provider_typebox_1.Type.String({ format: "date" }),
    adults: type_provider_typebox_1.Type.Integer({ minimum: 1 }),
    children: type_provider_typebox_1.Type.Optional(type_provider_typebox_1.Type.Integer({ minimum: 0 })),
};
exports.createBookingBodySchema = type_provider_typebox_1.Type.Union([
    type_provider_typebox_1.Type.Object({
        itemType: type_provider_typebox_1.Type.Literal("tour"),
        tourId: schemas_1.uuidSchema,
        activityId: type_provider_typebox_1.Type.Optional(type_provider_typebox_1.Type.Null()),
        ...bookingFields,
    }),
    type_provider_typebox_1.Type.Object({
        itemType: type_provider_typebox_1.Type.Literal("activity"),
        activityId: schemas_1.uuidSchema,
        tourId: type_provider_typebox_1.Type.Optional(type_provider_typebox_1.Type.Null()),
        ...bookingFields,
    }),
]);
exports.updateBookingBodySchema = type_provider_typebox_1.Type.Partial(type_provider_typebox_1.Type.Object({
    travelDate: bookingFields.travelDate,
    adults: bookingFields.adults,
    children: type_provider_typebox_1.Type.Integer({ minimum: 0 }),
    status: exports.bookingStatusSchema,
}), { minProperties: 1 });
exports.bookingQuerySchema = type_provider_typebox_1.Type.Object({
    ...schemas_1.paginationProperties,
    query: type_provider_typebox_1.Type.Optional(type_provider_typebox_1.Type.String()),
    status: type_provider_typebox_1.Type.Optional(exports.bookingStatusSchema),
    itemType: type_provider_typebox_1.Type.Optional(exports.bookingItemTypeSchema),
    sortBy: type_provider_typebox_1.Type.Optional(type_provider_typebox_1.Type.Union([
        type_provider_typebox_1.Type.Literal("bookingNumber"),
        type_provider_typebox_1.Type.Literal("travelDate"),
        type_provider_typebox_1.Type.Literal("totalPrice"),
        type_provider_typebox_1.Type.Literal("status"),
        type_provider_typebox_1.Type.Literal("createdAt"),
    ])),
    orderBy: type_provider_typebox_1.Type.Optional(schemas_1.orderBySchema),
});
