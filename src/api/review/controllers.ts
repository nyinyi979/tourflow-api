import { and, asc, desc, eq, ilike, sql } from "drizzle-orm";
import db from "../../db";
import { reviewsTable } from "../../db/review";
import { toursTable } from "../../db/tour";
import type { ReviewReadRequest, TReview, UReview } from "./schemas";
const reviewColumns = {
  id: true,
  customerName: true,
  avatar: true,
  tourId: true,
  rating: true,
  comment: true,
  reviewedAt: true,
  status: true,
} as const;
const reviewWith = { tour: { columns: { id: true, title: true } } } as const;

const refreshTourRating = async (tourId: string) => {
  const [stats] = await db
    .select({
      rating: sql<number>`coalesce(avg(${reviewsTable.rating}), 0)::double precision`,
      reviewCount: sql<number>`count(*)::integer`,
    })
    .from(reviewsTable)
    .where(
      and(
        eq(reviewsTable.tourId, tourId),
        eq(reviewsTable.status, "published"),
      ),
    );
  await db
    .update(toursTable)
    .set({
      rating: Math.round(stats.rating * 10) / 10,
      reviewCount: stats.reviewCount,
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
      columns: reviewColumns,
      with: reviewWith,
      orderBy: [orderBy === "asc" ? asc(orderColumn) : desc(orderColumn)],
      limit: perPage,
      offset: page * perPage,
    }),
    db.$count(reviewsTable, where),
  ]);
  return { data: rows, total };
};
export const getReviewById = async (id: string) => {
  return db.query.reviewsTable.findFirst({
    where: eq(reviewsTable.id, id),
    columns: reviewColumns,
    with: reviewWith,
  });
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
