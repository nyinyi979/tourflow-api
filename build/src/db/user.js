"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.usersTable = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.uuid)().defaultRandom().primaryKey(),
    username: (0, pg_core_1.varchar)({ length: 100 }).notNull(),
    email: (0, pg_core_1.varchar)({ length: 100 }).notNull().unique(),
    password: (0, pg_core_1.varchar)({ length: 255 }).notNull(),
    role: (0, pg_core_1.integer)().notNull().default(0),
});
