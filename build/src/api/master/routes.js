"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = masterRoutes;
const handlers_1 = require("./handlers");
function masterRoutes(app) {
    app.get("/countries", {
        schema: {
            tags: ["Master Data"],
            summary: "List countries",
        },
    }, handlers_1.handleGetCountries);
    app.get("/states", {
        schema: {
            tags: ["Master Data"],
            summary: "List states for a country",
            querystring: {
                type: "object",
                required: ["country"],
                properties: { country: { type: "string", minLength: 1 } },
            },
        },
    }, handlers_1.handleGetStates);
    app.get("/cities", {
        schema: {
            tags: ["Master Data"],
            summary: "List cities for a state",
            querystring: {
                type: "object",
                required: ["country", "state"],
                properties: {
                    country: { type: "string", minLength: 1 },
                    state: { type: "string", minLength: 1 },
                },
            },
        },
    }, handlers_1.handleGetCities);
}
