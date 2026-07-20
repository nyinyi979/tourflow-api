"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDeleteCategory = exports.handleUpdateCategory = exports.handleGetCategoryById = exports.handleGetAllCategories = exports.handleGetCategories = exports.handleCreateCategory = void 0;
const messages_1 = require("../messages");
const controllers_1 = require("./controllers");
const utils_1 = require("./utils");
const handleCreateCategory = async (req, res) => {
    let uploadedImage = null;
    let created = false;
    try {
        const result = await (0, utils_1.handleCategoryImage)(req.body);
        uploadedImage = result.uploadedImage;
        const data = await (0, controllers_1.createCategory)(result.body);
        created = true;
        await (0, utils_1.removeCategoryImages)(result.body.removedImageUrls, data.image);
        return res.status(201).send({ ...messages_1.messages.createOk, data });
    }
    catch (err) {
        if (!created)
            await (0, utils_1.removeCategoryImages)([uploadedImage]);
        throw err;
    }
};
exports.handleCreateCategory = handleCreateCategory;
const handleGetCategories = async (req, res) => {
    try {
        const params = req.query;
        const response = await (0, controllers_1.getCategories)({
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
exports.handleGetCategories = handleGetCategories;
const handleGetAllCategories = async (req, res) => {
    try {
        const params = req.query;
        const response = await (0, controllers_1.getAllCategories)(params.type);
        return res.status(200).send({ ...messages_1.messages.verifyOk, data: response });
    }
    catch (err) {
        throw err;
    }
};
exports.handleGetAllCategories = handleGetAllCategories;
const handleGetCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await (0, controllers_1.getCategoryById)(id);
        if (!data)
            return res.status(404).send({ ...messages_1.messages.notFound });
        return res.status(200).send({ ...messages_1.messages.verifyOk, data });
    }
    catch (err) {
        throw err;
    }
};
exports.handleGetCategoryById = handleGetCategoryById;
const handleUpdateCategory = async (req, res) => {
    let uploadedImage = null;
    let updated = false;
    try {
        const body = req.body;
        const previous = await (0, controllers_1.getCategoryById)(body.id);
        if (!previous)
            return res.status(404).send({ ...messages_1.messages.notFound });
        const result = await (0, utils_1.handleCategoryImage)(body);
        uploadedImage = result.uploadedImage;
        const data = await (0, controllers_1.updateCategory)(result.body);
        if (!data)
            throw new Error("Category not found");
        updated = true;
        const replaced = body.image !== undefined && body.image !== previous.image
            ? previous.image
            : null;
        await (0, utils_1.removeCategoryImages)([...(body.removedImageUrls || []), replaced], data.image);
        return res.status(200).send({ ...messages_1.messages.updateOk, data });
    }
    catch (err) {
        if (!updated)
            await (0, utils_1.removeCategoryImages)([uploadedImage]);
        throw err;
    }
};
exports.handleUpdateCategory = handleUpdateCategory;
const handleDeleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await (0, controllers_1.deleteCategory)(id);
        if (!data)
            return res.status(404).send({ ...messages_1.messages.notFound });
        await (0, utils_1.removeCategoryImages)([data.image]);
        return res.status(200).send({ ...messages_1.messages.deleteOk, data });
    }
    catch (err) {
        throw err;
    }
};
exports.handleDeleteCategory = handleDeleteCategory;
