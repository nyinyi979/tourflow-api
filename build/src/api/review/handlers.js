"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDeleteReview = exports.handleUpdateReview = exports.handleGetReviewById = exports.handleGetAdminReviews = exports.handleGetPublishedReviews = exports.handleCreateReview = void 0;
const auth_1 = require("../../utils/auth");
const messages_1 = require("../messages");
const controllers_1 = require("./controllers");
const handleCreateReview = async (req, res) => {
    try {
        const customer = await (0, auth_1.authenticateCustomer)(req, res);
        if (!customer)
            return;
        const data = await (0, controllers_1.createReview)(customer, req.body);
        return res.status(201).send({ ...messages_1.messages.createOk, data });
    }
    catch (err) {
        throw err;
    }
};
exports.handleCreateReview = handleCreateReview;
const handleGetPublishedReviews = async (req, res) => {
    try {
        const params = req.query;
        const response = await (0, controllers_1.getReviews)({ ...params, page: +params.page, perPage: +params.perPage }, true);
        return res
            .status(200)
            .send({ ...messages_1.messages.verifyOk, ...params, ...response });
    }
    catch (err) {
        throw err;
    }
};
exports.handleGetPublishedReviews = handleGetPublishedReviews;
const handleGetAdminReviews = async (req, res) => {
    try {
        const params = req.query;
        const response = await (0, controllers_1.getReviews)({
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
exports.handleGetAdminReviews = handleGetAdminReviews;
const handleGetReviewById = async (req, res) => {
    try {
        const data = await (0, controllers_1.getReviewById)(req.params.id);
        if (!data || data.status !== "published")
            return res.status(404).send({ ...messages_1.messages.notFound });
        return res.status(200).send({ ...messages_1.messages.verifyOk, data });
    }
    catch (err) {
        throw err;
    }
};
exports.handleGetReviewById = handleGetReviewById;
const handleUpdateReview = async (req, res) => {
    try {
        const data = await (0, controllers_1.updateReview)(req.body);
        if (!data)
            return res.status(404).send({ ...messages_1.messages.notFound });
        return res.status(200).send({ ...messages_1.messages.updateOk, data });
    }
    catch (err) {
        throw err;
    }
};
exports.handleUpdateReview = handleUpdateReview;
const handleDeleteReview = async (req, res) => {
    try {
        const data = await (0, controllers_1.deleteReview)(req.params.id);
        if (!data)
            return res.status(404).send({ ...messages_1.messages.notFound });
        return res.status(200).send({ ...messages_1.messages.deleteOk, data });
    }
    catch (err) {
        throw err;
    }
};
exports.handleDeleteReview = handleDeleteReview;
