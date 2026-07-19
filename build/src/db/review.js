"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewsRelations = exports.reviewsTable = exports.reviewStatusEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const customer_1 = require("./customer");
const tour_1 = require("./tour");
const drizzle_orm_1 = require("drizzle-orm");
exports.reviewStatusEnum = (0, pg_core_1.pgEnum)("review_status", [
    "published",
    "hidden",
]);
exports.reviewsTable = (0, pg_core_1.pgTable)("reviews", {
    id: (0, pg_core_1.uuid)().defaultRandom().primaryKey(),
    customerId: (0, pg_core_1.uuid)("customer_id").references(() => customer_1.customersTable.id, {
        onDelete: "set null",
    }),
    customerName: (0, pg_core_1.varchar)("customer_name", { length: 150 }).notNull(),
    avatar: (0, pg_core_1.varchar)({ length: 2048 }),
    tourId: (0, pg_core_1.uuid)("tour_id")
        .notNull()
        .references(() => tour_1.toursTable.id, { onDelete: "cascade" }),
    rating: (0, pg_core_1.integer)().notNull(),
    comment: (0, pg_core_1.text)().notNull(),
    reviewedAt: (0, pg_core_1.timestamp)("reviewed_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
    status: (0, exports.reviewStatusEnum)().notNull().default("published"),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("reviews_customer_id_index").on(table.customerId),
    (0, pg_core_1.index)("reviews_tour_id_index").on(table.tourId),
    (0, pg_core_1.index)("reviews_status_index").on(table.status),
]);
exports.reviewsRelations = (0, drizzle_orm_1.relations)(exports.reviewsTable, ({ one }) => ({
    customer: one(customer_1.customersTable, {
        fields: [exports.reviewsTable.customerId],
        references: [customer_1.customersTable.id],
    }),
    tour: one(tour_1.toursTable, {
        fields: [exports.reviewsTable.tourId],
        references: [tour_1.toursTable.id],
    }),
}));
