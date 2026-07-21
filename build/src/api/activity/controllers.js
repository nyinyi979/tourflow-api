"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteActivity = exports.updateActivity = exports.getActivityById = exports.getActivities = exports.createActivity = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = __importDefault(require("../../db"));
const activity_1 = require("../../db/activity");
const utils_1 = require("./utils");
const activityWith = {
    category: { columns: { label: true } },
    images: {
        columns: { id: true, url: true },
        orderBy: (0, drizzle_orm_1.asc)(activity_1.activityImagesTable.position),
    },
    highlights: {
        columns: { id: true, label: true },
        orderBy: (0, drizzle_orm_1.asc)(activity_1.activityHighlightsTable.position),
    },
    included: {
        columns: { id: true, label: true },
        orderBy: (0, drizzle_orm_1.asc)(activity_1.activityIncludedItemsTable.position),
    },
};
const createActivity = async (data) => {
    const id = await db_1.default.transaction(async (tx) => {
        const rows = await tx
            .insert(activity_1.activitiesTable)
            .values({
            slug: data.slug,
            title: data.title,
            description: data.description,
            longDescription: data.longDescription,
            price: data.price,
            duration: data.duration,
            categoryId: data.categoryId,
            rating: data.rating,
            meetingPoint: data.meetingPoint,
        })
            .returning({ id: activity_1.activitiesTable.id });
        await (0, utils_1.insertActivityChildren)(tx, rows[0].id, data);
        return rows[0].id;
    });
    return (0, exports.getActivityById)(id);
};
exports.createActivity = createActivity;
const getActivities = async ({ page, perPage, query, categoryId, sortBy, orderBy, }) => {
    const conditions = [];
    if (query)
        conditions.push((0, drizzle_orm_1.ilike)(activity_1.activitiesTable.title, `%${query}%`));
    if (categoryId)
        conditions.push((0, drizzle_orm_1.eq)(activity_1.activitiesTable.categoryId, categoryId));
    const where = conditions.length ? (0, drizzle_orm_1.and)(...conditions) : undefined;
    const columns = {
        title: activity_1.activitiesTable.title,
        price: activity_1.activitiesTable.price,
        duration: activity_1.activitiesTable.duration,
        rating: activity_1.activitiesTable.rating,
        createdAt: activity_1.activitiesTable.createdAt,
    };
    const orderColumn = sortBy && sortBy in columns
        ? columns[sortBy]
        : activity_1.activitiesTable.createdAt;
    const [rows, total] = await Promise.all([
        db_1.default.query.activitiesTable.findMany({
            where,
            with: activityWith,
            orderBy: [orderBy === "asc" ? (0, drizzle_orm_1.asc)(orderColumn) : (0, drizzle_orm_1.desc)(orderColumn)],
            limit: perPage,
            offset: page * perPage,
        }),
        db_1.default.$count(activity_1.activitiesTable, where),
    ]);
    return { data: rows, total };
};
exports.getActivities = getActivities;
const getActivityById = async (id) => {
    return db_1.default.query.activitiesTable.findFirst({
        where: (0, drizzle_orm_1.eq)(activity_1.activitiesTable.id, id),
        with: activityWith,
    });
};
exports.getActivityById = getActivityById;
const updateActivity = async (data) => {
    await db_1.default.transaction(async (tx) => {
        await tx
            .update(activity_1.activitiesTable)
            .set({
            slug: data.slug,
            title: data.title,
            description: data.description,
            longDescription: data.longDescription,
            price: data.price,
            duration: data.duration,
            categoryId: data.categoryId,
            rating: data.rating,
            meetingPoint: data.meetingPoint,
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(activity_1.activitiesTable.id, data.id));
        if (data.images)
            await (0, utils_1.syncActivityImages)(tx, data.id, data.images);
        if (data.highlights)
            await (0, utils_1.syncActivityLabels)(tx, data.id, data.highlights, activity_1.activityHighlightsTable, "activity highlight");
        if (data.included)
            await (0, utils_1.syncActivityLabels)(tx, data.id, data.included, activity_1.activityIncludedItemsTable, "included item");
    });
    return (0, exports.getActivityById)(data.id);
};
exports.updateActivity = updateActivity;
const deleteActivity = async (id) => {
    const previous = await (0, exports.getActivityById)(id);
    if (!previous)
        return undefined;
    await db_1.default.delete(activity_1.activitiesTable).where((0, drizzle_orm_1.eq)(activity_1.activitiesTable.id, id));
    return previous;
};
exports.deleteActivity = deleteActivity;
