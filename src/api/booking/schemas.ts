import { Static, Type } from "@fastify/type-provider-typebox";
import { orderBySchema, paginationProperties, uuidSchema } from "../schemas";

export const bookingStatusSchema = Type.Union([
  Type.Literal("pending"),
  Type.Literal("confirmed"),
  Type.Literal("cancelled"),
  Type.Literal("completed"),
]);
export const bookingItemTypeSchema = Type.Union([
  Type.Literal("tour"),
  Type.Literal("activity"),
]);

export const paymentMethodSchema = Type.Union([
  Type.Literal("card"),
  Type.Literal("wallet"),
]);

export const payBookingBodySchema = Type.Object({
  paymentMethod: paymentMethodSchema,
});

const bookingFields = {
  travelDate: Type.String({ format: "date" }),
  adults: Type.Integer({ minimum: 1 }),
  children: Type.Optional(Type.Integer({ minimum: 0 })),
};

export const createBookingBodySchema = Type.Union([
  Type.Object({
    itemType: Type.Literal("tour"),
    tourId: uuidSchema,
    activityId: Type.Optional(Type.Null()),
    ...bookingFields,
  }),
  Type.Object({
    itemType: Type.Literal("activity"),
    activityId: uuidSchema,
    tourId: Type.Optional(Type.Null()),
    ...bookingFields,
  }),
]);

export const updateBookingBodySchema = Type.Partial(
  Type.Object({
    travelDate: bookingFields.travelDate,
    adults: bookingFields.adults,
    children: Type.Integer({ minimum: 0 }),
    status: bookingStatusSchema,
  }),
  { minProperties: 1 },
);

export const bookingQuerySchema = Type.Object({
  ...paginationProperties,
  query: Type.Optional(Type.String()),
  status: Type.Optional(bookingStatusSchema),
  itemType: Type.Optional(bookingItemTypeSchema),
  sortBy: Type.Optional(
    Type.Union([
      Type.Literal("bookingNumber"),
      Type.Literal("travelDate"),
      Type.Literal("totalPrice"),
      Type.Literal("status"),
      Type.Literal("createdAt"),
    ]),
  ),
  orderBy: Type.Optional(orderBySchema),
});

export type BookingStatus = Static<typeof bookingStatusSchema>;
export type BookingReadRequest = Static<typeof bookingQuerySchema>;
export type TBooking = Static<typeof createBookingBodySchema>;
export type UBooking = Static<typeof updateBookingBodySchema>;
export type PayBookingRequest = Static<typeof payBookingBodySchema>;
