"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDeleteTour = exports.handleUpdateTour = exports.handleGetTourById = exports.handleGetTours = exports.handleCreateTour = void 0;
const messages_1 = require("../messages");
const controllers_1 = require("./controllers");
const utils_1 = require("./utils");
const handleCreateTour = async (req, res) => {
    let uploaded = [];
    let saved = false;
    try {
        const result = await (0, utils_1.handleTourImages)(req.body);
        uploaded = result.uploadedImages;
        const data = await (0, controllers_1.createTour)(result.body);
        if (!data)
            throw new Error("Tour was not created");
        saved = true;
        await (0, utils_1.removeTourImages)(result.body.removedImageUrls, data.images);
        return res.status(201).send({ ...messages_1.messages.createOk, data });
    }
    catch (err) {
        if (!saved)
            await (0, utils_1.removeTourImages)(uploaded);
        console.log(err);
        throw err;
    }
};
exports.handleCreateTour = handleCreateTour;
const handleGetTours = async (req, res) => {
    try {
        const params = req.query;
        const response = await (0, controllers_1.getTours)({
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
exports.handleGetTours = handleGetTours;
const handleGetTourById = async (req, res) => {
    try {
        const data = await (0, controllers_1.getTourById)(req.params.id);
        if (!data)
            return res.status(404).send({ ...messages_1.messages.notFound });
        return res.status(200).send({ ...messages_1.messages.verifyOk, data });
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};
exports.handleGetTourById = handleGetTourById;
const handleUpdateTour = async (req, res) => {
    let uploaded = [];
    let saved = false;
    try {
        const body = req.body;
        const previous = await (0, controllers_1.getTourById)(body.id);
        if (!previous)
            return res.status(404).send({ ...messages_1.messages.notFound });
        const result = await (0, utils_1.handleTourImages)(body);
        uploaded = result.uploadedImages;
        const data = await (0, controllers_1.updateTour)(result.body);
        if (!data)
            throw new Error("Tour not found");
        saved = true;
        const replaced = body.images
            ? previous.images
                .filter((previousImage) => !data.images.some((image) => image.id === previousImage.id &&
                image.url === previousImage.url))
                .map((image) => image.url)
            : [];
        await (0, utils_1.removeTourImages)([...(body.removedImageUrls || []), ...replaced], data.images);
        return res.status(200).send({ ...messages_1.messages.updateOk, data });
    }
    catch (err) {
        if (!saved)
            await (0, utils_1.removeTourImages)(uploaded);
        console.log(err);
        throw err;
    }
};
exports.handleUpdateTour = handleUpdateTour;
const handleDeleteTour = async (req, res) => {
    try {
        const data = await (0, controllers_1.deleteTour)(req.params.id);
        if (!data)
            return res.status(404).send({ ...messages_1.messages.notFound });
        await (0, utils_1.removeTourImages)(data.images.map((image) => image.url));
        return res.status(200).send({ ...messages_1.messages.deleteOk, data });
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};
exports.handleDeleteTour = handleDeleteTour;
