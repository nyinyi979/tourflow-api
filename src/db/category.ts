import { relations } from "drizzle-orm";
import {
  pgEnum,
  pgTable,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { activitiesTable } from "./activity";
import { toursTable } from "./tour";

export const categoryTypeEnum = pgEnum("category_type", ["tour", "activity"]);

export const categoriesTable = pgTable(
  "categories",
  {
    id: uuid().defaultRandom().primaryKey(),
    slug: varchar({ length: 100 }).notNull(),
    label: varchar({ length: 100 }).notNull(),
    image: varchar({ length: 2048 }),
    type: categoryTypeEnum().notNull(),
  },
  (table) => [
    uniqueIndex("categories_type_slug_unique").on(table.type, table.slug),
  ],
);

export const categoriesRelations = relations(categoriesTable, ({ many }) => ({
  tours: many(toursTable),
  activities: many(activitiesTable),
}));
