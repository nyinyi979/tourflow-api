"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTour = exports.updateTour = exports.getTourById = exports.getTours = exports.createTour = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = __importDefault(require("../../db"));
const review_1 = require("../../db/review");
const tour_1 = require("../../db/tour");
const utils_1 = require("./utils");
const tourWith = {
    category: { columns: { label: true } },
    images: {
        columns: { id: true, url: true },
        orderBy: (0, drizzle_orm_1.asc)(tour_1.tourImagesTable.position),
    },
    highlights: {
        columns: { id: true, label: true },
        orderBy: (0, drizzle_orm_1.asc)(tour_1.tourHighlightsTable.position),
    },
    itinerary: {
        columns: { id: true, day: true, title: true, description: true },
        orderBy: (0, drizzle_orm_1.asc)(tour_1.tourItineraryTable.day),
    },
    reviews: {
        columns: {
            id: true,
            customerName: true,
            avatar: true,
            reviewedAt: true,
            rating: true,
            comment: true,
        },
        where: (0, drizzle_orm_1.eq)(review_1.reviewsTable.status, "published"),
    },
};
const createTour = async (data) => {
    const id = await db_1.default.transaction(async (tx) => {
        const rows = await tx
            .insert(tour_1.toursTable)
            .values({
            slug: data.slug,
            title: data.title,
            description: data.description,
            price: data.price,
            duration: data.duration,
            difficulty: data.difficulty,
            categoryId: data.categoryId,
            capacity: data.capacity,
            rating: data.rating,
            reviewCount: data.reviewCount,
            popularity: data.popularity,
        })
            .returning({ id: tour_1.toursTable.id });
        await (0, utils_1.insertTourChildren)(tx, rows[0].id, data);
        return rows[0].id;
    });
    return (0, exports.getTourById)(id);
};
exports.createTour = createTour;
const getTours = async ({ page, perPage, query, categoryId, difficulty, sortBy, orderBy, }) => {
    const conditions = [];
    if (query)
        conditions.push((0, drizzle_orm_1.ilike)(tour_1.toursTable.title, `%${query}%`));
    if (categoryId)
        conditions.push((0, drizzle_orm_1.eq)(tour_1.toursTable.categoryId, categoryId));
    if (difficulty)
        conditions.push((0, drizzle_orm_1.eq)(tour_1.toursTable.difficulty, difficulty));
    const where = conditions.length ? (0, drizzle_orm_1.and)(...conditions) : undefined;
    const columns = {
        title: tour_1.toursTable.title,
        price: tour_1.toursTable.price,
        duration: tour_1.toursTable.duration,
        rating: tour_1.toursTable.rating,
        popularity: tour_1.toursTable.popularity,
        createdAt: tour_1.toursTable.createdAt,
    };
    const orderColumn = sortBy && sortBy in columns
        ? columns[sortBy]
        : tour_1.toursTable.createdAt;
    const [rows, total] = await Promise.all([
        db_1.default.query.toursTable.findMany({
            where,
            with: tourWith,
            orderBy: [orderBy === "asc" ? (0, drizzle_orm_1.asc)(orderColumn) : (0, drizzle_orm_1.desc)(orderColumn)],
            limit: perPage,
            offset: page * perPage,
        }),
        db_1.default.$count(tour_1.toursTable, where),
    ]);
    return { data: rows, total };
};
exports.getTours = getTours;
const getTourById = async (id) => {
    return db_1.default.query.toursTable.findFirst({
        where: (0, drizzle_orm_1.eq)(tour_1.toursTable.id, id),
        with: tourWith,
    });
};
exports.getTourById = getTourById;
const updateTour = async (data) => {
    await db_1.default.transaction(async (tx) => {
        await tx
            .update(tour_1.toursTable)
            .set({
            slug: data.slug,
            title: data.title,
            description: data.description,
            price: data.price,
            duration: data.duration,
            difficulty: data.difficulty,
            categoryId: data.categoryId,
            capacity: data.capacity,
            rating: data.rating,
            reviewCount: data.reviewCount,
            popularity: data.popularity,
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(tour_1.toursTable.id, data.id));
        if (data.images)
            await (0, utils_1.syncTourImages)(tx, data.id, data.images);
        if (data.highlights)
            await (0, utils_1.syncTourHighlights)(tx, data.id, data.highlights);
        if (data.itinerary)
            await (0, utils_1.syncTourItinerary)(tx, data.id, data.itinerary);
    });
    return (0, exports.getTourById)(data.id);
};
exports.updateTour = updateTour;
const deleteTour = async (id) => {
    const previous = await (0, exports.getTourById)(id);
    if (!previous)
        return undefined;
    await db_1.default.delete(tour_1.toursTable).where((0, drizzle_orm_1.eq)(tour_1.toursTable.id, id));
    return previous;
};
exports.deleteTour = deleteTour;
