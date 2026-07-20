"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingActivityRelations = exports.bookingsRelations = exports.bookingActivityTable = exports.bookingsTable = exports.bookingStatusEnum = exports.bookingItemTypeEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const activity_1 = require("./activity");
const customer_1 = require("./customer");
const tour_1 = require("./tour");
exports.bookingItemTypeEnum = (0, pg_core_1.pgEnum)("booking_item_type", [
    "tour",
    "activity",
]);
exports.bookingStatusEnum = (0, pg_core_1.pgEnum)("booking_status", [
    "pending",
    "confirmed",
    "cancelled",
    "completed",
]);
exports.bookingsTable = (0, pg_core_1.pgTable)("bookings", {
    id: (0, pg_core_1.uuid)().defaultRandom().primaryKey(),
    bookingNumber: (0, pg_core_1.varchar)("booking_number", { length: 50 }).notNull(),
    customerId: (0, pg_core_1.uuid)("customer_id")
        .notNull()
        .references(() => customer_1.customersTable.id, { onDelete: "restrict" }),
    itemType: (0, exports.bookingItemTypeEnum)("item_type").notNull(),
    tourId: (0, pg_core_1.uuid)("tour_id").references(() => tour_1.toursTable.id, {
        onDelete: "restrict",
    }),
    activityId: (0, pg_core_1.uuid)("activity_id").references(() => activity_1.activitiesTable.id, {
        onDelete: "restrict",
    }),
    travelDate: (0, pg_core_1.date)("travel_date", { mode: "string" }).notNull(),
    adults: (0, pg_core_1.integer)().notNull().default(1),
    children: (0, pg_core_1.integer)().notNull().default(0),
    totalPrice: (0, pg_core_1.numeric)("total_price", {
        precision: 12,
        scale: 2,
        mode: "number",
    }).notNull(),
    status: (0, exports.bookingStatusEnum)().notNull().default("pending"),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
}, (table) => [
    (0, pg_core_1.uniqueIndex)("bookings_booking_number_unique").on(table.bookingNumber),
    (0, pg_core_1.index)("bookings_customer_id_index").on(table.customerId),
    (0, pg_core_1.index)("bookings_tour_id_index").on(table.tourId),
    (0, pg_core_1.index)("bookings_activity_id_index").on(table.activityId),
    (0, pg_core_1.index)("bookings_status_index").on(table.status),
    (0, pg_core_1.index)("bookings_travel_date_index").on(table.travelDate),
]);
exports.bookingActivityTable = (0, pg_core_1.pgTable)("booking_activity", {
    id: (0, pg_core_1.uuid)().defaultRandom().primaryKey(),
    bookingId: (0, pg_core_1.uuid)("booking_id")
        .notNull()
        .references(() => exports.bookingsTable.id, { onDelete: "cascade" }),
    occurredAt: (0, pg_core_1.timestamp)("occurred_at", { withTimezone: true }).notNull(),
    label: (0, pg_core_1.text)().notNull(),
}, (table) => [
    (0, pg_core_1.index)("booking_activity_booking_id_index").on(table.bookingId),
    (0, pg_core_1.index)("booking_activity_occurred_at_index").on(table.occurredAt),
]);
exports.bookingsRelations = (0, drizzle_orm_1.relations)(exports.bookingsTable, ({ one, many }) => ({
    customer: one(customer_1.customersTable, {
        fields: [exports.bookingsTable.customerId],
        references: [customer_1.customersTable.id],
    }),
    tour: one(tour_1.toursTable, {
        fields: [exports.bookingsTable.tourId],
        references: [tour_1.toursTable.id],
    }),
    activity: one(activity_1.activitiesTable, {
        fields: [exports.bookingsTable.activityId],
        references: [activity_1.activitiesTable.id],
    }),
    events: many(exports.bookingActivityTable),
}));
exports.bookingActivityRelations = (0, drizzle_orm_1.relations)(exports.bookingActivityTable, ({ one }) => ({
    booking: one(exports.bookingsTable, {
        fields: [exports.bookingActivityTable.bookingId],
        references: [exports.bookingsTable.id],
    }),
}));
