"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testimonialsTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.testimonialsTable = (0, pg_core_1.pgTable)("testimonials", {
    id: (0, pg_core_1.uuid)().defaultRandom().primaryKey(),
    name: (0, pg_core_1.varchar)({ length: 150 }).notNull(),
    avatar: (0, pg_core_1.varchar)({ length: 2048 }),
    quote: (0, pg_core_1.text)().notNull(),
    rating: (0, pg_core_1.integer)().notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
});
