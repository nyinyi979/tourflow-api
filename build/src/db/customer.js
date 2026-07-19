"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customersRelations = exports.customersTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const booking_1 = require("./booking");
const review_1 = require("./review");
const drizzle_orm_1 = require("drizzle-orm");
exports.customersTable = (0, pg_core_1.pgTable)("customers", {
    id: (0, pg_core_1.uuid)().defaultRandom().primaryKey(),
    name: (0, pg_core_1.varchar)({ length: 150 }).notNull(),
    email: (0, pg_core_1.varchar)({ length: 255 }).notNull(),
    password: (0, pg_core_1.varchar)({ length: 255 }).notNull(),
    avatar: (0, pg_core_1.varchar)({ length: 2048 }),
    registeredAt: (0, pg_core_1.timestamp)("registered_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
}, (table) => [(0, pg_core_1.uniqueIndex)("customers_email_unique").on(table.email)]);
exports.customersRelations = (0, drizzle_orm_1.relations)(exports.customersTable, ({ many }) => ({
    bookings: many(booking_1.bookingsTable),
    reviews: many(review_1.reviewsTable),
}));
