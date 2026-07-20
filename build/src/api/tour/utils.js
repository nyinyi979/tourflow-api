"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncTourItinerary = exports.syncTourHighlights = exports.syncTourImages = exports.removeTourImages = exports.handleTourImages = exports.insertTourChildren = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const tour_1 = require("../../db/tour");
const file_1 = require("../../utils/file");
const errors_1 = require("../../utils/errors");
const insertTourChildren = async (tx, tourId, data) => {
    var _a, _b, _c;
    if ((_a = data.images) === null || _a === void 0 ? void 0 : _a.length)
        await tx.insert(tour_1.tourImagesTable).values(data.images.map((image, position) => ({
            tourId,
            url: image.url,
            position,
        })));
    if ((_b = data.highlights) === null || _b === void 0 ? void 0 : _b.length)
        await tx.insert(tour_1.tourHighlightsTable).values(data.highlights.map((highlight, position) => ({
            tourId,
            label: highlight.label,
            position,
        })));
    if ((_c = data.itinerary) === null || _c === void 0 ? void 0 : _c.length)
        await tx.insert(tour_1.tourItineraryTable).values(data.itinerary.map(({ day, title, description }) => ({
            tourId,
            day,
            title,
            description,
        })));
};
exports.insertTourChildren = insertTourChildren;
const handleTourImages = async (body) => {
    const uploadedImages = [];
    try {
        if (body.images) {
            body.images = await Promise.all(body.images.map(async (image) => {
                if (!image.url.startsWith("/tmp/"))
                    return image;
                const uploaded = await (0, file_1.uploadFile)(image.url);
                if (!uploaded)
                    throw new Error("A tour image could not be uploaded");
                uploadedImages.push(uploaded);
                return { ...image, url: uploaded };
            }));
        }
        return { body, uploadedImages };
    }
    catch (err) {
        await (0, file_1.removeFiles)(uploadedImages);
        throw err;
    }
};
exports.handleTourImages = handleTourImages;
const removeTourImages = async (urls, current = []) => (0, file_1.removeFiles)([...new Set(urls || [])].filter((url) => url && !current.some((image) => image.url === url)));
exports.removeTourImages = removeTourImages;
const validateTourChildIds = (incomingIds, existingIds, relationName) => {
    if (new Set(incomingIds).size !== incomingIds.length) {
        throw new errors_1.ConflictError(`Duplicate ${relationName} ID`);
    }
    if (incomingIds.some((id) => !existingIds.includes(id))) {
        throw new errors_1.BadRequestError(`${relationName} does not belong to this tour`);
    }
};
const syncTourImages = async (tx, tourId, images) => {
    const existing = await tx
        .select()
        .from(tour_1.tourImagesTable)
        .where((0, drizzle_orm_1.eq)(tour_1.tourImagesTable.tourId, tourId));
    const incomingIds = images.flatMap((image) => (image.id ? [image.id] : []));
    validateTourChildIds(incomingIds, existing.map((item) => item.id), "tour image");
    // Temporarily move positions negative so reordering cannot violate the unique position index.
    for (const [index, item] of existing.entries())
        await tx
            .update(tour_1.tourImagesTable)
            .set({ position: -(index + 1) })
            .where((0, drizzle_orm_1.eq)(tour_1.tourImagesTable.id, item.id));
    for (const item of existing)
        if (!incomingIds.includes(item.id))
            await tx.delete(tour_1.tourImagesTable).where((0, drizzle_orm_1.eq)(tour_1.tourImagesTable.id, item.id));
    for (const [position, image] of images.entries()) {
        if (image.id)
            await tx
                .update(tour_1.tourImagesTable)
                .set({ url: image.url, position })
                .where((0, drizzle_orm_1.eq)(tour_1.tourImagesTable.id, image.id));
        else
            await tx
                .insert(tour_1.tourImagesTable)
                .values({ tourId, url: image.url, position });
    }
};
exports.syncTourImages = syncTourImages;
const syncTourHighlights = async (tx, tourId, highlights) => {
    const existing = await tx
        .select()
        .from(tour_1.tourHighlightsTable)
        .where((0, drizzle_orm_1.eq)(tour_1.tourHighlightsTable.tourId, tourId));
    const incomingIds = highlights.flatMap((item) => (item.id ? [item.id] : []));
    validateTourChildIds(incomingIds, existing.map((item) => item.id), "tour highlight");
    for (const [index, item] of existing.entries())
        await tx
            .update(tour_1.tourHighlightsTable)
            .set({ position: -(index + 1) })
            .where((0, drizzle_orm_1.eq)(tour_1.tourHighlightsTable.id, item.id));
    for (const item of existing)
        if (!incomingIds.includes(item.id))
            await tx
                .delete(tour_1.tourHighlightsTable)
                .where((0, drizzle_orm_1.eq)(tour_1.tourHighlightsTable.id, item.id));
    for (const [position, highlight] of highlights.entries()) {
        if (highlight.id)
            await tx
                .update(tour_1.tourHighlightsTable)
                .set({ label: highlight.label, position })
                .where((0, drizzle_orm_1.eq)(tour_1.tourHighlightsTable.id, highlight.id));
        else
            await tx
                .insert(tour_1.tourHighlightsTable)
                .values({ tourId, label: highlight.label, position });
    }
};
exports.syncTourHighlights = syncTourHighlights;
const syncTourItinerary = async (tx, tourId, itinerary) => {
    const existing = await tx
        .select()
        .from(tour_1.tourItineraryTable)
        .where((0, drizzle_orm_1.eq)(tour_1.tourItineraryTable.tourId, tourId));
    const incomingIds = itinerary.flatMap((item) => (item.id ? [item.id] : []));
    validateTourChildIds(incomingIds, existing.map((item) => item.id), "itinerary item");
    if (new Set(itinerary.map((item) => item.day)).size !== itinerary.length)
        throw new errors_1.ConflictError("Itinerary days must be unique");
    // Days are temporarily negative for the same reason as ordered positions above.
    for (const [index, item] of existing.entries())
        await tx
            .update(tour_1.tourItineraryTable)
            .set({ day: -(index + 1) })
            .where((0, drizzle_orm_1.eq)(tour_1.tourItineraryTable.id, item.id));
    for (const item of existing)
        if (!incomingIds.includes(item.id))
            await tx
                .delete(tour_1.tourItineraryTable)
                .where((0, drizzle_orm_1.eq)(tour_1.tourItineraryTable.id, item.id));
    for (const item of itinerary) {
        const values = {
            day: item.day,
            title: item.title,
            description: item.description,
        };
        if (item.id)
            await tx
                .update(tour_1.tourItineraryTable)
                .set(values)
                .where((0, drizzle_orm_1.eq)(tour_1.tourItineraryTable.id, item.id));
        else
            await tx.insert(tour_1.tourItineraryTable).values({ tourId, ...values });
    }
};
exports.syncTourItinerary = syncTourItinerary;
