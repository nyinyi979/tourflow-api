import { and, asc, desc, eq, ilike } from "drizzle-orm";
import db from "../../db";
import {
  activitiesTable,
  activityHighlightsTable,
  activityImagesTable,
  activityIncludedItemsTable,
} from "../../db/activity";
import type { ActivityReadRequest, TActivity, UActivity } from "./schemas";
import {
  insertActivityChildren,
  syncActivityImages,
  syncActivityLabels,
} from "./utils";

const activityWith = {
  category: true,
  images: { orderBy: asc(activityImagesTable.position) },
  highlights: { orderBy: asc(activityHighlightsTable.position) },
  included: { orderBy: asc(activityIncludedItemsTable.position) },
} as const;
const mapActivity = (row: any) => ({
  ...row,
  category: row.category?.label,
  images: row.images?.map((x: any) => ({ id: x.id, url: x.url })) || [],
  highlights:
    row.highlights?.map((x: any) => ({ id: x.id, label: x.label })) || [],
  included: row.included?.map((x: any) => ({ id: x.id, label: x.label })) || [],
});

export const createActivity = async (data: TActivity) => {
  const id = await db.transaction(async (tx) => {
    const rows = await tx
      .insert(activitiesTable)
      .values({
        slug: data.slug,
        title: data.title,
        description: data.description,
        longDescription: data.longDescription,
        price: data.price,
        duration: data.duration,
        categoryId: data.categoryId,
        rating: data.rating,
        meetingPoint: data.meetingPoint,
      })
      .returning({ id: activitiesTable.id });
    await insertActivityChildren(tx, rows[0].id, data);
    return rows[0].id;
  });
  return getActivityById(id);
};

export const getActivities = async ({
  page,
  perPage,
  query,
  categoryId,
  sortBy,
  orderBy,
}: ActivityReadRequest) => {
  const conditions = [];
  if (query) conditions.push(ilike(activitiesTable.title, `%${query}%`));
  if (categoryId) conditions.push(eq(activitiesTable.categoryId, categoryId));
  const where = conditions.length ? and(...conditions) : undefined;
  const columns = {
    title: activitiesTable.title,
    price: activitiesTable.price,
    duration: activitiesTable.duration,
    rating: activitiesTable.rating,
    createdAt: activitiesTable.createdAt,
  };
  const orderColumn =
    sortBy && sortBy in columns
      ? columns[sortBy as keyof typeof columns]
      : activitiesTable.createdAt;
  const [rows, total] = await Promise.all([
    db.query.activitiesTable.findMany({
      where,
      with: activityWith,
      orderBy: [orderBy === "asc" ? asc(orderColumn) : desc(orderColumn)],
      limit: perPage,
      offset: page * perPage,
    }),
    db.$count(activitiesTable, where),
  ]);
  return { data: rows.map(mapActivity), total };
};
export const getActivityById = async (id: string) => {
  const row = await db.query.activitiesTable.findFirst({
    where: eq(activitiesTable.id, id),
    with: activityWith,
  });
  return row ? mapActivity(row) : undefined;
};

export const updateActivity = async (data: UActivity) => {
  await db.transaction(async (tx) => {
    await tx
      .update(activitiesTable)
      .set({
        slug: data.slug,
        title: data.title,
        description: data.description,
        longDescription: data.longDescription,
        price: data.price,
        duration: data.duration,
        categoryId: data.categoryId,
        rating: data.rating,
        meetingPoint: data.meetingPoint,
        updatedAt: new Date(),
      })
      .where(eq(activitiesTable.id, data.id));
    if (data.images) await syncActivityImages(tx, data.id, data.images);
    if (data.highlights)
      await syncActivityLabels(
        tx,
        data.id,
        data.highlights,
        activityHighlightsTable,
        "activity highlight",
      );
    if (data.included)
      await syncActivityLabels(
        tx,
        data.id,
        data.included,
        activityIncludedItemsTable,
        "included item",
      );
  });
  return getActivityById(data.id);
};
export const deleteActivity = async (id: string) => {
  const previous = await getActivityById(id);
  if (!previous) return undefined;
  await db.delete(activitiesTable).where(eq(activitiesTable.id, id));
  return previous;
};
