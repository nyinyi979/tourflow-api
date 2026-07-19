import { FastifyReply, FastifyRequest } from "fastify";
import {
  createBatchFiles,
  createFile,
  deleteFile,
  uploadFile,
} from "./controllers";
import { messages } from "../messages";
import handleFormData from "../../utils/handleFormData";
import { duplicateFileS3, TFile } from "../../utils/file";

export const handleFileUploadTmp = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  try {
    const parts = req.parts();
    const { imageBuffer, body } = await handleFormData(parts);
    if (!imageBuffer) {
      return res.status(400).send({ message: "File is required" });
    }
    const result = await createFile({
      buffer: imageBuffer,
      filename: body.image.filename,
    });
    res.code(201).send({
      ...messages.verifyOk,
      data: { url: result, filename: body.image.filename },
    });
  } catch (err) {
    res.code(500).send({ ...messages.somethingWentWrong });
  }
};

export const handleCreateBatchFiles = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  try {
    const parts = req.parts();
    const files: TFile[] = [];
    for await (const part of parts) {
      if (part.type === "file" && part.fieldname === "file") {
        const imageBuffer = await part.toBuffer();
        files.push({
          filename: part.filename,
          buffer: imageBuffer,
        });
      }
    }
    const result = await createBatchFiles(files);
    console.log(result);
    res.code(201).send({ ...messages.verifyOk, data: result });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const handleUploadFile = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  try {
    const body = req.body as { url: string };
    const result = await uploadFile(body.url);
    res.code(201).send({
      ...messages.verifyOk,
      data: { url: result },
    });
  } catch (err) {
    throw err;
  }
};
export const handleRemoveFile = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  try {
    const { url } = req.query as { url: string };
    if (!url) return res.code(400).send({ message: "URL param is required" });
    const result = await deleteFile(url);
    res.code(200).send({ ...messages.verifyOk, data: result });
  } catch (err) {
    res.code(500).send({ ...messages.somethingWentWrong });
  }
};

export const handleDuplicateFile = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  const url = req.query as { url: string };
  const result = await duplicateFileS3(url.url);
  return result;
};
