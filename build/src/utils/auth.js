"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = exports.authenticateCustomer = exports.authenticateAdmin = exports.authenticate = void 0;
const controllers_1 = require("../api/auth/controllers");
const controllers_2 = require("../api/customer/controllers");
const errors_1 = require("./errors");
const getAccessToken = (req) => {
    const token = req.headers["x-access-token"];
    if (!token || typeof token !== "string")
        throw new errors_1.UnauthorizedError();
    return token;
};
const rethrowServerError = (error) => {
    if (error instanceof errors_1.AppError && error.statusCode >= 500)
        throw error;
};
const authenticate = async function (req, _res) {
    try {
        return await (0, controllers_1.getUserByToken)(getAccessToken(req));
    }
    catch (error) {
        rethrowServerError(error);
        throw new errors_1.UnauthorizedError();
    }
};
exports.authenticate = authenticate;
const authenticateAdmin = async function (req, _res) {
    try {
        const user = await (0, controllers_1.getUserByToken)(getAccessToken(req));
        if (user.role !== 1)
            throw new errors_1.ForbiddenError();
        return user;
    }
    catch (error) {
        rethrowServerError(error);
        if (error instanceof errors_1.ForbiddenError)
            throw error;
        throw new errors_1.UnauthorizedError();
    }
};
exports.authenticateAdmin = authenticateAdmin;
const authenticateCustomer = async function (req, _res) {
    try {
        return await (0, controllers_2.getCustomerByToken)(getAccessToken(req));
    }
    catch (error) {
        rethrowServerError(error);
        throw new errors_1.UnauthorizedError();
    }
};
exports.authenticateCustomer = authenticateCustomer;
const authenticateUser = async function (req, _res) {
    const token = getAccessToken(req);
    try {
        const customer = await (0, controllers_2.getCustomerByToken)(token);
        return { ...customer, accountType: "customer" };
    }
    catch (error) {
        rethrowServerError(error);
        try {
            const admin = await (0, controllers_1.getUserByToken)(token);
            return { ...admin, accountType: "admin" };
        }
        catch (error) {
            rethrowServerError(error);
            throw new errors_1.UnauthorizedError();
        }
    }
};
exports.authenticateUser = authenticateUser;
