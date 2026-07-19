"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = dashboardRoutes;
const auth_1 = require("../../utils/auth");
const handlers_1 = require("./handlers");
async function dashboardRoutes(app) {
    app.get("", {
        preHandler: auth_1.authenticateAdmin,
        schema: {
            tags: ["Dashboard"],
            summary: "Get dashboard statistics",
            security: [{ accessToken: [] }],
        },
    }, handlers_1.handleGetDashboard);
}
