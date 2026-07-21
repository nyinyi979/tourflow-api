"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.getCategoryById = exports.getAllCategories = exports.getCategories = exports.createCategory = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = __importDefault(require("../../db"));
const activity_1 = require("../../db/activity");
const category_1 = require("../../db/category");
const tour_1 = require("../../db/tour");
const errors_1 = require("../../utils/errors");
const createCategory = async (data) => {
    const response = await db_1.default
        .insert(category_1.categoriesTable)
        .values({
        slug: data.slug,
        label: data.label,
        image: data.image,
        type: data.type,
    })
        .returning();
    return response[0];
};
exports.createCategory = createCategory;
const getCategories = async ({ page, perPage, query, type, sortBy, orderBy, }) => {
    const conditions = [];
    if (query)
        conditions.push((0, drizzle_orm_1.ilike)(category_1.categoriesTable.label, `%${query}%`));
    if (type)
        conditions.push((0, drizzle_orm_1.eq)(category_1.categoriesTable.type, type));
    const where = conditions.length ? (0, drizzle_orm_1.and)(...conditions) : undefined;
    const sortableColumns = {
        slug: category_1.categoriesTable.slug,
        label: category_1.categoriesTable.label,
        type: category_1.categoriesTable.type,
    };
    const orderColumn = sortBy && sortBy in sortableColumns
        ? sortableColumns[sortBy]
        : category_1.categoriesTable.label;
    const [data, total] = await Promise.all([
        db_1.default.query.categoriesTable.findMany({
            where,
            orderBy: [orderBy === "desc" ? (0, drizzle_orm_1.desc)(orderColumn) : (0, drizzle_orm_1.asc)(orderColumn)],
            limit: perPage,
            offset: page * perPage,
        }),
        db_1.default.$count(category_1.categoriesTable, where),
    ]);
    return { data, total };
};
exports.getCategories = getCategories;
const getAllCategories = async (type) => db_1.default.query.categoriesTable.findMany({ where: (0, drizzle_orm_1.eq)(category_1.categoriesTable.type, type) });
exports.getAllCategories = getAllCategories;
const getCategoryById = async (id) => db_1.default.query.categoriesTable.findFirst({ where: (0, drizzle_orm_1.eq)(category_1.categoriesTable.id, id) });
exports.getCategoryById = getCategoryById;
const updateCategory = async (data) => {
    const response = await db_1.default
        .update(category_1.categoriesTable)
        .set({
        slug: data.slug,
        label: data.label,
        image: data.image,
        type: data.type,
    })
        .where((0, drizzle_orm_1.eq)(category_1.categoriesTable.id, data.id))
        .returning();
    return response[0];
};
exports.updateCategory = updateCategory;
const deleteCategory = async (id) => {
    const category = await (0, exports.getCategoryById)(id);
    if (!category)
        return undefined;
    const [tourCount, activityCount] = await Promise.all([
        db_1.default.$count(tour_1.toursTable, (0, drizzle_orm_1.eq)(tour_1.toursTable.categoryId, id)),
        db_1.default.$count(activity_1.activitiesTable, (0, drizzle_orm_1.eq)(activity_1.activitiesTable.categoryId, id)),
    ]);
    if (tourCount || activityCount) {
        let usage = "";
        if (tourCount) {
            usage = `${tourCount} tour${tourCount === 1 ? "" : "s"}`;
        }
        if (activityCount) {
            const activities = `${activityCount} activit${activityCount === 1 ? "y" : "ies"}`;
            usage = usage ? `${usage} and ${activities}` : activities;
        }
        throw new errors_1.ConflictError(`This category is used by ${usage}. Reassign or delete those listings first.`, "CATEGORY_IN_USE");
    }
    const response = await db_1.default
        .delete(category_1.categoriesTable)
        .where((0, drizzle_orm_1.eq)(category_1.categoriesTable.id, id))
        .returning();
    return response[0];
};
exports.deleteCategory = deleteCategory;
