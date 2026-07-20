import { Static, Type } from "@fastify/type-provider-typebox";
import {
  idParamsSchema,
  nullableUrlSchema,
  orderBySchema,
  paginationProperties,
  removedImageUrlsSchema,
} from "../schemas";

export const categoryTypeSchema = Type.Union([
  Type.Literal("tour"),
  Type.Literal("activity"),
]);

const categoryFields = {
  slug: Type.String({ minLength: 1, maxLength: 100 }),
  label: Type.String({ minLength: 1, maxLength: 100 }),
  image: nullableUrlSchema,
  type: categoryTypeSchema,
  removedImageUrls: removedImageUrlsSchema,
};

export const createCategoryBodySchema = Type.Object({
  slug: categoryFields.slug,
  label: categoryFields.label,
  type: categoryFields.type,
  image: Type.Optional(categoryFields.image),
  removedImageUrls: Type.Optional(categoryFields.removedImageUrls),
});

export const updateCategoryBodySchema = Type.Object(
  {
    id: idParamsSchema.properties.id,
    ...Type.Partial(Type.Object(categoryFields)).properties,
  },
  { minProperties: 2 },
);

export const categoryQuerySchema = Type.Object({
  ...paginationProperties,
  query: Type.Optional(Type.String()),
  type: Type.Optional(categoryTypeSchema),
  sortBy: Type.Optional(
    Type.Union([
      Type.Literal("slug"),
      Type.Literal("label"),
      Type.Literal("type"),
    ]),
  ),
  orderBy: Type.Optional(orderBySchema),
});

export const allCategoryQuerySchema = Type.Object({ type: categoryTypeSchema });

export type CategoryReadRequest = Static<typeof categoryQuerySchema>;
export type AllCategoryReadRequest = Static<typeof allCategoryQuerySchema>;
export type TCategory = Static<typeof createCategoryBodySchema>;
export type UCategory = Static<typeof updateCategoryBodySchema>;
