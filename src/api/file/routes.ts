import { FastifyInstance } from "fastify";
import {
  handleCreateBatchFiles,
  handleDuplicateFile,
  handleFileUploadTmp,
  handleUploadFile,
} from "./handlers";

export default async function fileRoutes(app: FastifyInstance) {
  app.post("/", handleFileUploadTmp);
  app.post("/batch", handleCreateBatchFiles);
  app.post("/upload", handleUploadFile);
  // app.post('/duplicate', handleDuplicateFile);
}
