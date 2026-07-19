import {
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
  pgTable,
} from "drizzle-orm/pg-core";
import { bookingsTable } from "./booking";
import { reviewsTable } from "./review";
import { relations } from "drizzle-orm";

export const customersTable = pgTable(
  "customers",
  {
    id: uuid().defaultRandom().primaryKey(),
    name: varchar({ length: 150 }).notNull(),
    email: varchar({ length: 255 }).notNull(),
    password: varchar({ length: 255 }).notNull(),
    avatar: varchar({ length: 2048 }),
    registeredAt: timestamp("registered_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [uniqueIndex("customers_email_unique").on(table.email)],
);

export const customersRelations = relations(customersTable, ({ many }) => ({
  bookings: many(bookingsTable),
  reviews: many(reviewsTable),
}));
