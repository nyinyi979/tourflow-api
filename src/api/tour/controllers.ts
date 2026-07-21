import { and, asc, desc, eq, ilike } from "drizzle-orm";
import db from "../../db";
import { reviewsTable } from "../../db/review";
import {
  tourHighlightsTable,
  tourImagesTable,
  tourItineraryTable,
  toursTable,
} from "../../db/tour";
import type { TourReadRequest, TTour, UTour } from "./schemas";
import {
  insertTourChildren,
  syncTourHighlights,
  syncTourImages,
  syncTourItinerary,
} from "./utils";

const tourWith = {
  category: { columns: { label: true } },
  images: {
    columns: { id: true, url: true },
    orderBy: asc(tourImagesTable.position),
  },
  highlights: {
    columns: { id: true, label: true },
    orderBy: asc(tourHighlightsTable.position),
  },
  itinerary: {
    columns: { id: true, day: true, title: true, description: true },
    orderBy: asc(tourItineraryTable.day),
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
    where: eq(reviewsTable.status, "published"),
  },
} as const;

export const createTour = async (data: TTour) => {
  const id = await db.transaction(async (tx) => {
    const rows = await tx
      .insert(toursTable)
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
      .returning({ id: toursTable.id });
    await insertTourChildren(tx, rows[0].id, data);
    return rows[0].id;
  });
  return getTourById(id);
};

export const getTours = async ({
  page,
  perPage,
  query,
  categoryId,
  difficulty,
  sortBy,
  orderBy,
}: TourReadRequest) => {
  const conditions = [];
  if (query) conditions.push(ilike(toursTable.title, `%${query}%`));
  if (categoryId) conditions.push(eq(toursTable.categoryId, categoryId));
  if (difficulty) conditions.push(eq(toursTable.difficulty, difficulty));
  const where = conditions.length ? and(...conditions) : undefined;
  const columns = {
    title: toursTable.title,
    price: toursTable.price,
    duration: toursTable.duration,
    rating: toursTable.rating,
    popularity: toursTable.popularity,
    createdAt: toursTable.createdAt,
  };
  const orderColumn =
    sortBy && sortBy in columns
      ? columns[sortBy as keyof typeof columns]
      : toursTable.createdAt;
  const [rows, total] = await Promise.all([
    db.query.toursTable.findMany({
      where,
      with: tourWith,
      orderBy: [orderBy === "asc" ? asc(orderColumn) : desc(orderColumn)],
      limit: perPage,
      offset: page * perPage,
    }),
    db.$count(toursTable, where),
  ]);
  return { data: rows, total };
};

export const getTourById = async (id: string) => {
  return db.query.toursTable.findFirst({
    where: eq(toursTable.id, id),
    with: tourWith,
  });
};

export const updateTour = async (data: UTour) => {
  await db.transaction(async (tx) => {
    await tx
      .update(toursTable)
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
      .where(eq(toursTable.id, data.id));
    if (data.images) await syncTourImages(tx, data.id, data.images);
    if (data.highlights) await syncTourHighlights(tx, data.id, data.highlights);
    if (data.itinerary) await syncTourItinerary(tx, data.id, data.itinerary);
  });
  return getTourById(data.id);
};

export const deleteTour = async (id: string) => {
  const previous = await getTourById(id);
  if (!previous) return undefined;
  await db.delete(toursTable).where(eq(toursTable.id, id));
  return previous;
};
