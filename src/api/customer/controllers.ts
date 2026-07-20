import bcrypt from "bcrypt";
import { asc, desc, eq, ilike, or } from "drizzle-orm";
import { sign, verify } from "jsonwebtoken";
import db from "../../db";
import { customersTable } from "../../db/customer";
import type {
  CustomerReadRequest,
  TCustomerLogin,
  TCustomerSignup,
  TCustomerUpdate,
} from "./schemas";
import { ConfigurationError } from "../../utils/errors";

const customerColumns = {
  id: customersTable.id,
  name: customersTable.name,
  email: customersTable.email,
  avatar: customersTable.avatar,
  registeredAt: customersTable.registeredAt,
};

export const signupCustomer = async (data: TCustomerSignup) => {
  const existingCustomer = await db.query.customersTable.findFirst({
    where: eq(customersTable.email, data.email),
    columns: { id: true },
  });

  if (existingCustomer) return null;

  const password = await bcrypt.hash(data.password, 10);
  const response = await db
    .insert(customersTable)
    .values({
      name: data.name,
      email: data.email,
      password,
      avatar: data.avatar,
    })
    .returning(customerColumns);

  return response[0];
};

export const loginCustomer = async (data: TCustomerLogin) => {
  const customer = await db.query.customersTable.findFirst({
    where: eq(customersTable.email, data.email),
  });

  if (!customer) return null;

  const passwordMatches = await bcrypt.compare(
    data.password,
    customer.password,
  );
  if (!passwordMatches) return null;

  const secret = process.env.JWT_SECRET;
  if (!secret) throw new ConfigurationError("JWT_SECRET is not configured");

  const token = sign({ id: customer.id, accountType: "customer" }, secret, {
    algorithm: "HS256",
    expiresIn: "7d",
  });

  const { password: _password, ...customerData } = customer;
  return { customer: customerData, token };
};

export const getCustomers = async ({
  page,
  perPage,
  query,
  sortBy,
  orderBy,
}: CustomerReadRequest) => {
  const where = query
    ? or(
        ilike(customersTable.name, `%${query}%`),
        ilike(customersTable.email, `%${query}%`),
      )
    : undefined;

  const sortableColumns = {
    name: customersTable.name,
    email: customersTable.email,
    registeredAt: customersTable.registeredAt,
    createdAt: customersTable.createdAt,
    updatedAt: customersTable.updatedAt,
  };

  const orderColumn =
    sortBy && sortBy in sortableColumns
      ? sortableColumns[sortBy as keyof typeof sortableColumns]
      : customersTable.registeredAt;

  const [rows, total] = await Promise.all([
    db.query.customersTable.findMany({
      where,
      columns: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        registeredAt: true,
      },
      with: {
        bookings: {
          columns: {
            totalPrice: true,
          },
        },
      },
      orderBy: [orderBy === "asc" ? asc(orderColumn) : desc(orderColumn)],
      limit: perPage,
      offset: page * perPage,
    }),
    db.$count(customersTable, where),
  ]);

  const data = rows.map(({ bookings, ...customer }) => ({
    ...customer,
    totalBookings: bookings.length,
    totalSpent: bookings.reduce(
      (totalSpent, booking) => totalSpent + booking.totalPrice,
      0,
    ),
  }));

  return { data, total };
};

export const getCustomerById = async (id: string) => {
  return db.query.customersTable.findFirst({
    where: eq(customersTable.id, id),
    columns: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      registeredAt: true,
    },
  });
};

export const getCustomerByToken = async (token: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new ConfigurationError("JWT_SECRET is not configured");

  const payload = verify(token, secret, { algorithms: ["HS256"] });
  if (
    typeof payload === "string" ||
    typeof payload.id !== "string" ||
    payload.accountType !== "customer"
  ) {
    throw new Error("Invalid customer token");
  }

  const customer = await getCustomerById(payload.id);
  if (!customer) throw new Error("Customer not found");

  return customer;
};

export const updateCustomer = async (id: string, data: TCustomerUpdate) => {
  const password = data.password
    ? await bcrypt.hash(data.password, 10)
    : undefined;

  const response = await db
    .update(customersTable)
    .set({
      name: data.name,
      email: data.email,
      avatar: data.avatar,
      password,
      updatedAt: new Date(),
    })
    .where(eq(customersTable.id, id))
    .returning(customerColumns);

  return response[0];
};

export const deleteCustomer = async (id: string) => {
  const response = await db
    .delete(customersTable)
    .where(eq(customersTable.id, id))
    .returning({
      id: customersTable.id,
      avatar: customersTable.avatar,
    });

  return response[0];
};
