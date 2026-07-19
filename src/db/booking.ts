import {
  date,
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { activitiesTable } from "./activity";
import { customersTable } from "./customer";
import { toursTable } from "./tour";

export const bookingItemTypeEnum = pgEnum("booking_item_type", [
  "tour",
  "activity",
]);

export const bookingStatusEnum = pgEnum("booking_status", [
  "pending",
  "confirmed",
  "cancelled",
  "completed",
]);

export const bookingsTable = pgTable(
  "bookings",
  {
    id: uuid().defaultRandom().primaryKey(),
    bookingNumber: varchar("booking_number", { length: 50 }).notNull(),
    customerId: uuid("customer_id")
      .notNull()
      .references(() => customersTable.id, { onDelete: "restrict" }),
    itemType: bookingItemTypeEnum("item_type").notNull(),
    tourId: uuid("tour_id").references(() => toursTable.id, {
      onDelete: "restrict",
    }),
    activityId: uuid("activity_id").references(() => activitiesTable.id, {
      onDelete: "restrict",
    }),
    travelDate: date("travel_date", { mode: "string" }).notNull(),
    adults: integer().notNull().default(1),
    children: integer().notNull().default(0),
    totalPrice: numeric("total_price", {
      precision: 12,
      scale: 2,
      mode: "number",
    }).notNull(),
    status: bookingStatusEnum().notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("bookings_booking_number_unique").on(table.bookingNumber),
    index("bookings_customer_id_index").on(table.customerId),
    index("bookings_tour_id_index").on(table.tourId),
    index("bookings_activity_id_index").on(table.activityId),
    index("bookings_status_index").on(table.status),
    index("bookings_travel_date_index").on(table.travelDate),
  ],
);

export const bookingActivityTable = pgTable(
  "booking_activity",
  {
    id: uuid().defaultRandom().primaryKey(),
    bookingId: uuid("booking_id")
      .notNull()
      .references(() => bookingsTable.id, { onDelete: "cascade" }),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull(),
    label: text().notNull(),
  },
  (table) => [
    index("booking_activity_booking_id_index").on(table.bookingId),
    index("booking_activity_occurred_at_index").on(table.occurredAt),
  ],
);

export const bookingsRelations = relations(bookingsTable, ({ one, many }) => ({
  customer: one(customersTable, {
    fields: [bookingsTable.customerId],
    references: [customersTable.id],
  }),
  tour: one(toursTable, {
    fields: [bookingsTable.tourId],
    references: [toursTable.id],
  }),
  activity: one(activitiesTable, {
    fields: [bookingsTable.activityId],
    references: [activitiesTable.id],
  }),
  events: many(bookingActivityTable),
}));

export const bookingActivityRelations = relations(
  bookingActivityTable,
  ({ one }) => ({
    booking: one(bookingsTable, {
      fields: [bookingActivityTable.bookingId],
      references: [bookingsTable.id],
    }),
  }),
);
import { relations } from "drizzle-orm";
