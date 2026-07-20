"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../../utils/auth");
const schemas_1 = require("../schemas");
const handlers_1 = require("./handlers");
const schemas_2 = require("./schemas");
const activityRoutes = async (app) => {
    app.post("", {
        preHandler: auth_1.authenticateAdmin,
        schema: {
            tags: ["Activities"],
            summary: "Create an activity",
            security: [{ accessToken: [] }],
            body: schemas_2.createActivityBodySchema,
        },
        handler: handlers_1.handleCreateActivity,
    });
    app.get("", {
        schema: {
            tags: ["Activities"],
            summary: "List activities",
            querystring: schemas_2.activityQuerySchema,
        },
        handler: handlers_1.handleGetActivities,
    });
    app.get("/:id", {
        schema: {
            tags: ["Activities"],
            summary: "Get an activity",
            params: schemas_1.idParamsSchema,
        },
        handler: handlers_1.handleGetActivityById,
    });
    app.put("", {
        preHandler: auth_1.authenticateAdmin,
        schema: {
            tags: ["Activities"],
            summary: "Update an activity",
            security: [{ accessToken: [] }],
            body: schemas_2.updateActivityBodySchema,
        },
        handler: handlers_1.handleUpdateActivity,
    });
    app.delete("/:id", {
        preHandler: auth_1.authenticateAdmin,
        schema: {
            tags: ["Activities"],
            summary: "Delete an activity",
            security: [{ accessToken: [] }],
            params: schemas_1.idParamsSchema,
        },
        handler: handlers_1.handleDeleteActivity,
    });
};
exports.default = activityRoutes;
