import { and, asc, desc, eq, ilike } from "drizzle-orm";
import db from "../../db";
import { categoriesTable } from "../../db/category";
import type { CategoryReadRequest, TCategory, UCategory } from "./schemas";

export const createCategory = async (data: TCategory) => {
  const response = await db
    .insert(categoriesTable)
    .values({
      slug: data.slug,
      label: data.label,
      image: data.image,
      type: data.type,
    })
    .returning();
  return response[0];
};

export const getCategories = async ({
  page,
  perPage,
  query,
  type,
  sortBy,
  orderBy,
}: CategoryReadRequest) => {
  const conditions = [];
  if (query) conditions.push(ilike(categoriesTable.label, `%${query}%`));
  if (type) conditions.push(eq(categoriesTable.type, type));
  const where = conditions.length ? and(...conditions) : undefined;

  const sortableColumns = {
    slug: categoriesTable.slug,
    label: categoriesTable.label,
    type: categoriesTable.type,
  };
  const orderColumn =
    sortBy && sortBy in sortableColumns
      ? sortableColumns[sortBy as keyof typeof sortableColumns]
      : categoriesTable.label;

  const [data, total] = await Promise.all([
    db.query.categoriesTable.findMany({
      where,
      orderBy: [orderBy === "desc" ? desc(orderColumn) : asc(orderColumn)],
      limit: perPage,
      offset: page * perPage,
    }),
    db.$count(categoriesTable, where),
  ]);
  return { data, total };
};

export const getAllCategories = async (type: "tour" | "activity") =>
  db.query.categoriesTable.findMany({ where: eq(categoriesTable.type, type) });

export const getCategoryById = async (id: string) =>
  db.query.categoriesTable.findFirst({ where: eq(categoriesTable.id, id) });

export const updateCategory = async (data: UCategory) => {
  const response = await db
    .update(categoriesTable)
    .set({
      slug: data.slug,
      label: data.label,
      image: data.image,
      type: data.type,
    })
    .where(eq(categoriesTable.id, data.id))
    .returning();
  return response[0];
};

export const deleteCategory = async (id: string) => {
  const response = await db
    .delete(categoriesTable)
    .where(eq(categoriesTable.id, id))
    .returning();
  return response[0];
};
