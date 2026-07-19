import { and, asc, desc, eq, ilike } from "drizzle-orm";
import db from "../../db";
import { reviewsTable } from "../../db/review";
import { toursTable } from "../../db/tour";
import { ReviewReadRequest, TReview, UReview } from "./types";
const reviewWith = { tour: { columns: { id: true, title: true } } } as const;
const mapReview = (row: any) => ({
  id: row.id,
  customer: row.customerName,
  name: row.customerName,
  avatar: row.avatar,
  tour: row.tour?.title,
  tourId: row.tourId,
  rating: row.rating,
  comment: row.comment,
  date: row.reviewedAt,
  status: row.status,
});

const refreshTourRating = async (tourId: string) => {
  const rows = await db.query.reviewsTable.findMany({
    where: and(
      eq(reviewsTable.tourId, tourId),
      eq(reviewsTable.status, "published"),
    ),
    columns: { rating: true },
  });
  const rating = rows.length
    ? rows.reduce((sum, row) => sum + row.rating, 0) / rows.length
    : 0;
  await db
    .update(toursTable)
    .set({
      rating: Math.round(rating * 10) / 10,
      reviewCount: rows.length,
      updatedAt: new Date(),
    })
    .where(eq(toursTable.id, tourId));
};

export const createReview = async (
  customer: { id: string; name: string; avatar: string | null },
  data: TReview,
) => {
  const rows = await db
    .insert(reviewsTable)
    .values({
      customerId: customer.id,
      customerName: customer.name,
      avatar: customer.avatar,
      tourId: data.tourId,
      rating: data.rating,
      comment: data.comment,
    })
    .returning({ id: reviewsTable.id });
  await refreshTourRating(data.tourId);
  return getReviewById(rows[0].id);
};

export const getReviews = async (
  { page, perPage, query, tourId, status, sortBy, orderBy }: ReviewReadRequest,
  publicOnly = false,
) => {
  const conditions = [];
  if (query) conditions.push(ilike(reviewsTable.comment, `%${query}%`));
  if (tourId) conditions.push(eq(reviewsTable.tourId, tourId));
  if (publicOnly) conditions.push(eq(reviewsTable.status, "published"));
  else if (status) conditions.push(eq(reviewsTable.status, status));
  const where = conditions.length ? and(...conditions) : undefined;
  const columns = {
    rating: reviewsTable.rating,
    reviewedAt: reviewsTable.reviewedAt,
    status: reviewsTable.status,
    createdAt: reviewsTable.createdAt,
  };
  const orderColumn =
    sortBy && sortBy in columns
      ? columns[sortBy as keyof typeof columns]
      : reviewsTable.reviewedAt;
  const [rows, total] = await Promise.all([
    db.query.reviewsTable.findMany({
      where,
      with: reviewWith,
      orderBy: [orderBy === "asc" ? asc(orderColumn) : desc(orderColumn)],
      limit: perPage,
      offset: page * perPage,
    }),
    db.$count(reviewsTable, where),
  ]);
  return { data: rows.map(mapReview), total };
};
export const getReviewById = async (id: string) => {
  const row = await db.query.reviewsTable.findFirst({
    where: eq(reviewsTable.id, id),
    with: reviewWith,
  });
  return row ? mapReview(row) : undefined;
};
export const updateReview = async (data: UReview) => {
  const previous = await db.query.reviewsTable.findFirst({
    where: eq(reviewsTable.id, data.id),
  });
  if (!previous) return undefined;
  await db
    .update(reviewsTable)
    .set({
      rating: data.rating,
      comment: data.comment,
      status: data.status,
      updatedAt: new Date(),
    })
    .where(eq(reviewsTable.id, data.id));
  await refreshTourRating(previous.tourId);
  return getReviewById(data.id);
};
export const deleteReview = async (id: string) => {
  const previous = await getReviewById(id);
  if (!previous) return undefined;
  await db.delete(reviewsTable).where(eq(reviewsTable.id, id));
  await refreshTourRating(previous.tourId);
  return previous;
};
