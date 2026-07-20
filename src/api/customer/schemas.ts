import { Static, Type } from "@fastify/type-provider-typebox";
import {
  nullableUrlSchema,
  orderBySchema,
  paginationProperties,
  removedImageUrlsSchema,
} from "../schemas";

const customerFields = {
  name: Type.String({ minLength: 1, maxLength: 150 }),
  email: Type.String({ format: "email", maxLength: 255 }),
  password: Type.String({ minLength: 8, maxLength: 255 }),
  avatar: nullableUrlSchema,
  removedImageUrls: removedImageUrlsSchema,
};

export const customerSignupBodySchema = Type.Object({
  name: customerFields.name,
  email: customerFields.email,
  password: customerFields.password,
  avatar: Type.Optional(customerFields.avatar),
  removedImageUrls: Type.Optional(customerFields.removedImageUrls),
});

export const customerLoginBodySchema = Type.Object({
  email: customerFields.email,
  password: Type.String({ minLength: 1, maxLength: 255 }),
});

export const customerUpdateBodySchema = Type.Partial(
  Type.Object(customerFields),
  { minProperties: 1 },
);

export const customerQuerySchema = Type.Object({
  ...paginationProperties,
  query: Type.Optional(Type.String()),
  sortBy: Type.Optional(
    Type.Union([
      Type.Literal("name"),
      Type.Literal("email"),
      Type.Literal("registeredAt"),
      Type.Literal("createdAt"),
      Type.Literal("updatedAt"),
    ]),
  ),
  orderBy: Type.Optional(orderBySchema),
});

export type CustomerReadRequest = Static<typeof customerQuerySchema>;
export type TCustomerLogin = Static<typeof customerLoginBodySchema>;
export type TCustomerSignup = Static<typeof customerSignupBodySchema>;
export type TCustomerUpdate = Static<typeof customerUpdateBodySchema>;
