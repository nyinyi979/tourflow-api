"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTestimonial = exports.updateTestimonial = exports.getTestimonialById = exports.getTestimonials = exports.createTestimonial = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = __importDefault(require("../../db"));
const testimonial_1 = require("../../db/testimonial");
const createTestimonial = async (data) => {
    const rows = await db_1.default
        .insert(testimonial_1.testimonialsTable)
        .values({
        name: data.name,
        avatar: data.avatar,
        quote: data.quote,
        rating: data.rating,
    })
        .returning();
    return rows[0];
};
exports.createTestimonial = createTestimonial;
const getTestimonials = async ({ page, perPage, query, sortBy, orderBy, }) => {
    const where = query ? (0, drizzle_orm_1.ilike)(testimonial_1.testimonialsTable.name, `%${query}%`) : undefined;
    const columns = {
        name: testimonial_1.testimonialsTable.name,
        rating: testimonial_1.testimonialsTable.rating,
        createdAt: testimonial_1.testimonialsTable.createdAt,
    };
    const orderColumn = sortBy && sortBy in columns
        ? columns[sortBy]
        : testimonial_1.testimonialsTable.createdAt;
    const [data, total] = await Promise.all([
        db_1.default.query.testimonialsTable.findMany({
            where,
            orderBy: [orderBy === "asc" ? (0, drizzle_orm_1.asc)(orderColumn) : (0, drizzle_orm_1.desc)(orderColumn)],
            limit: perPage,
            offset: page * perPage,
        }),
        db_1.default.$count(testimonial_1.testimonialsTable, where),
    ]);
    return { data, total };
};
exports.getTestimonials = getTestimonials;
const getTestimonialById = async (id) => db_1.default.query.testimonialsTable.findFirst({ where: (0, drizzle_orm_1.eq)(testimonial_1.testimonialsTable.id, id) });
exports.getTestimonialById = getTestimonialById;
const updateTestimonial = async (data) => {
    const rows = await db_1.default
        .update(testimonial_1.testimonialsTable)
        .set({
        name: data.name,
        avatar: data.avatar,
        quote: data.quote,
        rating: data.rating,
        updatedAt: new Date(),
    })
        .where((0, drizzle_orm_1.eq)(testimonial_1.testimonialsTable.id, data.id))
        .returning();
    return rows[0];
};
exports.updateTestimonial = updateTestimonial;
const deleteTestimonial = async (id) => {
    const rows = await db_1.default
        .delete(testimonial_1.testimonialsTable)
        .where((0, drizzle_orm_1.eq)(testimonial_1.testimonialsTable.id, id))
        .returning();
    return rows[0];
};
exports.deleteTestimonial = deleteTestimonial;
