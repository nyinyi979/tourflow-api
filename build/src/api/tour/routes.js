"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../../utils/auth");
const schemas_1 = require("../schemas");
const handlers_1 = require("./handlers");
const schemas_2 = require("./schemas");
const tourRoutes = async (app) => {
    app.post("", {
        preHandler: auth_1.authenticateAdmin,
        schema: {
            tags: ["Tours"],
            summary: "Create a tour",
            security: [{ accessToken: [] }],
            body: schemas_2.createTourBodySchema,
        },
        handler: handlers_1.handleCreateTour,
    });
    app.get("", {
        schema: {
            tags: ["Tours"],
            summary: "List tours",
            querystring: schemas_2.tourQuerySchema,
        },
        handler: handlers_1.handleGetTours,
    });
    app.get("/:id", {
        schema: {
            tags: ["Tours"],
            summary: "Get a tour",
            params: schemas_1.idParamsSchema,
        },
        handler: handlers_1.handleGetTourById,
    });
    app.put("", {
        preHandler: auth_1.authenticateAdmin,
        schema: {
            tags: ["Tours"],
            summary: "Update a tour",
            security: [{ accessToken: [] }],
            body: schemas_2.updateTourBodySchema,
        },
        handler: handlers_1.handleUpdateTour,
    });
    app.delete("/:id", {
        preHandler: auth_1.authenticateAdmin,
        schema: {
            tags: ["Tours"],
            summary: "Delete a tour",
            security: [{ accessToken: [] }],
            params: schemas_1.idParamsSchema,
        },
        handler: handlers_1.handleDeleteTour,
    });
};
exports.default = tourRoutes;
