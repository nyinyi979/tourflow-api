"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReview = exports.updateReview = exports.getReviewById = exports.getReviews = exports.createReview = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = __importDefault(require("../../db"));
const review_1 = require("../../db/review");
const tour_1 = require("../../db/tour");
const reviewColumns = {
    id: true,
    customerName: true,
    avatar: true,
    tourId: true,
    rating: true,
    comment: true,
    reviewedAt: true,
    status: true,
};
const reviewWith = { tour: { columns: { id: true, title: true } } };
const refreshTourRating = async (tourId) => {
    const [stats] = await db_1.default
        .select({
        rating: (0, drizzle_orm_1.sql) `coalesce(avg(${review_1.reviewsTable.rating}), 0)::double precision`,
        reviewCount: (0, drizzle_orm_1.sql) `count(*)::integer`,
    })
        .from(review_1.reviewsTable)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(review_1.reviewsTable.tourId, tourId), (0, drizzle_orm_1.eq)(review_1.reviewsTable.status, "published")));
    await db_1.default
        .update(tour_1.toursTable)
        .set({
        rating: Math.round(stats.rating * 10) / 10,
        reviewCount: stats.reviewCount,
        updatedAt: new Date(),
    })
        .where((0, drizzle_orm_1.eq)(tour_1.toursTable.id, tourId));
};
const createReview = async (customer, data) => {
    const rows = await db_1.default
        .insert(review_1.reviewsTable)
        .values({
        customerId: customer.id,
        customerName: customer.name,
        avatar: customer.avatar,
        tourId: data.tourId,
        rating: data.rating,
        comment: data.comment,
    })
        .returning({ id: review_1.reviewsTable.id });
    await refreshTourRating(data.tourId);
    return (0, exports.getReviewById)(rows[0].id);
};
exports.createReview = createReview;
const getReviews = async ({ page, perPage, query, tourId, status, sortBy, orderBy }, publicOnly = false) => {
    const conditions = [];
    if (query)
        conditions.push((0, drizzle_orm_1.ilike)(review_1.reviewsTable.comment, `%${query}%`));
    if (tourId)
        conditions.push((0, drizzle_orm_1.eq)(review_1.reviewsTable.tourId, tourId));
    if (publicOnly)
        conditions.push((0, drizzle_orm_1.eq)(review_1.reviewsTable.status, "published"));
    else if (status)
        conditions.push((0, drizzle_orm_1.eq)(review_1.reviewsTable.status, status));
    const where = conditions.length ? (0, drizzle_orm_1.and)(...conditions) : undefined;
    const columns = {
        rating: review_1.reviewsTable.rating,
        reviewedAt: review_1.reviewsTable.reviewedAt,
        status: review_1.reviewsTable.status,
        createdAt: review_1.reviewsTable.createdAt,
    };
    const orderColumn = sortBy && sortBy in columns
        ? columns[sortBy]
        : review_1.reviewsTable.reviewedAt;
    const [rows, total] = await Promise.all([
        db_1.default.query.reviewsTable.findMany({
            where,
            columns: reviewColumns,
            with: reviewWith,
            orderBy: [orderBy === "asc" ? (0, drizzle_orm_1.asc)(orderColumn) : (0, drizzle_orm_1.desc)(orderColumn)],
            limit: perPage,
            offset: page * perPage,
        }),
        db_1.default.$count(review_1.reviewsTable, where),
    ]);
    return { data: rows, total };
};
exports.getReviews = getReviews;
const getReviewById = async (id) => {
    return db_1.default.query.reviewsTable.findFirst({
        where: (0, drizzle_orm_1.eq)(review_1.reviewsTable.id, id),
        columns: reviewColumns,
        with: reviewWith,
    });
};
exports.getReviewById = getReviewById;
const updateReview = async (data) => {
    const previous = await db_1.default.query.reviewsTable.findFirst({
        where: (0, drizzle_orm_1.eq)(review_1.reviewsTable.id, data.id),
    });
    if (!previous)
        return undefined;
    await db_1.default
        .update(review_1.reviewsTable)
        .set({
        rating: data.rating,
        comment: data.comment,
        status: data.status,
        updatedAt: new Date(),
    })
        .where((0, drizzle_orm_1.eq)(review_1.reviewsTable.id, data.id));
    await refreshTourRating(previous.tourId);
    return (0, exports.getReviewById)(data.id);
};
exports.updateReview = updateReview;
const deleteReview = async (id) => {
    const previous = await (0, exports.getReviewById)(id);
    if (!previous)
        return undefined;
    await db_1.default.delete(review_1.reviewsTable).where((0, drizzle_orm_1.eq)(review_1.reviewsTable.id, id));
    await refreshTourRating(previous.tourId);
    return previous;
};
exports.deleteReview = deleteReview;
