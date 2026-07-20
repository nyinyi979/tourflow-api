"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCustomer = exports.updateCustomer = exports.getCustomerByToken = exports.getCustomerById = exports.getCustomers = exports.loginCustomer = exports.signupCustomer = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const drizzle_orm_1 = require("drizzle-orm");
const jsonwebtoken_1 = require("jsonwebtoken");
const db_1 = __importDefault(require("../../db"));
const customer_1 = require("../../db/customer");
const errors_1 = require("../../utils/errors");
const customerColumns = {
    id: customer_1.customersTable.id,
    name: customer_1.customersTable.name,
    email: customer_1.customersTable.email,
    avatar: customer_1.customersTable.avatar,
    registeredAt: customer_1.customersTable.registeredAt,
};
const signupCustomer = async (data) => {
    const existingCustomer = await db_1.default.query.customersTable.findFirst({
        where: (0, drizzle_orm_1.eq)(customer_1.customersTable.email, data.email),
        columns: { id: true },
    });
    if (existingCustomer)
        return null;
    const password = await bcrypt_1.default.hash(data.password, 10);
    const response = await db_1.default
        .insert(customer_1.customersTable)
        .values({
        name: data.name,
        email: data.email,
        password,
        avatar: data.avatar,
    })
        .returning(customerColumns);
    return response[0];
};
exports.signupCustomer = signupCustomer;
const loginCustomer = async (data) => {
    const customer = await db_1.default.query.customersTable.findFirst({
        where: (0, drizzle_orm_1.eq)(customer_1.customersTable.email, data.email),
    });
    if (!customer)
        return null;
    const passwordMatches = await bcrypt_1.default.compare(data.password, customer.password);
    if (!passwordMatches)
        return null;
    const secret = process.env.JWT_SECRET;
    if (!secret)
        throw new errors_1.ConfigurationError("JWT_SECRET is not configured");
    const token = (0, jsonwebtoken_1.sign)({ id: customer.id, accountType: "customer" }, secret, {
        algorithm: "HS256",
        expiresIn: "7d",
    });
    const { password: _password, ...customerData } = customer;
    return { customer: customerData, token };
};
exports.loginCustomer = loginCustomer;
const getCustomers = async ({ page, perPage, query, sortBy, orderBy, }) => {
    const where = query
        ? (0, drizzle_orm_1.or)((0, drizzle_orm_1.ilike)(customer_1.customersTable.name, `%${query}%`), (0, drizzle_orm_1.ilike)(customer_1.customersTable.email, `%${query}%`))
        : undefined;
    const sortableColumns = {
        name: customer_1.customersTable.name,
        email: customer_1.customersTable.email,
        registeredAt: customer_1.customersTable.registeredAt,
        createdAt: customer_1.customersTable.createdAt,
        updatedAt: customer_1.customersTable.updatedAt,
    };
    const orderColumn = sortBy && sortBy in sortableColumns
        ? sortableColumns[sortBy]
        : customer_1.customersTable.registeredAt;
    const [rows, total] = await Promise.all([
        db_1.default.query.customersTable.findMany({
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
            orderBy: [orderBy === "asc" ? (0, drizzle_orm_1.asc)(orderColumn) : (0, drizzle_orm_1.desc)(orderColumn)],
            limit: perPage,
            offset: page * perPage,
        }),
        db_1.default.$count(customer_1.customersTable, where),
    ]);
    const data = rows.map(({ bookings, ...customer }) => ({
        ...customer,
        totalBookings: bookings.length,
        totalSpent: bookings.reduce((totalSpent, booking) => totalSpent + booking.totalPrice, 0),
    }));
    return { data, total };
};
exports.getCustomers = getCustomers;
const getCustomerById = async (id) => {
    return db_1.default.query.customersTable.findFirst({
        where: (0, drizzle_orm_1.eq)(customer_1.customersTable.id, id),
        columns: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            registeredAt: true,
        },
    });
};
exports.getCustomerById = getCustomerById;
const getCustomerByToken = async (token) => {
    const secret = process.env.JWT_SECRET;
    if (!secret)
        throw new errors_1.ConfigurationError("JWT_SECRET is not configured");
    const payload = (0, jsonwebtoken_1.verify)(token, secret, { algorithms: ["HS256"] });
    if (typeof payload === "string" ||
        typeof payload.id !== "string" ||
        payload.accountType !== "customer") {
        throw new Error("Invalid customer token");
    }
    const customer = await (0, exports.getCustomerById)(payload.id);
    if (!customer)
        throw new Error("Customer not found");
    return customer;
};
exports.getCustomerByToken = getCustomerByToken;
const updateCustomer = async (id, data) => {
    const password = data.password
        ? await bcrypt_1.default.hash(data.password, 10)
        : undefined;
    const response = await db_1.default
        .update(customer_1.customersTable)
        .set({
        name: data.name,
        email: data.email,
        avatar: data.avatar,
        password,
        updatedAt: new Date(),
    })
        .where((0, drizzle_orm_1.eq)(customer_1.customersTable.id, id))
        .returning(customerColumns);
    return response[0];
};
exports.updateCustomer = updateCustomer;
const deleteCustomer = async (id) => {
    const response = await db_1.default
        .delete(customer_1.customersTable)
        .where((0, drizzle_orm_1.eq)(customer_1.customersTable.id, id))
        .returning({
        id: customer_1.customersTable.id,
        avatar: customer_1.customersTable.avatar,
    });
    return response[0];
};
exports.deleteCustomer = deleteCustomer;
