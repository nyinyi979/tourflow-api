"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../../utils/auth");
const handlers_1 = require("./handlers");
const dashboardRoutes = async (app) => {
    app.get("", {
        preHandler: auth_1.authenticateAdmin,
        schema: {
            tags: ["Dashboard"],
            summary: "Get dashboard statistics",
            security: [{ accessToken: [] }],
        },
        handler: handlers_1.handleGetDashboard,
    });
};
exports.default = dashboardRoutes;
