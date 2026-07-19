import { and, asc, desc, eq, ilike } from "drizzle-orm";
import db from "../../db";
import { reviewsTable } from "../../db/review";
import {
  tourHighlightsTable,
  tourImagesTable,
  tourItineraryTable,
  toursTable,
} from "../../db/tour";
import { TourReadRequest, TTour, UTour } from "./types";
import {
  insertTourChildren,
  syncTourHighlights,
  syncTourImages,
  syncTourItinerary,
} from "./utils";

const mapTour = (tour: any) => ({
  ...tour,
  category: tour.category?.label,
  images:
    tour.images?.map((item: any) => ({ id: item.id, url: item.url })) || [],
  highlights:
    tour.highlights?.map((item: any) => ({
      id: item.id,
      label: item.label,
    })) || [],
  itinerary: tour.itinerary?.map(({ tourId, ...item }: any) => item) || [],
  reviews:
    tour.reviews?.map((review: any) => ({
      id: review.id,
      name: review.customerName,
      avatar: review.avatar,
      date: review.reviewedAt,
      rating: review.rating,
      comment: review.comment,
    })) || [],
});

const tourWith = {
  category: true,
  images: { orderBy: asc(tourImagesTable.position) },
  highlights: { orderBy: asc(tourHighlightsTable.position) },
  itinerary: { orderBy: asc(tourItineraryTable.day) },
  reviews: { where: eq(reviewsTable.status, "published") },
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
  return { data: rows.map(mapTour), total };
};

export const getTourById = async (id: string) => {
  const row = await db.query.toursTable.findFirst({
    where: eq(toursTable.id, id),
    with: tourWith,
  });
  return row ? mapTour(row) : undefined;
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
