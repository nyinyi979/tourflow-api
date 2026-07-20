"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../../utils/auth");
const handlers_1 = require("./handlers");
const schemas_1 = require("./schemas");
const customerRoutes = async (app) => {
    app.post("/signup", {
        schema: {
            tags: ["Customers"],
            summary: "Create a customer account",
            body: schemas_1.customerSignupBodySchema,
        },
    }, handlers_1.handleCustomerSignup);
    app.post("/login", {
        schema: {
            tags: ["Customers"],
            summary: "Log in to a customer account",
            body: schemas_1.customerLoginBodySchema,
        },
    }, handlers_1.handleCustomerLogin);
    app.get("", {
        preHandler: auth_1.authenticateAdmin,
        schema: {
            tags: ["Customers"],
            summary: "List customers",
            security: [{ accessToken: [] }],
            querystring: schemas_1.customerQuerySchema,
        },
    }, handlers_1.handleGetCustomers);
    app.get("/me", {
        schema: {
            tags: ["Customers"],
            summary: "Get the current customer",
            security: [{ accessToken: [] }],
        },
    }, handlers_1.handleGetCustomerByToken);
    app.put("/me", {
        schema: {
            tags: ["Customers"],
            summary: "Update the current customer",
            security: [{ accessToken: [] }],
            body: schemas_1.customerUpdateBodySchema,
        },
    }, handlers_1.handleUpdateCustomer);
    app.delete("/me", {
        schema: {
            tags: ["Customers"],
            summary: "Delete the current customer account",
            security: [{ accessToken: [] }],
        },
    }, handlers_1.handleDeleteCustomer);
};
exports.default = customerRoutes;
