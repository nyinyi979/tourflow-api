"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeActivityImages = exports.handleActivityImages = exports.syncActivityLabels = exports.syncActivityImages = exports.insertActivityChildren = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const activity_1 = require("../../db/activity");
const file_1 = require("../../utils/file");
const insertActivityChildren = async (tx, activityId, data) => {
    var _a, _b, _c;
    if ((_a = data.images) === null || _a === void 0 ? void 0 : _a.length)
        await tx.insert(activity_1.activityImagesTable).values(data.images.map((image, position) => ({
            activityId,
            url: image.url,
            position,
        })));
    if ((_b = data.highlights) === null || _b === void 0 ? void 0 : _b.length)
        await tx.insert(activity_1.activityHighlightsTable).values(data.highlights.map((highlight, position) => ({
            activityId,
            label: highlight.label,
            position,
        })));
    if ((_c = data.included) === null || _c === void 0 ? void 0 : _c.length)
        await tx.insert(activity_1.activityIncludedItemsTable).values(data.included.map((item, position) => ({
            activityId,
            label: item.label,
            position,
        })));
};
exports.insertActivityChildren = insertActivityChildren;
const validateActivityChildIds = (incomingIds, existingIds, relationName) => {
    if (new Set(incomingIds).size !== incomingIds.length) {
        throw new Error(`Duplicate ${relationName} ID`);
    }
    if (incomingIds.some((id) => !existingIds.includes(id))) {
        throw new Error(`${relationName} does not belong to this activity`);
    }
};
const syncActivityImages = async (tx, activityId, images) => {
    const existing = await tx
        .select()
        .from(activity_1.activityImagesTable)
        .where((0, drizzle_orm_1.eq)(activity_1.activityImagesTable.activityId, activityId));
    const incomingIds = images.flatMap((image) => (image.id ? [image.id] : []));
    validateActivityChildIds(incomingIds, existing.map((item) => item.id), "activity image");
    // Free the unique positions before assigning the requested order.
    for (const [index, item] of existing.entries())
        await tx
            .update(activity_1.activityImagesTable)
            .set({ position: -(index + 1) })
            .where((0, drizzle_orm_1.eq)(activity_1.activityImagesTable.id, item.id));
    for (const item of existing)
        if (!incomingIds.includes(item.id))
            await tx
                .delete(activity_1.activityImagesTable)
                .where((0, drizzle_orm_1.eq)(activity_1.activityImagesTable.id, item.id));
    for (const [position, image] of images.entries()) {
        if (image.id)
            await tx
                .update(activity_1.activityImagesTable)
                .set({ url: image.url, position })
                .where((0, drizzle_orm_1.eq)(activity_1.activityImagesTable.id, image.id));
        else
            await tx
                .insert(activity_1.activityImagesTable)
                .values({ activityId, url: image.url, position });
    }
};
exports.syncActivityImages = syncActivityImages;
const syncActivityLabels = async (tx, activityId, items, table, relationName) => {
    const existing = await tx
        .select()
        .from(table)
        .where((0, drizzle_orm_1.eq)(table.activityId, activityId));
    const incomingIds = items.flatMap((item) => (item.id ? [item.id] : []));
    validateActivityChildIds(incomingIds, existing.map((item) => item.id), relationName);
    // Free the unique positions before assigning the requested order.
    for (const [index, item] of existing.entries())
        await tx
            .update(table)
            .set({ position: -(index + 1) })
            .where((0, drizzle_orm_1.eq)(table.id, item.id));
    for (const item of existing)
        if (!incomingIds.includes(item.id))
            await tx.delete(table).where((0, drizzle_orm_1.eq)(table.id, item.id));
    for (const [position, item] of items.entries()) {
        if (item.id)
            await tx
                .update(table)
                .set({ label: item.label, position })
                .where((0, drizzle_orm_1.eq)(table.id, item.id));
        else
            await tx
                .insert(table)
                .values({ activityId, label: item.label, position });
    }
};
exports.syncActivityLabels = syncActivityLabels;
const handleActivityImages = async (body) => {
    const uploadedImages = [];
    try {
        if (body.images) {
            body.images = await Promise.all(body.images.map(async (image) => {
                if (!image.url.startsWith("/tmp/"))
                    return image;
                const uploaded = await (0, file_1.uploadFile)(image.url);
                if (!uploaded)
                    throw new Error("An activity image could not be uploaded");
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
exports.handleActivityImages = handleActivityImages;
const removeActivityImages = async (urls, current = []) => (0, file_1.removeFiles)([...new Set(urls || [])].filter((url) => url && !current.some((image) => image.url === url)));
exports.removeActivityImages = removeActivityImages;
