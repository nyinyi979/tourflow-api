"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = fileRoutes;
const handlers_1 = require("./handlers");
async function fileRoutes(app) {
    app.post("/", handlers_1.handleFileUploadTmp);
    app.post("/batch", handlers_1.handleCreateBatchFiles);
    app.post("/upload", handlers_1.handleUploadFile);
    // app.post('/duplicate', handleDuplicateFile);
}
