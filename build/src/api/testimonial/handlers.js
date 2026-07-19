"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDeleteTestimonial = exports.handleUpdateTestimonial = exports.handleGetTestimonialById = exports.handleGetTestimonials = exports.handleCreateTestimonial = void 0;
const messages_1 = require("../messages");
const controllers_1 = require("./controllers");
const utils_1 = require("./utils");
const handleCreateTestimonial = async (req, res) => {
    let uploaded = null;
    let saved = false;
    try {
        const result = await (0, utils_1.handleTestimonialAvatar)(req.body);
        uploaded = result.uploadedAvatar;
        const data = await (0, controllers_1.createTestimonial)(result.body);
        saved = true;
        await (0, utils_1.removeTestimonialAvatars)(result.body.removedImageUrls, data.avatar);
        return res.status(201).send({ ...messages_1.messages.createOk, data });
    }
    catch (err) {
        if (!saved)
            await (0, utils_1.removeTestimonialAvatars)([uploaded]);
        console.log(err);
        throw err;
    }
};
exports.handleCreateTestimonial = handleCreateTestimonial;
const handleGetTestimonials = async (req, res) => {
    try {
        const params = req.query;
        const response = await (0, controllers_1.getTestimonials)({
            ...params,
            page: +params.page,
            perPage: +params.perPage,
        });
        return res
            .status(200)
            .send({ ...messages_1.messages.verifyOk, ...params, ...response });
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};
exports.handleGetTestimonials = handleGetTestimonials;
const handleGetTestimonialById = async (req, res) => {
    try {
        const data = await (0, controllers_1.getTestimonialById)(req.params.id);
        if (!data)
            return res.status(404).send({ ...messages_1.messages.notFound });
        return res.status(200).send({ ...messages_1.messages.verifyOk, data });
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};
exports.handleGetTestimonialById = handleGetTestimonialById;
const handleUpdateTestimonial = async (req, res) => {
    let uploaded = null;
    let saved = false;
    try {
        const body = req.body;
        const previous = await (0, controllers_1.getTestimonialById)(body.id);
        if (!previous)
            return res.status(404).send({ ...messages_1.messages.notFound });
        const result = await (0, utils_1.handleTestimonialAvatar)(body);
        uploaded = result.uploadedAvatar;
        const data = await (0, controllers_1.updateTestimonial)(result.body);
        if (!data)
            throw new Error("Testimonial not found");
        saved = true;
        const replaced = body.avatar !== undefined && body.avatar !== previous.avatar
            ? previous.avatar
            : null;
        await (0, utils_1.removeTestimonialAvatars)([...(body.removedImageUrls || []), replaced], data.avatar);
        return res.status(200).send({ ...messages_1.messages.updateOk, data });
    }
    catch (err) {
        if (!saved)
            await (0, utils_1.removeTestimonialAvatars)([uploaded]);
        console.log(err);
        throw err;
    }
};
exports.handleUpdateTestimonial = handleUpdateTestimonial;
const handleDeleteTestimonial = async (req, res) => {
    try {
        const data = await (0, controllers_1.deleteTestimonial)(req.params.id);
        if (!data)
            return res.status(404).send({ ...messages_1.messages.notFound });
        await (0, utils_1.removeTestimonialAvatars)([data.avatar]);
        return res.status(200).send({ ...messages_1.messages.deleteOk, data });
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};
exports.handleDeleteTestimonial = handleDeleteTestimonial;
