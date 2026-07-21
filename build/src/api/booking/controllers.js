"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBooking = exports.payBooking = exports.updateBooking = exports.getBookingById = exports.getBookings = exports.createBooking = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const node_crypto_1 = require("node:crypto");
const db_1 = __importDefault(require("../../db"));
const activity_1 = require("../../db/activity");
const booking_1 = require("../../db/booking");
const tour_1 = require("../../db/tour");
const errors_1 = require("../../utils/errors");
const bookingWith = {
    customer: { columns: { name: true, email: true, avatar: true } },
    tour: { columns: { title: true } },
    activity: { columns: { title: true } },
    events: {
        columns: { occurredAt: true, label: true },
        orderBy: (0, drizzle_orm_1.asc)(booking_1.bookingActivityTable.occurredAt),
    },
};
const getItemPrice = async (data) => {
    if (data.itemType === "tour" && data.tourId)
        return db_1.default.query.toursTable.findFirst({
            where: (0, drizzle_orm_1.eq)(tour_1.toursTable.id, data.tourId),
            columns: { price: true },
        });
    if (data.itemType === "activity" && data.activityId)
        return db_1.default.query.activitiesTable.findFirst({
            where: (0, drizzle_orm_1.eq)(activity_1.activitiesTable.id, data.activityId),
            columns: { price: true },
        });
    return undefined;
};
const createBooking = async (customerId, data) => {
    const item = await getItemPrice(data);
    if (!item)
        throw new errors_1.NotFoundError("Booking item not found");
    const adults = data.adults;
    const children = data.children || 0;
    const totalPrice = item.price * adults + Math.round(item.price * 0.5) * children;
    const id = await db_1.default.transaction(async (tx) => {
        const rows = await tx
            .insert(booking_1.bookingsTable)
            .values({
            customerId,
            itemType: data.itemType,
            tourId: data.itemType === "tour" ? data.tourId : null,
            activityId: data.itemType === "activity" ? data.activityId : null,
            travelDate: data.travelDate,
            adults,
            children,
            totalPrice,
            bookingNumber: `BK-${Date.now()}-${(0, node_crypto_1.randomUUID)().slice(0, 6).toUpperCase()}`,
        })
            .returning({ id: booking_1.bookingsTable.id });
        await tx.insert(booking_1.bookingActivityTable).values({
            bookingId: rows[0].id,
            occurredAt: new Date(),
            label: "Booking created",
        });
        return rows[0].id;
    });
    return (0, exports.getBookingById)(id);
};
exports.createBooking = createBooking;
const getBookings = async ({ page, perPage, query, status, itemType, sortBy, orderBy, }, customerId) => {
    const conditions = [];
    if (query)
        conditions.push((0, drizzle_orm_1.ilike)(booking_1.bookingsTable.bookingNumber, `%${query}%`));
    if (status)
        conditions.push((0, drizzle_orm_1.eq)(booking_1.bookingsTable.status, status));
    if (itemType)
        conditions.push((0, drizzle_orm_1.eq)(booking_1.bookingsTable.itemType, itemType));
    if (customerId)
        conditions.push((0, drizzle_orm_1.eq)(booking_1.bookingsTable.customerId, customerId));
    const where = conditions.length ? (0, drizzle_orm_1.and)(...conditions) : undefined;
    const columns = {
        bookingNumber: booking_1.bookingsTable.bookingNumber,
        travelDate: booking_1.bookingsTable.travelDate,
        totalPrice: booking_1.bookingsTable.totalPrice,
        status: booking_1.bookingsTable.status,
        createdAt: booking_1.bookingsTable.createdAt,
    };
    const orderColumn = sortBy && sortBy in columns
        ? columns[sortBy]
        : booking_1.bookingsTable.createdAt;
    const [rows, total] = await Promise.all([
        db_1.default.query.bookingsTable.findMany({
            where,
            with: bookingWith,
            orderBy: [orderBy === "asc" ? (0, drizzle_orm_1.asc)(orderColumn) : (0, drizzle_orm_1.desc)(orderColumn)],
            limit: perPage,
            offset: page * perPage,
        }),
        db_1.default.$count(booking_1.bookingsTable, where),
    ]);
    return { data: rows, total };
};
exports.getBookings = getBookings;
const getBookingById = async (id) => {
    return db_1.default.query.bookingsTable.findFirst({
        where: (0, drizzle_orm_1.eq)(booking_1.bookingsTable.id, id),
        with: bookingWith,
    });
};
exports.getBookingById = getBookingById;
const updateBooking = async (id, data) => {
    var _a, _b;
    const current = await db_1.default.query.bookingsTable.findFirst({
        where: (0, drizzle_orm_1.eq)(booking_1.bookingsTable.id, id),
    });
    if (!current)
        return undefined;
    let totalPrice = current.totalPrice;
    if (data.adults !== undefined || data.children !== undefined) {
        const item = await getItemPrice(current);
        if (!item)
            throw new errors_1.NotFoundError("Booking item not found");
        const adults = (_a = data.adults) !== null && _a !== void 0 ? _a : current.adults;
        const children = (_b = data.children) !== null && _b !== void 0 ? _b : current.children;
        totalPrice = item.price * adults + Math.round(item.price * 0.5) * children;
    }
    await db_1.default.transaction(async (tx) => {
        await tx
            .update(booking_1.bookingsTable)
            .set({
            travelDate: data.travelDate,
            adults: data.adults,
            children: data.children,
            status: data.status,
            totalPrice,
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(booking_1.bookingsTable.id, id));
        if (data.status && data.status !== current.status)
            await tx.insert(booking_1.bookingActivityTable).values({
                bookingId: id,
                occurredAt: new Date(),
                label: `Status changed to ${data.status}`,
            });
    });
    return (0, exports.getBookingById)(id);
};
exports.updateBooking = updateBooking;
const payBooking = async (id, customerId, { paymentMethod }) => {
    const current = await db_1.default.query.bookingsTable.findFirst({
        where: (0, drizzle_orm_1.eq)(booking_1.bookingsTable.id, id),
    });
    if (!current)
        throw new errors_1.NotFoundError("Booking not found");
    if (current.customerId !== customerId)
        throw new errors_1.ForbiddenError();
    if (current.paymentStatus === "paid")
        return (0, exports.getBookingById)(id);
    if (current.status === "cancelled" || current.status === "completed") {
        throw new errors_1.BadRequestError(`A ${current.status} booking cannot be paid.`);
    }
    const paidAt = new Date();
    const paymentReference = `PAY-${Date.now()}-${(0, node_crypto_1.randomUUID)()
        .slice(0, 6)
        .toUpperCase()}`;
    await db_1.default.transaction(async (tx) => {
        await tx
            .update(booking_1.bookingsTable)
            .set({
            status: "confirmed",
            paymentStatus: "paid",
            paymentMethod,
            paymentReference,
            paidAt,
            updatedAt: paidAt,
        })
            .where((0, drizzle_orm_1.eq)(booking_1.bookingsTable.id, id));
        await tx.insert(booking_1.bookingActivityTable).values({
            bookingId: id,
            occurredAt: paidAt,
            label: "Payment received",
        });
    });
    return (0, exports.getBookingById)(id);
};
exports.payBooking = payBooking;
const deleteBooking = async (id) => {
    const previous = await (0, exports.getBookingById)(id);
    if (!previous)
        return undefined;
    await db_1.default.delete(booking_1.bookingsTable).where((0, drizzle_orm_1.eq)(booking_1.bookingsTable.id, id));
    return previous;
};
exports.deleteBooking = deleteBooking;
