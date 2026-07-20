"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../../utils/auth");
const schemas_1 = require("../schemas");
const handlers_1 = require("./handlers");
const schemas_2 = require("./schemas");
const categoryRoutes = async (app) => {
    app.post("", {
        preHandler: auth_1.authenticateAdmin,
        schema: {
            tags: ["Categories"],
            summary: "Create a category",
            security: [{ accessToken: [] }],
            body: schemas_2.createCategoryBodySchema,
        },
        handler: handlers_1.handleCreateCategory,
    });
    app.get("", {
        schema: {
            tags: ["Categories"],
            summary: "List categories",
            querystring: schemas_2.categoryQuerySchema,
        },
        handler: handlers_1.handleGetCategories,
    });
    app.get("/all", {
        schema: {
            tags: ["Categories"],
            summary: "List all categories",
            querystring: schemas_2.allCategoryQuerySchema,
        },
        handler: handlers_1.handleGetAllCategories,
    });
    app.get("/:id", {
        schema: {
            tags: ["Categories"],
            summary: "Get a category",
            params: schemas_1.idParamsSchema,
        },
        handler: handlers_1.handleGetCategoryById,
    });
    app.put("", {
        preHandler: auth_1.authenticateAdmin,
        schema: {
            tags: ["Categories"],
            summary: "Update a category",
            security: [{ accessToken: [] }],
            body: schemas_2.updateCategoryBodySchema,
        },
        handler: handlers_1.handleUpdateCategory,
    });
    app.delete("/:id", {
        preHandler: auth_1.authenticateAdmin,
        schema: {
            tags: ["Categories"],
            summary: "Delete a category",
            security: [{ accessToken: [] }],
            params: schemas_1.idParamsSchema,
        },
        handler: handlers_1.handleDeleteCategory,
    });
};
exports.default = categoryRoutes;
