"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCustomerAvatars = exports.handleCustomerAvatar = void 0;
const file_1 = require("../../utils/file");
const handleCustomerAvatar = async (body) => {
    var _a, _b, _c;
    // The frontend sends temporary uploads as /tmp/...; existing remote URLs stay unchanged.
    const isTemporaryAvatar = (_b = (_a = body.avatar) === null || _a === void 0 ? void 0 : _a.startsWith("/tmp/")) !== null && _b !== void 0 ? _b : false;
    if ((_c = body.avatar) === null || _c === void 0 ? void 0 : _c.startsWith("/tmp/")) {
        const uploadedAvatar = await (0, file_1.uploadFile)(body.avatar);
        if (!uploadedAvatar) {
            throw new Error("The temporary customer avatar could not be uploaded");
        }
        body.avatar = uploadedAvatar;
    }
    return {
        body,
        uploadedAvatar: isTemporaryAvatar ? body.avatar || null : null,
    };
};
exports.handleCustomerAvatar = handleCustomerAvatar;
const removeCustomerAvatars = async (imageUrls, currentAvatar) => {
    const unusedImageUrls = [...new Set(imageUrls || [])].filter((imageUrl) => imageUrl && imageUrl !== currentAvatar);
    await (0, file_1.removeFiles)(unusedImageUrls);
};
exports.removeCustomerAvatars = removeCustomerAvatars;
