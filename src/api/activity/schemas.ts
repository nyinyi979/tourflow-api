import { Static, Type } from "@fastify/type-provider-typebox";
import {
  idParamsSchema,
  orderBySchema,
  paginationProperties,
  removedImageUrlsSchema,
  uuidSchema,
} from "../schemas";

export const activityImageSchema = Type.Object({
  id: Type.Optional(uuidSchema),
  url: Type.String({ maxLength: 2048 }),
});
export const activityLabelSchema = Type.Object({
  id: Type.Optional(uuidSchema),
  label: Type.String({ minLength: 1 }),
});

const activityFields = {
  slug: Type.String({ minLength: 1, maxLength: 100 }),
  title: Type.String({ minLength: 1, maxLength: 255 }),
  description: Type.String({ minLength: 1 }),
  longDescription: Type.Union([Type.String(), Type.Null()]),
  price: Type.Number({ minimum: 0 }),
  duration: Type.Integer({ minimum: 1 }),
  categoryId: uuidSchema,
  rating: Type.Number({ minimum: 0, maximum: 5 }),
  meetingPoint: Type.Union([Type.String(), Type.Null()]),
  images: Type.Array(activityImageSchema),
  highlights: Type.Array(activityLabelSchema),
  included: Type.Array(activityLabelSchema),
  removedImageUrls: removedImageUrlsSchema,
};

export const createActivityBodySchema = Type.Object({
  slug: activityFields.slug,
  title: activityFields.title,
  description: activityFields.description,
  price: activityFields.price,
  duration: activityFields.duration,
  categoryId: activityFields.categoryId,
  longDescription: Type.Optional(activityFields.longDescription),
  rating: Type.Optional(activityFields.rating),
  meetingPoint: Type.Optional(activityFields.meetingPoint),
  images: Type.Optional(activityFields.images),
  highlights: Type.Optional(activityFields.highlights),
  included: Type.Optional(activityFields.included),
  removedImageUrls: Type.Optional(activityFields.removedImageUrls),
});

export const updateActivityBodySchema = Type.Object(
  {
    id: idParamsSchema.properties.id,
    ...Type.Partial(Type.Object(activityFields)).properties,
  },
  { minProperties: 2 },
);

export const activityQuerySchema = Type.Object({
  ...paginationProperties,
  query: Type.Optional(Type.String()),
  categoryId: Type.Optional(uuidSchema),
  sortBy: Type.Optional(
    Type.Union([
      Type.Literal("title"),
      Type.Literal("price"),
      Type.Literal("duration"),
      Type.Literal("rating"),
      Type.Literal("createdAt"),
    ]),
  ),
  orderBy: Type.Optional(orderBySchema),
});

export type ActivityReadRequest = Static<typeof activityQuerySchema>;
export type TActivityImage = Static<typeof activityImageSchema>;
export type TActivityLabel = Static<typeof activityLabelSchema>;
export type TActivity = Static<typeof createActivityBodySchema>;
export type UActivity = Static<typeof updateActivityBodySchema>;
