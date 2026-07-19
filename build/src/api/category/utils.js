"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCategoryImages = exports.handleCategoryImage = void 0;
const file_1 = require("../../utils/file");
const handleCategoryImage = async (body) => {
    var _a, _b;
    const isTemporaryImage = (_b = (_a = body.image) === null || _a === void 0 ? void 0 : _a.startsWith("/tmp/")) !== null && _b !== void 0 ? _b : false;
    if (isTemporaryImage && body.image) {
        const image = await (0, file_1.uploadFile)(body.image);
        if (!image)
            throw new Error("The category image could not be uploaded");
        body.image = image;
    }
    return { body, uploadedImage: isTemporaryImage ? body.image || null : null };
};
exports.handleCategoryImage = handleCategoryImage;
const removeCategoryImages = async (urls, currentImage) => (0, file_1.removeFiles)([...new Set(urls || [])].filter((url) => url && url !== currentImage));
exports.removeCategoryImages = removeCategoryImages;
