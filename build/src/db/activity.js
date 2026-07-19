"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activityIncludedItemsRelations = exports.activityHighlightsRelations = exports.activityImagesRelations = exports.activitiesRelations = exports.activityIncludedItemsTable = exports.activityHighlightsTable = exports.activityImagesTable = exports.activitiesTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const category_1 = require("./category");
const booking_1 = require("./booking");
const drizzle_orm_1 = require("drizzle-orm");
exports.activitiesTable = (0, pg_core_1.pgTable)("activities", {
    id: (0, pg_core_1.uuid)().defaultRandom().primaryKey(),
    slug: (0, pg_core_1.varchar)({ length: 100 }).notNull(),
    title: (0, pg_core_1.varchar)({ length: 255 }).notNull(),
    description: (0, pg_core_1.text)().notNull(),
    longDescription: (0, pg_core_1.text)("long_description"),
    price: (0, pg_core_1.numeric)({ precision: 12, scale: 2, mode: "number" }).notNull(),
    duration: (0, pg_core_1.integer)().notNull(),
    categoryId: (0, pg_core_1.uuid)("category_id")
        .notNull()
        .references(() => category_1.categoriesTable.id, { onDelete: "restrict" }),
    rating: (0, pg_core_1.numeric)({ precision: 2, scale: 1, mode: "number" })
        .notNull()
        .default(0),
    meetingPoint: (0, pg_core_1.text)("meeting_point"),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
}, (table) => [
    (0, pg_core_1.uniqueIndex)("activities_slug_unique").on(table.slug),
    (0, pg_core_1.index)("activities_category_id_index").on(table.categoryId),
]);
exports.activityImagesTable = (0, pg_core_1.pgTable)("activity_images", {
    id: (0, pg_core_1.uuid)().defaultRandom().primaryKey(),
    activityId: (0, pg_core_1.uuid)("activity_id")
        .notNull()
        .references(() => exports.activitiesTable.id, { onDelete: "cascade" }),
    url: (0, pg_core_1.varchar)({ length: 2048 }).notNull(),
    position: (0, pg_core_1.integer)().notNull().default(0),
}, (table) => [
    (0, pg_core_1.index)("activity_images_activity_id_index").on(table.activityId),
    (0, pg_core_1.uniqueIndex)("activity_images_activity_position_unique").on(table.activityId, table.position),
]);
exports.activityHighlightsTable = (0, pg_core_1.pgTable)("activity_highlights", {
    id: (0, pg_core_1.uuid)().defaultRandom().primaryKey(),
    activityId: (0, pg_core_1.uuid)("activity_id")
        .notNull()
        .references(() => exports.activitiesTable.id, { onDelete: "cascade" }),
    label: (0, pg_core_1.text)().notNull(),
    position: (0, pg_core_1.integer)().notNull().default(0),
}, (table) => [
    (0, pg_core_1.index)("activity_highlights_activity_id_index").on(table.activityId),
    (0, pg_core_1.uniqueIndex)("activity_highlights_activity_position_unique").on(table.activityId, table.position),
]);
exports.activityIncludedItemsTable = (0, pg_core_1.pgTable)("activity_included_items", {
    id: (0, pg_core_1.uuid)().defaultRandom().primaryKey(),
    activityId: (0, pg_core_1.uuid)("activity_id")
        .notNull()
        .references(() => exports.activitiesTable.id, { onDelete: "cascade" }),
    label: (0, pg_core_1.text)().notNull(),
    position: (0, pg_core_1.integer)().notNull().default(0),
}, (table) => [
    (0, pg_core_1.index)("activity_included_items_activity_id_index").on(table.activityId),
    (0, pg_core_1.uniqueIndex)("activity_included_items_activity_position_unique").on(table.activityId, table.position),
]);
exports.activitiesRelations = (0, drizzle_orm_1.relations)(exports.activitiesTable, ({ one, many }) => ({
    category: one(category_1.categoriesTable, {
        fields: [exports.activitiesTable.categoryId],
        references: [category_1.categoriesTable.id],
    }),
    images: many(exports.activityImagesTable),
    highlights: many(exports.activityHighlightsTable),
    included: many(exports.activityIncludedItemsTable),
    bookings: many(booking_1.bookingsTable),
}));
exports.activityImagesRelations = (0, drizzle_orm_1.relations)(exports.activityImagesTable, ({ one }) => ({
    activity: one(exports.activitiesTable, {
        fields: [exports.activityImagesTable.activityId],
        references: [exports.activitiesTable.id],
    }),
}));
exports.activityHighlightsRelations = (0, drizzle_orm_1.relations)(exports.activityHighlightsTable, ({ one }) => ({
    activity: one(exports.activitiesTable, {
        fields: [exports.activityHighlightsTable.activityId],
        references: [exports.activitiesTable.id],
    }),
}));
exports.activityIncludedItemsRelations = (0, drizzle_orm_1.relations)(exports.activityIncludedItemsTable, ({ one }) => ({
    activity: one(exports.activitiesTable, {
        fields: [exports.activityIncludedItemsTable.activityId],
        references: [exports.activitiesTable.id],
    }),
}));
