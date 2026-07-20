import { eq } from "drizzle-orm";
import {
  activityHighlightsTable,
  activityImagesTable,
  activityIncludedItemsTable,
} from "../../db/activity";
import { removeFiles, uploadFile } from "../../utils/file";
import { TActivity, UActivity } from "./types";
import db from "../../db";
import { BadRequestError, ConflictError } from "../../utils/errors";

type DbTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

export const insertActivityChildren = async (
  tx: DbTransaction,
  activityId: string,
  data: TActivity | UActivity,
) => {
  if (data.images?.length)
    await tx.insert(activityImagesTable).values(
      data.images.map((image, position) => ({
        activityId,
        url: image.url,
        position,
      })),
    );
  if (data.highlights?.length)
    await tx.insert(activityHighlightsTable).values(
      data.highlights.map((highlight, position) => ({
        activityId,
        label: highlight.label,
        position,
      })),
    );
  if (data.included?.length)
    await tx.insert(activityIncludedItemsTable).values(
      data.included.map((item, position) => ({
        activityId,
        label: item.label,
        position,
      })),
    );
};

const validateActivityChildIds = (
  incomingIds: string[],
  existingIds: string[],
  relationName: string,
) => {
  if (new Set(incomingIds).size !== incomingIds.length) {
    throw new ConflictError(`Duplicate ${relationName} ID`);
  }
  if (incomingIds.some((id) => !existingIds.includes(id))) {
    throw new BadRequestError(
      `${relationName} does not belong to this activity`,
    );
  }
};

export const syncActivityImages = async (
  tx: DbTransaction,
  activityId: string,
  images: NonNullable<UActivity["images"]>,
) => {
  const existing = await tx
    .select()
    .from(activityImagesTable)
    .where(eq(activityImagesTable.activityId, activityId));
  const incomingIds = images.flatMap((image) => (image.id ? [image.id] : []));
  validateActivityChildIds(
    incomingIds,
    existing.map((item) => item.id),
    "activity image",
  );

  // Free the unique positions before assigning the requested order.
  for (const [index, item] of existing.entries())
    await tx
      .update(activityImagesTable)
      .set({ position: -(index + 1) })
      .where(eq(activityImagesTable.id, item.id));
  for (const item of existing)
    if (!incomingIds.includes(item.id))
      await tx
        .delete(activityImagesTable)
        .where(eq(activityImagesTable.id, item.id));
  for (const [position, image] of images.entries()) {
    if (image.id)
      await tx
        .update(activityImagesTable)
        .set({ url: image.url, position })
        .where(eq(activityImagesTable.id, image.id));
    else
      await tx
        .insert(activityImagesTable)
        .values({ activityId, url: image.url, position });
  }
};

export const syncActivityLabels = async (
  tx: DbTransaction,
  activityId: string,
  items: NonNullable<UActivity["highlights"]>,
  table: typeof activityHighlightsTable | typeof activityIncludedItemsTable,
  relationName: string,
) => {
  const existing = await tx
    .select()
    .from(table)
    .where(eq(table.activityId, activityId));
  const incomingIds = items.flatMap((item) => (item.id ? [item.id] : []));
  validateActivityChildIds(
    incomingIds,
    existing.map((item) => item.id),
    relationName,
  );

  // Free the unique positions before assigning the requested order.
  for (const [index, item] of existing.entries())
    await tx
      .update(table)
      .set({ position: -(index + 1) })
      .where(eq(table.id, item.id));
  for (const item of existing)
    if (!incomingIds.includes(item.id))
      await tx.delete(table).where(eq(table.id, item.id));
  for (const [position, item] of items.entries()) {
    if (item.id)
      await tx
        .update(table)
        .set({ label: item.label, position })
        .where(eq(table.id, item.id));
    else
      await tx
        .insert(table)
        .values({ activityId, label: item.label, position });
  }
};

export const handleActivityImages = async <T extends TActivity | UActivity>(
  body: T,
) => {
  const uploadedImages: string[] = [];
  try {
    if (body.images) {
      body.images = await Promise.all(
        body.images.map(async (image) => {
          if (!image.url.startsWith("/tmp/")) return image;
          const uploaded = await uploadFile(image.url);
          if (!uploaded)
            throw new Error("An activity image could not be uploaded");
          uploadedImages.push(uploaded);
          return { ...image, url: uploaded };
        }),
      );
    }
    return { body, uploadedImages };
  } catch (err) {
    await removeFiles(uploadedImages);
    throw err;
  }
};
export const removeActivityImages = async (
  urls?: Array<string | null>,
  current: Array<{ url: string }> = [],
) =>
  removeFiles(
    [...new Set(urls || [])].filter(
      (url) => url && !current.some((image) => image.url === url),
    ),
  );
