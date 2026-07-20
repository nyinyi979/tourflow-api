"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../../utils/auth");
const handlers_1 = require("./handlers");
const schemas_1 = require("./schemas");
const schemas_2 = require("../schemas");
const authRoutes = async (app) => {
    app.post("/login", {
        schema: {
            tags: ["Authentication"],
            summary: "Log in",
            body: schemas_1.loginBodySchema,
        },
    }, handlers_1.handleLogin);
    app.get("", {
        preHandler: auth_1.authenticateAdmin,
        schema: {
            tags: ["Authentication"],
            summary: "List users",
            security: [{ accessToken: [] }],
            querystring: schemas_2.paginationQuerySchema,
        },
    }, handlers_1.handleGetUsers);
    app.get("/:id", {
        preHandler: auth_1.authenticateAdmin,
        schema: {
            tags: ["Authentication"],
            summary: "Get a user by ID",
            security: [{ accessToken: [] }],
            params: schemas_2.idParamsSchema,
        },
    }, handlers_1.handleGetUserById);
    app.post("/me", {
        schema: {
            tags: ["Authentication"],
            summary: "Get the current user",
            security: [{ accessToken: [] }],
        },
    }, handlers_1.handleGetUserByToken);
    app.put("/", {
        preHandler: auth_1.authenticateAdmin,
        schema: {
            tags: ["Authentication"],
            summary: "Update a user",
            security: [{ accessToken: [] }],
            body: schemas_1.updateUserBodySchema,
        },
    }, handlers_1.handleUpdateUser);
    app.delete("/:id", {
        preHandler: auth_1.authenticateAdmin,
        schema: {
            tags: ["Authentication"],
            summary: "Delete a user",
            security: [{ accessToken: [] }],
            params: schemas_2.idParamsSchema,
        },
    }, handlers_1.handleDeleteAdmin);
};
exports.default = authRoutes;
