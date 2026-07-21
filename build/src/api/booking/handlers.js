"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDeleteBooking = exports.handlePayBooking = exports.handleUpdateBooking = exports.handleGetBookingById = exports.handleGetMyBookings = exports.handleGetBookings = exports.handleCreateBooking = void 0;
const auth_1 = require("../../utils/auth");
const messages_1 = require("../messages");
const controllers_1 = require("./controllers");
const handleCreateBooking = async (req, res) => {
    try {
        const customer = await (0, auth_1.authenticateCustomer)(req, res);
        if (!customer)
            return;
        const data = await (0, controllers_1.createBooking)(customer.id, req.body);
        return res.status(201).send({ ...messages_1.messages.createOk, data });
    }
    catch (err) {
        throw err;
    }
};
exports.handleCreateBooking = handleCreateBooking;
const handleGetBookings = async (req, res) => {
    try {
        const params = req.query;
        const response = await (0, controllers_1.getBookings)({
            ...params,
            page: +params.page,
            perPage: +params.perPage,
        });
        return res
            .status(200)
            .send({ ...messages_1.messages.verifyOk, ...params, ...response });
    }
    catch (err) {
        throw err;
    }
};
exports.handleGetBookings = handleGetBookings;
const handleGetMyBookings = async (req, res) => {
    try {
        const customer = await (0, auth_1.authenticateCustomer)(req, res);
        if (!customer)
            return;
        const params = req.query;
        const response = await (0, controllers_1.getBookings)({ ...params, page: +params.page, perPage: +params.perPage }, customer.id);
        return res
            .status(200)
            .send({ ...messages_1.messages.verifyOk, ...params, ...response });
    }
    catch (err) {
        throw err;
    }
};
exports.handleGetMyBookings = handleGetMyBookings;
const handleGetBookingById = async (req, res) => {
    try {
        const user = await (0, auth_1.authenticateUser)(req, res);
        if (!user)
            return;
        const data = await (0, controllers_1.getBookingById)(req.params.id);
        if (!data)
            return res.status(404).send({ ...messages_1.messages.notFound });
        if (user.accountType === "customer" && data.customerId !== user.id)
            return res.status(403).send({ ...messages_1.messages.forbiddenAccess });
        return res.status(200).send({ ...messages_1.messages.verifyOk, data });
    }
    catch (err) {
        throw err;
    }
};
exports.handleGetBookingById = handleGetBookingById;
const handleUpdateBooking = async (req, res) => {
    try {
        const user = await (0, auth_1.authenticateUser)(req, res);
        if (!user)
            return;
        const id = req.params.id;
        const current = await (0, controllers_1.getBookingById)(id);
        if (!current)
            return res.status(404).send({ ...messages_1.messages.notFound });
        const body = req.body;
        if (user.accountType === "customer" &&
            (current.customerId !== user.id ||
                (body.status && body.status !== "cancelled")))
            return res.status(403).send({ ...messages_1.messages.forbiddenAccess });
        const data = await (0, controllers_1.updateBooking)(id, body);
        return res.status(200).send({ ...messages_1.messages.updateOk, data });
    }
    catch (err) {
        throw err;
    }
};
exports.handleUpdateBooking = handleUpdateBooking;
const handlePayBooking = async (req, res) => {
    const customer = await (0, auth_1.authenticateCustomer)(req, res);
    if (!customer)
        return;
    const data = await (0, controllers_1.payBooking)(req.params.id, customer.id, req.body);
    return res.status(200).send({ ...messages_1.messages.updateOk, data });
};
exports.handlePayBooking = handlePayBooking;
const handleDeleteBooking = async (req, res) => {
    try {
        const user = await (0, auth_1.authenticateUser)(req, res);
        if (!user)
            return;
        const id = req.params.id;
        const current = await (0, controllers_1.getBookingById)(id);
        if (!current)
            return res.status(404).send({ ...messages_1.messages.notFound });
        if (user.accountType === "customer" && current.customerId !== user.id)
            return res.status(403).send({ ...messages_1.messages.forbiddenAccess });
        const data = await (0, controllers_1.deleteBooking)(id);
        return res.status(200).send({ ...messages_1.messages.deleteOk, data });
    }
    catch (err) {
        throw err;
    }
};
exports.handleDeleteBooking = handleDeleteBooking;
