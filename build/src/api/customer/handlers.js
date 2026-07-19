"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDeleteCustomer = exports.handleUpdateCustomer = exports.handleGetCustomerByToken = exports.handleGetCustomers = exports.handleCustomerLogin = exports.handleCustomerSignup = void 0;
const auth_1 = require("../../utils/auth");
const messages_1 = require("../messages");
const controllers_1 = require("./controllers");
const utils_1 = require("./utils");
const handleCustomerSignup = async (req, res) => {
    let uploadedAvatar = null;
    let customerCreated = false;
    try {
        const avatarResult = await (0, utils_1.handleCustomerAvatar)(req.body);
        const { body } = avatarResult;
        uploadedAvatar = avatarResult.uploadedAvatar;
        const customer = await (0, controllers_1.signupCustomer)(body);
        if (!customer) {
            await (0, utils_1.removeCustomerAvatars)([uploadedAvatar]);
            return res.code(409).send({ ...messages_1.messages.duplicateEmail });
        }
        customerCreated = true;
        await (0, utils_1.removeCustomerAvatars)(body.removedImageUrls, customer.avatar);
        return res.code(201).send({ ...messages_1.messages.createOk, data: customer });
    }
    catch (err) {
        if (!customerCreated) {
            await (0, utils_1.removeCustomerAvatars)([uploadedAvatar]);
        }
        console.log(err);
        throw err;
    }
};
exports.handleCustomerSignup = handleCustomerSignup;
const handleCustomerLogin = async (req, res) => {
    try {
        const data = await (0, controllers_1.loginCustomer)(req.body);
        if (!data) {
            return res.code(401).send({ ...messages_1.messages.loginError });
        }
        return res.code(200).send({ ...messages_1.messages.verifyOk, ...data });
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};
exports.handleCustomerLogin = handleCustomerLogin;
const handleGetCustomers = async (req, res) => {
    try {
        const params = req.query;
        if (params.page === undefined || params.perPage === undefined) {
            return res
                .status(500)
                .send({ message: "Params page and perPage are required" });
        }
        const response = await (0, controllers_1.getCustomers)({
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
exports.handleGetCustomers = handleGetCustomers;
const handleGetCustomerByToken = async (req, res) => {
    try {
        const customer = await (0, auth_1.authenticateCustomer)(req, res);
        if (!customer)
            return;
        return res.code(200).send({ ...messages_1.messages.verifyOk, data: customer });
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};
exports.handleGetCustomerByToken = handleGetCustomerByToken;
const handleUpdateCustomer = async (req, res) => {
    let uploadedAvatar = null;
    let customerUpdated = false;
    try {
        const customer = await (0, auth_1.authenticateCustomer)(req, res);
        if (!customer)
            return;
        const avatarResult = await (0, utils_1.handleCustomerAvatar)(req.body);
        const { body } = avatarResult;
        uploadedAvatar = avatarResult.uploadedAvatar;
        const data = await (0, controllers_1.updateCustomer)(customer.id, body);
        if (!data)
            throw new Error("Customer not found");
        customerUpdated = true;
        const replacedAvatar = body.avatar !== undefined && body.avatar !== customer.avatar
            ? customer.avatar
            : null;
        await (0, utils_1.removeCustomerAvatars)([...(body.removedImageUrls || []), replacedAvatar], data.avatar);
        return res.code(200).send({ ...messages_1.messages.updateOk, data });
    }
    catch (err) {
        if (!customerUpdated) {
            await (0, utils_1.removeCustomerAvatars)([uploadedAvatar]);
        }
        console.log(err);
        throw err;
    }
};
exports.handleUpdateCustomer = handleUpdateCustomer;
const handleDeleteCustomer = async (req, res) => {
    try {
        const customer = await (0, auth_1.authenticateCustomer)(req, res);
        if (!customer)
            return;
        const data = await (0, controllers_1.deleteCustomer)(customer.id);
        if (!data)
            throw new Error("Customer not found");
        await (0, utils_1.removeCustomerAvatars)([data.avatar]);
        return res.code(200).send({ ...messages_1.messages.deleteOk, data });
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};
exports.handleDeleteCustomer = handleDeleteCustomer;
