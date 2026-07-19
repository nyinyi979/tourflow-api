"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeTestimonialAvatars = exports.handleTestimonialAvatar = void 0;
const file_1 = require("../../utils/file");
const handleTestimonialAvatar = async (body) => {
    var _a, _b;
    const temporary = (_b = (_a = body.avatar) === null || _a === void 0 ? void 0 : _a.startsWith("/tmp/")) !== null && _b !== void 0 ? _b : false;
    if (temporary && body.avatar) {
        const avatar = await (0, file_1.uploadFile)(body.avatar);
        if (!avatar)
            throw new Error("The testimonial avatar could not be uploaded");
        body.avatar = avatar;
    }
    return { body, uploadedAvatar: temporary ? body.avatar || null : null };
};
exports.handleTestimonialAvatar = handleTestimonialAvatar;
const removeTestimonialAvatars = async (urls, current) => (0, file_1.removeFiles)([...new Set(urls || [])].filter((url) => url && url !== current));
exports.removeTestimonialAvatars = removeTestimonialAvatars;
