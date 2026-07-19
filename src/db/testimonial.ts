import {
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const testimonialsTable = pgTable("testimonials", {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 150 }).notNull(),
  avatar: varchar({ length: 2048 }),
  quote: text().notNull(),
  rating: integer().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
