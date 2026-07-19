import {
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { customersTable } from "./customer";
import { toursTable } from "./tour";
import { relations } from "drizzle-orm";

export const reviewStatusEnum = pgEnum("review_status", [
  "published",
  "hidden",
]);

export const reviewsTable = pgTable(
  "reviews",
  {
    id: uuid().defaultRandom().primaryKey(),
    customerId: uuid("customer_id").references(() => customersTable.id, {
      onDelete: "set null",
    }),
    customerName: varchar("customer_name", { length: 150 }).notNull(),
    avatar: varchar({ length: 2048 }),
    tourId: uuid("tour_id")
      .notNull()
      .references(() => toursTable.id, { onDelete: "cascade" }),
    rating: integer().notNull(),
    comment: text().notNull(),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    status: reviewStatusEnum().notNull().default("published"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("reviews_customer_id_index").on(table.customerId),
    index("reviews_tour_id_index").on(table.tourId),
    index("reviews_status_index").on(table.status),
  ],
);

export const reviewsRelations = relations(reviewsTable, ({ one }) => ({
  customer: one(customersTable, {
    fields: [reviewsTable.customerId],
    references: [customersTable.id],
  }),
  tour: one(toursTable, {
    fields: [reviewsTable.tourId],
    references: [toursTable.id],
  }),
}));
