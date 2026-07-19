"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messages = void 0;
exports.messages = {
    welcome: {
        statusCode: 200,
        message: "Welcome to the TourFlow API.",
    },
    initializationError: {
        statusCode: 500,
        error: "Initialization Error",
        message: "Unable to connect to the database.",
    },
    somethingWentWrong: {
        statusCode: 500,
        error: "Internal Server Error",
        message: "Something went wrong. Please try again later.",
    },
    loginError: {
        statusCode: 401,
        error: "Authentication Failed",
        message: "The email or password is incorrect.",
    },
    foreignKeyError: {
        statusCode: 409,
        error: "Conflict",
        message: "This operation cannot be completed because related records exist.",
    },
    forbiddenAccess: {
        statusCode: 403,
        error: "Forbidden",
        message: "You do not have permission to perform this action.",
    },
    clientDataError: {
        statusCode: 400,
        error: "Validation Error",
        message: "The provided data does not meet the expected requirements.",
    },
    notFound: {
        statusCode: 404,
        error: "Not Found",
        message: "The requested record was not found.",
    },
    schemaError: {
        statusCode: 400,
        error: "Bad Request",
        message: "Please provide all required data.",
    },
    createOk: {
        statusCode: 201,
        message: "The record was created successfully.",
    },
    createError: {
        statusCode: 500,
        error: "Internal Server Error",
        message: "The record could not be created.",
    },
    retrieveError: {
        statusCode: 500,
        error: "Internal Server Error",
        message: "The requested data could not be retrieved.",
    },
    updateOk: {
        statusCode: 200,
        message: "The record was updated successfully.",
    },
    checkOk: {
        statusCode: 200,
        message: "The check completed successfully.",
    },
    updatePasswordError: {
        statusCode: 500,
        error: "Internal Server Error",
        message: "The password could not be updated.",
    },
    updateError: {
        statusCode: 500,
        error: "Internal Server Error",
        message: "The record could not be updated.",
    },
    verifyOk: {
        statusCode: 200,
        message: "The request completed successfully.",
    },
    verifyError: {
        statusCode: 400,
        error: "Verification Error",
        message: "Verification failed.",
    },
    resendOk: {
        statusCode: 200,
        message: "The item was resent successfully.",
    },
    resendError: {
        statusCode: 400,
        error: "Resend Error",
        message: "The item could not be resent.",
    },
    deleteOk: {
        statusCode: 200,
        message: "The record was deleted successfully.",
    },
    deleteError: {
        statusCode: 500,
        error: "Internal Server Error",
        message: "The record could not be deleted.",
    },
    deleteDependencyError: {
        statusCode: 409,
        error: "Conflict",
        message: "This record cannot be deleted because related records exist.",
    },
    deleteDependencyErrorService: {
        statusCode: 409,
        error: "Conflict",
        message: "This service cannot be deleted because related records exist.",
    },
    incorrectAction: {
        statusCode: 400,
        error: "Invalid Action",
        message: "The requested action is invalid.",
    },
    invalidSignin: {
        statusCode: 401,
        error: "Authentication Failed",
        message: "The email or password is incorrect.",
    },
    unthorizedAccess: {
        statusCode: 401,
        error: "Unauthorized",
        message: "A valid access token is required.",
    },
    duplicateEmail: {
        statusCode: 409,
        error: "Conflict",
        message: "This email address is already in use.",
    },
    duplicatePhone: {
        statusCode: 409,
        error: "Conflict",
        message: "This phone number is already in use.",
    },
    duplicateData: {
        statusCode: 409,
        error: "Conflict",
        message: "This record already exists.",
    },
    notDuplicateData: {
        statusCode: 200,
        message: "This value is available.",
    },
    receiptHeader: {
        statusCode: 409,
        error: "Conflict",
        message: "The maximum number of receipt headers has been reached.",
    },
    duplicateImage: {
        statusCode: 409,
        error: "Conflict",
        message: "An image is already associated with this record.",
    },
    duplicateId: {
        statusCode: 409,
        error: "Conflict",
        message: "This ID is already in use.",
    },
    duplicateSKU: {
        statusCode: 409,
        error: "Conflict",
        message: "This SKU is already associated with another record.",
    },
    fileError: {
        statusCode: 400,
        error: "File Error",
        message: "The file is invalid, too large, or cannot be stored.",
    },
    fileDeleteError: {
        statusCode: 500,
        error: "File Delete Error",
        message: "The requested file could not be deleted.",
    },
    notAllowedOnExists: {
        statusCode: 409,
        error: "Conflict",
        message: "Remove the existing record before creating another one.",
    },
    duplicatePhoneEmail: {
        statusCode: 409,
        error: "Conflict",
        message: "This phone number or email address is already in use.",
    },
    doesNotExists: {
        statusCode: 404,
        error: "Not Found",
        message: "The requested record was not found.",
    },
    deleteConflictComboError: {
        statusCode: 409,
        error: "Conflict",
        message: "This record cannot be deleted because it is in use.",
    },
};
