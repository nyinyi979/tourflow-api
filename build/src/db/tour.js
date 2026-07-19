"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tourItineraryRelations = exports.tourHighlightsRelations = exports.tourImagesRelations = exports.toursRelations = exports.tourItineraryTable = exports.tourHighlightsTable = exports.tourImagesTable = exports.toursTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const category_1 = require("./category");
const booking_1 = require("./booking");
const review_1 = require("./review");
const drizzle_orm_1 = require("drizzle-orm");
exports.toursTable = (0, pg_core_1.pgTable)("tours", {
    id: (0, pg_core_1.uuid)().defaultRandom().primaryKey(),
    slug: (0, pg_core_1.varchar)({ length: 100 }).notNull(),
    title: (0, pg_core_1.varchar)({ length: 255 }).notNull(),
    description: (0, pg_core_1.text)().notNull(),
    price: (0, pg_core_1.numeric)({ precision: 12, scale: 2, mode: "number" }).notNull(),
    duration: (0, pg_core_1.integer)().notNull(),
    difficulty: (0, pg_core_1.varchar)({ length: 50 }).notNull(),
    categoryId: (0, pg_core_1.uuid)("category_id")
        .notNull()
        .references(() => category_1.categoriesTable.id, { onDelete: "restrict" }),
    capacity: (0, pg_core_1.integer)().notNull(),
    rating: (0, pg_core_1.numeric)({ precision: 2, scale: 1, mode: "number" })
        .notNull()
        .default(0),
    reviewCount: (0, pg_core_1.integer)("review_count").notNull().default(0),
    popularity: (0, pg_core_1.integer)().notNull().default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
}, (table) => [
    (0, pg_core_1.uniqueIndex)("tours_slug_unique").on(table.slug),
    (0, pg_core_1.index)("tours_category_id_index").on(table.categoryId),
    (0, pg_core_1.index)("tours_popularity_index").on(table.popularity),
]);
exports.tourImagesTable = (0, pg_core_1.pgTable)("tour_images", {
    id: (0, pg_core_1.uuid)().defaultRandom().primaryKey(),
    tourId: (0, pg_core_1.uuid)("tour_id")
        .notNull()
        .references(() => exports.toursTable.id, { onDelete: "cascade" }),
    url: (0, pg_core_1.varchar)({ length: 2048 }).notNull(),
    position: (0, pg_core_1.integer)().notNull().default(0),
}, (table) => [
    (0, pg_core_1.index)("tour_images_tour_id_index").on(table.tourId),
    (0, pg_core_1.uniqueIndex)("tour_images_tour_position_unique").on(table.tourId, table.position),
]);
exports.tourHighlightsTable = (0, pg_core_1.pgTable)("tour_highlights", {
    id: (0, pg_core_1.uuid)().defaultRandom().primaryKey(),
    tourId: (0, pg_core_1.uuid)("tour_id")
        .notNull()
        .references(() => exports.toursTable.id, { onDelete: "cascade" }),
    label: (0, pg_core_1.text)().notNull(),
    position: (0, pg_core_1.integer)().notNull().default(0),
}, (table) => [
    (0, pg_core_1.index)("tour_highlights_tour_id_index").on(table.tourId),
    (0, pg_core_1.uniqueIndex)("tour_highlights_tour_position_unique").on(table.tourId, table.position),
]);
exports.tourItineraryTable = (0, pg_core_1.pgTable)("tour_itinerary", {
    id: (0, pg_core_1.uuid)().defaultRandom().primaryKey(),
    tourId: (0, pg_core_1.uuid)("tour_id")
        .notNull()
        .references(() => exports.toursTable.id, { onDelete: "cascade" }),
    day: (0, pg_core_1.integer)().notNull(),
    title: (0, pg_core_1.varchar)({ length: 255 }).notNull(),
    description: (0, pg_core_1.text)().notNull(),
}, (table) => [
    (0, pg_core_1.index)("tour_itinerary_tour_id_index").on(table.tourId),
    (0, pg_core_1.uniqueIndex)("tour_itinerary_tour_day_unique").on(table.tourId, table.day),
]);
exports.toursRelations = (0, drizzle_orm_1.relations)(exports.toursTable, ({ one, many }) => ({
    category: one(category_1.categoriesTable, {
        fields: [exports.toursTable.categoryId],
        references: [category_1.categoriesTable.id],
    }),
    images: many(exports.tourImagesTable),
    highlights: many(exports.tourHighlightsTable),
    itinerary: many(exports.tourItineraryTable),
    reviews: many(review_1.reviewsTable),
    bookings: many(booking_1.bookingsTable),
}));
exports.tourImagesRelations = (0, drizzle_orm_1.relations)(exports.tourImagesTable, ({ one }) => ({
    tour: one(exports.toursTable, {
        fields: [exports.tourImagesTable.tourId],
        references: [exports.toursTable.id],
    }),
}));
exports.tourHighlightsRelations = (0, drizzle_orm_1.relations)(exports.tourHighlightsTable, ({ one }) => ({
    tour: one(exports.toursTable, {
        fields: [exports.tourHighlightsTable.tourId],
        references: [exports.toursTable.id],
    }),
}));
exports.tourItineraryRelations = (0, drizzle_orm_1.relations)(exports.tourItineraryTable, ({ one }) => ({
    tour: one(exports.toursTable, {
        fields: [exports.tourItineraryTable.tourId],
        references: [exports.toursTable.id],
    }),
}));
