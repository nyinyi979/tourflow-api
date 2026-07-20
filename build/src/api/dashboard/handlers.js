"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetDashboard = void 0;
const messages_1 = require("../messages");
const controllers_1 = require("./controllers");
const handleGetDashboard = async (_req, res) => {
    try {
        const data = await (0, controllers_1.getDashboard)();
        return res.status(200).send({ ...messages_1.messages.verifyOk, ...data });
    }
    catch (err) {
        throw err;
    }
};
exports.handleGetDashboard = handleGetDashboard;
