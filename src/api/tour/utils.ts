import { eq } from "drizzle-orm";
import {
  tourHighlightsTable,
  tourImagesTable,
  tourItineraryTable,
} from "../../db/tour";
import { removeFiles, uploadFile } from "../../utils/file";
import type { TTour, UTour } from "./schemas";
import db from "../../db";
import { BadRequestError, ConflictError } from "../../utils/errors";

type DbTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

export const insertTourChildren = async (
  tx: DbTransaction,
  tourId: string,
  data: TTour | UTour,
) => {
  if (data.images?.length)
    await tx.insert(tourImagesTable).values(
      data.images.map((image, position) => ({
        tourId,
        url: image.url,
        position,
      })),
    );
  if (data.highlights?.length)
    await tx.insert(tourHighlightsTable).values(
      data.highlights.map((highlight, position) => ({
        tourId,
        label: highlight.label,
        position,
      })),
    );
  if (data.itinerary?.length)
    await tx.insert(tourItineraryTable).values(
      data.itinerary.map(({ day, title, description }) => ({
        tourId,
        day,
        title,
        description,
      })),
    );
};

export const handleTourImages = async <T extends TTour | UTour>(body: T) => {
  const uploadedImages: string[] = [];
  try {
    if (body.images) {
      body.images = await Promise.all(
        body.images.map(async (image) => {
          if (!image.url.startsWith("/tmp/")) return image;
          const uploaded = await uploadFile(image.url);
          if (!uploaded) throw new Error("A tour image could not be uploaded");
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

export const removeTourImages = async (
  urls?: Array<string | null>,
  current: Array<{ url: string }> = [],
) =>
  removeFiles(
    [...new Set(urls || [])].filter(
      (url) => url && !current.some((image) => image.url === url),
    ),
  );

const validateTourChildIds = (
  incomingIds: string[],
  existingIds: string[],
  relationName: string,
) => {
  if (new Set(incomingIds).size !== incomingIds.length) {
    throw new ConflictError(`Duplicate ${relationName} ID`);
  }
  if (incomingIds.some((id) => !existingIds.includes(id))) {
    throw new BadRequestError(`${relationName} does not belong to this tour`);
  }
};

export const syncTourImages = async (
  tx: DbTransaction,
  tourId: string,
  images: NonNullable<UTour["images"]>,
) => {
  const existing = await tx
    .select()
    .from(tourImagesTable)
    .where(eq(tourImagesTable.tourId, tourId));
  const incomingIds = images.flatMap((image) => (image.id ? [image.id] : []));
  validateTourChildIds(
    incomingIds,
    existing.map((item) => item.id),
    "tour image",
  );

  // Temporarily move positions negative so reordering cannot violate the unique position index.
  for (const [index, item] of existing.entries())
    await tx
      .update(tourImagesTable)
      .set({ position: -(index + 1) })
      .where(eq(tourImagesTable.id, item.id));
  for (const item of existing)
    if (!incomingIds.includes(item.id))
      await tx.delete(tourImagesTable).where(eq(tourImagesTable.id, item.id));
  for (const [position, image] of images.entries()) {
    if (image.id)
      await tx
        .update(tourImagesTable)
        .set({ url: image.url, position })
        .where(eq(tourImagesTable.id, image.id));
    else
      await tx
        .insert(tourImagesTable)
        .values({ tourId, url: image.url, position });
  }
};

export const syncTourHighlights = async (
  tx: DbTransaction,
  tourId: string,
  highlights: NonNullable<UTour["highlights"]>,
) => {
  const existing = await tx
    .select()
    .from(tourHighlightsTable)
    .where(eq(tourHighlightsTable.tourId, tourId));
  const incomingIds = highlights.flatMap((item) => (item.id ? [item.id] : []));
  validateTourChildIds(
    incomingIds,
    existing.map((item) => item.id),
    "tour highlight",
  );
  for (const [index, item] of existing.entries())
    await tx
      .update(tourHighlightsTable)
      .set({ position: -(index + 1) })
      .where(eq(tourHighlightsTable.id, item.id));
  for (const item of existing)
    if (!incomingIds.includes(item.id))
      await tx
        .delete(tourHighlightsTable)
        .where(eq(tourHighlightsTable.id, item.id));
  for (const [position, highlight] of highlights.entries()) {
    if (highlight.id)
      await tx
        .update(tourHighlightsTable)
        .set({ label: highlight.label, position })
        .where(eq(tourHighlightsTable.id, highlight.id));
    else
      await tx
        .insert(tourHighlightsTable)
        .values({ tourId, label: highlight.label, position });
  }
};

export const syncTourItinerary = async (
  tx: DbTransaction,
  tourId: string,
  itinerary: NonNullable<UTour["itinerary"]>,
) => {
  const existing = await tx
    .select()
    .from(tourItineraryTable)
    .where(eq(tourItineraryTable.tourId, tourId));
  const incomingIds = itinerary.flatMap((item) => (item.id ? [item.id] : []));
  validateTourChildIds(
    incomingIds,
    existing.map((item) => item.id),
    "itinerary item",
  );
  if (new Set(itinerary.map((item) => item.day)).size !== itinerary.length)
    throw new ConflictError("Itinerary days must be unique");

  // Days are temporarily negative for the same reason as ordered positions above.
  for (const [index, item] of existing.entries())
    await tx
      .update(tourItineraryTable)
      .set({ day: -(index + 1) })
      .where(eq(tourItineraryTable.id, item.id));
  for (const item of existing)
    if (!incomingIds.includes(item.id))
      await tx
        .delete(tourItineraryTable)
        .where(eq(tourItineraryTable.id, item.id));
  for (const item of itinerary) {
    const values = {
      day: item.day,
      title: item.title,
      description: item.description,
    };
    if (item.id)
      await tx
        .update(tourItineraryTable)
        .set(values)
        .where(eq(tourItineraryTable.id, item.id));
    else await tx.insert(tourItineraryTable).values({ tourId, ...values });
  }
};
