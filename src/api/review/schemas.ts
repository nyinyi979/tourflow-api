import { Static, Type } from "@fastify/type-provider-typebox";
import {
  idParamsSchema,
  orderBySchema,
  paginationProperties,
  uuidSchema,
} from "../schemas";

export const reviewStatusSchema = Type.Union([
  Type.Literal("published"),
  Type.Literal("hidden"),
]);

export const createReviewBodySchema = Type.Object({
  tourId: uuidSchema,
  rating: Type.Integer({ minimum: 1, maximum: 5 }),
  comment: Type.String({ minLength: 1 }),
});

export const updateReviewBodySchema = Type.Object(
  {
    id: idParamsSchema.properties.id,
    ...Type.Partial(
      Type.Object({
        rating: Type.Integer({ minimum: 1, maximum: 5 }),
        comment: Type.String({ minLength: 1 }),
        status: reviewStatusSchema,
      }),
    ).properties,
  },
  { minProperties: 2 },
);

export const reviewQuerySchema = Type.Object({
  ...paginationProperties,
  query: Type.Optional(Type.String()),
  tourId: Type.Optional(uuidSchema),
  status: Type.Optional(reviewStatusSchema),
  sortBy: Type.Optional(
    Type.Union([
      Type.Literal("rating"),
      Type.Literal("reviewedAt"),
      Type.Literal("status"),
      Type.Literal("createdAt"),
    ]),
  ),
  orderBy: Type.Optional(orderBySchema),
});

export type ReviewReadRequest = Static<typeof reviewQuerySchema>;
export type TReview = Static<typeof createReviewBodySchema>;
export type UReview = Static<typeof updateReviewBodySchema>;
