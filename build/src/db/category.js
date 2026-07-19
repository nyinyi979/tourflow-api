"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriesRelations = exports.categoriesTable = exports.categoryTypeEnum = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const activity_1 = require("./activity");
const tour_1 = require("./tour");
exports.categoryTypeEnum = (0, pg_core_1.pgEnum)("category_type", ["tour", "activity"]);
exports.categoriesTable = (0, pg_core_1.pgTable)("categories", {
    id: (0, pg_core_1.uuid)().defaultRandom().primaryKey(),
    slug: (0, pg_core_1.varchar)({ length: 100 }).notNull(),
    label: (0, pg_core_1.varchar)({ length: 100 }).notNull(),
    image: (0, pg_core_1.varchar)({ length: 2048 }),
    type: (0, exports.categoryTypeEnum)().notNull(),
}, (table) => [
    (0, pg_core_1.uniqueIndex)("categories_type_slug_unique").on(table.type, table.slug),
]);
exports.categoriesRelations = (0, drizzle_orm_1.relations)(exports.categoriesTable, ({ many }) => ({
    tours: many(tour_1.toursTable),
    activities: many(activity_1.activitiesTable),
}));
