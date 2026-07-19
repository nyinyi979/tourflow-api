"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDeleteAdmin = exports.handleUpdateUser = exports.handleGetUserByToken = exports.handleGetUserById = exports.handleGetUsers = exports.handleLogin = void 0;
const messages_1 = require("../messages");
const controllers_1 = require("./controllers");
const auth_1 = require("../../utils/auth");
const handleLogin = async (req, res) => {
    try {
        const data = await (0, controllers_1.login)(req.body);
        res.code(200).send({ ...messages_1.messages.verifyOk, ...data });
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};
exports.handleLogin = handleLogin;
const handleGetUsers = async (req, res) => {
    try {
        const params = req.query;
        if (!params.page || !params.perPage)
            res.status(500).send({ message: "Params page and perPage are required" });
        const response = await (0, controllers_1.getUsers)({
            page: +params.page,
            perPage: +params.perPage,
        });
        res.code(200).send({ ...messages_1.messages.verifyOk, ...response });
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};
exports.handleGetUsers = handleGetUsers;
const handleGetUserById = async (req, res) => {
    try {
        const params = req.params;
        if (!params.id)
            res.status(500).send({ message: "Params ID is required" });
        const response = await (0, controllers_1.getUserById)(params.id);
        res.code(200).send({ ...messages_1.messages.verifyOk, data: response });
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};
exports.handleGetUserById = handleGetUserById;
const handleGetUserByToken = async (req, res) => {
    try {
        const data = await (0, auth_1.authenticate)(req, res);
        if (!data)
            return;
        res.code(200).send({ ...messages_1.messages.verifyOk, data });
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};
exports.handleGetUserByToken = handleGetUserByToken;
const handleUpdateUser = async (req, res) => {
    try {
        const data = await (0, controllers_1.updateUser)(req.body);
        res.code(200).send({ ...messages_1.messages.verifyOk, data });
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};
exports.handleUpdateUser = handleUpdateUser;
const handleDeleteAdmin = async (req, res) => {
    try {
        const params = req.params;
        if (!params.id)
            res.status(500).send({ message: "Params ID is required" });
        const data = await (0, controllers_1.deleteUser)(params.id);
        res.code(200).send({ ...messages_1.messages.verifyOk, data });
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};
exports.handleDeleteAdmin = handleDeleteAdmin;
