import {
  index,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { categoriesTable } from "./category";
import { bookingsTable } from "./booking";
import { relations } from "drizzle-orm";

export const activitiesTable = pgTable(
  "activities",
  {
    id: uuid().defaultRandom().primaryKey(),
    slug: varchar({ length: 100 }).notNull(),
    title: varchar({ length: 255 }).notNull(),
    description: text().notNull(),
    longDescription: text("long_description"),
    price: numeric({ precision: 12, scale: 2, mode: "number" }).notNull(),
    duration: integer().notNull(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categoriesTable.id, { onDelete: "restrict" }),
    rating: numeric({ precision: 2, scale: 1, mode: "number" })
      .notNull()
      .default(0),
    meetingPoint: text("meeting_point"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("activities_slug_unique").on(table.slug),
    index("activities_category_id_index").on(table.categoryId),
  ],
);

export const activityImagesTable = pgTable(
  "activity_images",
  {
    id: uuid().defaultRandom().primaryKey(),
    activityId: uuid("activity_id")
      .notNull()
      .references(() => activitiesTable.id, { onDelete: "cascade" }),
    url: varchar({ length: 2048 }).notNull(),
    position: integer().notNull().default(0),
  },
  (table) => [
    index("activity_images_activity_id_index").on(table.activityId),
    uniqueIndex("activity_images_activity_position_unique").on(
      table.activityId,
      table.position,
    ),
  ],
);

export const activityHighlightsTable = pgTable(
  "activity_highlights",
  {
    id: uuid().defaultRandom().primaryKey(),
    activityId: uuid("activity_id")
      .notNull()
      .references(() => activitiesTable.id, { onDelete: "cascade" }),
    label: text().notNull(),
    position: integer().notNull().default(0),
  },
  (table) => [
    index("activity_highlights_activity_id_index").on(table.activityId),
    uniqueIndex("activity_highlights_activity_position_unique").on(
      table.activityId,
      table.position,
    ),
  ],
);

export const activityIncludedItemsTable = pgTable(
  "activity_included_items",
  {
    id: uuid().defaultRandom().primaryKey(),
    activityId: uuid("activity_id")
      .notNull()
      .references(() => activitiesTable.id, { onDelete: "cascade" }),
    label: text().notNull(),
    position: integer().notNull().default(0),
  },
  (table) => [
    index("activity_included_items_activity_id_index").on(table.activityId),
    uniqueIndex("activity_included_items_activity_position_unique").on(
      table.activityId,
      table.position,
    ),
  ],
);

export const activitiesRelations = relations(
  activitiesTable,
  ({ one, many }) => ({
    category: one(categoriesTable, {
      fields: [activitiesTable.categoryId],
      references: [categoriesTable.id],
    }),
    images: many(activityImagesTable),
    highlights: many(activityHighlightsTable),
    included: many(activityIncludedItemsTable),
    bookings: many(bookingsTable),
  }),
);

export const activityImagesRelations = relations(
  activityImagesTable,
  ({ one }) => ({
    activity: one(activitiesTable, {
      fields: [activityImagesTable.activityId],
      references: [activitiesTable.id],
    }),
  }),
);

export const activityHighlightsRelations = relations(
  activityHighlightsTable,
  ({ one }) => ({
    activity: one(activitiesTable, {
      fields: [activityHighlightsTable.activityId],
      references: [activitiesTable.id],
    }),
  }),
);

export const activityIncludedItemsRelations = relations(
  activityIncludedItemsTable,
  ({ one }) => ({
    activity: one(activitiesTable, {
      fields: [activityIncludedItemsTable.activityId],
      references: [activitiesTable.id],
    }),
  }),
);
