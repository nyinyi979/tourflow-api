"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authRoutes;
const handlers_1 = require("./handlers");
const auth_1 = require("../../utils/auth");
async function authRoutes(app) {
    app.post("/login", {
        schema: {
            tags: ["Authentication"],
            summary: "Log in",
            body: {
                type: "object",
                required: ["email", "password"],
                properties: {
                    email: { type: "string", format: "email" },
                    password: { type: "string", minLength: 1 },
                },
            },
        },
    }, handlers_1.handleLogin);
    app.get("", {
        preHandler: auth_1.authenticateAdmin,
        schema: {
            tags: ["Authentication"],
            summary: "List users",
            security: [{ accessToken: [] }],
            querystring: {
                type: "object",
                required: ["page", "perPage"],
                properties: {
                    page: { type: "integer", minimum: 0 },
                    perPage: { type: "integer", minimum: 1, maximum: 100 },
                },
            },
        },
    }, handlers_1.handleGetUsers);
    app.get("/:id", {
        preHandler: auth_1.authenticateAdmin,
        schema: {
            tags: ["Authentication"],
            summary: "Get a user by ID",
            security: [{ accessToken: [] }],
            params: {
                type: "object",
                required: ["id"],
                properties: { id: { type: "string", format: "uuid" } },
            },
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
            body: {
                type: "object",
                required: ["id"],
                properties: {
                    id: { type: "string", format: "uuid" },
                    username: { type: "string", minLength: 1, maxLength: 100 },
                    email: { type: "string", format: "email", maxLength: 100 },
                    password: {
                        anyOf: [
                            { type: "string", minLength: 8, maxLength: 255 },
                            { type: "null" },
                        ],
                    },
                    role: { type: "integer" },
                },
            },
        },
    }, handlers_1.handleUpdateUser);
    app.delete("/:id", {
        preHandler: auth_1.authenticateAdmin,
        schema: {
            tags: ["Authentication"],
            summary: "Delete a user",
            security: [{ accessToken: [] }],
            params: {
                type: "object",
                required: ["id"],
                properties: { id: { type: "string", format: "uuid" } },
            },
        },
    }, handlers_1.handleDeleteAdmin);
}
