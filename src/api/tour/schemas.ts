import { Static, Type } from "@fastify/type-provider-typebox";
import {
  idParamsSchema,
  orderBySchema,
  paginationProperties,
  removedImageUrlsSchema,
  uuidSchema,
} from "../schemas";

export const tourImageSchema = Type.Object({
  id: Type.Optional(uuidSchema),
  url: Type.String({ maxLength: 2048 }),
});
export const tourHighlightSchema = Type.Object({
  id: Type.Optional(uuidSchema),
  label: Type.String({ minLength: 1 }),
});
export const itineraryDaySchema = Type.Object({
  id: Type.Optional(uuidSchema),
  day: Type.Integer({ minimum: 1 }),
  title: Type.String({ minLength: 1, maxLength: 255 }),
  description: Type.String({ minLength: 1 }),
});

const tourFields = {
  slug: Type.String({ minLength: 1, maxLength: 100 }),
  title: Type.String({ minLength: 1, maxLength: 255 }),
  description: Type.String({ minLength: 1 }),
  price: Type.Number({ minimum: 0 }),
  duration: Type.Integer({ minimum: 1 }),
  difficulty: Type.String({ minLength: 1, maxLength: 50 }),
  categoryId: uuidSchema,
  capacity: Type.Integer({ minimum: 1 }),
  rating: Type.Number({ minimum: 0, maximum: 5 }),
  reviewCount: Type.Integer({ minimum: 0 }),
  popularity: Type.Integer({ minimum: 0 }),
  images: Type.Array(tourImageSchema),
  highlights: Type.Array(tourHighlightSchema),
  itinerary: Type.Array(itineraryDaySchema),
  removedImageUrls: removedImageUrlsSchema,
};

export const createTourBodySchema = Type.Object({
  slug: tourFields.slug,
  title: tourFields.title,
  description: tourFields.description,
  price: tourFields.price,
  duration: tourFields.duration,
  difficulty: tourFields.difficulty,
  categoryId: tourFields.categoryId,
  capacity: tourFields.capacity,
  rating: Type.Optional(tourFields.rating),
  reviewCount: Type.Optional(tourFields.reviewCount),
  popularity: Type.Optional(tourFields.popularity),
  images: Type.Optional(tourFields.images),
  highlights: Type.Optional(tourFields.highlights),
  itinerary: Type.Optional(tourFields.itinerary),
  removedImageUrls: Type.Optional(tourFields.removedImageUrls),
});

export const updateTourBodySchema = Type.Object(
  {
    id: idParamsSchema.properties.id,
    ...Type.Partial(Type.Object(tourFields)).properties,
  },
  { minProperties: 2 },
);

export const tourQuerySchema = Type.Object({
  ...paginationProperties,
  query: Type.Optional(Type.String()),
  categoryId: Type.Optional(uuidSchema),
  difficulty: Type.Optional(Type.String()),
  sortBy: Type.Optional(
    Type.Union([
      Type.Literal("title"),
      Type.Literal("price"),
      Type.Literal("duration"),
      Type.Literal("rating"),
      Type.Literal("popularity"),
      Type.Literal("createdAt"),
    ]),
  ),
  orderBy: Type.Optional(orderBySchema),
});

export type TourReadRequest = Static<typeof tourQuerySchema>;
export type TTourImage = Static<typeof tourImageSchema>;
export type TTourHighlight = Static<typeof tourHighlightSchema>;
export type TItineraryDay = Static<typeof itineraryDaySchema>;
export type TTour = Static<typeof createTourBodySchema>;
export type UTour = Static<typeof updateTourBodySchema>;
