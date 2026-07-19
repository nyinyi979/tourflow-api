"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = categoryRoutes;
const auth_1 = require("../../utils/auth");
const handlers_1 = require("./handlers");
const idParams = {
    type: "object",
    required: ["id"],
    properties: { id: { type: "string", format: "uuid" } },
};
const querystring = {
    type: "object",
    required: ["page", "perPage"],
    properties: {
        page: { type: "integer", minimum: 0 },
        perPage: { type: "integer", minimum: 1, maximum: 100 },
        query: { type: "string" },
        type: { type: "string", enum: ["tour", "activity"] },
        sortBy: { type: "string", enum: ["slug", "label", "type"] },
        orderBy: { type: "string", enum: ["asc", "desc"] },
    },
};
const categoryProperties = {
    id: { type: "string", format: "uuid" },
    slug: { type: "string", minLength: 1, maxLength: 100 },
    label: { type: "string", minLength: 1, maxLength: 100 },
    image: { anyOf: [{ type: "string", maxLength: 2048 }, { type: "null" }] },
    type: { type: "string", enum: ["tour", "activity"] },
    removedImageUrls: {
        type: "array",
        items: { anyOf: [{ type: "string" }, { type: "null" }] },
    },
};
async function categoryRoutes(app) {
    app.post("", {
        preHandler: auth_1.authenticateAdmin,
        schema: {
            tags: ["Categories"],
            summary: "Create a category",
            security: [{ accessToken: [] }],
            body: {
                type: "object",
                required: ["slug", "label", "type"],
                properties: categoryProperties,
            },
        },
    }, handlers_1.handleCreateCategory);
    app.get("", {
        schema: { tags: ["Categories"], summary: "List categories", querystring },
    }, handlers_1.handleGetCategories);
    app.get("/all", {
        schema: {
            tags: ["Categories"],
            summary: "List all categories",
            querystring: {
                type: "object",
                required: ["type"],
                properties: {
                    type: { type: "string", enum: ["tour", "activity"] },
                },
            },
        },
        handler: handlers_1.handleGetAllCategories,
    });
    app.get("/:id", {
        schema: {
            tags: ["Categories"],
            summary: "Get a category",
            params: idParams,
        },
    }, handlers_1.handleGetCategoryById);
    app.put("", {
        preHandler: auth_1.authenticateAdmin,
        schema: {
            tags: ["Categories"],
            summary: "Update a category",
            security: [{ accessToken: [] }],
            body: {
                type: "object",
                required: ["id"],
                minProperties: 2,
                properties: categoryProperties,
            },
        },
    }, handlers_1.handleUpdateCategory);
    app.delete("/:id", {
        preHandler: auth_1.authenticateAdmin,
        schema: {
            tags: ["Categories"],
            summary: "Delete a category",
            security: [{ accessToken: [] }],
            params: idParams,
        },
    }, handlers_1.handleDeleteCategory);
}
