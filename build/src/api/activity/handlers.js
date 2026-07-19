"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDeleteActivity = exports.handleUpdateActivity = exports.handleGetActivityById = exports.handleGetActivities = exports.handleCreateActivity = void 0;
const messages_1 = require("../messages");
const controllers_1 = require("./controllers");
const utils_1 = require("./utils");
const handleCreateActivity = async (req, res) => {
    let uploaded = [];
    let saved = false;
    try {
        const result = await (0, utils_1.handleActivityImages)(req.body);
        uploaded = result.uploadedImages;
        const data = await (0, controllers_1.createActivity)(result.body);
        if (!data)
            throw new Error("Activity was not created");
        saved = true;
        await (0, utils_1.removeActivityImages)(result.body.removedImageUrls, data.images);
        return res.status(201).send({ ...messages_1.messages.createOk, data });
    }
    catch (err) {
        if (!saved)
            await (0, utils_1.removeActivityImages)(uploaded);
        console.log(err);
        throw err;
    }
};
exports.handleCreateActivity = handleCreateActivity;
const handleGetActivities = async (req, res) => {
    try {
        const params = req.query;
        const response = await (0, controllers_1.getActivities)({
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
exports.handleGetActivities = handleGetActivities;
const handleGetActivityById = async (req, res) => {
    try {
        const data = await (0, controllers_1.getActivityById)(req.params.id);
        if (!data)
            return res.status(404).send({ ...messages_1.messages.notFound });
        return res.status(200).send({ ...messages_1.messages.verifyOk, data });
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};
exports.handleGetActivityById = handleGetActivityById;
const handleUpdateActivity = async (req, res) => {
    let uploaded = [];
    let saved = false;
    try {
        const body = req.body;
        const previous = await (0, controllers_1.getActivityById)(body.id);
        if (!previous)
            return res.status(404).send({ ...messages_1.messages.notFound });
        const result = await (0, utils_1.handleActivityImages)(body);
        uploaded = result.uploadedImages;
        const data = await (0, controllers_1.updateActivity)(result.body);
        if (!data)
            throw new Error("Activity not found");
        saved = true;
        const replaced = body.images
            ? previous.images
                .filter((previousImage) => !data.images.some((image) => image.id === previousImage.id &&
                image.url === previousImage.url))
                .map((image) => image.url)
            : [];
        await (0, utils_1.removeActivityImages)([...(body.removedImageUrls || []), ...replaced], data.images);
        return res.status(200).send({ ...messages_1.messages.updateOk, data });
    }
    catch (err) {
        if (!saved)
            await (0, utils_1.removeActivityImages)(uploaded);
        console.log(err);
        throw err;
    }
};
exports.handleUpdateActivity = handleUpdateActivity;
const handleDeleteActivity = async (req, res) => {
    try {
        const data = await (0, controllers_1.deleteActivity)(req.params.id);
        if (!data)
            return res.status(404).send({ ...messages_1.messages.notFound });
        await (0, utils_1.removeActivityImages)(data.images.map((image) => image.url));
        return res.status(200).send({ ...messages_1.messages.deleteOk, data });
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};
exports.handleDeleteActivity = handleDeleteActivity;
