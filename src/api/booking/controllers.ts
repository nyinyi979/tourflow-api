import { and, asc, desc, eq, ilike } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import db from "../../db";
import { activitiesTable } from "../../db/activity";
import { bookingActivityTable, bookingsTable } from "../../db/booking";
import { toursTable } from "../../db/tour";
import type {
  BookingReadRequest,
  PayBookingRequest,
  TBooking,
  UBooking,
} from "./schemas";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../../utils/errors";

const bookingWith = {
  customer: { columns: { name: true, email: true, avatar: true } },
  tour: { columns: { title: true } },
  activity: { columns: { title: true } },
  events: {
    columns: { occurredAt: true, label: true },
    orderBy: asc(bookingActivityTable.occurredAt),
  },
} as const;

const getItemPrice = async (data: {
  itemType: "tour" | "activity";
  tourId?: string | null;
  activityId?: string | null;
}) => {
  if (data.itemType === "tour" && data.tourId)
    return db.query.toursTable.findFirst({
      where: eq(toursTable.id, data.tourId),
      columns: { price: true },
    });
  if (data.itemType === "activity" && data.activityId)
    return db.query.activitiesTable.findFirst({
      where: eq(activitiesTable.id, data.activityId),
      columns: { price: true },
    });
  return undefined;
};

export const createBooking = async (customerId: string, data: TBooking) => {
  const item = await getItemPrice(data);
  if (!item) throw new NotFoundError("Booking item not found");
  const adults = data.adults;
  const children = data.children || 0;
  const totalPrice =
    item.price * adults + Math.round(item.price * 0.5) * children;
  const id = await db.transaction(async (tx) => {
    const rows = await tx
      .insert(bookingsTable)
      .values({
        customerId,
        itemType: data.itemType,
        tourId: data.itemType === "tour" ? data.tourId : null,
        activityId: data.itemType === "activity" ? data.activityId : null,
        travelDate: data.travelDate,
        adults,
        children,
        totalPrice,
        bookingNumber: `BK-${Date.now()}-${randomUUID().slice(0, 6).toUpperCase()}`,
      })
      .returning({ id: bookingsTable.id });
    await tx.insert(bookingActivityTable).values({
      bookingId: rows[0].id,
      occurredAt: new Date(),
      label: "Booking created",
    });
    return rows[0].id;
  });
  return getBookingById(id);
};

export const getBookings = async (
  {
    page,
    perPage,
    query,
    status,
    itemType,
    sortBy,
    orderBy,
  }: BookingReadRequest,
  customerId?: string,
) => {
  const conditions = [];
  if (query) conditions.push(ilike(bookingsTable.bookingNumber, `%${query}%`));
  if (status) conditions.push(eq(bookingsTable.status, status));
  if (itemType) conditions.push(eq(bookingsTable.itemType, itemType));
  if (customerId) conditions.push(eq(bookingsTable.customerId, customerId));
  const where = conditions.length ? and(...conditions) : undefined;
  const columns = {
    bookingNumber: bookingsTable.bookingNumber,
    travelDate: bookingsTable.travelDate,
    totalPrice: bookingsTable.totalPrice,
    status: bookingsTable.status,
    createdAt: bookingsTable.createdAt,
  };
  const orderColumn =
    sortBy && sortBy in columns
      ? columns[sortBy as keyof typeof columns]
      : bookingsTable.createdAt;
  const [rows, total] = await Promise.all([
    db.query.bookingsTable.findMany({
      where,
      with: bookingWith,
      orderBy: [orderBy === "asc" ? asc(orderColumn) : desc(orderColumn)],
      limit: perPage,
      offset: page * perPage,
    }),
    db.$count(bookingsTable, where),
  ]);
  return { data: rows, total };
};
export const getBookingById = async (id: string) => {
  return db.query.bookingsTable.findFirst({
    where: eq(bookingsTable.id, id),
    with: bookingWith,
  });
};

export const updateBooking = async (id: string, data: UBooking) => {
  const current = await db.query.bookingsTable.findFirst({
    where: eq(bookingsTable.id, id),
  });
  if (!current) return undefined;
  let totalPrice = current.totalPrice;
  if (data.adults !== undefined || data.children !== undefined) {
    const item = await getItemPrice(current);
    if (!item) throw new NotFoundError("Booking item not found");
    const adults = data.adults ?? current.adults;
    const children = data.children ?? current.children;
    totalPrice = item.price * adults + Math.round(item.price * 0.5) * children;
  }
  await db.transaction(async (tx) => {
    await tx
      .update(bookingsTable)
      .set({
        travelDate: data.travelDate,
        adults: data.adults,
        children: data.children,
        status: data.status,
        totalPrice,
        updatedAt: new Date(),
      })
      .where(eq(bookingsTable.id, id));
    if (data.status && data.status !== current.status)
      await tx.insert(bookingActivityTable).values({
        bookingId: id,
        occurredAt: new Date(),
        label: `Status changed to ${data.status}`,
      });
  });
  return getBookingById(id);
};

export const payBooking = async (
  id: string,
  customerId: string,
  { paymentMethod }: PayBookingRequest,
) => {
  const current = await db.query.bookingsTable.findFirst({
    where: eq(bookingsTable.id, id),
  });

  if (!current) throw new NotFoundError("Booking not found");
  if (current.customerId !== customerId) throw new ForbiddenError();
  if (current.paymentStatus === "paid") return getBookingById(id);
  if (current.status === "cancelled" || current.status === "completed") {
    throw new BadRequestError(`A ${current.status} booking cannot be paid.`);
  }

  const paidAt = new Date();
  const paymentReference = `PAY-${Date.now()}-${randomUUID()
    .slice(0, 6)
    .toUpperCase()}`;

  await db.transaction(async (tx) => {
    await tx
      .update(bookingsTable)
      .set({
        status: "confirmed",
        paymentStatus: "paid",
        paymentMethod,
        paymentReference,
        paidAt,
        updatedAt: paidAt,
      })
      .where(eq(bookingsTable.id, id));

    await tx.insert(bookingActivityTable).values({
      bookingId: id,
      occurredAt: paidAt,
      label: "Payment received",
    });
  });

  return getBookingById(id);
};

export const deleteBooking = async (id: string) => {
  const previous = await getBookingById(id);
  if (!previous) return undefined;
  await db.delete(bookingsTable).where(eq(bookingsTable.id, id));
  return previous;
};
