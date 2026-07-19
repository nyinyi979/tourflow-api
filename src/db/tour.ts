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
import { reviewsTable } from "./review";
import { relations } from "drizzle-orm";

export const toursTable = pgTable(
  "tours",
  {
    id: uuid().defaultRandom().primaryKey(),
    slug: varchar({ length: 100 }).notNull(),
    title: varchar({ length: 255 }).notNull(),
    description: text().notNull(),
    price: numeric({ precision: 12, scale: 2, mode: "number" }).notNull(),
    duration: integer().notNull(),
    difficulty: varchar({ length: 50 }).notNull(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categoriesTable.id, { onDelete: "restrict" }),
    capacity: integer().notNull(),
    rating: numeric({ precision: 2, scale: 1, mode: "number" })
      .notNull()
      .default(0),
    reviewCount: integer("review_count").notNull().default(0),
    popularity: integer().notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("tours_slug_unique").on(table.slug),
    index("tours_category_id_index").on(table.categoryId),
    index("tours_popularity_index").on(table.popularity),
  ],
);

export const tourImagesTable = pgTable(
  "tour_images",
  {
    id: uuid().defaultRandom().primaryKey(),
    tourId: uuid("tour_id")
      .notNull()
      .references(() => toursTable.id, { onDelete: "cascade" }),
    url: varchar({ length: 2048 }).notNull(),
    position: integer().notNull().default(0),
  },
  (table) => [
    index("tour_images_tour_id_index").on(table.tourId),
    uniqueIndex("tour_images_tour_position_unique").on(
      table.tourId,
      table.position,
    ),
  ],
);

export const tourHighlightsTable = pgTable(
  "tour_highlights",
  {
    id: uuid().defaultRandom().primaryKey(),
    tourId: uuid("tour_id")
      .notNull()
      .references(() => toursTable.id, { onDelete: "cascade" }),
    label: text().notNull(),
    position: integer().notNull().default(0),
  },
  (table) => [
    index("tour_highlights_tour_id_index").on(table.tourId),
    uniqueIndex("tour_highlights_tour_position_unique").on(
      table.tourId,
      table.position,
    ),
  ],
);

export const tourItineraryTable = pgTable(
  "tour_itinerary",
  {
    id: uuid().defaultRandom().primaryKey(),
    tourId: uuid("tour_id")
      .notNull()
      .references(() => toursTable.id, { onDelete: "cascade" }),
    day: integer().notNull(),
    title: varchar({ length: 255 }).notNull(),
    description: text().notNull(),
  },
  (table) => [
    index("tour_itinerary_tour_id_index").on(table.tourId),
    uniqueIndex("tour_itinerary_tour_day_unique").on(table.tourId, table.day),
  ],
);

export const toursRelations = relations(toursTable, ({ one, many }) => ({
  category: one(categoriesTable, {
    fields: [toursTable.categoryId],
    references: [categoriesTable.id],
  }),
  images: many(tourImagesTable),
  highlights: many(tourHighlightsTable),
  itinerary: many(tourItineraryTable),
  reviews: many(reviewsTable),
  bookings: many(bookingsTable),
}));

export const tourImagesRelations = relations(tourImagesTable, ({ one }) => ({
  tour: one(toursTable, {
    fields: [tourImagesTable.tourId],
    references: [toursTable.id],
  }),
}));

export const tourHighlightsRelations = relations(
  tourHighlightsTable,
  ({ one }) => ({
    tour: one(toursTable, {
      fields: [tourHighlightsTable.tourId],
      references: [toursTable.id],
    }),
  }),
);

export const tourItineraryRelations = relations(
  tourItineraryTable,
  ({ one }) => ({
    tour: one(toursTable, {
      fields: [tourItineraryTable.tourId],
      references: [toursTable.id],
    }),
  }),
);
