import { asc, desc, eq, ilike } from "drizzle-orm";
import db from "../../db";
import { testimonialsTable } from "../../db/testimonial";
import type {
  TestimonialReadRequest,
  TTestimonial,
  UTestimonial,
} from "./schemas";

export const createTestimonial = async (data: TTestimonial) => {
  const rows = await db
    .insert(testimonialsTable)
    .values({
      name: data.name,
      avatar: data.avatar,
      quote: data.quote,
      rating: data.rating,
    })
    .returning();
  return rows[0];
};

export const getTestimonials = async ({
  page,
  perPage,
  query,
  sortBy,
  orderBy,
}: TestimonialReadRequest) => {
  const where = query ? ilike(testimonialsTable.name, `%${query}%`) : undefined;
  const columns = {
    name: testimonialsTable.name,
    rating: testimonialsTable.rating,
    createdAt: testimonialsTable.createdAt,
  };
  const orderColumn =
    sortBy && sortBy in columns
      ? columns[sortBy as keyof typeof columns]
      : testimonialsTable.createdAt;
  const [data, total] = await Promise.all([
    db.query.testimonialsTable.findMany({
      where,
      orderBy: [orderBy === "asc" ? asc(orderColumn) : desc(orderColumn)],
      limit: perPage,
      offset: page * perPage,
    }),
    db.$count(testimonialsTable, where),
  ]);
  return { data, total };
};
export const getTestimonialById = async (id: string) =>
  db.query.testimonialsTable.findFirst({ where: eq(testimonialsTable.id, id) });
export const updateTestimonial = async (data: UTestimonial) => {
  const rows = await db
    .update(testimonialsTable)
    .set({
      name: data.name,
      avatar: data.avatar,
      quote: data.quote,
      rating: data.rating,
      updatedAt: new Date(),
    })
    .where(eq(testimonialsTable.id, data.id))
    .returning();
  return rows[0];
};
export const deleteTestimonial = async (id: string) => {
  const rows = await db
    .delete(testimonialsTable)
    .where(eq(testimonialsTable.id, id))
    .returning();
  return rows[0];
};
