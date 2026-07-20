import { Static, Type } from "@fastify/type-provider-typebox";
import {
  idParamsSchema,
  nullableUrlSchema,
  orderBySchema,
  paginationProperties,
  removedImageUrlsSchema,
} from "../schemas";

const testimonialFields = {
  name: Type.String({ minLength: 1, maxLength: 150 }),
  avatar: nullableUrlSchema,
  quote: Type.String({ minLength: 1 }),
  rating: Type.Integer({ minimum: 1, maximum: 5 }),
  removedImageUrls: removedImageUrlsSchema,
};

export const createTestimonialBodySchema = Type.Object({
  name: testimonialFields.name,
  quote: testimonialFields.quote,
  rating: testimonialFields.rating,
  avatar: Type.Optional(testimonialFields.avatar),
  removedImageUrls: Type.Optional(testimonialFields.removedImageUrls),
});

export const updateTestimonialBodySchema = Type.Object(
  {
    id: idParamsSchema.properties.id,
    ...Type.Partial(Type.Object(testimonialFields)).properties,
  },
  { minProperties: 2 },
);

export const testimonialQuerySchema = Type.Object({
  ...paginationProperties,
  query: Type.Optional(Type.String()),
  sortBy: Type.Optional(
    Type.Union([
      Type.Literal("name"),
      Type.Literal("rating"),
      Type.Literal("createdAt"),
    ]),
  ),
  orderBy: Type.Optional(orderBySchema),
});

export type TestimonialReadRequest = Static<typeof testimonialQuerySchema>;
export type TTestimonial = Static<typeof createTestimonialBodySchema>;
export type UTestimonial = Static<typeof updateTestimonialBodySchema>;
