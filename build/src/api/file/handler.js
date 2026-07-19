"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDuplicateFile =
  exports.handleRemoveFile =
  exports.handleUploadFile =
  exports.handleCreateBatchFiles =
  exports.handleFileUploadTmp =
    void 0;
const controller_1 = require("./controller");
const messages_1 = require("../messages");
const handleFormData_1 = __importDefault(require("../../utils/handleFormData"));
const file_1 = require("../../utils/file");
const handleFileUploadTmp = async (req, res) => {
  try {
    const parts = req.parts();
    const { imageBuffer, body } = await (0, handleFormData_1.default)(parts);
    if (!imageBuffer) {
      return res.status(400).send({ message: "File is required" });
    }
    const result = await (0, controller_1.createFile)({
      buffer: imageBuffer,
      filename: body.image.filename,
    });
    res.code(201).send({
      ...messages_1.messages.verifyOk,
      data: { url: result, filename: body.image.filename },
    });
  } catch (err) {
    res.code(500).send({ ...messages_1.messages.somethingWentWrong });
  }
};
exports.handleFileUploadTmp = handleFileUploadTmp;
const handleCreateBatchFiles = async (req, res) => {
  try {
    const parts = req.parts();
    const files = [];
    for await (const part of parts) {
      if (part.type === "file" && part.fieldname === "file") {
        const imageBuffer = await part.toBuffer();
        files.push({
          filename: part.filename,
          buffer: imageBuffer,
        });
      }
    }
    const result = await (0, controller_1.createBatchFiles)(files);
    console.log(result);
    res.code(201).send({ ...messages_1.messages.verifyOk, data: result });
  } catch (err) {
    console.log(err);
    throw err;
  }
};
exports.handleCreateBatchFiles = handleCreateBatchFiles;
const handleUploadFile = async (req, res) => {
  try {
    const body = req.body;
    const result = await (0, controller_1.uploadFile)(body.url);
    res.code(201).send({
      ...messages_1.messages.verifyOk,
      data: { url: result },
    });
  } catch (err) {
    throw err;
  }
};
exports.handleUploadFile = handleUploadFile;
const handleRemoveFile = async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) return res.code(400).send({ message: "URL param is required" });
    const result = await (0, controller_1.deleteFile)(url);
    res.code(200).send({ ...messages_1.messages.verifyOk, data: result });
  } catch (err) {
    res.code(500).send({ ...messages_1.messages.somethingWentWrong });
  }
};
exports.handleRemoveFile = handleRemoveFile;
const handleDuplicateFile = async (req, res) => {
  const url = req.query;
  const result = await (0, file_1.duplicateFileS3)(url.url);
  return result;
};
exports.handleDuplicateFile = handleDuplicateFile;
